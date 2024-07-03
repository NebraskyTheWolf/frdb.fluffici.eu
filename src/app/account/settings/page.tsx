"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLanguage, FaBell, FaSave } from "react-icons/fa";
import { Button } from "@/components/button";
import { showToast } from "@/components/toast";

interface UserSettings {
    language: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
}

const UserSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings>({
        language: "en",
        notifications: {
            email: true,
            sms: false,
            push: true,
        },
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/user/settings");
                setSettings(response.data);
            } catch (error) {
                showToast("Error fetching user settings", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSaveSettings = async () => {
        try {
            setLoading(true);
            await axios.post("/api/user/settings", settings);
            showToast("Settings saved successfully", "success");
        } catch (error) {
            showToast("Error saving settings", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings({ ...settings, language: event.target.value });
    };

    const handleToggleNotification = (type: keyof UserSettings["notifications"]) => {
        setSettings({
            ...settings,
            notifications: {
                ...settings.notifications,
                [type]: !settings.notifications[type],
            },
        });
    };

    return (
        <div className="container mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">User Settings</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* Language Settings */}
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <FaLanguage className="mr-2" /> Language
                        </h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <select
                                value={settings.language}
                                onChange={handleChangeLanguage}
                                className="bg-gray-700 text-white p-2 rounded-lg w-full"
                            >
                                <option value="en">English</option>
                                <option value="cs">Czech</option>
                                <option value="sk">Slovak</option>
                            </select>
                        </div>
                    </section>

                    {/* Notification Settings */}
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <FaBell className="mr-2" /> Notifications
                        </h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.email}
                                    onChange={() => handleToggleNotification("email")}
                                    className="mr-2"
                                />
                                <label>Email Notifications</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.sms}
                                    onChange={() => handleToggleNotification("sms")}
                                    className="mr-2"
                                />
                                <label>SMS Notifications</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.push}
                                    onChange={() => handleToggleNotification("push")}
                                    className="mr-2"
                                />
                                <label>Push Notifications</label>
                            </div>
                        </div>
                    </section>

                    <Button onClick={handleSaveSettings} variant="outline" className="bg-green-500 text-white py-2 px-4 rounded">
                        <FaSave className="mr-2" /> Save Settings
                    </Button>
                </>
            )}
        </div>
    );
};

export default UserSettingsPage;
