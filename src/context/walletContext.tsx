import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from "react";

export type Wallet = {
    title: string;
    publicKey: string;
    privateKey: string;
};


type Mnemonic = {
    value: string;
    trigger: string;
    mnemonicsData: string[]
}



type WalletContextType = {
    walletName: string;
    setWalletName: Dispatch<SetStateAction<string>>;

    mnemonics: Mnemonic | null;
    setMnemonics: Dispatch<SetStateAction<Mnemonic | null>>;

    wallets: Wallet[];
    setWallets: Dispatch<SetStateAction<Wallet[]>>;

    clearWallet: () => void;

    recoveryPhrase: string;
    setRecoveryPhrase: Dispatch<SetStateAction<string>>;


    solanaWallet: Wallet[];
    setSolanaWallet: Dispatch<SetStateAction<Wallet[]>>;


    ethereumWallet: Wallet[];
    setEthereumWallet: Dispatch<SetStateAction<Wallet[]>>;


};

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [walletName, setWalletName] = useState<string>("");
    const [mnemonics, setMnemonics] = useState<Mnemonic | null>(null);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [recoveryPhrase, setRecoveryPhrase] = useState<string>("");


    const [solanaWallet, setSolanaWallet] = useState<Wallet[]>([]);
    const [ethereumWallet, setEthereumWallet] = useState<Wallet[]>([]);

    const clearWallet = (): void => {
        setWalletName("");
        setMnemonics(null);
        setWallets([]);
        setRecoveryPhrase("");


        setSolanaWallet([]);
        setEthereumWallet([]);
    };

    return (
        <WalletContext.Provider
            value={{
                walletName,
                setWalletName,
                mnemonics,
                setMnemonics,
                wallets,
                setWallets,
                clearWallet,
                recoveryPhrase,
                setRecoveryPhrase,
                solanaWallet,
                setSolanaWallet,
                ethereumWallet,
                setEthereumWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = (): WalletContextType => {
    const context = useContext(WalletContext);

    if (!context) {
        throw new Error("useWalletContext must be used inside WalletProvider");
    }

    return context;
};