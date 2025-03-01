import React, { useEffect, useState } from "react";
import { GuildSettings } from "@/models/GuildSettings.ts";
import axios from "axios";
import { showToast } from "@/components/toast.tsx";
import { FaQuestionCircle } from "react-icons/fa";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import { customSelectStyles } from "@/lib/utils.ts";
import {defaultSettings} from "@/lib/constants.ts";

interface AntiScamProps {
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

const AntiScam: React.FC<AntiScamProps> = ({ actorId, serverId }) => {
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
                        antiScamFeature: {
                            ...settings.config.features.antiScamFeature,
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
                        antiScamFeature: {
                            ...settings.config.features.antiScamFeature,
                            settings: {
                                ...settings.config.features.antiScamFeature.settings,
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
            <h2 className="text-2xl font-bold text-white">Anti Scam Settings</h2>
            {isLoading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 space-x-0 md:space-x-4">
                        <span className="text-white">
                            Enabled {renderHelpIcon('Enable or disable anti-scam feature')}
                        </span>
                        <Switch
                            checked={settings?.config.features.antiScamFeature.enabled}
                            onChange={value => handleSwitchChange('enabled', value)}
                            className={`${settings?.config.features.antiScamFeature.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Anti Scam</span>
                            <span
                                className={`${settings?.config.features.antiScamFeature.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Select the quarantined role {renderHelpIcon('This role will prevent the quarantined users to interact with your server, Be aware! you need to setup this role yourself!')}
                        </label>
                        <Select
                            options={renderSelectOptions(roles)}
                            className="w-full sm:w-2/3"
                            onChange={selected => handleSelectChange('quarantinedRole', selected)}
                            value={renderSelectOptions(roles).filter(role => settings?.config.features.antiScamFeature.settings.quarantinedRole === role.value)}
                            styles={customSelectStyles}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Select the channels where the quarantine logs will be sent {renderHelpIcon('All the quarantined users will appear there')}
                        </label>
                        <Select
                            options={renderSelectOptions(channels)}
                            className="w-full sm:w-2/3"
                            onChange={selected => handleSelectChange('loggingChannel', selected)}
                            value={renderSelectOptions(channels).filter(channel => settings?.config.features.antiScamFeature.settings.loggingChannel === channel.value)}
                            styles={customSelectStyles}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AntiScam;
