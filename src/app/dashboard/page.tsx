import type { Metadata } from "next";
import Features from "@/components/cards/features";
import Servers from "@/components/cards/partners";
import InviteBot from "@/components/cards/invitebot";
import Hero from "@/components/cards/hero";
import DashboardPage from "@/components/dashboard/dashboard.tsx";
import Footer from "@/components/footer.tsx";

export const metadata: Metadata = {
    title: "FurRaidDB",
    description: "The official website of FurRaidDB",
};

export default function Dashboard() {
    return (
        <div>
            <DashboardPage />
        </div>
    );
}
