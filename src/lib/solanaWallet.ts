import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";




export const generateSolanaWallet = (mnemonic: string, walletLength: string) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }

  const index = parseInt(walletLength, 10);
  if (isNaN(index) || index < 0) {
    throw new Error("Invalid wallet index");
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const derivedSeed = derivePath(
    `m/44'/501'/${index}'/0'`,
    seed.toString("hex")
  ).key;

  const keypair = Keypair.fromSeed(derivedSeed);

  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
  };
};



export const recoverSolanaWallets = async (mnemonic: string, count: number) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }

  const index = parseInt(String(count), 10);
  if (isNaN(index) || index < 0) {
    throw new Error("Invalid wallet count");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const wallets = [];

  for (let i = 0; i < index; i++) {
    const path = `m/44'/501'/${i}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);

    wallets.push({
      title: `Wallet ${i + 1}`,
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
    });
  }

  return wallets;
};
