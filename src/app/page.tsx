import type { Metadata } from "next";
import Features from "@/components/cards/features";
import Servers from "@/components/cards/partners";
import Partners from "@/components/cards/servers";
import InviteBot from "@/components/cards/invitebot";
import Hero from "@/components/cards/hero";

export const metadata: Metadata = {
  title: "FurRaidDB",
  description: "The official website of FurRaidDB",
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Servers />
      <Features />
      {/*<Partners /> */}
      <InviteBot />
    </div>
  );
}
