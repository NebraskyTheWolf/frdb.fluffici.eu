"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useTable, useGlobalFilter } from "react-table";
import { GlobalFilter } from "../global-filter.tsx";
import {
    FaBan,
    FaCheckCircle,
    FaUserShield,
} from "react-icons/fa";
import { Member } from "@/models/Member.ts";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { DataModel, Pagination } from "@/models/Paginate.ts";
import { Button } from "@/components/button.tsx";
import debounce from 'lodash.debounce';
import { showToast } from "@/components/toast.tsx";
import ModerationDialog from "@/components/moderation-view.tsx";
import { useSession } from "next-auth/react";
import InputDialog from "@/components/dialoginput.tsx";

interface Ticket {
    guildId: string;
    username: string;
    ticketId: string;
    userId: string;
    channelId: string;
    status: string;
    createdAt: string;
    isStaff: boolean;
    webhookUrl: string;
}

interface ViewMembersProps {
    serverId: string;
    onSelect: (ticket: Ticket) => void
}

const TicketList: React.FC<ViewMembersProps> = ({ serverId, onSelect }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    const fetchTickets = async (page: number = 1, filter: string = "", sortOrder: "asc" | "desc" | null = null) => {
        try {
            const response = await axios.get(`/api/servers/${serverId}/tickets?page=${page}` + (filter.length !== 0 ? '&limit=5000' : '&limit=10'));
            const dataModel: DataModel = response.data;
            setTickets(dataModel.data.filter(value => value.username.startsWith(filter)));
            setPagination(dataModel.pagination);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching members:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchTickets(1, globalFilter, sortOrder);
    }, [serverId]);

    const debouncedFetchMembers = useCallback(debounce((filter) => {
        if (filter.length >= 3 || filter.length === 0) {
            setLoading(true);
            fetchTickets(1, filter, sortOrder);
        }
    }, 300), []);

    useEffect(() => {
        debouncedFetchMembers(globalFilter);
    }, [globalFilter, debouncedFetchMembers]);

    const data = React.useMemo(() => tickets, [tickets]);
    const columns = React.useMemo(
        () => [
            {
                Header: "Username",
                accessor: "username" as const
            },
            {
                Header: "ID",
                accessor: "userId" as const,
            },
            {
                Header: "Status",
                accessor: "status" as const,
            },
            {
                Header: "Created At",
                accessor: "createdAt" as const,
            },
        ],
        [sortOrder]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useGlobalFilter);

    const handleClick = (ticket: Ticket) => {
        onSelect(ticket)
    };

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        fetchTickets(newPage, globalFilter, sortOrder);
    };

    return (
        <div className="p-4 md:p-6 bg-gray-800 rounded-lg shadow-lg relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">Search a ticket...</h2>
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                </div>
            ) : tickets.length === 0 ? (
                <p className="text-gray-400">No tickets were fetched.</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table {...getTableProps()} className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                            <thead className="bg-gray-700">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th
                                            {...column.getHeaderProps()}
                                            className="px-2 md:px-4 py-2 text-left text-white font-medium"
                                        >
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        className="border-b border-gray-700 hover:bg-gray-600 cursor-pointer"
                                        onClick={(e) => handleClick(row.original)}
                                    >
                                        {row.cells.map(cell => (
                                            <td
                                                {...cell.getCellProps()}
                                                className="px-2 md:px-4 py-2 text-white"
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center mt-4">
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination?.currentPage! - 1)}
                            disabled={pagination?.isFirstPage}
                            className="bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50 mb-2 md:mb-0"
                        >
                            Previous
                        </Button>
                        <span className="text-white mb-2 md:mb-0">
                            Page {pagination?.currentPage} of {pagination?.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination?.currentPage! + 1)}
                            disabled={pagination?.isLastPage}
                            className="bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicketList;
