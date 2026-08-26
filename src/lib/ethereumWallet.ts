import * as bip39 from "bip39";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";

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
            publicKey: wallet.address,
            privateKey: wallet.privateKey,
        });
    }

    return wallets;
};

