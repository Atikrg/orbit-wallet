import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";




export const generateSolanaWallet = (mnemonic: string, walletLength: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const derivedSeed = derivePath(
    `m/44'/501'/${walletLength}'/0'`,
    seed.toString("hex")
  ).key;

  const keypair = Keypair.fromSeed(derivedSeed);

  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: Buffer.from(keypair.secretKey).toString("hex"),
  };
};



export const recoverSolanaWallets = async (mnemonic: string, count: number) => {
 
 
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const wallets = [];

  for (let i = 0; i < count; i++) {
    const path = `m/44'/501'/${i}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);

    wallets.push({
      title: `Wallet ${i + 1}`,
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey), // full 64-byte — Phantom/Solflare compatible
    });
  }

  return wallets;
};
