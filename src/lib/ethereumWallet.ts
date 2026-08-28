import * as bip39 from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const isEthereumPrivateKey = (value: string): boolean => {
    return /^0x[0-9a-fA-F]{64}$/.test(value.trim());
};

export const importEthereumFromPrivateKey = (privateKey: string) => {
    const wallet = new Wallet(privateKey.trim());

    return {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
    };
};

export const generateEthereumWallet = (mnemonic: string, walletLength: string) => {
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Invalid mnemonic phrase");
    }

    const index = parseInt(walletLength, 10);
    if (isNaN(index) || index < 0) {
        throw new Error("Invalid wallet index");
    }

    const wallet = HDNodeWallet.fromPhrase(
        mnemonic,
        undefined,
        `m/44'/60'/0'/0/${index}`
    );
    return {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
    };
};

export const recoverEthereumWallets = (mnemonic: string, count: number) => {
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Invalid mnemonic phrase");
    }

    const index = parseInt(String(count), 10);
    if (isNaN(index) || index < 0) {
        throw new Error("Invalid wallet count");
    }

    const wallets = [];

    for (let i = 0; i < index; i++) {
        const wallet = HDNodeWallet.fromPhrase(
            mnemonic,
            undefined,
            `m/44'/60'/0'/0/${i}`
        );

        wallets.push({
            title: `Wallet ${i + 1}`,
            index: i,
            publicKey: wallet.address,
            privateKey: wallet.privateKey,
        });
    }

    return wallets;
};

export const recoverEthereumWalletsByIndexes = (
    mnemonic: string,
    indexes: number[]
) => {
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Invalid mnemonic phrase");
    }

    const sortedIndexes = [...new Set(indexes.map(Number).filter((n) => Number.isInteger(n) && n >= 0))].sort(
        (a, b) => a - b
    );

    if (sortedIndexes.length === 0) {
        throw new Error("Invalid wallet indexes");
    }

    return sortedIndexes.map((i) => {
        const wallet = HDNodeWallet.fromPhrase(
            mnemonic,
            undefined,
            `m/44'/60'/0'/0/${i}`
        );

        return {
            title: `Wallet ${i + 1}`,
            index: i,
            publicKey: wallet.address,
            privateKey: wallet.privateKey,
        };
    });
};

