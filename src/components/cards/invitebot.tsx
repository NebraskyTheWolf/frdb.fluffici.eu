import React from "react";
import { Button } from "@/components/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";

const InviteBot: React.FC = () => {
  return (
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Připraven(a) pozvat?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Vylepšete svůj zážitek na Discordu s naším botem. Zlepšete moderování,
            zabezpečení a mnoho dalšího.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Pozvat</Button>
            </DialogTrigger>
            <DialogContent
                style={{
                  background: "#020817",
                }}
            >
              <DialogHeader className="text-white">
                <DialogTitle>Pozvat FurRaidDB</DialogTitle>
                <DialogDescription className="text-base md:text-lg text-gray-300 py-4">
                  Pozváním FurRaidDB souhlasíte s našimi Podmínkami služby a Zásadami ochrany osobních údajů.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4"></div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Link href="https://discord.com/oauth2/authorize?client_id=1281924846690762794&permissions=1101659220054&response_type=code&redirect_uri=https%3A%2F%2Fsentralyx.com&integration_type=0&scope=bot">
                  <Button variant="ghost">Rozumím.</Button>
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>{" "}
        </div>
      </section>
  );
};

export default InviteBot;
