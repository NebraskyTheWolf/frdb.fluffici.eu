import type { Metadata } from "next";
import Features from "@/components/cards/features";
import Servers from "@/components/cards/partners";
import Partners from "@/components/cards/servers";
import InviteBot from "@/components/cards/invitebot";
import Hero from "@/components/cards/hero";
import Metrics from "@/components/cards/metrics.tsx";

export const metadata: Metadata = {
  title: "Sentralyx",
  description: "The official website of Sentralyx",
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Servers />
      <Metrics />
      <Features />
      {/*<Partners /> */}
      <InviteBot />
    </div>
  );
}
