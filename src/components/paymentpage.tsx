"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FaDiscord, FaCheck, FaTimes, FaCreditCard, FaPaypal, FaBitcoin, FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/button";
import { Plan } from "@/models/Plan";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Skeleton } from "@/components/skeleton.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/dialog.tsx";
import Link from "next/link";
import { getServerIconUrl, hasAdministratorPermission } from "@/lib/utils.ts";
import { showToast } from "@/components/toast.tsx";

type Step = "connect" | "selectServer" | "payment";

declare interface Server {
    id: string;
    name: string;
    icon: string;
    permissions: number;
}

const PaymentPage: React.FC = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>("connect");
    const [plan, setPlan] = useState<Plan>();
    const [loading, setLoading] = useState(false);
    const [servers, setServers] = useState<Server[]>([]);
    const [selectedServer, setSelectedServer] = useState<string | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'creditCard' | 'paypal' | 'crypto' | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [cookies, setCookie] = useCookies(['selectedServer']);
    const { data: session, status } = useSession();

    useEffect(() => {
        const planParam = localStorage.getItem("selectedPlan");
        if (planParam) {
            const fetchPlan = async (offerId: string) => {
                const response = await fetch(`/api/offer/${offerId}`);
                const data = await response.json();
                setPlan(data);
            };
            fetchPlan(planParam);
        } else {
            router.push('/premium');
            showToast("The selected offer does not exist.", "error");
        }

        if (session) {
            setStep("selectServer");
        }
    }, [session]);

    const checkPremiumStatus = async (guildId: string) => {
        try {
            const response = await axios.get(`/api/is-premium/${guildId}`);
            return response.data.isPremium;
        } catch (error) {
            console.error("Checking premium status failed:", error);
            return false;
        }
    };

    useEffect(() => {
        const fetchGuilds = async () => {
            try {
                const response = await axios.get('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                });
                if (response.status === 200) {
                    const adminServers = response.data.filter((server: Server) =>
                        hasAdministratorPermission(server.permissions)
                    );
                    setServers(adminServers);
                } else {
                    console.error('Unable to fetch user guilds: ' + response.data + ' status: ' + response.status);
                }
            } catch (error) {
                console.error('Unable to fetch user guilds: ', error);
            }
        };

        if (step === "selectServer" && session) {
            fetchGuilds().then(r => console.log);
        }
    }, [step, session]);

    const handleStepChange = (newStep: Step) => {
        setStep(newStep);
    };

    const handleDiscordLogin = () => {
        setLoading(true);
        signIn('discord', { callbackUrl: window.location.href, redirect: false });
    };

    const handleBillingCycleChange = (cycle: 'monthly' | 'yearly') => {
        setLoading(true);
        setTimeout(() => {
            setBillingCycle(cycle);
            setLoading(false);
        }, 1000); // Simulating network delay
    };

    const handlePaymentMethodChange = (method: 'creditCard' | 'paypal' | 'crypto') => {
        setLoading(true);
        setTimeout(() => {
            setSelectedPaymentMethod(method);
            setLoading(false);
        }, 500); // Simulating network delay
    };

    const getPriceMonthly = (plan: Plan) => plan.offerPrice;
    const getPriceYearly = (plan: Plan) => plan.offerPrice * 12;

    const renderStepContent = () => {
        switch (step) {
            case "connect":
                return (
                    <div className="flex flex-col items-center">
                        {loading ? (
                            <div className="flex flex-col items-center">
                                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                                <p>Awaiting Discord Login...</p>
                            </div>
                        ) : (
                            <Button variant="outline" onClick={handleDiscordLogin}>
                                <FaDiscord className="mr-2" /> Connect with Discord
                            </Button>
                        )}
                    </div>
                );
            case "selectServer":
                let isPremium = false;
                return (
                    <div className="flex flex-col items-center">
                        <p>Welcome back, {session?.user.name}!</p>
                        <p>{servers.length <= 0 ? "You don't have any server, you can invite the bot first." : "Select one of the servers you have permission in:"}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {servers.map((server) => (
                                <div
                                    key={server.id}
                                    className={`p-4 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition ${
                                        selectedServer === server.id ? 'border-4 border-green-500' : 'border-2 border-gray-600'
                                    }`}
                                    onClick={async () => {
                                        isPremium = await checkPremiumStatus(server.id);
                                        setSelectedServer(server.id);
                                        setCookie('selectedServer', server.id, { path: '/' });
                                    }}
                                >
                                    <img src={getServerIconUrl(server.id, server.icon)} alt={server.name} className="w-12 h-12 rounded-full mx-auto" />
                                    <p className="font-bold text-center mt-2">{server.name}</p>
                                    <p className={`text-center mt-1 ${isPremium ? 'text-green-500' : 'text-red-500'}`}>
                                        {isPremium ? 'Premium' : 'Not Premium'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => handleStepChange("payment")}
                            disabled={!selectedServer}
                        >
                            Next
                        </Button>
                    </div>
                );
            case "payment":
                const selectedServerDetails = servers.find(server => server.id === selectedServer);
                return (
                    <div className="flex flex-col items-center">
                        <p className="text-lg mb-4">Subscribe to <span className="font-bold">{selectedServerDetails?.name}</span></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                            <div
                                className={`p-6 rounded-lg shadow-md cursor-pointer flex flex-col items-center ${
                                    billingCycle === 'monthly' ? 'border-4 border-green-500' : 'border-2 border-gray-600'
                                }`}
                                onClick={() => handleBillingCycleChange('monthly')}
                            >
                                <FaCalendarAlt className="text-4xl mb-2" />
                                <p>Monthly</p>
                                <p className="text-lg font-bold">{getPriceMonthly(plan!)} Kč/month</p>
                            </div>
                            <div
                                className={`p-6 rounded-lg shadow-md cursor-pointer flex flex-col items-center ${
                                    billingCycle === 'yearly' ? 'border-4 border-green-500' : 'border-2 border-gray-600'
                                }`}
                                onClick={() => handleBillingCycleChange('yearly')}
                            >
                                <FaCalendarAlt className="text-4xl mb-2" />
                                <p>Yearly</p>
                                <p className="text-lg font-bold">{getPriceYearly(plan!)} Kč/year</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                            <div
                                className={`p-6 rounded-lg shadow-md cursor-pointer flex flex-col items-center ${
                                    selectedPaymentMethod === 'creditCard' ? 'border-4 border-green-500' : 'border-2 border-gray-600'
                                }`}
                                onClick={() => handlePaymentMethodChange('creditCard')}
                            >
                                <FaCreditCard className="text-4xl mb-2" />
                                <p>Credit Card</p>
                            </div>
                            <div
                                className={`p-6 rounded-lg shadow-md cursor-pointer flex flex-col items-center ${
                                    selectedPaymentMethod === 'paypal' ? 'border-4 border-green-500' : 'border-2 border-gray-600'
                                }`}
                                onClick={() => handlePaymentMethodChange('paypal')}
                            >
                                <FaPaypal className="text-4xl mb-2" />
                                <p>PayPal</p>
                            </div>
                            <div
                                className={`p-6 rounded-lg shadow-md cursor-pointer flex flex-col items-center ${
                                    selectedPaymentMethod === 'crypto' ? 'border-4 border-green-500' : 'border-2 border-gray-600'
                                }`}
                                onClick={() => handlePaymentMethodChange('crypto')}
                            >
                                <FaBitcoin className="text-4xl mb-2" />
                                <p>Crypto</p>
                            </div>
                        </div>
                        {loading ? (
                            <Skeleton className="h-6 w-full mt-4 animate-pulse" />
                        ) : (
                            <p className="text-xl mt-4">
                                {billingCycle === 'monthly'
                                    ? `Price: ${getPriceMonthly(plan!)} Kč/month`
                                    : `Price: ${getPriceYearly(plan!)} Kč/year`}
                            </p>
                        )}
                        <p className="text-gray-500 mt-2">Includes VAT (20%)</p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="login" className="mt-4">Pay {billingCycle === 'monthly'
                                    ? `${getPriceMonthly(plan!)} Kč/month`
                                    : `${getPriceYearly(plan!)} Kč/year`}
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                style={{
                                    background: "#020817",
                                }}
                            >
                                <DialogHeader className="text-white">
                                    <DialogTitle>Oh no...</DialogTitle>
                                    <DialogDescription className="text-base md:text-lg text-gray-300 py-4">
                                        We haven't implemented the payment mechanism yet.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start">
                                    <Link href="/premium">
                                        <Button type="button" variant="outline">
                                            I understand.
                                        </Button>
                                    </Link>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
            <aside className="w-full md:w-1/4 bg-gray-800 p-6 m-4 rounded-lg shadow-lg">
                {plan && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">{plan.offerName}</h2>
                        <p className="mb-4">{plan.offerDescription}</p>
                        <p className="text-xl mb-4">
                            {getPriceMonthly(plan!) !== 0 ? `${getPriceMonthly(plan!)} Kč/měsíc nebo ${getPriceYearly(plan!)} Kč/rok` : 'Zdarma'}
                        </p>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2">Zahrnuto:</h4>
                            <ul className="text-left mb-4">
                                {plan.offerFeatures.map((feature, index) => (
                                    <li key={index} className="mb-2 flex items-center">
                                        {feature.included ? (
                                            <FaCheck className="text-green-400 mr-2" />
                                        ) : (
                                            <FaTimes className="text-red-500 mr-2" />
                                        )}
                                        <span>{feature.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </aside>
            <main className="w-full md:w-3/4 p-6 m-4 rounded-lg bg-gray-800 shadow-lg">
                <div className="mb-6">
                    <div className="flex justify-around mb-4">
                        <div className={`flex-1 text-center py-2 border-b-4 ${step === "connect" ? "border-green-500 text-green-500" : "border-gray-600 text-gray-600"}`}>
                            1. Login
                        </div>
                        <div className={`flex-1 text-center py-2 border-b-4 ${step === "selectServer" ? "border-green-500 text-green-500" : "border-gray-600 text-gray-600"}`}>
                            2. Select Server
                        </div>
                        <div className={`flex-1 text-center py-2 border-b-4 ${step === "payment" ? "border-green-500 text-green-500" : "border-gray-600 text-gray-600"}`}>
                            3. Payment
                        </div>
                    </div>
                    <div className="mt-4">{renderStepContent()}</div>
                </div>
            </main>
        </div>
    );
};

export default PaymentPage;
