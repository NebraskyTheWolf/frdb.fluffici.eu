import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Switch } from '@headlessui/react';
import { FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
import { showToast } from '@/components/toast.tsx';
import { GuildSettings } from '@/models/GuildSettings.ts';
import {defaultSettings} from "@/lib/constants.ts";

interface GeneralSettingsProps {
    actorId?: string;
    serverId?: string;
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

interface Command {
    id: string;
    name: string;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ serverId, actorId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<GuildSettings>(defaultSettings(serverId!));
    const [channels, setChannels] = useState<Channel[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [commands, setCommands] = useState<Command[]>([]);

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

        const fetchCommands = async () => {
            try {
                const response = await axios.post(`/api/commands`);
                setCommands(response.data);
            } catch (error) {
                showToast('Unable to fetch roles', 'error');
            }
        };

        fetchSettings();
        fetchChannels();
        fetchRoles();
        fetchCommands();
    }, [serverId, actorId]);

    const handleMultiSelectChange = (field: string, selectedOptions: any) => {
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    settings: {
                        ...settings.config.settings,
                        [field]: selectedOptions.map((option: any) => option.value)
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
                    settings: {
                        ...settings.config.settings,
                        [field]: value
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
                    settings: {
                        ...settings.config.settings,
                        [field]: selectedOption.value
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

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'cs', label: 'Czech' },
        { value: 'sk', label: 'Slovak' },
    ];

    return (
        <div className="flex flex-col p-6 space-y-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-white">General Settings</h2>
            {isLoading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Select the staff roles {renderHelpIcon('Select roles that will have staff permissions.')}
                        </label>
                        <Select
                            options={renderSelectOptions(roles)}
                            isMulti
                            className="w-full sm:w-2/3"
                            onChange={selected => handleMultiSelectChange('staffRoles', selected)}
                            value={renderSelectOptions(roles).filter(role => settings?.config.settings.staffRoles.includes(role.value))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Select the channels where the filters will be ignored {renderHelpIcon('These channels will be exempt from any filters applied.')}
                        </label>
                        <Select
                            options={renderSelectOptions(channels)}
                            isMulti
                            className="w-full sm:w-2/3"
                            onChange={selected => handleMultiSelectChange('exemptedChannels', selected)}
                            value={renderSelectOptions(channels).filter(channel => settings?.config.settings.exemptedChannels.includes(channel.value))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Select the roles that will be ignored with filters {renderHelpIcon('Members with these roles will be exempt from any filters applied.')}
                        </label>
                        <Select
                            options={renderSelectOptions(roles)}
                            isMulti
                            className="w-full sm:w-2/3"
                            onChange={selected => handleMultiSelectChange('exemptedRoles', selected)}
                            value={renderSelectOptions(roles).filter(role => settings?.config.settings.exemptedRoles.includes(role.value))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Select the disabled commands {renderHelpIcon('These commands will be disabled.')}
                        </label>
                        <Select
                            options={renderSelectOptions(commands)}
                            isMulti
                            className="w-full sm:w-2/3"
                            onChange={selected => handleMultiSelectChange('disabledCommands', selected)}
                            value={renderSelectOptions(commands).filter(role => settings?.config.settings.disabledCommands.includes(role.value))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Select Language {renderHelpIcon('Select the language for the bot.')}
                        </label>
                        <Select
                            options={languageOptions}
                            className="w-full sm:w-2/3"
                            onChange={selected => handleSelectChange('language', selected)}
                            value={languageOptions.find(lang => lang.value === settings?.config.settings.language)}
                            styles={customStyles}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <span className="text-sm font-medium text-gray-400 flex items-center w-full sm:w-1/3">
                            Whitelist override {renderHelpIcon('Enable this option to override any blacklist settings with whitelists.')}
                        </span>
                        <Switch
                            checked={settings?.config.settings.whitelistOverride}
                            onChange={value => handleSwitchChange('whitelistOverride', value)}
                            className={`${settings?.config.settings.whitelistOverride ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Whitelist Override</span>
                            <span
                                className={`${settings?.config.settings.whitelistOverride ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <span className="text-sm font-medium text-gray-400 flex items-center w-full sm:w-1/3">
                            Member join/leave details {renderHelpIcon('Show detailed logs of member joins and leaves.')}
                        </span>
                        <Switch
                            checked={settings?.config.settings.isUsingJoinLeaveInformation}
                            onChange={value => handleSwitchChange('isUsingJoinLeaveInformation', value)}
                            className={`${settings?.config.settings.isUsingJoinLeaveInformation ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Join/Leave Information</span>
                            <span
                                className={`${settings?.config.settings.isUsingJoinLeaveInformation ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <span className="text-sm font-medium text-gray-400 flex items-center w-full sm:w-1/3">
                            Using global blacklist {renderHelpIcon('Enable this to use a global blacklist for filtering members.')}
                        </span>
                        <Switch
                            checked={settings?.config.settings.isUsingGlobalBlacklist}
                            onChange={value => handleSwitchChange('isUsingGlobalBlacklist', value)}
                            className={`${settings?.config.settings.isUsingGlobalBlacklist ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Global Blacklist</span>
                            <span
                                className={`${settings?.config.settings.isUsingGlobalBlacklist ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <span className="text-sm font-medium text-gray-400 flex items-center w-full sm:w-1/3">
                            Using local blacklist {renderHelpIcon('Enable this to use a local blacklist for filtering members.')}
                        </span>
                        <Switch
                            checked={settings?.config.settings.isUsingLocalBlacklist}
                            onChange={value => handleSwitchChange('isUsingLocalBlacklist', value)}
                            className={`${settings?.config.settings.isUsingLocalBlacklist ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Local Blacklist</span>
                            <span
                                className={`${settings?.config.settings.isUsingLocalBlacklist ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneralSettings;
