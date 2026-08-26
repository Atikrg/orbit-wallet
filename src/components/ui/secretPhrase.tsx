import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { FaRegCopy, FaRegQuestionCircle } from "react-icons/fa";

import { useState } from "react";
import { useWalletContext } from "@/context/walletContext";
import { toast, Toaster } from "sonner";



export function SecretPhraseComponent() {


    const { mnemonics } = useWalletContext();

    const trigger = mnemonics?.trigger || "";
    const value = mnemonics?.value || "";

    const mnemonicData = mnemonics?.mnemonicsData;



    const copyToClipboard = async () => {

        const mnemonic = mnemonicData?.join(" ") || "";

        try {
            await navigator.clipboard.writeText(mnemonic);


            toast.success("Copied the phrase");

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            toast.error("Failed to copy to clipboard", { description: message });
        }
    }


    return (

        <div>
            <Accordion
                type="single"
                collapsible
                className=" rounded-lg border"
                defaultValue="wallet-secret-phrase"
            >

                <div className="p-[26px]">


                    <AccordionItem
                        key={value}
                        value={value}
                        className="border-b px-4 last:border-b-0"
                    >
                        <AccordionTrigger className="text-[34px] font-sans">{trigger}</AccordionTrigger>
                        <AccordionContent onClick={copyToClipboard}>
                            <div className="grid grid-cols-4 gap-3 mt-[44px]">

                                {mnemonicData?.map((element, index) => (
                                    <div key={index} className="bg-zinc-100 text-gray-600 rounded-sm text-left px-2 hover:bg-zinc-200 py-3 font-mono text-[22px]">
                                        {
                                            element
                                        }
                                    </div>

                                ))}
                            </div>


                            <div className="flex items-center gap-2 ml- mt-8 text-[20px] text-gray-500">

                                <FaRegCopy className="" />
                                <span className="font-sans">

                                    Click anywhere to copy
                                </span>

                            </div>
                        </AccordionContent>

                    </AccordionItem>

                </div>
            </Accordion>
        </div>

    )
}
