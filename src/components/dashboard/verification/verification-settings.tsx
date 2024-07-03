"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../dialog.tsx';
import { Button } from '@/components/button.tsx';
import { Switch } from '@headlessui/react';
import { FaPlusSquare, FaTrash, FaQuestionCircle } from 'react-icons/fa';
import axios from "axios";
import { showToast } from "@/components/toast.tsx";
import { GuildSettings, Question } from "@/models/GuildSettings.ts";
import { FaRegNoteSticky } from "react-icons/fa6";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Select, { SingleValue, StylesConfig } from 'react-select';

interface VerificationSettingsProps {
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

interface OptionType {
    value: string;
    label: string;
}

const VerificationSettings: React.FC<VerificationSettingsProps> = ({ serverId, actorId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogDesc, setShowDialogDesc] = useState(false);
    const [description, setDescription] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [newQuestion, setNewQuestion] = useState<Question>({
        title: '',
        placeholder: '',
        min: 0,
        max: 0
    });
    const [settings, setSettings] = useState<GuildSettings | null>(null);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/settings`);
                setSettings(response.data);
                setQuestions(response.data.config.features.verification.settings.questions);
                setEnabled(response.data.config.features.verification.enabled);
                setDescription(response.data.config.features.verification.settings.description)
            } catch (error) {
                showToast("Unable to fetch server settings", "error");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchChannels = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/channels`);
                setChannels(response.data.channels.filter((channel: Channel) => channel.type === "TEXT"));
            } catch (error) {
                showToast("Unable to fetch channels", "error");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axios.post(`/api/servers/${serverId}/roles`);
                setRoles(response.data.roles);
            } catch (error) {
                showToast("Unable to fetch roles", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
        fetchChannels();
        fetchRoles()
    }, [serverId, actorId]);

    const handleDialogOpen = () => {
        setIsEditing(false);
        setShowDialog(true);
    };

    const handleDialogOpenDesc = () => {
        setShowDialogDesc(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        setNewQuestion({ title: '', placeholder: '', min: 0, max: 0 });
        setCurrentIndex(null);
    };

    const handleDialogCloseDesc = () => {
        setShowDialogDesc(false);
    };

    const handleSaveQuestion = async () => {
        const updatedSettings = { ...settings! };
        if (isEditing && currentIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[currentIndex] = newQuestion;
            setQuestions(updatedQuestions);
            updatedSettings.config.features.verification.settings.questions = updatedQuestions;
        } else {
            const updatedQuestions = [...questions, newQuestion];
            setQuestions(updatedQuestions);
            updatedSettings.config.features.verification.settings.questions = updatedQuestions;
        }

        handleDialogClose();
        await handlePatchQuestions(updatedSettings);
    };

    const handleSaveDesc = async () => {
        const updatedSettings = { ...settings! };
        updatedSettings.config.features.verification.settings.description = description;

        handleDialogCloseDesc();
        await handlePatchDesc(updatedSettings);
    };

    const handleEditQuestion = (index: number) => {
        setIsEditing(true);
        setCurrentIndex(index);
        setNewQuestion(questions[index]);
        setShowDialog(true);
    };

    const handleDeleteQuestion = async (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
        const updatedSettings = { ...settings! };
        updatedSettings.config.features.verification.settings.questions = updatedQuestions;
        await handlePatchQuestions(updatedSettings);
    };

    const handleGateUpdate = async (option: SingleValue<OptionType>) => {
        if (settings && option) {
            const updatedSettings = { ...settings };
            updatedSettings.config.features.verification.settings.verificationGate = option.value;

            try {
                const response = await axios.post(`/api/patch-settings`, updatedSettings);
                setSettings(updatedSettings);

                if (!response.data.status) {
                    showToast(response.data.message, "error");
                }
            } catch (error) {
                showToast("Unable to update gate channel", "error");
            }
        }
    };

    const handleLoggingUpdate = async (option: SingleValue<OptionType>) => {
        if (settings && option) {
            const updatedSettings = { ...settings };
            updatedSettings.config.features.verification.settings.verificationLoggingChannel = option.value;

            try {
                const response = await axios.post(`/api/patch-settings`, updatedSettings);
                setSettings(updatedSettings);

                if (!response.data.status) {
                    showToast(response.data.message, "error");
                }
            } catch (error) {
                showToast("Unable to update logging channel", "error");
            }
        }
    };

    const handleUnverifiedRole = async (option: SingleValue<OptionType>) => {
        if (settings && option) {
            const updatedSettings = { ...settings };
            updatedSettings.config.features.verification.settings.unverifiedRole = option.value;

            try {
                const response = await axios.post(`/api/patch-settings`, updatedSettings);
                setSettings(updatedSettings);

                if (!response.data.status) {
                    showToast(response.data.message, "error");
                }
            } catch (error) {
                showToast("Unable to update unverified role", "error");
            }
        }
    };

    const handleVerifiedRole = async (option: SingleValue<OptionType>) => {
        if (settings && option) {
            const updatedSettings = { ...settings };
            updatedSettings.config.features.verification.settings.verifiedRole = option.value;

            try {
                const response = await axios.post(`/api/patch-settings`, updatedSettings);
                setSettings(updatedSettings);

                if (!response.data.status) {
                    showToast(response.data.message, "error");
                }
            } catch (error) {
                showToast("Unable to update verified role", "error");
            }
        }
    };

    const handlePatchQuestions = async (updatedSettings: GuildSettings | null) => {
        if (!updatedSettings) return;

        try {
            const response = await axios.post(`/api/patch-settings`, updatedSettings);
            setSettings(updatedSettings);

            if (!response.data.status) {
                showToast(response.data.message, "error");
            }
        } catch (error) {
            showToast("Unable to update questions", "error");
        }
    };

    const handlePatchDesc = async (updatedSettings: GuildSettings | null) => {
        if (!updatedSettings) return;

        try {
            const response = await axios.post(`/api/patch-settings`, updatedSettings);
            setSettings(updatedSettings);

            if (!response.data.status) {
                showToast(response.data.message, "error");
            }
        } catch (error) {
            showToast("Unable to update description", "error");
        }
    };

    const handleSwitchState = async (state: boolean) => {
        if (settings) {
            const updatedSettings = { ...settings };
            updatedSettings.config.features.verification.enabled = state;
            setEnabled(state);

            try {
                const response = await axios.post(`/api/patch-settings`, updatedSettings);
                setSettings(updatedSettings);

                if (!response.data.status) {
                    showToast(response.data.message, "error");
                }
            } catch (error) {
                showToast("Unable to update enabled state", "error");
            }
        }
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const updatedQuestions = Array.from(questions);
        const [movedQuestion] = updatedQuestions.splice(result.source.index, 1);
        updatedQuestions.splice(result.destination.index, 0, movedQuestion);
        setQuestions(updatedQuestions);

        const updatedSettings = { ...settings! };
        updatedSettings.config.features.verification.settings.questions = updatedQuestions;
        await handlePatchQuestions(updatedSettings);
    };

    const renderHelpIcon = (message: string) => (
        <div className="relative group">
            <FaQuestionCircle className="text-gray-500 hover:text-gray-300 cursor-pointer" />
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-sm rounded-lg shadow-lg">
                {message}
            </div>
        </div>
    );

    const customStyles: StylesConfig<OptionType, false> = {
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
            <h2 className="text-2xl font-bold text-white">Verification Configuration</h2>
            {isLoading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <>
                    <div className="flex items-center space-x-4">
                        <span className="text-white">Enabled {renderHelpIcon('Enable or disable verification feature')}</span>
                        <Switch
                            checked={enabled}
                            onChange={handleSwitchState}
                            className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'}
                                        relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable Verification</span>
                            <span
                                className={`${enabled ? 'translate-x-6' : 'translate-x-1'}
                                            inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-400">
                                Select the channel where the form will be sent {renderHelpIcon('Choose the channel where verification forms will be sent.')}
                            </label>
                            <Select
                                options={channels.map(channel => ({ value: channel.id, label: channel.name }))}
                                onChange={handleGateUpdate}
                                value={channels.map(channel => ({ value: channel.id, label: channel.name })).find(option => option.value === settings?.config.features.verification.settings.verificationGate)}
                                className="w-2/3"
                                styles={customStyles}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-400">
                                Select the channel where verification will be sent {renderHelpIcon('Choose the channel where verification notifications will be sent.')}
                            </label>
                            <Select
                                options={channels.map(channel => ({ value: channel.id, label: channel.name }))}
                                onChange={handleLoggingUpdate}
                                value={channels.map(channel => ({ value: channel.id, label: channel.name })).find(option => option.value === settings?.config.features.verification.settings.verificationLoggingChannel)}
                                className="w-2/3"
                                styles={customStyles}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-400">
                                Select the unverified role that will be assigned to all new members {renderHelpIcon('Choose the role that will be assigned to unverified members.')}
                            </label>
                            <Select
                                options={roles.map(role => ({ value: role.id, label: role.name }))}
                                onChange={handleUnverifiedRole}
                                value={roles.map(role => ({ value: role.id, label: role.name })).find(option => option.value === settings?.config.features.verification.settings.unverifiedRole)}
                                className="w-2/3"
                                styles={customStyles}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-400">
                                Select the verified member role {renderHelpIcon('Choose the role that will be assigned to verified members.')}
                            </label>
                            <Select
                                options={roles.map(role => ({ value: role.id, label: role.name }))}
                                onChange={handleVerifiedRole}
                                value={roles.map(role => ({ value: role.id, label: role.name })).find(option => option.value === settings?.config.features.verification.settings.verifiedRole)}
                                className="w-2/3"
                                styles={customStyles}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-white">Questions</h3>
                            <div className="flex space-x-2">
                                <Button onClick={handleDialogOpen}
                                        variant={questions.length >= 5 ? "destructive" : "outline"}
                                        disabled={questions.length >= 5}>
                                    <FaPlusSquare/>
                                </Button>
                                <Button onClick={handleDialogOpenDesc}
                                        variant="outline">
                                    <FaRegNoteSticky/>
                                </Button>
                            </div>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="questions">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {questions.map((question, index) => (
                                            <Draggable key={question.title} draggableId={question.title} index={index}>
                                                {(provided) => (
                                                    <div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className="p-4 bg-gray-700 rounded-lg shadow-md flex justify-between items-center"
                                                    >
                                                        <div onClick={() => handleEditQuestion(index)} className="flex-1 cursor-pointer">
                                                            <h4 className="text-lg font-bold text-white">{question.title}</h4>
                                                            <p className="text-sm text-gray-300">{question.placeholder}</p>
                                                            <p className="text-sm text-gray-400">Min Characters: {question.min}, Max Characters: {question.max}</p>
                                                        </div>
                                                        <Button onClick={() => handleDeleteQuestion(index)} variant="destructive">
                                                            <FaTrash />
                                                        </Button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                    {showDialog && (
                        <Dialog open={showDialog} onOpenChange={handleDialogClose}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{isEditing ? 'Edit Question' : 'Add Question'}</DialogTitle>
                                    <DialogDescription>
                                        Provide the details for the question.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={newQuestion.title}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                                        className="w-full p-3 bg-gray-800 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newQuestion.placeholder}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, placeholder: e.target.value })}
                                        className="w-full p-3 bg-gray-800 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex space-x-4">
                                        <input
                                            type="number"
                                            placeholder="Min Characters"
                                            value={newQuestion.min}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, min: parseInt(e.target.value) })}
                                            className="w-full p-3 bg-gray-800 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Characters"
                                            value={newQuestion.max}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, max: parseInt(e.target.value) })}
                                            className="w-full p-3 bg-gray-800 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleDialogClose} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveQuestion} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                        Save
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    {showDialogDesc && (
                        <Dialog open={showDialogDesc} onOpenChange={handleDialogCloseDesc}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Gate Description</DialogTitle>
                                    <DialogDescription>
                                        Provide the description that will be shown on the gate channel
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-3 bg-gray-800 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleDialogCloseDesc} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveDesc} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                        Save
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </>
            )}
        </div>
    );
};

export default VerificationSettings;
