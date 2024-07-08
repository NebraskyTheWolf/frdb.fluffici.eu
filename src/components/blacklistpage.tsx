import {getSession, GetSessionParams} from "next-auth/react";
import React, {useState} from "react";
import {showToast} from "@/components/toast.tsx";
import axios from "axios";
import {Button} from "@/components/button.tsx";
import {FaCalendarAlt, FaExclamationTriangle, FaSearch, FaUser} from "react-icons/fa";

export declare interface Blacklist {
    status: boolean;
    message?: string;
    user?: { id: string };
    author?: { id: string };
    reason?: string;
    attachmentUrl?: string;
    createdAt?: string;
}

export async function getServerSideProps(context: { req: GetSessionParams | undefined; }) {
    const session = await getSession(context.req)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    if (session) {
        const response = await axios.get(`/api/is-staff`);
        if (!response.data.isStaff) {
            showToast('You need to be a staff of FurRaidDB to access this page!', 'info');
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
    }

    return {
        props: {},
    };
}

const BlacklistPage = () => {
    const [userId, setUserId] = useState("");
    const [blacklistData, setBlacklistData] = useState<Blacklist | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="spinner mb-4"></div>
                    <p>Loading Changelogs...</p>
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
}

export default BlacklistPage;
