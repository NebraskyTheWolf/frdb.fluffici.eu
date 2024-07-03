import React, { useEffect, useState } from 'react';
import { FaCheck, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { getServerIconUrlValid } from "@/lib/utils.ts";
import { Button } from "@/components/button.tsx";
import axios from "axios";

interface Question {
    title: string;
    answer: string;
}

interface UserInfo {
    title: string;
    data: string;
}

export interface Verification {
    id: number;
    userId: string;
    username: string;
    avatarUrl?: string | null;
    status: string;
    questions: Question[];
    userInfo: UserInfo[];
    createdAt: string;
    verifiedBy: { username?: string; avatarUrl?: string; }
}

interface VerificationProps {
    actorId?: string;
    serverId?: string;
    verification: Verification;
    isExpanded: boolean;
    onToggle: () => void;
    onAccept: (id: number) => void;
    onDeny: (id: number) => void;
}

const VerificationCard: React.FC<VerificationProps> = ({ verification, isExpanded, onToggle, onAccept, onDeny, serverId, actorId }) => {
    const [isBlacklisted, setIsBlacklisted] = useState<boolean>(false);

    useEffect(() => {
        const fetchIsBlacklisted = async () => {
            const response = await axios.post(`/api/servers/${serverId}/is-blacklisted?actorId=${actorId}`, {
                user: verification.userId
            });

            setIsBlacklisted(response.data.result);
        };

        fetchIsBlacklisted();
    }, [verification]);

    if (isBlacklisted)
        verification.status = "Ineligible";

    const getStatusLabelStyles = (status: string) => {
        if (isBlacklisted)
            return 'bg-red-500 text-white';

        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-500 text-white';
            case 'accepted':
                return 'bg-green-500 text-white';
            case 'denied':
                return 'bg-red-500 text-white';
            case 'expired':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="bg-gray-800 text-white p-4 md:p-6 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
                <div className="flex items-center">
                    <img src={getServerIconUrlValid(verification.avatarUrl)} alt={`${verification.username}'s avatar`} className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-4"/>
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="flex flex-col mr-2">
                            <h2 className="text-lg font-semibold">{verification.username}</h2>
                            <small className="text-gray-400">Created At: {verification.createdAt}</small>
                        </div>
                        <p className={`text-sm px-3 py-1 rounded ${getStatusLabelStyles(verification.status)}`}>{verification.status.toLowerCase()}</p>
                    </div>
                </div>
                <span className="text-green-500">{isExpanded ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>
            {isExpanded && (
                <div className="mt-4 bg-gray-700 p-4 md:p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Questions</h3>
                            {verification.questions.map((q, index) => (
                                <div key={index} className="bg-gray-600 p-3 md:p-4 rounded mb-2">
                                    <p className="text-sm text-gray-300"><strong>{q.title}</strong></p>
                                    <p className="text-sm text-gray-400">{q.answer}</p>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3">User Information</h3>
                            {verification.userInfo.map((info, index) => (
                                <div key={index} className="bg-gray-600 p-3 md:p-4 rounded mb-2">
                                    <p className="text-sm text-gray-300"><strong>{info.title}:</strong> {info.data}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-end mt-4 md:mt-6 space-y-2 md:space-y-0 md:space-x-4">
                        {verification.status.toLowerCase() === 'accepted' || verification.status.toLowerCase() === 'denied' ? (
                            <div className="flex items-center space-x-2">
                                <img src={getServerIconUrlValid(verification.verifiedBy.avatarUrl)}
                                     alt={`${verification.verifiedBy.username}'s avatar`}
                                     className="w-8 h-8 md:w-10 md:h-10 rounded-full"/>
                                <span className="text-sm text-gray-300">Verified By: {verification.verifiedBy.username}</span>
                            </div>
                        ) : isBlacklisted ? (
                            <Button variant="destructive" disabled>
                                <FaTimes className="mr-2 text-white"/> Ineligible for verification
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => onAccept(verification.id)} disabled={verification.status.toLowerCase() !== "pending"}>
                                    <FaCheck className="mr-2 text-green-500"/> Accept
                                </Button>
                                <Button variant="outline" onClick={() => onDeny(verification.id)} disabled={verification.status.toLowerCase() !== "pending"}>
                                    <FaTimes className="mr-2 text-red-500"/> Deny
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationCard;
