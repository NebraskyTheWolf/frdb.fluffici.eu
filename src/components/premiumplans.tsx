"use client";

import React, {useEffect, useState} from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Plan } from '@/models/Plan'; // Import the Plan class
import { Button } from '@/components/button';
import {Spinner} from "@/components/spinner.tsx";

const PremiumPlans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[] | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAllOffers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/get-all-offers');
                const data = await response.json();
                setPlans(data);
               setIsLoading(false);
            } catch (error) {
                console.error('Error fetching offers:', error);
                setIsLoading(false);
            }
        };

        fetchAllOffers();
    }, []);

    const handleCardClick = (plan: Plan) => {
        if (plan.offerName !== 'FurRaid Classic') {
            setSelectedPlan(plan);
        }
    };

    const handleSelectPlan = () => {
        if (selectedPlan) {
            localStorage.setItem("selectedPlan", String(selectedPlan.id));
            router.push(`/payment`);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <section className="py-12 text-white">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">Prémiový plán</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans && plans.map((plan) => (
                        <div
                            key={plan.offerName}
                            className={`flex flex-col justify-between p-6 bg-gray-800 rounded-lg shadow-md cursor-pointer h-full ${
                                selectedPlan === plan ? 'border-4 border-gold' : ''
                            } ${plan.offerName === 'FurRaid Classic' ? 'cursor-not-allowed' : ''}`}
                            onClick={() => handleCardClick(plan)}
                        >
                            <div>
                                <h3 className="text-2xl font-bold mb-4">{plan.offerName}</h3>
                                <p className="text-xl mb-4">
                                    {plan.offerPrice !== 0 ? `${plan.offerPrice} Kč/měsíc nebo ${plan.offerPrice * 12} Kč/rok` : 'Zdarma'}
                                </p>
                                {plan.offerDescription && (
                                    <p className="text-gray-400 mb-4">{plan.offerDescription}</p>
                                )}
                            </div>
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
                        </div>
                    ))}
                </div>
                <Button variant="premium" className="mt-8" onClick={handleSelectPlan}>
                    Vybrat {selectedPlan ? selectedPlan.offerName : 'plán'}
                </Button>
            </div>
        </section>
    );
};

export default PremiumPlans;
