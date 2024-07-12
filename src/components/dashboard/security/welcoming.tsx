import React, { useEffect, useState } from "react";
import { GuildSettings } from "@/models/GuildSettings.ts";
import axios from "axios";
import { showToast } from "@/components/toast.tsx";
import { FaQuestionCircle } from "react-icons/fa";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import { customSelectStyles } from "@/lib/utils.ts";
import {defaultSettings} from "@/lib/constants.ts";

interface InviteTrackerProps {
    actorId: string;
    serverId: string;
}

interface Channel {
    id: string;
    name: string;
    type: string;
}

interface Role {
    id: string;
    name: string;
    color: string;
    position: number;
}

const Welcoming: React.FC<InviteTrackerProps> = ({ actorId, serverId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<GuildSettings>(defaultSettings(serverId!));
    const [channels, setChannels] = useState<Channel[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

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
            } catch (error) {
                showToast('Unable to fetch channels', 'error');
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/roles`);
                setRoles(response.data.roles);
            } catch (error) {
                showToast('Unable to fetch roles', 'error');
            }
        };

        fetchSettings();
        fetchChannels();
        fetchRoles();
    }, [serverId, actorId]);

    const handleSwitchChange = (field: string, value: boolean) => {
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        welcoming: {
                            ...settings.config.features.welcoming,
                            [field]: value
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
                        welcoming: {
                            ...settings.config.features.welcoming,
                            settings: {
                                ...settings.config.features.welcoming.settings,
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
        const plainText = target.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags to get plain text
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        welcoming: {
                            ...settings.config.features.welcoming,
                            settings: {
                                ...settings.config.features.welcoming.settings,
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

    return (
        <div className="flex flex-col p-6 space-y-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-white">Welcoming Settings</h2>
            {isLoading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <div className="space-y-4">
                    <div
                        className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 space-x-0 md:space-x-4">
                        <span className="text-white">
                            {renderHelpIcon('Enable or disable invite-tracker feature')} Enabled
                        </span>
                        <Switch
                            checked={settings?.config.features.welcoming.enabled}
                            onChange={value => handleSwitchChange('enabled', value)}
                            className={`${settings?.config.features.welcoming.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Welcome Message</span>
                            <span
                                className={`${settings?.config.features.welcoming.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            {renderHelpIcon('Select the channel where the welcome message will be sent')} Join channel
                        </label>
                        <Select
                            options={renderSelectOptions(channels)}
                            className="w-full sm:w-2/3"
                            onChange={selected => handleSelectChange('welcomeChannel', selected)}
                            value={renderSelectOptions(channels).filter(channel => settings?.config.features.welcoming.settings.welcomeChannel === channel.value)}
                            styles={customSelectStyles}
                            isDisabled={!settings?.config.features.welcoming.enabled}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            {renderHelpIcon('Select the channel where the leave message will be sent')} Leave channel
                        </label>
                        <Select
                            options={renderSelectOptions(channels)}
                            className="w-full sm:w-2/3"
                            onChange={selected => handleSelectChange('goodbyeChannel', selected)}
                            value={renderSelectOptions(channels).filter(channel => settings?.config.features.welcoming.settings.goodbyeChannel === channel.value)}
                            styles={customSelectStyles}
                            isDisabled={!settings?.config.features.welcoming.enabled}
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-400">
                                    {renderHelpIcon('The welcome message will be displayed on the embed')} Welcome message
                                </label>
                                <textarea
                                    value={settings?.config.features.welcoming.settings.joinMessage || ''}
                                    onChange={(e) => handleInputChange('joinMessage', e.target.value)}
                                    className="w-2/3 p-2 bg-gray-900 text-white rounded border-green-400"
                                    placeholder={"Enter a message..."}
                                    rows={8}
                                    cols={16}
                                    disabled={!settings?.config.features.welcoming.enabled}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-400">
                                    {renderHelpIcon('The goodbye message will be displayed on the embed')} Goodbye message
                                </label>
                                <textarea
                                    value={settings?.config.features.welcoming.settings.leftMessage || ''}
                                    onChange={(e) => handleInputChange('leftMessage', e.target.value)}
                                    className="w-2/3 p-2 bg-gray-900 text-white rounded border-green-400"
                                    placeholder={"Enter a message..."}
                                    rows={8}
                                    cols={16}
                                    disabled={!settings?.config.features.welcoming.enabled}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Welcoming;
