import React, { useEffect, useState, Fragment } from "react";
import { FaBuildingShield, FaShield } from "react-icons/fa6";
import {FaCogs, FaQuestionCircle, FaShieldAlt, FaShieldVirus} from "react-icons/fa";
import { GuildSettings } from "@/models/GuildSettings.ts";
import axios from "axios";
import { showToast } from "@/components/toast.tsx";
import Select, { components } from "react-select";
import { Switch } from "@headlessui/react";
import { customSelectStyles } from "@/lib/utils.ts";
import ModuleDialog from '../../moduledialog.tsx';
import {Button} from "@/components/button.tsx";

interface AutoModerationProps {
    actorId: string;
    serverId: string;
}

interface Channel {
    id: string;
    name: string;
    type: string;
}

interface Module {
    enabled: boolean;
    slug: string;
    name: string;
    sensitivity: string;
    description: string;
    customSettings?: {
        threshold?: number;
        timeThreshold?: number;
    };
}

const SENSITIVITY = [
    { label: 'Low', value: 'LOW', icon: <FaShield /> },
    { label: 'Medium', value: 'MEDIUM', icon: <FaShieldAlt /> },
    { label: 'High', value: 'HIGH', icon: <FaShieldVirus /> },
    { label: 'Strict', value: 'STRICT', icon: <FaShieldAlt /> },
    { label: 'Custom', value: 'CUSTOM', icon: <FaBuildingShield /> },
]

const defaultModules: Module[] = [
    { enabled: false, slug: 'mass_mentions', name: 'Mass Mentions', sensitivity: 'LOW', description: 'Detect and prevent mass mentions to avoid spamming.' },
    { enabled: false, slug: 'spam', name: 'Spam', sensitivity: 'MEDIUM', description: 'Detect and prevent spam messages in the server.' },
    { enabled: false, slug: 'repeated_messages', name: 'Repeated Messages', sensitivity: 'HIGH', description: 'Detect and prevent repeated messages.' },
    { enabled: false, slug: 'link_protection', name: 'Link Protection', sensitivity: 'HIGH', description: 'Detect and prevent spammy or harmful links.' },
    { enabled: false, slug: 'emoji_spam', name: 'Emoji Spam', sensitivity: 'LOW', description: 'Detect and prevent excessive use of emojis.' },
    { enabled: false, slug: 'attachment_spam', name: 'Attachment Spam', sensitivity: 'MEDIUM', description: 'Detect and prevent spammy attachments.' },
]

const AutoModeration: React.FC<AutoModerationProps> = ({ actorId, serverId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<GuildSettings | null>(null);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [modules, setModules] = useState<Module[]>(defaultModules);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

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
                        autoModeration: {
                            ...settings.config.features.autoModeration,
                            [field]: value
                        }
                    }
                }
            };
            setSettings(updatedSettings);
            patchSettings(updatedSettings);
        }
    };

    const handleModuleSwitchChange = (index: number, value: boolean) => {
        const updatedModules = [...modules];
        updatedModules[index].enabled = value;
        setModules(updatedModules);
        patchModules(updatedModules);
    };

    const handleSelectChange = (field: string, selectedOption: any) => {
        if (settings) {
            const updatedSettings: GuildSettings = {
                ...settings,
                config: {
                    ...settings.config,
                    features: {
                        ...settings.config.features,
                        autoModeration: {
                            ...settings.config.features.autoModeration,
                            settings: {
                                ...settings.config.features.autoModeration.settings,
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

    const patchModules = async (updatedModules: Module[]) => {
        try {
            const updatedSettings = {
                ...settings,
                config: {
                    ...settings?.config,
                    features: {
                        ...settings?.config.features,
                        autoModeration: {
                            ...settings?.config.features.autoModeration,
                            settings: {
                                ...settings?.config.features.autoModeration.settings,
                                modules: updatedModules
                            }
                        }
                    }
                }
            };
            setSettings(updatedSettings as GuildSettings);
            patchSettings(updatedSettings as GuildSettings);
        } catch (error) {
            showToast('Unable to update modules', 'error');
        }
    };

    const updateModuleCustomSettings = (slug: string | undefined, customSettings: any) => {
        const updatedModules = modules.map(module =>
            module.slug === slug ? { ...module, customSettings } : module
        );
        setModules(updatedModules);
        patchModules(updatedModules);
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

    const openModuleDialog = (module: Module) => {
        setSelectedModule(module);
        setIsDialogOpen(true);
    };

    const closeModuleDialog = () => {
        setSelectedModule(null);
        setIsDialogOpen(false);
    };

    const handleSensitivityChange = (selectedOption: any) => {
        if (selectedModule) {
            const updatedModule = { ...selectedModule, sensitivity: selectedOption.value };
            const updatedModules = modules.map(module =>
                module.slug === updatedModule.slug ? updatedModule : module
            );
            setModules(updatedModules);
            patchModules(updatedModules);
            setSelectedModule(updatedModule);
        }
    };

    return (
        <div className="flex flex-col p-6 space-y-6 bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-white">Auto Moderation Settings</h2>
            {isLoading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 space-x-0 md:space-x-4">
                        <span className="text-white">
                            Enabled {renderHelpIcon('Enable or disable verification feature')}
                        </span>
                        <Switch
                            checked={settings?.config.features.autoModeration.enabled}
                            onChange={value => handleSwitchChange('enabled', value)}
                            className={`${settings?.config.features.autoModeration.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Auto Moderation</span>
                            <span
                                className={`${settings?.config.features.autoModeration.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <label className="block text-sm font-medium text-gray-400 w-full sm:w-1/3">
                            Logging channel {renderHelpIcon('Select the channel where the auto moderation logs will be sent')}
                        </label>
                        <Select
                            options={renderSelectOptions(channels)}
                            className="w-full sm:w-2/3"
                            onChange={selected => handleSelectChange('loggingChannel', selected)}
                            value={renderSelectOptions(channels).filter(channel => settings?.config.features.autoModeration.settings.loggingChannel === channel.value)}
                            styles={customSelectStyles}
                        />
                    </div>
                    <div className="space-y-4">
                        {modules.map((module, index) => (
                            <div key={module.slug} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <span className="text-white">{module.name}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        onClick={() => openModuleDialog(module)}
                                        variant={"outline"}
                                    >
                                        <FaCogs />
                                    </Button>
                                    <Switch
                                        checked={module.enabled}
                                        onChange={value => handleModuleSwitchChange(index, value)}
                                        className={`${module.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span className="sr-only">{module.slug}</span>
                                        <span
                                            className={`${module.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
                                        />
                                    </Switch>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <ModuleDialog
                isDialogOpen={isDialogOpen}
                closeModuleDialog={closeModuleDialog}
                selectedModule={selectedModule}
                SENSITIVITY={SENSITIVITY}
                handleSensitivityChange={handleSensitivityChange}
                customSelectStyles={customSelectStyles}
                CustomOption={CustomOption}
                updateModuleCustomSettings={updateModuleCustomSettings}
            />
        </div>
    );
}

export default AutoModeration;
