"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useTable, useGlobalFilter } from "react-table";
import { GlobalFilter } from "../global-filter.tsx";
import { FaBan, FaCheckCircle, FaUserShield } from "react-icons/fa";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { DataModel, Pagination } from "@/models/Paginate.ts";
import { Button } from "@/components/button.tsx";
import debounce from 'lodash.debounce';
import { LocalBlacklist } from "@/models/LocalBlacklist.ts";
import { showToast } from "@/components/toast.tsx";
import { useSession } from "next-auth/react";

interface ViewMembersProps {
    serverId?: string;
}

const MENU_ID = "blacklist-context-menu";

const LocalBlacklistView: React.FC<ViewMembersProps> = ({ serverId }) => {
    const [blacklists, setBlacklists] = useState<LocalBlacklist[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const { data: session } = useSession();

    const fetchBlacklist = async (page: number = 1, filter: string = "") => {
        try {
            const response = await axios.get(`/api/servers/${serverId}/local-blacklist?page=${page}` + (filter.length !== 0 ? '&limit=5000' : '&limit=10'));
            const dataModel: DataModel = response.data;
            setBlacklists(dataModel.data.filter(value => value.username.startsWith(filter)));
            setPagination(dataModel.pagination);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching local-blacklist:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchBlacklist(1, globalFilter);
    }, [serverId]);

    const debouncedFetchMembers = useCallback(debounce((filter) => {
        if (filter.length >= 3 || filter.length === 0) {
            setLoading(true);
            fetchBlacklist(1, filter);
        }
    }, 300), []);

    useEffect(() => {
        debouncedFetchMembers(globalFilter);
    }, [globalFilter, debouncedFetchMembers]);

    const data = React.useMemo(() => blacklists, [blacklists]);
    const columns = React.useMemo(
        () => [
            {
                Header: "Avatar",
                accessor: "avatar" as const,
                Cell: ({ row }: any) => (
                    <img
                        src={row.original.avatar}
                        alt={row.original.id}
                        className="w-10 h-10 rounded-full"
                    />
                ),
            },
            {
                Header: "ID",
                accessor: "id" as const,
            },
            {
                Header: "Username",
                accessor: "username" as const,
            },
            {
                Header: "Reason",
                accessor: "reason" as const,
            },
            {
                accessor: "issuedBy" as const,
                Header: "Issued By"
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

    const { show } = useContextMenu({
        id: MENU_ID
    });

    const handleContextMenu = (event: React.MouseEvent, member: LocalBlacklist) => {
        event.preventDefault();
        show({
            event,
            props: {
                member,
            },
        });
    };

    const handleItemClick = ({ event, props, triggerEvent, data }: any) => {
        const removeBlacklist = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/remove-blacklist`, {
                    user: props.member.id
                });

                if (response.data.status) {
                    showToast(`${props.member.username} has been removed from the local blacklist`, "info");
                } else {
                    showToast("Error removing local-blacklist", "error");
                }

                setLoading(true);
                fetchBlacklist(1, globalFilter);
            } catch (error) {
                console.error("Error removing local-blacklist:", error);
                showToast("Error removing local-blacklist", "error");
            }
        };

        removeBlacklist();
    };

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        fetchBlacklist(newPage, globalFilter);
    };

    return (
        <div className="p-4 md:p-6 bg-gray-800 rounded-lg shadow-lg relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">Local Blacklist</h2>
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                </div>
            ) : blacklists.length === 0 ? (
                <p className="text-gray-400">No blacklist entries found.</p>
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
                                        onContextMenu={(e) => handleContextMenu(e, row.original)}
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
            <Menu id={MENU_ID} className="bg-gray-700 text-white rounded-lg shadow-lg contexify_theme-dark">
                <Item onClick={handleItemClick}>
                    <FaBan className="mr-2" /> Remove
                </Item>
            </Menu>
        </div>
    );
};

export default LocalBlacklistView;
