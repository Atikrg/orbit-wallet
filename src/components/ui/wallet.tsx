import { Button } from "./button";
import Footer from "./footer";
import { useWalletContext } from "@/context/walletContext";
const Wallet = () => {


    const { setWalletName } = useWalletContext();


    const solanaHandler = () => {
        setWalletName("Solana");


    }

    const ethereumHandler = () => {
        setWalletName("Ethereum")
    }

    return (
        <>

            <div>

                <p className="font-semibold text-5xl">Orbit Wallet</p>




                <div className="mt-[44px]">

                    <p className="text-[20px] text-gray-500">Choose one wallet to get started</p>
                    <div className="flex flex-row gap-3 items-center justify-center mt-[16px]">
                        <Button className="px-12 py-6" onClick={solanaHandler}>Solana</Button>
                        <Button className="px-12 py-6" onClick={ethereumHandler}>Ethereum</Button>
                    </div>

                </div>

            </div>

            <div className="mt-[550px]">

                <Footer />

            </div>
        </>
    )
}


export default Wallet;