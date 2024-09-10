"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/skeleton";
import axios from "axios";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import {getServerIconUrlValid} from "@/lib/utils.ts"; // Import the CSS for Tippy

interface Server {
  id: string;
  icon: string;
  name: string;
  memberCount: number;
}

const Partners: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get(`/api/get-servers`);
        const sortedServers = response.data.sort((a: Server, b: Server) => b.memberCount - a.memberCount);
        setServers(sortedServers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching servers:", error);
        setLoading(true);
      }
    };

    fetchServers().then(r => console.error);
  }, []);

  return (
      <section className="py-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">
              Many popular servers use{" "}
              <span className="text-red-600">Sentralyx</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {loading
                  ? Array(9)
                      .fill(0)
                      .map((_, index) => (
                          <Skeleton key={index} className="w-16 h-16 rounded-full" />
                      ))
                  : servers.slice(0, 9).map((server) => (
                      <Tippy
                          key={server.id}
                          content={
                            <div className="flex items-center p-2 text-white rounded-lg shadow-md">
                              <img
                                  src={getServerIconUrlValid(server.icon)}
                                  alt={server.name}
                                  className="w-10 h-10 rounded-full mr-2"
                              />
                              <div>
                                <p className="font-bold">{server.name}</p>
                                <p className="text-sm">Members: {server.memberCount}</p>
                              </div>
                            </div>
                          }
                          placement="top"
                          animation="fade"
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer">
                          <img
                              src={getServerIconUrlValid(server.icon)}
                              alt={server.name}
                              className="w-full h-full object-cover"
                          />
                        </div>
                      </Tippy>
                  ))}
            </div>
          </div>
        </div>
      </section>
  );
};

export default Partners;
