import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import axios from 'axios';
import { Guild } from '@/models/Guild.ts';
import { Skeleton } from '@/components/skeleton.tsx';
import { ChartData } from '@/models/ChartData.ts';
import { FaUsers, FaUserPlus, FaUserCheck } from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
);

interface StatisticsProps {
    serverId: string;
}

const Statistics: React.FC<StatisticsProps> = ({ serverId }) => {
    const [guild, setGuild] = useState<Guild>();
    const [monthlyCount, setMonthlyCount] = useState<number>(0);
    const [activeUsers, setActiveUsers] = useState<number>(0);
    const [newMembers, setNewMembers] = useState<ChartData>(
        new ChartData(
            [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ],
            [
                {
                    label: 'New Members',
                    data: Array(12).fill(0),
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                }
            ]
        )
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMemberCount, setLoadingMemberCount] = useState<boolean>(true);
    const [loadingActiveUsers, setLoadingActiveUsers] = useState<boolean>(true);
    const [loadingNewMembers, setLoadingNewMembers] = useState<boolean>(true);

    useEffect(() => {
        const fetchServer = async () => {
            try {
                const response = await axios.get(`/api/servers/${serverId}/available`);
                setGuild(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        const fetchMonthlyCount = async () => {
            try {
                const response = await axios.get(`/api/servers/${serverId}/member-monthly-count`);
                setMonthlyCount(response.data.count);
                setLoadingMemberCount(false);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        const fetchActiveMembers = async () => {
            try {
                const response = await axios.get(`/api/servers/${serverId}/active-members`);
                setActiveUsers(response.data.activeMembersCount);
                setLoadingActiveUsers(false);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        const fetchNewMembersChart = async () => {
            try {
                const response = await axios.get(`/api/servers/${serverId}/new-members`);
                setNewMembers(response.data);
                setLoadingNewMembers(false);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchServer();
        fetchMonthlyCount();
        fetchActiveMembers();
        fetchNewMembersChart();
    }, [serverId]);

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-white">User Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center">
                        <FaUsers className="text-4xl text-white mb-2" />
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">Total Users</h3>
                        <p className="text-2xl sm:text-4xl text-white">{loading ? <Skeleton /> : guild?.memberCount}</p>
                    </div>
                    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center">
                        <FaUserPlus className="text-4xl text-white mb-2" />
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">New Users This Month</h3>
                        <p className="text-2xl sm:text-4xl text-white">{loadingMemberCount ? <Skeleton /> : monthlyCount}</p>
                    </div>
                    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center">
                        <FaUserCheck className="text-4xl text-white mb-2" />
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">Active Users</h3>
                        <p className="text-2xl sm:text-4xl text-white">{loadingActiveUsers ? <Skeleton /> : activeUsers}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-white">New Users Over Time</h2>
                {loadingNewMembers ? (
                    <Skeleton className="h-64" />
                ) : (
                    <div className="h-64">
                        <Bar data={newMembers} options={{ maintainAspectRatio: false }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistics;
