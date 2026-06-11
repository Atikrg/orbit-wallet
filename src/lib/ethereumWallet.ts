import * as bip39 from "bip39";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";

export const generateEthereumWallet = (mnemonic: string, walletLength: string) => {


    const wallet = HDNodeWallet.fromPhrase(
        mnemonic,
        undefined,
        `m/44'/60'/0'/0/${walletLength}`
    );
    return {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
    };
};

export const recoverEthereumWallets = (mnemonic: string, count: number) => {
    const wallets = [];

    for (let i = 0; i < count; i++) {
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

