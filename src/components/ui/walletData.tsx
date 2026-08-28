import { Card, CardContent, CardHeader, CardTitle } from "./card";
import WalletHeaderComponent from "./walletHeader";
import { MdDelete } from "react-icons/md";
import { LuEye } from "react-icons/lu";
import { FiEyeOff } from "react-icons/fi";
import { useEffect, useState } from "react";
import Footer from "./footer";
import { useWalletContext, type Wallet } from "@/context/walletContext";
import { generateSolanaWallet } from "@/lib/solanaWallet";
import { generateEthereumWallet } from "@/lib/ethereumWallet";
import { getWalletIndexes, saveWalletIndexes, type Network } from "@/lib/walletStore";

const WalletDataComponent = () => {
    const [walletData, setWalletData] = useState<Wallet[]>([]);
    const [visibleIndexKey, setVisibleIndexKey] = useState<number | null>(null);

    const {
        walletName,
        solanaWallet,
        ethereumWallet,
        mnemonics,
        setSolanaWallet,
        setEthereumWallet,
    } = useWalletContext();

    useEffect(() => {
        let cancelled = false;
        const formattedMnemonics = mnemonics?.mnemonicsData?.join(" ") ?? "";

        if (!formattedMnemonics || !walletName) return;

        const currentWalletName = walletName.toLowerCase();

        if (currentWalletName === "solana") {
            if (solanaWallet.length === 0) {
                try {
                    const wallet = generateSolanaWallet(formattedMnemonics, "0");

                    if (cancelled) return;

                    const newWallet: Wallet = {
                        title: "Wallet 1",
                        index: 0,
                        publicKey: wallet.publicKey,
                        privateKey: wallet.privateKey,
                    };

                    setSolanaWallet([newWallet]);
                    setWalletData([newWallet]);
                    localStorage.setItem("totalSolanaWallets", "1");
                    saveWalletIndexes("solana", formattedMnemonics, [0]);
                } catch (error) {
                    console.error("Failed to generate Solana wallet:", error);
                }
            } else {
                setWalletData(solanaWallet);
            }
        }

        if (currentWalletName === "ethereum") {
            if (ethereumWallet.length === 0) {
                try {
                    const wallet = generateEthereumWallet(formattedMnemonics, "0");

                    if (cancelled) return;

                    const newWallet: Wallet = {
                        title: "Wallet 1",
                        index: 0,
                        publicKey: wallet.publicKey,
                        privateKey: wallet.privateKey,
                    };

                    setEthereumWallet([newWallet]);
                    setWalletData([newWallet]);
                    localStorage.setItem("totalEthereumWallets", "1");
                    saveWalletIndexes("ethereum", formattedMnemonics, [0]);
                } catch (error) {
                    console.error("Failed to generate Ethereum wallet:", error);
                }
            } else {
                setWalletData(ethereumWallet);
            }
        }

        return () => {
            cancelled = true;
        };
    }, [walletName, mnemonics, solanaWallet.length, ethereumWallet.length]);

    useEffect(() => {
        if (walletName.toLowerCase() === "solana") {
            setWalletData(solanaWallet);
        }

        if (walletName.toLowerCase() === "ethereum") {
            setWalletData(ethereumWallet);
        }
    }, [walletName, solanaWallet, ethereumWallet]);

    const handleWalletSubmit = (index: number): void => {
        setVisibleIndexKey((prev) => (prev === index ? null : index));
    };

    const deleteWalletHandler = (publicKey: string) => {
        const updatedWallets = walletData.filter(
            (wallet) => wallet.publicKey !== publicKey
        );

        setWalletData(updatedWallets);

        const formattedMnemonics = mnemonics?.mnemonicsData?.join(" ") ?? "";

        if (walletName.toLowerCase() === "solana") {
            setSolanaWallet(updatedWallets);
            localStorage.setItem(
                "totalSolanaWallets",
                updatedWallets.length.toString()
            );
            if (formattedMnemonics) {
                saveWalletIndexes("solana", formattedMnemonics, updatedWallets.map((w) => w.index));
            }
        }

        if (walletName.toLowerCase() === "ethereum") {
            setEthereumWallet(updatedWallets);
            localStorage.setItem(
                "totalEthereumWallets",
                updatedWallets.length.toString()
            );
            if (formattedMnemonics) {
                saveWalletIndexes("ethereum", formattedMnemonics, updatedWallets.map((w) => w.index));
            }
        }
    };

    return (
        <>
            <WalletHeaderComponent />

            <div className="flex flex-col gap-4">
                {walletData.map((element, index) => {
                    const isVisible = visibleIndexKey === index;

                    return (
                        <Card key={element.publicKey}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-[26px]">
                                    {element.title}
                                </CardTitle>

                                <MdDelete
                                    onClick={() => deleteWalletHandler(element.publicKey)}
                                    className="text-red-600 text-[24px] cursor-pointer"
                                />
                            </CardHeader>

                            <CardContent className="flex flex-col items-start justify-start text-left gap-6 p-6">
                                <div className="public-key w-full">
                                    <p className="font-serif text-[20px]">Public Key</p>

                                    <p className="mt-4 break-all text-sm text-[20px]">
                                        {element.publicKey}
                                    </p>
                                </div>

                                <div className="private-key w-full">
                                    <div className="flex items-start justify-between w-full gap-4">
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="font-sans text-[20px]">Private Key</p>

                                            <input
                                                className="break-all text-sm outline-none text-[20px] w-full"
                                                type={isVisible ? "text" : "password"}
                                                value={
                                                    isVisible
                                                        ? element.privateKey
                                                        : "........................................................................................"
                                                }
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            {isVisible ? (
                                                <LuEye
                                                    onClick={() => handleWalletSubmit(index)}
                                                    className="text-xl cursor-pointer shrink-0 mt-1"
                                                />
                                            ) : (
                                                <FiEyeOff
                                                    onClick={() => handleWalletSubmit(index)}
                                                    className="text-xl cursor-pointer shrink-0 mt-1"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Footer />
        </>
    );
};

export default WalletDataComponent;
