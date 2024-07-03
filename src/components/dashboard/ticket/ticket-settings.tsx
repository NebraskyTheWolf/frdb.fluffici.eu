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
    const [settings, setSettings] = useState<GuildSettings | null>(null);
    const [channels, setChannels] = useState<Channel[]>([]);
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
                                [field]: target
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
                            <span className={`${settings?.config.features.ticket.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`} />
                        </Switch>
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
                            <label className="block text-sm font-medium text-gray-400">
                                Enter the initial title {renderHelpIcon('The title will be displayed on the ticket channel')}
                            </label>
                            <input
                                type="text"
                                className="w-2/3 p-2 bg-gray-800 text-white rounded"
                                onChange={e => handleInputChange('initialTitle', e.target.value)}
                                value={settings?.config.features.ticket.settings.initialTitle || ''}
                            />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-400">
                                    Enter the initial message {renderHelpIcon('The description will be displayed on the ticket channel')}
                                </label>
                            </div>
                            <ReactQuill
                                theme="snow"
                                value={settings?.config.features.ticket.settings.initialMessage || ''}
                                onChange={(e) => handleInputChange('initialMessage', e)}
                                className="bg-gray-800 text-white rounded"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicketSettingsComponent;
