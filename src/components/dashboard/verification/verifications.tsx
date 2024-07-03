import React, { useEffect, useState } from 'react';
import VerificationCard, { Verification } from "@/components/verification-card.tsx";
import axios from "axios";
import { showToast } from "@/components/toast.tsx";
import {useSession} from "next-auth/react";
import {getServerIconUrl} from "@/lib/utils.ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/dialog.tsx";
import {Button} from "@/components/button.tsx";

interface VerificationProps {
    serverId?: string;
}

const VerificationScreen: React.FC<VerificationProps> = ({ serverId }) => {
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { data: session } = useSession()
    const [showDialog, setShowDialog] = useState(false);
    const [selectedVerification, setSelectedVerification] = useState(0);
    const [reason, setReason] = useState("");

    useEffect(() => {
        const fetchVerification = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/verifications`);
                setVerifications(response.data.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(true);
                showToast("Failed to load verifications", "error");
            }
        };

        fetchVerification();
    }, [serverId]);

    const handleToggle = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleAccept = async (id: number) => {
        try {
            const response = await axios.post(`/api/servers/${serverId}/verification`, {
                type: 'GRANT',
                id: id
            });

            if (response.data.status) {
                setVerifications(verifications.map(v => v.id === id ? { ...v, status: 'ACCEPTED', verifiedBy: { username: session?.user.name, avatarUrl: session?.user.image} } : v));
            } else {
                showToast("Unable to verify", "error");
            }
        } catch (error) {
            showToast("Unable to contact the backend server.", "error");
        }
    };

    const handleDeny = async () => {
        try {
            const response = await axios.post(`/api/servers/${serverId}/verification`, {
                type: 'DENY',
                id: selectedVerification,
                reason: reason
            });

            if (response.data.status) {
                setVerifications(verifications.map(v => v.id === selectedVerification ? { ...v, status: 'DENIED', verifiedBy: { username: session?.user.name, avatarUrl: session?.user.image} } : v));
            } else {
                showToast("Unable to verify", "error");
            }
        } catch (error) {
            showToast("Unable to contact the backend server.", "error");
        }
    };

    const handleDenyDialog = (id: number) => {
        setShowDialog(true);
        setSelectedVerification(id)
    }

    const handleDialogClose = () => {
        setShowDialog(false);
    }

    const handleSave = async () => {
        handleDialogClose();
        handleDeny()
    };

    return (
        <div className="min-h-screen text-white p-8">
            <div className="container mx-auto">
                <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                    <h1 className="text-2xl font-semibold mb-4">Verifications</h1>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="spinner mb-4"></div>
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <div>
                            {verifications.map((verification) => (
                                <VerificationCard
                                    serverId={serverId}
                                    actorId={session?.user.id}
                                    key={verification.id}
                                    verification={verification}
                                    isExpanded={expandedId === verification.id}
                                    onToggle={() => handleToggle(verification.id)}
                                    onAccept={handleAccept}
                                    onDeny={handleDenyDialog}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {showDialog && (
                <Dialog open={showDialog} onOpenChange={handleDialogClose}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Deny verification</DialogTitle>
                            <DialogDescription>
                                Please enter the reason
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                                    <textarea
                                        placeholder="Description"
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full p-3 bg-gray-800 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                        </div>
                        <DialogFooter>
                            <Button onClick={handleDialogClose} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                Deny
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default VerificationScreen;
