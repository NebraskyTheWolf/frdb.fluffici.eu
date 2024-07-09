import React, {useEffect, useState} from "react";
import {GuildSettings} from "@/models/GuildSettings.ts";
import axios from "axios";
import {showToast} from "@/components/toast.tsx";
import {FaQuestionCircle, FaShieldAlt, FaShieldVirus} from "react-icons/fa";
import {Switch} from "@headlessui/react";
import Select, { components } from "react-select";
import {customSelectStyles} from "@/lib/utils.ts";
import {FaShield} from "react-icons/fa6";
import {defaultSettings} from "@/lib/constants.ts";

interface AntiRaidProps {
    actorId: string;
    serverId: string;
}

interface Channel {
    id: string;
    name: string;
    type: string;
}

const SENSITIVITY = [
    { label: 'Low', value: 'LOW', icon: <FaShield /> },
    { label: 'Medium', value: 'MEDIUM', icon: <FaShieldAlt /> },
    { label: 'High', value: 'HIGH', icon: <FaShieldVirus /> },
    { label: 'Strict', value: 'STRICT', icon: <FaShieldAlt /> },
]

const AntiRaid: React.FC<AntiRaidProps> = ({ actorId, serverId}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<GuildSettings>(defaultSettings(serverId!));
    const [channels, setChannels] = useState<Channel[]>([]);

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

        fetchSettings();
        fetchChannels();
    }, [serverId, actorId]);

    const handleSwitchChange = (field: string, value: boolean) => {
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        antiRaid: {
                            ...settings.config.features.antiRaid,
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
                        antiRaid: {
                            ...settings.config.features.antiRaid,
                            settings: {
                                ...settings.config.features.antiRaid.settings,
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

    const CustomOption = (props: any) => {
        return (
            <components.Option {...props}>
                <div className="flex items-center">
                    {props.data.icon}
                    <span className="ml-2">{props.data.label}</span>
                </div>
            </components.Option>
        );
    };

    return (
        <div className="flex flex-col p-6 space-y-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-white">Anti Raid Settings</h2>
            {isLoading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <div className="space-y-4">
                    <div
                        className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 space-x-0 md:space-x-4">
                        <span className="text-white">
                            Enabled {renderHelpIcon('Enable or disable anti-raid feature')}
                        </span>
                        <Switch
                            checked={settings?.config.features.antiRaid.enabled}
                            onChange={value => handleSwitchChange('enabled', value)}
                            className={`${settings?.config.features.antiRaid.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Anti Raid</span>
                            <span
                                className={`${settings?.config.features.antiRaid.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Logging
                            channel {renderHelpIcon('Select the channel where the anti raid will alert your moderators when a raid is detected')}
                        </label>
                        <Select
                            options={renderSelectOptions(channels)}
                            className="w-full sm:w-2/3"
                            onChange={selected => handleSelectChange('loggingChannel', selected)}
                            value={renderSelectOptions(channels).filter(channel => settings?.config.features.antiRaid.settings.loggingChannel === channel.value)}
                            styles={customSelectStyles}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Sensitivity {renderHelpIcon('Choice the sensitivity of the anti-raid, for small servers we recommend Medium')}
                        </label>
                        <Select
                            options={SENSITIVITY}
                            className="w-full sm:w-2/3"
                            onChange={selected => handleSelectChange('sensitivity', selected)}
                            value={SENSITIVITY.find(option => option.value === settings?.config.features.antiRaid.settings.sensitivity)}
                            components={{ Option: CustomOption }}
                            styles={customSelectStyles}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AntiRaid;
