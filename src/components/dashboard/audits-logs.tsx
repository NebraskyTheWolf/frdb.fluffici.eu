"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useTable, useGlobalFilter } from "react-table";
import { GlobalFilter } from "./global-filter.tsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { DataModel, Pagination } from "@/models/Paginate.ts";
import { Button } from "@/components/button.tsx";
import debounce from 'lodash.debounce';
import { AuditLogEntry } from "@/models/AuditLogEntry.ts";
import { useSession } from "next-auth/react";

interface AuditLogsProps {
    actorId?: string;
    serverId?: string;
}

const AuditLogsView: React.FC<AuditLogsProps> = ({ serverId, actorId }) => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const { data: session } = useSession()

    const fetchLogs = async (page: number = 1, filter: string = "") => {
        try {
            const response = await axios.get(`/api/servers/${serverId}/audit-logs?page=${page}&limit=${filter.length !== 0 ? 5000 : 10}&actorId=${actorId}`);
            const dataModel: DataModel = response.data;
            setLogs(dataModel.data.filter(value => value.action.includes(filter)));
            setPagination(dataModel.pagination);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching audit logs:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchLogs(1, globalFilter);
    }, [serverId]);

    const debouncedFetchLogs = useCallback(debounce((filter) => {
        if (filter.length >= 3 || filter.length === 0) {
            setLoading(true);
            fetchLogs(1, filter);
        }
    }, 300), []);

    useEffect(() => {
        debouncedFetchLogs(globalFilter);
    }, [globalFilter, debouncedFetchLogs]);

    const data = React.useMemo(() => logs, [logs]);
    const columns = React.useMemo(
        () => [
            {
                Header: "Action",
                accessor: "action" as const,
            },
            {
                Header: "User",
                accessor: "user" as const,
                Cell: ({ row }: any) => (
                    <div className="flex items-center">
                        <img
                            src={row.original.user.avatarUrl}
                            alt={row.original.user.id}
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        <span>{row.original.user.username}</span>
                    </div>
                ),
            },
            {
                Header: "Target",
                accessor: "target" as const,
                Cell: ({ row }: any) => (
                    <div>
                        {row.original.target.username ? (
                            <div className="flex items-center">
                                <img
                                    src={row.original.target.avatarUrl}
                                    alt={row.original.target.id}
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <span>{row.original.target.username}</span>
                            </div>
                        ) : (
                            <span>{row.original.target.id}</span>
                        )}
                    </div>
                ),
            },
            {
                Header: "Reason",
                accessor: "reason" as const,
            },
            {
                accessor: "createdAt" as const,
                Header: "Created At"
            }
        ],
        [sortOrder]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data }, useGlobalFilter);

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        fetchLogs(newPage, globalFilter);
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg relative">
            <h2 className="text-3xl font-bold mb-6 text-white">Audit Logs</h2>
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                </div>
            ) : logs.length === 0 ? (
                <p className="text-gray-400">No audit logs found.</p>
            ) : (
                <>
                    <table {...getTableProps()} className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        {...column.getHeaderProps()}
                                        className="px-4 py-2 text-left text-white font-medium"
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
                                >
                                    {row.cells.map(cell => (
                                        <td
                                            {...cell.getCellProps()}
                                            className="px-4 py-2 text-white"
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination?.currentPage! - 1)}
                            disabled={pagination?.isFirstPage}
                            className="bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
                        >
                            <FaChevronLeft />
                            Previous
                        </Button>
                        <span className="text-white">
                            Page {pagination?.currentPage} of {pagination?.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination?.currentPage! + 1)}
                            disabled={pagination?.isLastPage}
                            className="bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
                        >
                            Next
                            <FaChevronRight />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AuditLogsView;
