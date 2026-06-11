import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateMnemonic, validateMnemonic } from "bip39";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export const generateMnemonicForWallet = () => {
  const mnemonic = generateMnemonic();

  return mnemonic;

}



export const isMnemonicValid = (mnemonic: string) => {
  if (!validateMnemonic(mnemonic)) {
    return false;
  }


  return true;


}
