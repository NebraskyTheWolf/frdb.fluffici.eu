import type { Metadata } from "next";
import PremiumPlans from "@/components/premiumplans.tsx";
import Hero from "@/components/cards/hero.tsx";
import Servers from "@/components/cards/partners.tsx";
import InviteBot from "@/components/cards/invitebot.tsx";
export const metadata: Metadata = {
    title: "FurRaidDB - Premium",
    description: "The official website of FurRaidDB",
};

export default function Premium() {
    return (
        <div>
            <Hero/>
            <Servers/>
            <PremiumPlans/>
            <InviteBot/>
        </div>
    );
}
