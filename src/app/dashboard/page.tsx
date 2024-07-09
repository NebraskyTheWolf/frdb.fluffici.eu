import type { Metadata } from "next";
import DashboardPage from "@/components/dashboard/dashboard.tsx";
import {getSession, GetSessionParams} from "next-auth/react";

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
