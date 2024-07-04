"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/button";
import { useSession } from "next-auth/react";
import { showToast } from "@/components/toast.tsx";
import { useRouter } from "next/navigation";
import { FaSearch, FaUser, FaExclamationTriangle, FaCalendarAlt, FaImage } from "react-icons/fa";

export declare interface Blacklist {
    status: boolean;
    message?: string;
    user?: { id: string };
    author?: { id: string };
    reason?: string;
    attachmentUrl?: string;
    createdAt?: string;
}

export default function Blacklist() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userId, setUserId] = useState("");
    const [blacklistData, setBlacklistData] = useState<Blacklist | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/');
            showToast('You need to login first.', 'info');
        }
    }, [status]);

    useEffect(() => {
        const fetchStaff = async () => {
            if (session) {
                const response = await axios.get(`/api/is-staff/${session?.user.id}`);
                if (!response.data.isStaff) {
                    router.push('/');
                    showToast('Permission denied', 'info');
                }
            }
        }

        fetchStaff();
    }, [session]);

    const handleSearch = async () => {
        if (!userId) {
            setError("Please enter a user ID");
            return;
        }

        setLoading(true);
        setError("");
        setBlacklistData(null);

        try {
            const response = await axios.get(`/api/fetch-blacklist/${userId}`);
            setBlacklistData(response.data);
        } catch (err) {
            setError("The user is not blacklisted");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold mb-8">Global Blacklist Database</h1>
            <div className="w-full max-w-md">
                <div className="flex items-center bg-gray-800 rounded-lg mb-4">
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter user ID"
                        className="w-full p-3 bg-gray-800 rounded-l-lg text-lg focus:outline-none"
                    />
                    <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-r-lg">
                        <FaSearch />
                    </Button>
                </div>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
            {blacklistData && (
                <div className="w-full max-w-2xl mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Blacklist Details</h2>
                    </div>
                    <div className="mb-4">
                        <p className="mb-2 flex items-center"><FaUser className="mr-2" /><strong>Username:</strong> {blacklistData.user!.id}</p>
                        <p className="mb-2 flex items-center"><FaUser className="mr-2" /><strong>Issued by:</strong> {blacklistData.author!.id}</p>
                        <p className="mb-2 flex items-center"><FaExclamationTriangle className="mr-2" /><strong>Reason:</strong> {blacklistData.reason}</p>
                        <p className="mb-2 flex items-center"><FaCalendarAlt className="mr-2" /><strong>Created at:</strong> {blacklistData.createdAt}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Attachment</h3>
                        {blacklistData.attachmentUrl ? (
                            <img src={blacklistData.attachmentUrl} alt="Attachment" className="w-full rounded-lg shadow-md" />
                        ) : (
                            <p>No attachment available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
