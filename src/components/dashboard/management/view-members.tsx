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

interface ViewMembersProps {
    serverId: string;
}

const MENU_ID = "member-context-menu";

const ViewMembers: React.FC<ViewMembersProps> = ({ serverId }) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [selectedMemberBl, setSelectedMemberBl] = useState<Member | null>(null);
    const [showModerationDialog, setShowModerationDialog] = useState(false)
    const [showBlacklistDialog, setShowBlacklistDialog] = useState(false)
    const { data: session } = useSession()
    const [reason, setReason] = useState<string>("");

    const fetchMembers = async (page: number = 1, filter: string = "", sortOrder: "asc" | "desc" | null = null) => {
        try {
            const response = await axios.get(`/api/servers/${serverId}/members?page=${page}` + (filter.length !== 0 ? '&limit=5000' : '&limit=10'));
            const dataModel: DataModel = response.data;
            setMembers(dataModel.data.filter(value => value.username.startsWith(filter)));
            setPagination(dataModel.pagination);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching members:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchMembers(1, globalFilter, sortOrder);
    }, [serverId]);

    const debouncedFetchMembers = useCallback(debounce((filter) => {
        if (filter.length >= 3 || filter.length === 0) {
            setLoading(true);
            fetchMembers(1, filter, sortOrder);
        }
    }, 300), []);

    useEffect(() => {
        debouncedFetchMembers(globalFilter);
    }, [globalFilter, debouncedFetchMembers]);

    const handleSortSpam = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        fetchMembers(1, globalFilter, newSortOrder);
    };

    const data = React.useMemo(() => members, [members]);
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
                Header: "Discriminator",
                accessor: "discriminator" as const,
            },
            {
                accessor: "isSpam" as const,
                Cell: ({ value }: any) => (value ? "Yes" : "No"),
                Header: () => (
                    <div onClick={handleSortSpam} className="cursor-pointer">
                        Is Flagged Spam?
                    </div>
                ),
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
        state
    } = useTable({ columns, data }, useGlobalFilter);

    const { show } = useContextMenu({
        id: MENU_ID
    });

    const handleContextMenu = (event: React.MouseEvent, member: Member) => {
        event.preventDefault();
        show({
            event,
            props: {
                member,
            },
        });
    };

    const handleAddBlacklist = async () => {
        if (!selectedMemberBl) return;

        try {
            const response = await axios.post(`/api/servers/${serverId}/add-blacklist?actorId=${session?.user.id}`, {
                user: selectedMemberBl.id,
                reason: reason,
            });

            if (response.data.status) {
                showToast(`${selectedMemberBl.username} has been added to the blacklist`, "success");
            } else {
                showToast(response.data.message, "error");
            }

            fetchMembers(1);
        } catch (error) {
            console.error("Error adding to blacklist:", error);
            showToast("Error adding to blacklist", "error");
        }
    };

    const handleAddBlacklists = ({ event, props, triggerEvent, data }: any) => {
        setSelectedMemberBl(props.member);
        setShowBlacklistDialog(true)
    };

    const handleAddWhitelist = ({ event, props, triggerEvent, data }: any) => {
        const addWhitelist = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/add-whitelist?actorId=${session?.user.id}`, {
                    user: props.member.id
                });

                if (response.data.status) {
                    showToast(`${props.member.username} has been added to the whitelist`, "success")
                } else {
                    showToast(response.data.message, "error");
                }

                fetchMembers(1)
            } catch (error) {
                console.error("Error removing local-blacklist:", error);
                showToast("Error adding local-whitelist", "error");
            }
        };

        addWhitelist()
    };

    const handleModerationView = ({ event, props, triggerEvent, data }: any) => {
        setSelectedMember(props.member);
        setShowModerationDialog(true);
    };

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        fetchMembers(newPage, globalFilter, sortOrder);
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg relative">
            <h2 className="text-3xl font-bold mb-6 text-white">Members</h2>
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                </div>
            ) : members.length === 0 ? (
                <p className="text-gray-400">No members were fetched.</p>
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
                                    onContextMenu={(e) => handleContextMenu(e, row.original)}
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
                        </Button>
                    </div>
                </>
            )}
            {selectedMember && <ModerationDialog actorId={session?.user.id} memberId={selectedMember.id} serverId={serverId} isVisible={showModerationDialog} onClose={() => setShowModerationDialog(false)} />}
            {selectedMemberBl &&
                <InputDialog
                    title={`Add ${selectedMemberBl.username} to Blacklist`}
                    reason={reason}
                    isVisible={showBlacklistDialog}
                    onClose={() => setShowBlacklistDialog(false)}
                    onChange={(text: string) => setReason(text)}
                    onAdd={handleAddBlacklist}
                />
            }

            <Menu id={MENU_ID} className="bg-gray-700 text-white rounded-lg shadow-lg contexify_theme-dark">
                <Item onClick={handleAddBlacklists}>
                    <FaBan className="mr-2" /> Blacklist
                </Item>
                <Item onClick={handleAddWhitelist}>
                    <FaCheckCircle className="mr-2" /> Whitelist
                </Item>
                <Item onClick={handleModerationView}>
                    <FaUserShield className="mr-2" /> Moderation View
                </Item>
            </Menu>
        </div>
    );
};

export default ViewMembers;
