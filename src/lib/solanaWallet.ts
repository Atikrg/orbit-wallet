import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";




export const isSolanaSecretKey = (value: string): boolean => {
  try {
    const decoded = bs58.decode(value.trim());
    return decoded.length === 64;
  } catch {
    return false;
  }
};

export const importSolanaFromSecretKey = (secretKey: string) => {
  const keypair = Keypair.fromSecretKey(bs58.decode(secretKey.trim()));

  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
  };
};

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
      index: i,
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
    });
  }

  return wallets;
};

export const recoverSolanaWalletsByIndexes = async (
  mnemonic: string,
  indexes: number[]
) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const sortedIndexes = [...new Set(indexes.map(Number).filter((n) => Number.isInteger(n) && n >= 0))].sort(
    (a, b) => a - b
  );

  if (sortedIndexes.length === 0) {
    throw new Error("Invalid wallet indexes");
  }

  return sortedIndexes.map((i) => {
    const path = `m/44'/501'/${i}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);

    return {
      title: `Wallet ${i + 1}`,
      index: i,
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
    };
  });
};
