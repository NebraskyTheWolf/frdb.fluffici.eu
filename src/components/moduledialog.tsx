import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Select from 'react-select';

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

interface ModuleDialogProps {
    isDialogOpen: boolean;
    closeModuleDialog: () => void;
    selectedModule: Module | null;
    SENSITIVITY: { label: string; value: string; icon: JSX.Element }[];
    handleSensitivityChange: (selectedOption: any) => void;
    customSelectStyles: any;
    CustomOption: any;
    updateModuleCustomSettings: (slug: string | undefined, customSettings: {
        threshold?: number;
        timeThreshold?: number
    }) => void;
}

const ModuleDialog: React.FC<ModuleDialogProps> = ({ isDialogOpen, closeModuleDialog, selectedModule, SENSITIVITY, handleSensitivityChange, customSelectStyles, CustomOption, updateModuleCustomSettings }) => {
    const [threshold, setThreshold] = useState(selectedModule?.customSettings?.threshold || 0);
    const [timeThreshold, setTimeThreshold] = useState(selectedModule?.customSettings?.timeThreshold || 0);

    const isCustomSensitivity = selectedModule?.sensitivity === 'CUSTOM';

    const handleSaveCustomSettings = () => {
        const customSettings = { threshold, timeThreshold };
        updateModuleCustomSettings(selectedModule?.slug, customSettings);
        closeModuleDialog();
    };

    return (
        <Transition appear show={isDialogOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModuleDialog}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl min-h-[400px] transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                                    {selectedModule?.name}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-300">
                                        {selectedModule?.description}
                                    </p>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-400">Sensitivity</label>
                                        <Select
                                            options={SENSITIVITY}
                                            className="mt-1"
                                            onChange={handleSensitivityChange}
                                            value={SENSITIVITY.find(option => option.value === selectedModule?.sensitivity)}
                                            components={{ Option: CustomOption }}
                                            styles={customSelectStyles}
                                        />
                                    </div>
                                    {isCustomSensitivity && (
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">Threshold</label>
                                                <input
                                                    type="number"
                                                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    value={threshold}
                                                    onChange={(e) => setThreshold(Number(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">Time Threshold</label>
                                                <input
                                                    type="number"
                                                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    value={timeThreshold}
                                                    onChange={(e) => setTimeThreshold(Number(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={handleSaveCustomSettings}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ml-2"
                                        onClick={closeModuleDialog}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ModuleDialog;
