
import { Toaster } from "sonner";
import Footer from "./components/ui/footer";
import Recover from "./components/ui/recovery";
import { SecretPhraseComponent } from "./components/ui/secretPhrase";
import Wallet from "./components/ui/wallet";
import WalletDataComponent from "./components/ui/walletData";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";
import { useWalletContext } from "./context/walletContext";

export function App() {

  const { walletName } = useWalletContext();
  return (
    <div className="container mx-auto p-8 w-3/4 mx-auto text-center relative z-10">

      <Toaster richColors position="top-right" />

      {
        walletName ? (

          <>
            <p className="font-semibold text-5xl">Orbit Wallet</p>


            <Recover />
          </>


        ) : (

          <>
            <Wallet />

          </>

        )
      }
    </div>
  );
}

export default App;
