import type { Metadata } from "next";
import DashboardPage from "@/components/dashboard/dashboard.tsx";

export const metadata: Metadata = {
    title: "Sentralyx",
    description: "The official website of Sentralyx",
};

export default function Dashboard() {
    return (
        <div>
            <DashboardPage />
        </div>
    );
}
