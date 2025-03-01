"use client";

import {useSession} from "next-auth/react";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import axios from "axios";
import { getServerIconUrl } from "@/lib/utils.ts";
import Statistics from "@/components/dashboard/statistics";
import ViewMembers from "@/components/dashboard/management/view-members.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/dialog.tsx";
import { Button } from "@/components/button.tsx";
import Link from "next/link";
import {PERMISSIONS} from "@/lib/constants.ts";
import LocalBlacklist from "@/components/dashboard/management/local-blacklist.tsx";
import {FaExclamationTriangle} from "react-icons/fa";
import Whitelist from "@/components/dashboard/management/whitelist.tsx";
import VerificationScreen from "@/components/dashboard/verification/verifications.tsx";
import VerificationSettings from "@/components/dashboard/verification/verification-settings.tsx";
import GeneralSettings from "@/components/dashboard/settings.tsx";
import TicketSettingsComponent from "@/components/dashboard/ticket/ticket-settings.tsx";
import AuditLogsView from "@/components/dashboard/audits-logs.tsx";
import TicketSupport from "@/components/dashboard/ticket/ticket-support.tsx";
import AntiScam from "@/components/dashboard/security/antiscam.tsx";
import AntiRaid from "@/components/dashboard/security/antiraid.tsx";
import AutoModeration from "@/components/dashboard/security/automod.tsx";
import Changelog from "./changelog";
import InviteTracker from "@/components/dashboard/security/invitetracker.tsx";
import {useRouter} from "next/navigation";
import Welcoming from "@/components/dashboard/security/welcoming.tsx";

interface Server {
    id: string;
    name: string;
    icon: string;
    permissions: number;
    memberCount: number;
}

interface Quota {
    isQuotaReached: boolean;
    localBlacklistQuota: number;
    localBlacklistUsed: number;
    whitelistQuota: number;
    whitelistUsed: number;
}

const DashboardPage: React.FC = () => {
    const { data: session, status } = useSession();
    const [servers, setServers] = useState<Server[]>([]);
    const [quota, setQuota] = useState<Quota>({
        isQuotaReached: false,
        localBlacklistQuota: 0,
        localBlacklistUsed: 0,
        whitelistQuota: 0,
        whitelistUsed: 0
    });
    const [selectedServer, setSelectedServer] = useState<Server | null>(null);
    const [isPremium, setIsPremium] = useState(false);
    const [isBlacklisted, setIsBlacklisted] = useState(false);
    const [planName, setPlanName] = useState("free");
    const [planExpiration, setPlanExpiration] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("");
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchServers = async () => {
            if (session) {
                try {
                    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });

                    const adminServers = response.data.filter((server: Server) =>
                        (server.permissions & PERMISSIONS.KICK_MEMBERS) === PERMISSIONS.KICK_MEMBERS ||
                        (server.permissions & PERMISSIONS.BAN_MEMBERS) === PERMISSIONS.BAN_MEMBERS ||
                        (server.permissions & PERMISSIONS.ADMINISTRATOR) === PERMISSIONS.ADMINISTRATOR ||
                        (server.permissions & PERMISSIONS.MANAGE_GUILD) === PERMISSIONS.MANAGE_GUILD
                    );
                    setServers(adminServers);
                } catch (error) {
                    console.error('Error fetching servers:', error);
                }
            }
        };

        fetchServers();
    }, [session]);

    const handleServerSelect = async (server: Server) => {
        const fetchQuota = async () => {
            if (session) {
                try {
                    const response = await axios.post(`/api/servers/${server.id}/quota`);
                    setQuota(response.data);
                } catch (error) {
                    console.error('Error fetching servers:', error);
                }
            }
        };

        try {
            const response = await axios.get(`/api/servers/${server.id}/available`);
            const isInvited = response.data.status;
            if (!isInvited) {
                setDialogOpen(true);
            } else {
                setSelectedServer(server);
                setActiveSection(""); // Reset active section when selecting a new server

                const premiumResponse = await axios.get(`/api/is-premium/${server.id}`);
                setIsPremium(premiumResponse.data.isPremium);
                setPlanName(premiumResponse.data.planName || "free");
                setPlanExpiration(premiumResponse.data.expiration)

                setIsBlacklisted(response.data.isBlacklisted)
                fetchQuota()
            }
        } catch (error) {
            console.error('Error fetching server details:', error);
        }
    };

    const handleSectionSelect = (section: string) => {
        setActiveSection(section);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'Statistics':
                // @ts-ignore
                return <Statistics serverId={selectedServer?.id} />;
            case 'MemberManagement-ViewMembers':
                // @ts-ignore
                return <ViewMembers serverId={selectedServer?.id} />;
            case 'MemberManagement-LocalBlacklist':
                return <LocalBlacklist serverId={selectedServer?.id} />;
            case 'MemberManagement-Whitelist':
                return <Whitelist serverId={selectedServer?.id} />;
            case 'Protection-AntiRaid':
                return <AntiRaid serverId={selectedServer?.id!} actorId={session?.user.id!} />;
            case 'Protection-AntiScam':
                return <AntiScam serverId={selectedServer?.id!} actorId={session?.user.id!} />;
            case 'Protection-AutoModeration':
                return <AutoModeration serverId={selectedServer?.id!} actorId={session?.user.id!} />;
            case 'Protection-InviteTracker':
                return <InviteTracker serverId={selectedServer?.id!} actorId={session?.user.id!} />;
            case 'Protection-Welcoming':
                return <Welcoming serverId={selectedServer?.id!} actorId={session?.user.id!} />;
            case 'Verification-Verifications':
                return <VerificationScreen serverId={selectedServer?.id} />;
            case 'Verification-Configuration':
                return <VerificationSettings serverId={selectedServer?.id} actorId={session?.user.id} />;
            case 'Ticket-SupportTicket':
                return <TicketSupport serverId={selectedServer?.id} actorId={session?.user.id} />;
            case 'Ticket-Settings':
                return <TicketSettingsComponent serverId={selectedServer?.id} actorId={session?.user.id} />;
            case 'Settings':
                return <GeneralSettings serverId={selectedServer?.id} actorId={session?.user.id} />;
            case 'AuditLogs':
                return <AuditLogsView serverId={selectedServer?.id} actorId={session?.user.id} />;
            default:
                return <Changelog />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen text-white p-4 md:p-8">
            {status === "loading" ? (
                <p>Loading...</p>
            ) : (
                <>
                    {!selectedServer ? (
                        <div className="w-full flex flex-col items-center p-8">
                            <h1 className="text-3xl mb-6">Select a server</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {servers.map((server) => (
                                    <div
                                        key={server.id}
                                        className="p-4 bg-gray-800 rounded-lg cursor-pointer"
                                        onClick={() => handleServerSelect(server)}
                                    >
                                        <img src={getServerIconUrl(server.id, server.icon)} alt={server.name} className="w-16 h-16 rounded-full mx-auto" />
                                        <p className="mt-2 text-center font-bold">{server.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto rounded-lg shadow-lg overflow-hidden">
                            <Sidebar
                                server={selectedServer}
                                isBlacklisted={isBlacklisted}
                                isPremium={isPremium}
                                planName={planName}
                                activeSection={activeSection}
                                onSectionSelect={handleSectionSelect}
                                premiumExpirationDate={planExpiration}
                                isQuotaReached={quota.isQuotaReached}
                                localBlacklistQuota={quota.localBlacklistQuota}
                                localBlacklistUsed={quota.localBlacklistUsed}
                                whitelistQuota={quota.whitelistQuota}
                                whitelistUsed={quota.whitelistUsed}
                            />
                            <main className="flex-1 p-4 md:p-8">
                                { isBlacklisted ? (
                                    <div className="w-full max-w-2xl mt-8 bg-red-800 p-6 rounded-lg shadow-lg text-center">
                                        <FaExclamationTriangle className="text-6xl mx-auto mb-4" />
                                        <h2 className="text-2xl font-bold mb-4">Server Restricted</h2>
                                        <p className="mb-4">This server has violated our Terms of Service and is now restricted.</p>
                                        <p className="mb-4">Restricted features include:</p>
                                        <ul className="list-disc list-inside mb-4">
                                            <li>All features on the dashboard</li>
                                            <li>All commands on the server</li>
                                            <li>Inviting the bot on your server</li>
                                        </ul>
                                        <Link href="mailto:support@sentralyx.com">
                                            <Button variant="outline">
                                                Contact Support
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {renderSectionContent()}
                                    </>
                                )}
                            </main>
                        </div>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent
                            style={{
                                background: "#020817",
                            }}
                        >
                            <DialogHeader className="text-white">
                                <DialogTitle>{selectedServer?.name} Does Not Have Sentralyx</DialogTitle>
                                <DialogDescription className="text-base md:text-lg text-gray-300 py-4">
                                    This server does not have Sentralyx. By inviting Sentralyx, you agree to our Terms of Service and Privacy Policy.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                                <Link
                                    href={`https://discord.com/oauth2/authorize?client_id=1281924846690762794&permissions=1101659220054&response_type=code&redirect_uri=https%3A%2F%2Fsentralyx.com&integration_type=0&scope=bot&guild_id=${selectedServer?.id}`} 
                                >
                                    <Button type="button" variant="outline">
                                        Invite Sentralyx
                                    </Button>
                                </Link>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}

export default DashboardPage;
