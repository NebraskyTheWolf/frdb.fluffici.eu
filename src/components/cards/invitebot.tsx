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
          <h2 className="text-4xl font-bold mb-6">Ready to invite?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Enhance your Discord experience with our bot. Improve moderation, security, and more.
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
                <DialogTitle>Pozvat Sentralyx</DialogTitle>
                <DialogDescription className="text-base md:text-lg text-gray-300 py-4">
                  By inviting Sentralyx, you agree to our Terms of Service and Privacy Policy.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4"></div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Link href="https://discord.com/oauth2/authorize?client_id=1281924846690762794&permissions=1101659220054&response_type=code&redirect_uri=https%3A%2F%2Fsentralyx.com&integration_type=0&scope=bot">
                  <Button variant="ghost">Invite</Button>
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>{" "}
        </div>
      </section>
  );
};

export default InviteBot;
