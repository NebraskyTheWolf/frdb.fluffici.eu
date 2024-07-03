"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCreditCard, FaFileInvoice, FaHistory } from "react-icons/fa";
import { Button } from "@/components/button";
import { showToast } from "@/components/toast";

interface BillingInformation {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface PaymentHistory {
    id: string;
    date: string;
    amount: string;
    status: string;
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
    link: string;
}

const BillingPage: React.FC = () => {
    const [billingInfo, setBillingInfo] = useState<BillingInformation | null>(null);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                setLoading(true);
                const [billingResponse, paymentResponse, invoiceResponse] = await Promise.all([
                    axios.get("/api/user/billing-info"),
                    axios.get("/api/user/payment-history"),
                    axios.get("/api/user/invoices"),
                ]);

                setBillingInfo(billingResponse.data);
                setPaymentHistory(paymentResponse.data);
                setInvoices(invoiceResponse.data);
            } catch (error) {
                showToast("Error fetching billing data", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Billing Page</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* Billing Information */}
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <FaCreditCard className="mr-2" /> Billing Information
                        </h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            {billingInfo ? (
                                <div>
                                    <p><strong>Name:</strong> {billingInfo.name}</p>
                                    <p><strong>Email:</strong> {billingInfo.email}</p>
                                    <p><strong>Address:</strong> {billingInfo.address}</p>
                                    <p><strong>City:</strong> {billingInfo.city}</p>
                                    <p><strong>State:</strong> {billingInfo.state}</p>
                                    <p><strong>ZIP:</strong> {billingInfo.zip}</p>
                                    <p><strong>Country:</strong> {billingInfo.country}</p>
                                </div>
                            ) : (
                                <p>No billing information available.</p>
                            )}
                        </div>
                    </section>

                    {/* Payment History */}
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <FaHistory className="mr-2" /> Payment History
                        </h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            {paymentHistory.length > 0 ? (
                                <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-white font-medium">Date</th>
                                        <th className="px-4 py-2 text-left text-white font-medium">Amount</th>
                                        <th className="px-4 py-2 text-left text-white font-medium">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paymentHistory.map((payment) => (
                                        <tr key={payment.id} className="border-b border-gray-700">
                                            <td className="px-4 py-2 text-white">{payment.date}</td>
                                            <td className="px-4 py-2 text-white">{payment.amount}</td>
                                            <td className="px-4 py-2 text-white">{payment.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No payment history available.</p>
                            )}
                        </div>
                    </section>

                    {/* Invoices */}
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <FaFileInvoice className="mr-2" /> Invoices
                        </h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            {invoices.length > 0 ? (
                                <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-white font-medium">Date</th>
                                        <th className="px-4 py-2 text-left text-white font-medium">Amount</th>
                                        <th className="px-4 py-2 text-left text-white font-medium">Invoice</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b border-gray-700">
                                            <td className="px-4 py-2 text-white">{invoice.date}</td>
                                            <td className="px-4 py-2 text-white">{invoice.amount}</td>
                                            <td className="px-4 py-2 text-white">
                                                <a href={invoice.link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                                                    View Invoice
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No invoices available.</p>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default BillingPage;
