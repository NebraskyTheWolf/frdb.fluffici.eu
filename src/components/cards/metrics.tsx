"use client"

"use client";

import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { FaShieldAlt, FaBan, FaServer, FaUsers } from 'react-icons/fa';
import axios from 'axios';

interface Statistics {
    raids: number;
    blacklisted: number;
    servers: number;
    users: number;
}

const Metrics: React.FC = () => {
    const [trigger, setTrigger] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState<Statistics>({
        raids: 0,
        blacklisted: 0,
        servers: 0,
        users: 0,
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('https://furraidapi.fluffici.eu/statistics');
                setStatistics(response.data);
            } catch (err) {
                console.error('Failed to fetch statistics:', err);
            } finally {
                setLoading(false);
                setTrigger(true);
            }
        };

        fetchStatistics();
    }, []);

    const raidsPrevented = useSpring({ number: trigger ? statistics.raids : 0, config: { duration: 2000 } });
    const blacklistedUsers = useSpring({ number: trigger ? statistics.blacklisted : 0, config: { duration: 2000 } });
    const trustedServers = useSpring({ number: trigger ? statistics.servers : 0, config: { duration: 2000 } });
    const activeUsers = useSpring({ number: trigger ? statistics.users : 0, config: { duration: 2000 } });

    return (
        <section className="py-12 text-white">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Statistics</h2>
                {loading ? (
                    <div className="text-center">
                        <div className="loader">Loading...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg shadow-md">
                            <FaShieldAlt className="text-4xl mb-4" />
                            <animated.div className="text-3xl font-bold">
                                {raidsPrevented.number.to((n) => n.toFixed(0))}
                            </animated.div>
                            <p className="text-xl mt-2">Raids Prevented</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg shadow-md">
                            <FaBan className="text-4xl mb-4" />
                            <animated.div className="text-3xl font-bold">
                                {blacklistedUsers.number.to((n) => n.toFixed(0))}
                            </animated.div>
                            <p className="text-xl mt-2">Blacklisted Users</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg shadow-md">
                            <FaServer className="text-4xl mb-4" />
                            <animated.div className="text-3xl font-bold">
                                {trustedServers.number.to((n) => n.toFixed(0))}
                            </animated.div>
                            <p className="text-xl mt-2">Trusted Servers</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg shadow-md">
                            <FaUsers className="text-4xl mb-4" />
                            <animated.div className="text-3xl font-bold">
                                {activeUsers.number.to((n) => n.toFixed(0))}
                            </animated.div>
                            <p className="text-xl mt-2">Active Users</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Metrics;
