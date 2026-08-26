import { useState } from "react";
import { useWalletContext } from "@/context/walletContext";
import { Button } from "./button";
import { SecretPhraseComponent } from "./secretPhrase";
import WalletDataComponent from "./walletData";
import { generateMnemonicForWallet, isMnemonicValid } from "@/lib/utils";
import { toast } from "sonner";
import { recoverSolanaWallets } from "@/lib/solanaWallet";
import { recoverEthereumWallets } from "@/lib/ethereumWallet";

const MAX_RECOVERY_WALLETS = 20;

const Recover = () => {
    const { recoveryPhrase, setRecoveryPhrase, mnemonics, setMnemonics, walletName, solanaWallet, setSolanaWallet, ethereumWallet, setEthereumWallet } = useWalletContext();
    const [showWallet, setShowWallet] = useState(false);

    const generateWalletHandler = async () => {
        if (recoveryPhrase.trim() === "") {
            try {
                const mnemonics = generateMnemonicForWallet();

                const formattedMnemonics = mnemonics.split(" ");
                setMnemonics({
                    value: "wallet-phrase",
                    trigger: "Your Secret Phrase",
                    mnemonicsData: formattedMnemonics
                });

                setShowWallet(true);
            } catch (error) {
                toast.error("Failed to generate wallet. Please try again.");
                setShowWallet(false);
            }
        } else {
            if (!isMnemonicValid(recoveryPhrase)) {
                toast.error("Invalid secret recovery phrase");
                setShowWallet(false);
                return;
            }

            try {
                if (walletName.toLocaleLowerCase() === "ethereum") {
                    const recoveredEthereumData = recoverEthereumWallets(recoveryPhrase, MAX_RECOVERY_WALLETS);

                    if (recoveredEthereumData.length === 0) {
                        toast.error("No wallets found for this recovery phrase.");
                        setShowWallet(false);
                        return;
                    }

                    setEthereumWallet(recoveredEthereumData);

                    const formattedMnemonics = recoveryPhrase.split(" ");
                    setMnemonics({
                        value: "wallet-phrase",
                        trigger: "Your Secret Phrase",
                        mnemonicsData: formattedMnemonics
                    });

                    toast.success("Wallets recovered successfully");
                    setShowWallet(true);
                }

                if (walletName.toLocaleLowerCase() === "solana") {
                    const recoveredSolanaData = await recoverSolanaWallets(recoveryPhrase, MAX_RECOVERY_WALLETS);

                    if (recoveredSolanaData.length === 0) {
                        toast.error("No wallets found for this recovery phrase.");
                        setShowWallet(false);
                        return;
                    }

                    setSolanaWallet(recoveredSolanaData);

                    const formattedMnemonics = recoveryPhrase.split(" ");
                    setMnemonics({
                        value: "wallet-phrase",
                        trigger: "Your Secret Phrase",
                        mnemonicsData: formattedMnemonics
                    });

                    toast.success("Wallets recovered successfully");
                    setShowWallet(true);
                }

                setRecoveryPhrase("");
            } catch (error) {
                toast.error("Failed to recover wallets. Please check your phrase and try again.");
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
                            autoComplete="off"
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
