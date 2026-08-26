
import { Toaster } from "sonner";
import Recover from "./components/ui/recovery";
import Wallet from "./components/ui/wallet";
import "./index.css";

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
