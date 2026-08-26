import { useState } from "react";
import { Button } from "./button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog";
import { useWalletContext } from "@/context/walletContext";
import { generateEthereumWallet } from "@/lib/ethereumWallet";
import { generateSolanaWallet } from "@/lib/solanaWallet";




const WalletHeaderComponent = () => {
    const [open, setOpen] = useState(false);


    const { walletName, clearWallet, mnemonics, solanaWallet, setSolanaWallet, ethereumWallet, setEthereumWallet } = useWalletContext();


    const clearWalletHandler = () => {

        clearWallet();
    }


    const addWalletHandler = () => {
        const mnemonicData = mnemonics?.mnemonicsData ?? [];

        if (mnemonicData.length === 0) {
            toast.error("No mnemonic available. Please generate a wallet first.");
            return;
        }

        const formattedMnemonics = mnemonicData.join(" ");

        if (walletName.toLocaleLowerCase() === "ethereum") {
            const walletLength = ethereumWallet.length;
            const wallet = generateEthereumWallet(formattedMnemonics, walletLength.toString());

            const { publicKey, privateKey } = wallet;

            const newWallet = {
                title: `Wallet ${walletLength + 1}`,
                publicKey: publicKey,
                privateKey: privateKey,
            };

            setEthereumWallet((prev) => {
                const updated = [...prev, newWallet];
                localStorage.setItem("totalEthereumWallets", updated.length.toString());
                return updated;
            });
        }

        if (walletName.toLocaleLowerCase() === "solana") {
            const walletLength = solanaWallet.length;
            const wallet = generateSolanaWallet(formattedMnemonics, walletLength.toString());

            const { publicKey, privateKey } = wallet;

            const newWallet = {
                title: `Wallet ${walletLength + 1}`,
                publicKey: publicKey,
                privateKey: privateKey,
            };

            setSolanaWallet((prev) => {
                const updated = [...prev, newWallet];
                localStorage.setItem("totalSolanaWallets", updated.length.toString());
                return updated;
            });
        }
    }

    return (
        <div className="flex items-center justify-between">
            <p className="text-[44px] pt-8.5 font-semibold leading-tight">
                {walletName} Wallet
            </p>

            <div className="wallet-buttons flex flex-row gap-3">
                <Button
                    className="add-wallet-btn"
                    onClick={addWalletHandler}
                >
                    Add Wallet
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="add-wallet-btn bg-red-500">
                            Clear Wallet
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Clear Wallet</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to clear all wallet data?
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => {
                                    clearWalletHandler();
                                    setOpen(false);
                                    toast.success("Wallet cleared");
                                }}
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default WalletHeaderComponent;