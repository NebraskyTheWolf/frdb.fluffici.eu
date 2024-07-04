"use client"

import React, {useEffect, useState} from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from "@/components/button";
import Select from "react-select";
import { customSelectStyles } from "@/lib/utils.ts";
import axios from "axios";
import {showToast} from "@/components/toast.tsx";

interface Member {
    id: string;
    name: string;
}

interface SelectInputProps {
    serverId: string;
    onClick: (member: Member) => void;
}

const SelectDialog: React.FC<SelectInputProps> = ({ serverId, onClick }) => {
    const [showSelectMember, setShowSelectMember] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setIsLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<boolean>(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/fetch-members`);
                setMembers(response.data.members);
            } catch (error) {
                showToast('Unable to fetch server settings', 'error');
            } finally {
                setIsLoading(false);
                setShowSelectMember(true)
            }
        };

        fetchMembers();
    }, []);

    const renderSelectOptions = (items: any[]) => {
        if (items.length <= 0)
            return []

        return items.map(item => ({
            value: item.id,
            label: item.name
        }));
    };

    const getMemberById = (id: string): Member => {
        return members.find(member => member.id === id) || { id: '', name: '' };
    }

    const handleClose = () => {
        setShowSelectMember(!showSelectMember)
    }

    const handleSelect = (selected: any) => {
        setSelectedMember(getMemberById(selected.value))
        setSelected(true)
    }

    const handleClick = () => {
        onClick(selectedMember!)
        setShowSelectMember(false)
    }

    return (
        <Dialog open={showSelectMember} onOpenChange={handleClose}>
            <DialogContent className="w-full max-w-lg rounded-lg shadow-lg bg-gray-900 text-white">
                <DialogHeader className="border-b border-gray-700 p-4">
                    <DialogTitle className="text-lg font-semibold text-gray-200">Select a member from the list</DialogTitle>
                </DialogHeader>
                <DialogDescription className="p-4 flex flex-col">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="spinner mb-4"></div>
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                            <Select
                                placeholder={"Make your choice"}
                                options={renderSelectOptions(members)}
                                className="w-full sm:w-2/3"
                                onChange={handleSelect}
                                value={selectedMember?.id}
                                styles={customSelectStyles}
                            />
                        </div>
                    )}
                </DialogDescription>
                <DialogFooter className="p-4 border-t border-gray-700">
                    <Button
                        type="button"
                        variant={selected ? 'outline' : 'destructive'}
                        onClick={handleClick}
                        disabled={!selected}
                        className="mr-2"
                    >
                        Continue
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SelectDialog;
