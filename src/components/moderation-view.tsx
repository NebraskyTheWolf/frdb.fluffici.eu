import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Tab } from '@headlessui/react';
import { FaBan, FaExclamationTriangle, FaMicrophoneSlash, FaRunning, FaStickyNote } from 'react-icons/fa';
import { Button } from "@/components/button";
import { Sanction } from "@/models/Sanction.ts";

interface ModerationDialogProps {
    actorId?: string;
    serverId: string;
    memberId: string;
    isVisible: boolean;
    onClose: () => void;
}

interface MemberModerationData {
    username: string;
    bans: number;
    warns: number;
    mutes: number;
    kicks: number;
    note: string;
    sanctions: Sanction[];
}

const ModerationDialog: React.FC<ModerationDialogProps> = ({ actorId, serverId, memberId, isVisible, onClose }) => {
    const [moderationData, setModerationData] = useState<MemberModerationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isVisible && memberId) {
            fetchModerationData();
        }
    }, [memberId, isVisible]);

    const fetchModerationData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`/api/servers/${serverId}/moderation?actorId=${actorId}`, {
                user: memberId
            });
            if (!response.data) {
                setError("Unable to load moderation view for " + memberId);
                return;
            }
            const data: MemberModerationData = await response.data;
            setModerationData(data);
        } catch (error: any) {
            setError('Failed to fetch moderation details: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getTypeByOffset = (index: number) => {
        switch (index) {
            case 1: return "Warn";
            case 2: return "Ban";
            case 3: return "Kick";
            case 4: return "Mute";
            default: return "Unknown";
        }
    }

    if (!isVisible) return null;

    return (
        <Dialog open={isVisible} onOpenChange={onClose}>
            <DialogContent className="p-8 w-full max-w-6xl bg-gray-800 rounded-lg">
                <DialogHeader className="border-b p-4">
                    <DialogTitle className="text-lg font-semibold text-white">{moderationData ? `${moderationData.username} - Moderation View` : 'Loading...'}</DialogTitle>
                </DialogHeader>
                <Tab.Group>
                    <Tab.List className="flex p-1 space-x-1 bg-gray-700 rounded-lg">
                        <Tab className={({ selected }) => `px-4 py-2 rounded-lg ${selected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                            Statistics
                        </Tab>
                        <Tab className={({ selected }) => `px-4 py-2 rounded-lg ${selected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                            Sanctions
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        <Tab.Panel className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-center p-4 bg-white rounded shadow">
                                    <FaBan className="mr-2 text-red-500"/>
                                    <div>
                                        <h3 className="text-lg font-semibold">Bans</h3>
                                        <p className="text-gray-700">{moderationData?.bans}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-white rounded shadow">
                                    <FaExclamationTriangle className="mr-2 text-yellow-500"/>
                                    <div>
                                        <h3 className="text-lg font-semibold">Warns</h3>
                                        <p className="text-gray-700">{moderationData?.warns}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-white rounded shadow">
                                    <FaMicrophoneSlash className="mr-2 text-blue-500"/>
                                    <div>
                                        <h3 className="text-lg font-semibold">Mutes</h3>
                                        <p className="text-gray-700">{moderationData?.mutes}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-white rounded shadow">
                                    <FaRunning className="mr-2 text-green-500"/>
                                    <div>
                                        <h3 className="text-lg font-semibold">Kicks</h3>
                                        <p className="text-gray-700">{moderationData?.kicks}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-white rounded shadow">
                                    <FaStickyNote className="mr-2 text-gray-500"/>
                                    <div>
                                        <h3 className="text-lg font-semibold">Note</h3>
                                        <p className="text-gray-700">{moderationData?.note}</p>
                                    </div>
                                </div>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel className="p-4">
                            <table className="min-w-full bg-gray-900 rounded-lg">
                                <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Reason
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Issuer Id
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Expires At
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {moderationData?.sanctions.map((sanction, index) => (
                                    <tr key={index} className={!sanction.isDeleted ? "bg-gray-800" : "bg-gray-700"}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{getTypeByOffset(sanction.typeId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            {sanction.reason}
                                            {sanction.attachmentUrl && (
                                                <div className="tooltip">
                                                    <img src={sanction.attachmentUrl} alt="Attachment" className="w-10 h-10 rounded"/>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{sanction.authorId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{!sanction.isDeleted ? "Active" : "Inactive"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{sanction.createdAt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{sanction.expirationTime}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
                {error && <p className="text-red-500 p-4">{error}</p>}
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModerationDialog;
