"use client"

import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Switch } from '@headlessui/react';
import { FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
import { showToast } from '@/components/toast.tsx';
import { GuildSettings } from '@/models/GuildSettings.ts';
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import '../../../styles/quill-custom.css';
import {Button} from "@/components/button.tsx";
import SelectChannelDialog from "@/components/selectchanneldialog.tsx";
import {defaultSettings} from "@/lib/constants.ts";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface TicketSettingsProps {
    actorId?: string;
    serverId?: string;
}

interface Channel {
    id: string;
    name: string;
    type: string;
}

const TicketSettingsComponent: React.FC<TicketSettingsProps> = ({ serverId, actorId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<GuildSettings>(defaultSettings(serverId!));
    const [channels, setChannels] = useState<Channel[]>([]);
    const [sendForm, setSendForm] = useState<boolean>(false);
    const [selectedChannel, setSelectedChannel] = useState<Channel>();
    const [categories, setCategories] = useState<Channel[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/settings`);
                setSettings(response.data);
            } catch (error) {
                showToast('Unable to fetch server settings', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchChannels = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/channels`);
                setChannels(response.data.channels.filter((channel: Channel) => channel.type === 'TEXT'));
                setCategories(response.data.channels.filter((channel: Channel) => channel.type === 'CATEGORY'));
            } catch (error) {
                showToast('Unable to fetch channels', 'error');
            }
        };

        fetchSettings();
        fetchChannels();
    }, [serverId, actorId]);

    const handleMultiSelectChange = (field: string, selectedOptions: any) => {
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        ticket: {
                            ...settings.config.features.ticket,
                            settings: {
                                ...settings.config.features.ticket.settings,
                                [field]: selectedOptions.map((option: any) => option.value)
                            }
                        }
                    }
                }
            };
            setSettings(updatedSettings);
            patchSettings(updatedSettings);
        }
    };

    const handleSwitchChange = (field: string, value: boolean) => {
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        ticket: {
                            ...settings.config.features.ticket,
                            settings: {
                                ...settings.config.features.ticket.settings,
                                [field]: value
                            }
                        }
                    }
                }
            };
            setSettings(updatedSettings);
            patchSettings(updatedSettings);
        }
    };

    const handleSelectChange = (field: string, selectedOption: any) => {
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        ticket: {
                            ...settings.config.features.ticket,
                            settings: {
                                ...settings.config.features.ticket.settings,
                                [field]: selectedOption.value
                            }
                        }
                    }
                }
            };
            setSettings(updatedSettings);
            patchSettings(updatedSettings);
        }
    };

    const handleInputChange = (field: string, target: string) => {
        if (field === "initialTitle" && target.length > 256) {
            showToast("A embedded title cannot exceed 256 characters")
            return
        } else if (field === "initialMessage" && target.length > 4096) {
            showToast("A embedded description cannot exceed 4096 characters")
            return
        }

        const plainText = target.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags to get plain text
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        ticket: {
                            ...settings.config.features.ticket,
                            settings: {
                                ...settings.config.features.ticket.settings,
                                [field]: plainText
                            }
                        }
                    }
                }
            };
            setSettings(updatedSettings);
            patchSettings(updatedSettings);
        }
    };

    const handleFeatureSwitchChange = (value: boolean) => {
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        ticket: {
                            ...settings.config.features.ticket,
                            enabled: value
                        }
                    }
                }
            };
            setSettings(updatedSettings);
            patchSettings(updatedSettings);
        }
    };

    const patchSettings = async (updatedSettings: GuildSettings) => {
        try {
            const response = await axios.post(`/api/patch-settings`, updatedSettings);

            if (!response.data.status) {
                showToast(response.data.message, 'error');
            }
        } catch (error) {
            showToast('Unable to update settings', 'error');
        }
    };

    const renderSelectOptions = (items: any[]) => {
        return items.map(item => ({
            value: item.id,
            label: item.name
        }));
    };

    const renderHelpIcon = (message: string) => (
        <div className="relative group">
            <FaQuestionCircle className="text-gray-500 hover:text-gray-300 cursor-pointer" />
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-sm rounded-lg shadow-lg">
                {message}
            </div>
        </div>
    );

    const customStyles: StylesConfig<any, true> = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#2d3748',
            borderColor: '#4a5568',
            color: '#e2e8f0',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#2d3748',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#e2e8f0',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4a5568' : state.isFocused ? '#2d3748' : '#2d3748',
            color: '#e2e8f0',
        }),
        input: (provided) => ({
            ...provided,
            color: '#e2e8f0',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#a0aec0',
        }),
    };

    const handleSendForm = async (channel: Channel) => {
        try {
            await axios.post(`/api/servers/${serverId}/summon-interaction`, {
                type: 'TICKET_FORM',
                channelId: channel.id
            });
            showToast("The ticket form has been sent to your server", "success")
        } catch (error) {
            showToast("A error occurred while sending the verification form", "error")
        }
    }

    const handleOpenSendForm = () => setSendForm(true)

    return (
        <div className="flex flex-col p-6 space-y-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-white">Ticket Settings</h2>
            {isLoading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <>
                    <div className="flex items-center space-x-4">
                        <span className="text-white">Enabled</span>
                        <Switch
                            checked={settings?.config.features.ticket.enabled}
                            onChange={handleFeatureSwitchChange}
                            className={`${settings?.config.features.ticket.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Ticket Module</span>
                            <span
                                className={`${settings?.config.features.ticket.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}/>
                        </Switch>
                    </div>
                    <div
                        className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 space-x-0 md:space-x-4">
                        <span
                            className="text-white">Send ticket form {renderHelpIcon('This button will send the ticket form to allow user to open new tickets')}</span>
                        <Button
                            onClick={handleOpenSendForm}
                            variant={settings?.config.features.ticket.enabled ? "premium" : "destructive"}
                            disabled={!settings?.config.features.ticket.enabled}
                        >
                            {settings?.config.features.ticket.enabled ? "Send form" : 'Please enable the ticket system.'}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-400">
                                Select the category for
                                tickets {renderHelpIcon('Select the category where tickets will be created.')}
                            </label>
                            <Select
                                options={renderSelectOptions(categories)}
                                className="w-2/3"
                                onChange={selected => handleSelectChange('categoryId', selected)}
                                value={renderSelectOptions(categories).find(category => category.value === settings?.config.features.ticket.settings.categoryId)}
                                styles={customStyles}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-400">
                                Select the category for closed
                                tickets {renderHelpIcon('Select the category where closed tickets will be transferred.')}
                            </label>
                            <Select
                                options={renderSelectOptions(categories)}
                                className="w-2/3"
                                onChange={selected => handleSelectChange('closingCategoryId', selected)}
                                value={renderSelectOptions(categories).find(category => category.value === settings?.config.features.ticket.settings.closingCategoryId)}
                                styles={customStyles}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-400">
                                Select the logging channel for
                                tickets {renderHelpIcon('Select the channel where ticket logs will be sent.')}
                            </label>
                            <Select
                                options={renderSelectOptions(channels)}
                                className="w-2/3"
                                onChange={selected => handleSelectChange('ticketLoggingChannel', selected)}
                                value={renderSelectOptions(channels).find(channel => channel.value === settings?.config.features.ticket.settings.ticketLoggingChannel)}
                                styles={customStyles}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-400 flex items-center">
                                Enable transcript {renderHelpIcon('Enable this to automatically generate transcripts of tickets.')}
                            </span>
                            <Switch
                                checked={settings?.config.features.ticket.settings.transcript}
                                onChange={value => handleSwitchChange('transcript', value)}
                                className={`${settings?.config.features.ticket.settings.transcript ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className="sr-only">Enable Transcript</span>
                                <span
                                    className={`${settings?.config.features.ticket.settings.transcript ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}/>
                            </Switch>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-400 flex items-center">
                                Auto closing orphan ticket {renderHelpIcon('Closing tickets automatically when a member have a opened ticket and leave your server')}
                            </span>
                            <Switch
                                checked={settings?.config.features.ticket.settings.autoCloseOnUserLeave}
                                onChange={value => handleSwitchChange('autoCloseOnUserLeave', value)}
                                className={`${settings?.config.features.ticket.settings.autoCloseOnUserLeave ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className="sr-only">Enable Transcript</span>
                                <span
                                    className={`${settings?.config.features.ticket.settings.autoCloseOnUserLeave ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}/>
                            </Switch>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-400">
                                    Enter the initial
                                    title {renderHelpIcon('The title will be displayed on the ticket channel')}
                                </label>
                                <textarea
                                    className="w-2/3 p-2 bg-gray-900 text-white rounded border-green-400"
                                    onChange={e => handleInputChange('initialTitle', e.target.value)}
                                    value={settings?.config.features.ticket.settings.initialTitle || ''}
                                    placeholder={"Enter a title..."}
                                    rows={8}
                                    cols={3}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-400">
                                    Enter the initial
                                    message {renderHelpIcon('The description will be displayed on the ticket channel')}
                                </label>
                                <textarea
                                    value={settings?.config.features.ticket.settings.initialMessage || ''}
                                    onChange={(e) => handleInputChange('initialMessage', e.target.value)}
                                    className="w-2/3 p-2 bg-gray-900 text-white rounded border-green-400"
                                    placeholder={"Enter a message..."}
                                    rows={8}
                                    cols={16}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
            {sendForm && (
                <SelectChannelDialog
                    serverId={serverId!}
                    onClick={handleSendForm}
                    channelType={'TEXT'}
                />
            )}
        </div>
    );
};

export default TicketSettingsComponent;
