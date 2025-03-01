import React, { useEffect, useState } from 'react';
import { FaLightbulb, FaBug, FaStickyNote, FaUser, FaEnvelope, FaCommentDots, FaTimes } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import { Button } from "@/components/button.tsx";
import { showToast } from "@/components/toast.tsx";
import axios from "axios";

interface Changelog {
    title: string;
    description: string;
    bannerURL: string;
    version: string;
    build: string;
    features: string[];
    bugs: string[];
    note: string;
}

const Changelog: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [changelog, setChangelog] = useState<Changelog>()
    const [message, setMessage] = useState<string>()
    const { data: session, status } = useSession()

    useEffect(() => {
        const fetchChangelogs = async () => {
            try {
                const response = await axios.get('/api/changelogs');

                if (response.status === 404) {
                    showToast("No change logs available.", "info")
                    setLoading(false);
                } else {
                    setChangelog(response.data);
                    setLoading(false);
                }
            } catch (error) {
                showToast("No change logs available.", "info")
                setLoading(false);
            }
        }

        fetchChangelogs()
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await axios.post('/api/send-feedback', {
                message: message
            })

            setMessage("")
            showToast("Thank your for your feedback, your feedback has been sent to our Headquarter!", "success")
        } catch (error) {
            showToast("Unable to send your feedback, please try again later.", "error")
        }
    };

    return (
        <>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="spinner mb-4"></div>
                    <p>Loading Changelogs...</p>
                </div>
            ) : (
                <div className="container mx-auto p-4">
                    <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
                        <h1 className="text-3xl font-bold mb-4 text-white">{changelog?.title}</h1>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-1 text-gray-200">Version: {changelog?.version}</h2>
                            <h3 className="text-lg font-medium text-gray-400">Build: {changelog?.build}</h3>
                        </div>
                        <img
                            src={changelog?.bannerURL}
                            alt="Changelog"
                            className="w-full h-auto mb-4 rounded"
                        />
                        <p className="text-gray-300 mb-4">
                            {changelog?.description}
                        </p>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold mb-2 flex items-center text-white">
                                <FaLightbulb className="mr-2"/> New Features
                            </h2>
                            <ul className="list-disc list-inside text-gray-300">
                                {changelog?.features.length! > 0 ? (
                                    <div>
                                        {changelog?.features.map((value, index) => <li key={index}>{value}</li>)}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <div className="mb-4"><FaTimes className="mr-2 text-gray-500"/></div>
                                        <p className="text-gray-500">No new features</p>
                                    </div>
                                )}
                            </ul>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold mb-2 flex items-center text-white">
                                <FaBug className="mr-2"/> Bug Patches
                            </h2>
                            <ul className="list-disc list-inside text-gray-300">
                                {changelog?.bugs.length! > 0 ? (
                                    <div>
                                        {changelog?.bugs.map((value, index) => <li key={index}>{value}</li>)}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <div className="mb-4"><FaTimes className="mr-2 text-gray-500"/></div>
                                        <p className="text-gray-500">No resolved bugs</p>
                                    </div>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 flex items-center text-white">
                                <FaStickyNote className="mr-2"/> Notes
                            </h2>
                            <p className="text-gray-300">{changelog?.note}</p>
                        </div>
                    </div>

                    <div className="bg-gray-800 shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
                            <FaCommentDots className="mr-2"/> Feedback
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name"
                                       className="block text-sm font-medium text-gray-300 flex items-center">
                                    <FaUser className="mr-2"/> Username
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
                                    value={session?.user.name}
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label htmlFor="message"
                                       className="block text-sm font-medium text-gray-300 flex items-center">
                                    <FaCommentDots className="mr-2"/> Message
                                </label>
                                <textarea
                                    id="message"
                                    className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
                                    placeholder="Your feedback"
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                ></textarea>
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    variant={message?.length! <= 0 ? 'destructive' : 'premium'}
                                >
                                    Submit Feedback
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Changelog;
