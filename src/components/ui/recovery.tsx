import { useState } from "react";
import { useWalletContext } from "@/context/walletContext";
import { Button } from "./button";
import { SecretPhraseComponent } from "./secretPhrase";
import WalletDataComponent from "./walletData";
import { generateMnemonicForWallet, isMnemonicValid } from "@/lib/utils";
import { toast } from "sonner";
import { recoverSolanaWallets } from "@/lib/solanaWallet";
import { recoverEthereumWallets } from "@/lib/ethereumWallet";

const Recover = () => {
    const { recoveryPhrase, setRecoveryPhrase, mnemonics, setMnemonics, walletName, solanaWallet, setSolanaWallet, ethereumWallet, setEthereumWallet } = useWalletContext();
    const [showWallet, setShowWallet] = useState(false);




    const generateWalletHandler = async () => {
        setShowWallet(true);

        if (recoveryPhrase.trim() === "") {

            const mnemonics = generateMnemonicForWallet();

            const formattedMnemonics = mnemonics.split(" ");
            setMnemonics({
                value: "wallet-phrase",
                trigger: "Your Secret Phrase",
                mnemonicsData: formattedMnemonics
            });


        } else {



            if (isMnemonicValid(recoveryPhrase)) {



                if (walletName.toLocaleLowerCase() === "ethereum") {

                    const totalEthereumAccount = localStorage.getItem("totalEthereumWallets") ?? 0;


                    if (+totalEthereumAccount < 0) return;



                    const recoveredEthereumData = recoverEthereumWallets(recoveryPhrase, +totalEthereumAccount);


                    const totalEthereumLength = recoveredEthereumData.length;


                    if (totalEthereumLength == 0) {
                        setShowWallet(false);
                    }


                    setEthereumWallet(recoveredEthereumData);



                    const formattedMnemonics = recoveryPhrase?.split(" ");

                    setMnemonics({
                        value: "wallet-phrase",
                        trigger: "Your Secret Phrase",
                        mnemonicsData: formattedMnemonics
                    });

                    toast.success("valid");
                }


                if (walletName.toLocaleLowerCase() === "solana") {

                    const totalSolanaAccount = localStorage.getItem("totalSolanaWallets") ?? 0;


                    if (+totalSolanaAccount < 0) return;





                    const recoveredSolanaData = await recoverSolanaWallets(recoveryPhrase, +totalSolanaAccount);


                    const totalSolanaLength = recoveredSolanaData.length;


                    if (totalSolanaLength == 0) {
                        setShowWallet(false);
                    }

                    setSolanaWallet(recoveredSolanaData);



                    const formattedMnemonics = recoveryPhrase?.split(" ");

                    setMnemonics({
                        value: "wallet-phrase",
                        trigger: "Your Secret Phrase",
                        mnemonicsData: formattedMnemonics
                    });

                    toast.success("valid");
                }
            } else {
                toast.error("Invalid secret recovery phrase");


                // do not display the wallet ui
                setShowWallet(false);

            }
        }
    };

    return (
        <>


            {showWallet ? (
                <>
                    <SecretPhraseComponent />
                    <WalletDataComponent />
                </>
            ) : (

                <div>


                    <p className="font-bold text-[34px]">Secret Recovery Phrase</p>
                    <p>Save these words in a safe place</p>

                    <div className="flex flex-row justify-between w-full gap-3 mt-[5px]">
                        <input
                            type="password"
                            className="w-full p-2"
                            placeholder="Enter your secret phrase (or leave blank to generate)"
                            value={recoveryPhrase}
                            onChange={(e) => setRecoveryPhrase(e.target.value)}
                        />

                        <Button onClick={generateWalletHandler}>
                            Generate Wallet
                        </Button>
                    </div>
                </div>

            )}
        </>
    );
};

export default Recover;