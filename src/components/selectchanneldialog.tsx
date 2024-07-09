"use client"

import React, {useEffect, useState} from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from "@/components/button.tsx";
import Select from "react-select";
import { customSelectStyles } from "@/lib/utils.ts";
import axios from "axios";
import {showToast} from "@/components/toast.tsx";

interface Channel {
    id: string;
    name: string;
    type: string;
}

interface SelectChannelDialogProps {
    serverId: string;
    channelType: 'TEXT' | 'CATEGORY' | 'VOICE';
    onClick: (member: Channel) => void;
}

const SelectChannelDialog: React.FC<SelectChannelDialogProps> = ({ serverId, onClick, channelType }) => {
    const [showSelectMember, setShowSelectMember] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState<Channel | null>();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setIsLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<boolean>(false);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/channels`);
                setChannels(response.data.channels.filter((channel: Channel) => channel.type === channelType));
            } catch (error) {
                showToast('Unable to fetch server channels', 'error');
            } finally {
                setIsLoading(false);
                setShowSelectMember(true)
            }
        };

        fetchChannels();
    }, []);

    const renderSelectOptions = (items: any[]) => {
        if (items.length <= 0)
            return []

        return items.map(item => ({
            value: item.id,
            label: item.name
        }));
    };

    const getMemberById = (id: string): Channel => {
        return channels.find(channel => channel.id === id) || { id: '', name: '', type: '' };
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
                    <DialogTitle className="text-lg font-semibold text-gray-200">Select a channel from the list</DialogTitle>
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
                                options={renderSelectOptions(channels)}
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

export default SelectChannelDialog;
