import React, { useState } from 'react';
import {
    FaChevronDown,
    FaChevronUp,
    FaStar,
    FaChartBar,
    FaUsers,
    FaShieldAlt,
    FaTicketAlt,
    FaCogs,
    FaClipboardList,
    FaUser,
    FaBan,
    FaCheck,
    FaLock,
    FaFilter,
    FaUserShield,
    FaCog,
    FaLifeRing,
    FaConciergeBell
} from 'react-icons/fa';
import { Guild } from "@/models/Guild.ts";
import { Button } from "@/components/button.tsx";
import { getServerIconUrl } from "@/lib/utils.ts";
import * as Tooltip from '@radix-ui/react-tooltip';
import { PERMISSIONS } from "@/lib/constants.ts";
import {FaFileCirclePlus} from "react-icons/fa6";
import Link from 'next/link';

interface SidebarProps {
    server: Guild;
    isBlacklisted: boolean;
    isPremium: boolean;
    planName: string;
    activeSection: string;
    onSectionSelect: (section: string) => void;
    premiumExpirationDate: number;
    isQuotaReached: boolean;
    localBlacklistQuota: number;
    localBlacklistUsed: number;
    whitelistQuota: number;
    whitelistUsed: number;
}

const Sidebar: React.FC<SidebarProps> = ({ server, isBlacklisted, isPremium, planName, activeSection, onSectionSelect, premiumExpirationDate, isQuotaReached, localBlacklistQuota, localBlacklistUsed, whitelistQuota, whitelistUsed }) => {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const restrictByPlan = (plan: string, requiredPlan: string) => {
        const plans = ['free', 'lite', 'premium'];
        return plans.indexOf(plan) >= plans.indexOf(requiredPlan);
    };

    const renderButton = (label: string, icon: JSX.Element, section: string, requiredPlan: string, hidden: boolean = false) => (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button
                        variant={activeSection === section ? 'primary' : 'outline'}
                        className="w-full text-left mt-5 flex justify-between items-center"
                        onClick={() => onSectionSelect(section)}
                        hidden={hidden}
                        disabled={!restrictByPlan(planName, requiredPlan)}
                    >
                        {icon} {label}
                        {!restrictByPlan(planName, requiredPlan) && <FaStar className="text-yellow-400 ml-2" />}
                    </Button>
                </Tooltip.Trigger>
                {!restrictByPlan(planName, requiredPlan) && (
                    <Tooltip.Content side="right" align="center"
                                    className="bg-gray-700 text-white p-2 rounded shadow-lg">
                        <Tooltip.Arrow className="fill-gray-700"/>
                        This feature requires {requiredPlan}
                    </Tooltip.Content>
                )}
            </Tooltip.Root>
        </Tooltip.Provider>
    );

    return (
        <div className="w-full lg:w-64 text-white p-4">
            <div className="flex flex-col items-center mb-6">
                <div
                    className={`w-16 h-16 rounded-full ${ isPremium ? 'border-4 border-yellow-500' : ''}`}
                >
                    <img
                    src={getServerIconUrl(server.id, server.icon)}
                    alt={server.name}
                    className="w-full h-full rounded-full"
                    />
                </div>
                <h2 className="mt-2 text-xl font-bold text-center">{server.name}</h2>
                {isBlacklisted && <span className="text-sm text-red-500">Restricted</span>}
                {isPremium && (
                    <div className="mt-2">
                    <span className="text-sm font-semibold text-yellow-500">
                        {planName}
                    </span>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <Button
                    variant={activeSection === 'Statistics' ? 'primary' : 'outline'}
                    className="w-full text-left"
                    onClick={() => onSectionSelect('Statistics')}
                    disabled={(server.permissions & PERMISSIONS.VIEW_GUILD_INSIGHTS) !== PERMISSIONS.VIEW_GUILD_INSIGHTS || isBlacklisted}
                >
                    <FaChartBar className="mr-2" /> Statistics
                </Button>
            </div>
            <div className="mb-4">
                <Button
                    variant={activeSection === 'Quota' ? 'primary' : 'outline'}
                    className="w-full text-left"
                    onClick={() => onSectionSelect('Quota')}
                >
                    <FaChartBar className="mr-2" /> Quota
                </Button>
                {activeSection === 'Quota' && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold">Local Blacklist</h4>
                        <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(localBlacklistUsed / localBlacklistQuota) * 100}%` }}></div>
                        </div>
                        <p className="text-sm mt-1">{localBlacklistUsed} / {localBlacklistQuota}</p>

                        <h4 className="text-sm font-semibold mt-4">Whitelist</h4>
                        <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(whitelistUsed / whitelistQuota) * 100}%` }}></div>
                        </div>
                        <p className="text-sm mt-1">{whitelistUsed} / {whitelistQuota}</p>
                    </div>
                )}
            </div>
            <hr className="border-gray-700 mb-4"/>
            <div className="mb-4">
                <Button
                    variant="outline"
                    className="w-full text-left flex justify-between items-center"
                    onClick={() => toggleSection('MemberManagement')}
                >
                    <FaUsers className="mr-2" /> Member Management
                    <span className="ml-auto">{openSection === 'MemberManagement' ? <FaChevronUp/> : <FaChevronDown/>}</span>
                </Button>
                {openSection === 'MemberManagement' && (
                    <div className="mt-5">
                        {renderButton('View Members', <FaUser className="mr-2" />, 'MemberManagement-ViewMembers', 'free')}
                        {renderButton('Local Blacklist', <FaBan className="mr-2" />, 'MemberManagement-LocalBlacklist', 'free')}
                        {renderButton('Whitelist', <FaCheck className="mr-2" />, 'MemberManagement-Whitelist', 'free')}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <Button
                                variant="outline"
                                className="w-full text-left flex justify-between items-center"
                                onClick={() => toggleSection('Protection')}
                                disabled={!isPremium || ((server.permissions & PERMISSIONS.BAN_MEMBERS) !== PERMISSIONS.BAN_MEMBERS || isBlacklisted)}
                            >
                                <FaShieldAlt className="mr-2" /> Security
                                <span className="ml-auto">
                                    {!isPremium && <FaStar className="text-yellow-400 ml-2"/>}
                                    {isPremium && (openSection === 'Protection' ? <FaChevronUp/> : <FaChevronDown/>)}
                                </span>
                            </Button>
                        </Tooltip.Trigger>
                        {!isPremium && (
                            <Tooltip.Content side="right" align="center"
                                            className="bg-gray-700 text-white p-2 rounded shadow-lg">
                                <Tooltip.Arrow className="fill-gray-700"/>
                                This feature requires Premium
                            </Tooltip.Content>
                        )}
                    </Tooltip.Root>
                </Tooltip.Provider>
                {openSection === 'Protection' && (
                    <div className="mt-5">
                        {renderButton('Anti Scam', <FaLock className="mr-2" />, 'Protection-AntiScam', 'premium')}
                        {renderButton('Auto Moderation', <FaUserShield className="mr-2" />, 'Protection-AutoModeration', 'premium')}
                        {renderButton('Invite Tracker', <FaFileCirclePlus className="mr-2" />, 'Protection-InviteTracker', 'premium')}
                        {renderButton('Welcoming', <FaConciergeBell className="mr-2" />, 'Protection-Welcoming', 'premium')}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <Button
                                variant="outline"
                                className="w-full text-left flex justify-between items-center"
                                onClick={() => toggleSection('Verification')}
                                disabled={!isPremium || ((server.permissions & PERMISSIONS.BAN_MEMBERS) !== PERMISSIONS.BAN_MEMBERS || isBlacklisted)}
                            >
                                <FaClipboardList className="mr-2" /> Verification
                                <span className="ml-auto">
                                    {!isPremium && <FaStar className="text-yellow-400 ml-2"/>}
                                    {isPremium && (openSection === 'Verification' ? <FaChevronUp/> : <FaChevronDown/>)}
                                </span>
                            </Button>
                        </Tooltip.Trigger>
                        {!isPremium && (
                            <Tooltip.Content side="right" align="center"
                                            className="bg-gray-700 text-white p-2 rounded shadow-lg">
                                <Tooltip.Arrow className="fill-gray-700"/>
                                This feature requires Premium
                            </Tooltip.Content>
                        )}
                    </Tooltip.Root>
                </Tooltip.Provider>
                {openSection === 'Verification' && (
                    <div className="mt-5">
                        {renderButton('Verifications', <FaClipboardList className="mr-2" />, 'Verification-Verifications', 'premium')}
                        {renderButton('Configuration', <FaCog className="mr-2" />, 'Verification-Configuration', 'premium', (server.permissions & PERMISSIONS.MANAGE_GUILD) !== PERMISSIONS.MANAGE_GUILD)}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <Button
                                variant="outline"
                                className="w-full text-left flex justify-between items-center"
                                onClick={() => toggleSection('Ticket')}
                                disabled={!isPremium || (server.permissions & PERMISSIONS.MANAGE_GUILD) !== PERMISSIONS.MANAGE_GUILD || isBlacklisted}
                            >
                                <FaTicketAlt className="mr-2" /> Ticket
                                <span className="ml-auto">
                                    {!isPremium && <FaStar className="text-yellow-400 ml-2"/>}
                                    {isPremium && (openSection === 'Ticket' ? <FaChevronUp/> : <FaChevronDown/>)}
                                </span>
                            </Button>
                        </Tooltip.Trigger>
                        {!isPremium && (
                            <Tooltip.Content side="right" align="center"
                                            className="bg-gray-700 text-white p-2 rounded shadow-lg">
                                <Tooltip.Arrow className="fill-gray-700"/>
                                This feature requires Premium
                            </Tooltip.Content>
                        )}
                    </Tooltip.Root>
                </Tooltip.Provider>
                {openSection === 'Ticket' && (
                    <div className="mt-5">
                        {renderButton('Support Ticket', <FaLifeRing className="mr-2" />, 'Ticket-SupportTicket', 'lite')}
                        {renderButton('Settings', <FaCog className="mr-2" />, 'Ticket-Settings', 'lite')}
                    </div>
                )}
            </div>
            <hr className="border-gray-700 mb-4"/>
            <div className="mb-4">
                <Button
                    variant={activeSection === 'Settings' ? 'primary' : 'outline'}
                    className="w-full text-left"
                    onClick={() => onSectionSelect('Settings')}
                    disabled={(server.permissions & PERMISSIONS.MANAGE_GUILD) !== PERMISSIONS.MANAGE_GUILD || isBlacklisted}
                >
                    <FaCogs className="mr-2" /> Settings
                </Button>
            </div>
            <div className="mb-4">
                <Button
                    variant={activeSection === 'AuditLogs' ? 'primary' : 'outline'}
                    className="w-full text-left"
                    onClick={() => onSectionSelect('AuditLogs')}
                    disabled={(server.permissions & PERMISSIONS.VIEW_AUDIT_LOG) !== PERMISSIONS.VIEW_AUDIT_LOG || isBlacklisted}
                >
                    <FaClipboardList className="mr-2" /> Audit Logs
                </Button>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${isPremium ? 'bg-gray-800' : 'bg-gray-900'} text-white`}>
                <h3 className="text-lg font-bold mb-2">Subscription Information</h3>
                {isPremium ? (
                    <div>
                        <p className="text-sm mb-2">Your current plan: {planName}</p>
                        <p className="text-sm mb-2">Premium expires on: {new Date(premiumExpirationDate).toLocaleDateString()}</p>
                        {isQuotaReached && (
                            <div>
                                {planName === "lite" ? (
                                    <div>
                                        <Link href="/premium" passHref>
                                            <Button
                                                variant="premium"
                                                className="w-full mt-4"
                                            >
                                                Upgrade to Premium
                                            </Button>
                                        </Link>
                                    </div>
                                ) : planName === "premium" && (
                                    <div>
                                        <p className="text-sm text-red-400">Quota has been reached. Please contact support for custom limits.</p>
                                        <Link href="/support" passHref>
                                            <Button
                                                variant="invite"
                                                className="w-full mt-4"
                                            >
                                                Contact Support
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <Button
                            variant="premium"
                            className="w-full mt-4"
                            onClick={() => alert('Upgrade to Premium')}
                        >
                            Upgrade to Premium
                        </Button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Sidebar;
