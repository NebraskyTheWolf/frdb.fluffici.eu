import type { Metadata } from "next";
import PaymentPage from "@/components/paymentpage.tsx";
export const metadata: Metadata = {
    title: "FurRaidDB - Payment",
    description: "The official website of FurRaidDB",
};

export default function Payment() {
    return (
        <div>
            <PaymentPage/>
        </div>
    );
}
