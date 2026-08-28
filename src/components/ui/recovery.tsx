import { useState } from "react";
import { useWalletContext } from "@/context/walletContext";
import { Button } from "./button";
import { SecretPhraseComponent } from "./secretPhrase";
import WalletDataComponent from "./walletData";
import { generateMnemonicForWallet, isMnemonicValid } from "@/lib/utils";
import { toast } from "sonner";
import { recoverSolanaWalletsByIndexes, isSolanaSecretKey, importSolanaFromSecretKey } from "@/lib/solanaWallet";
import { recoverEthereumWalletsByIndexes, isEthereumPrivateKey, importEthereumFromPrivateKey } from "@/lib/ethereumWallet";
import { getWalletIndexes, saveWalletIndexes, type Network } from "@/lib/walletStore";

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

                const network: Network = walletName.toLowerCase() === "ethereum" ? "ethereum" : "solana";
                saveWalletIndexes(network, mnemonics, [0]);

                setShowWallet(true);
            } catch (error) {
                toast.error("Failed to generate wallet. Please try again.");
                setShowWallet(false);
            }
        } else {
            const input = recoveryPhrase.trim();
            const isEthereum = walletName.toLowerCase() === "ethereum";
            const isSolana = walletName.toLowerCase() === "solana";

            const isSingleKey = isEthereum
                ? isEthereumPrivateKey(input)
                : isSolana
                    ? isSolanaSecretKey(input)
                    : false;

            if (isEthereum && !isSingleKey && isSolanaSecretKey(input)) {
                toast.error("This looks like a Solana secret key. Use it with the Solana wallet instead.");
                setShowWallet(false);
                return;
            }

            if (!isSingleKey && !isMnemonicValid(input)) {
                toast.error("Invalid secret recovery phrase");
                setShowWallet(false);
                return;
            }

            try {
                if (isSingleKey) {
                    const singleWallet = isEthereum
                        ? importEthereumFromPrivateKey(input)
                        : importSolanaFromSecretKey(input);

                    const recoveredData = [{
                        title: "Wallet 1",
                        index: 0,
                        ...singleWallet,
                    }];

                    if (isEthereum) setEthereumWallet(recoveredData);
                    if (isSolana) setSolanaWallet(recoveredData);

                    toast.success("Wallet recovered successfully");
                    setShowWallet(true);
                }

                if (!isSingleKey && isEthereum) {
                    const indexes = getWalletIndexes("ethereum", input);
                    const recoveredEthereumData = recoverEthereumWalletsByIndexes(input, indexes);

                    if (recoveredEthereumData.length === 0) {
                        toast.error("No wallets found for this recovery phrase.");
                        setShowWallet(false);
                        return;
                    }

                    setEthereumWallet(recoveredEthereumData);
                    saveWalletIndexes("ethereum", input, recoveredEthereumData.map((w) => w.index));

                    const formattedMnemonics = input.split(" ");
                    setMnemonics({
                        value: "wallet-phrase",
                        trigger: "Your Secret Phrase",
                        mnemonicsData: formattedMnemonics
                    });

                    toast.success("Wallets recovered successfully");
                    setShowWallet(true);
                }

                if (!isSingleKey && isSolana) {
                    const indexes = getWalletIndexes("solana", input);
                    const recoveredSolanaData = await recoverSolanaWalletsByIndexes(input, indexes);

                    if (recoveredSolanaData.length === 0) {
                        toast.error("No wallets found for this recovery phrase.");
                        setShowWallet(false);
                        return;
                    }

                    setSolanaWallet(recoveredSolanaData);
                    saveWalletIndexes("solana", input, recoveredSolanaData.map((w) => w.index));

                    const formattedMnemonics = input.split(" ");
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
