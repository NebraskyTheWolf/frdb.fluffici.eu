"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { FaChevronLeft, FaPaperPlane, FaEllipsisV, FaUpload, FaUser, FaTrash, FaCogs, FaTimes, FaPlus, FaClipboard } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Button } from "@/components/button.tsx";
import { useDropzone } from 'react-dropzone';
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import {showToast} from "@/components/toast.tsx";
import TicketList from "@/components/dashboard/ticket/ticket-list.tsx";

interface Ticket {
    guildId: string;
    username: string;
    ticketId: string;
    userId: string;
    channelId: string;
    status: string;
    createdAt: string;
    isStaff: boolean;
    webhookUrl: string;
}

interface Message {
    guildId?: string;
    ticketId: string;
    userId?: string;
    messageContent: string;
    messageId?: string;
    createdAt: string;
    sender: {
        username: string;
        avatarUrl: string;
    };
    attachmentUrl?: string;
}

const pusher = new Pusher('42f3a4cad068043e1452', {
    cluster: 'eu'
});

interface SupportTicketsProps {
    actorId?: string;
    serverId?: string;
}

const MENU_ID_USER = "user-context-menu";
const MENU_ID_CHAT = "chat-context-menu";
const MENU_ID_TICKET = "ticket-context-menu";

const SupportTicketsView: React.FC<SupportTicketsProps> = ({ serverId }) => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const { data: session } = useSession();
    const [loading, setLoading] = useState<boolean>(true);
    const [showTranscript, setShowTranscript] = useState<boolean>(false);

    const { show: showUserContextMenu } = useContextMenu({ id: MENU_ID_USER });
    const { show: showChatContextMenu } = useContextMenu({ id: MENU_ID_CHAT });

    const handleOnSelect = useCallback((ticket: Ticket) => {
        setSelectedTicket(ticket);
    }, []);

    useEffect(() => {
        if (selectedTicket) {
            const fetchMessages = async () => {
                try {
                    const response = await axios.post(`/api/servers/${serverId}/fetch-ticket-messages`, {
                        ticketId: selectedTicket.ticketId,
                    });
                    setMessages(response.data);
                    setLoading(false);
                } catch (err) {
                    showToast("Unable to fetch messages", "error");
                }
            };

            fetchMessages();

            const channel = pusher.subscribe(`ticket-${selectedTicket.ticketId}`);
            channel.bind('new-message', (data: Message) => {
                setMessages((prevMessages) => [...prevMessages, data]);
            });

            channel.bind('ticket-closed', () => {
                setShowTranscript(true);
                showToast("The ticket has been closed by the user", "info");
            });

            return () => {
                pusher.unsubscribe(`ticket-${selectedTicket.ticketId}`);
            };
        }
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            ticketId: selectedTicket?.ticketId!,
            sender: {
                username: session?.user.name as string,
                avatarUrl: session?.user.image as string,
            },
            messageContent: newMessage,
            createdAt: new Date().toISOString()
        };

        try {
            await axios.post(`/api/servers/${serverId}/ticket-send-message`, {
                ticketId: selectedTicket?.ticketId,
                content: newMessage
            });

            setMessages((prevMessages) => [...prevMessages!, message]);
            setNewMessage("");
        } catch (err) {
            showToast("Unable to send message", "error")
        }
    };

    const handleUserContextMenu = (event: React.MouseEvent, message: Message) => {
        event.preventDefault();
        showUserContextMenu({ event, props: { message } });
    };

    const handleChatContextMenu = (event: React.MouseEvent, message: Message) => {
        event.preventDefault();
        showChatContextMenu({ event, props: { message } });
    };

    const handleControlMenuClick = (action: string) => {
        switch (action) {
            case 'close':
                // Add logic to close ticket
                break;
            case 'addMember':
                // Add logic to add member
                break;
            case 'transcript':
                setShowTranscript(true);
                break;
            case 'deleteChannel':
                // Add logic to delete channel
                break;
        }
    };

    return (
        <div className="p-6 bg-gray-900 rounded-lg shadow-lg relative">
            {selectedTicket ? (
                <>
                    <Button variant="outline" onClick={() => setSelectedTicket(null)} className="mb-4">
                        <FaChevronLeft /> Back to Tickets
                    </Button>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedTicket.username}'s ticket</h2>
                                <p className="text-sm text-gray-400">Status: {selectedTicket.status}</p>
                                <p className="text-sm text-gray-400">Created At: {selectedTicket.createdAt}</p>
                            </div>
                            <Button variant="outline" className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => handleControlMenuClick('menu')}>
                                <FaCogs />
                            </Button>
                        </div>
                    </div>
                    {showTranscript ? (
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 h-64 overflow-y-scroll">
                            <h2 className="text-xl font-bold text-white mb-4">Transcript</h2>
                            {messages.map((message) => (
                                <div key={message.ticketId} className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <img src={message.sender.avatarUrl} alt={`${message.sender.username}'s avatar`} className="w-8 h-8 rounded-full mr-2" />
                                        <span className="text-white font-semibold">{message.sender.username}</span>
                                        <span className="text-sm text-gray-400 ml-2">{message.createdAt}</span>
                                    </div>
                                    <p className="text-gray-300">{message.messageContent}</p>
                                    {message.attachmentUrl && <a href={message.attachmentUrl} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View Attachment</a>}
                                </div>
                            ))}
                        </div>
                    ) : loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                            </div>
                        ) : (
                        <>
                            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 h-64 overflow-y-scroll">
                                {messages.map((message) => (
                                    <div key={message.messageId} className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <img src={message.sender.avatarUrl} alt={`${message.sender.username}'s avatar`} className="w-8 h-8 rounded-full mr-2" />
                                            <span className="text-white font-semibold" onContextMenu={(e) => handleUserContextMenu(e, message)}>{message.sender.username}</span>
                                            <span className="text-sm text-gray-400 ml-2">{message.createdAt}</span>
                                            <FaEllipsisV className="ml-auto cursor-pointer text-white" onContextMenu={(e) => handleChatContextMenu(e, message)} />
                                        </div>
                                        <p className="text-gray-300">{message.messageContent}</p>
                                        {message.attachmentUrl && <a href={message.attachmentUrl} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View Attachment</a>}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full p-2 rounded-lg bg-gray-900 text-white ml-2"
                                />
                                <Button variant="outline" onClick={handleSendMessage} className="bg-green-500 text-white py-2 px-4 rounded ml-2">
                                    <FaPaperPlane />
                                </Button>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <TicketList
                        serverId={serverId!}
                        onSelect={handleOnSelect}
                    />
                </>
            )}
            <Menu id={MENU_ID_CHAT} className="bg-gray-700 text-white rounded-lg shadow-lg contexify_theme-dark">
                <Item onClick={() => console.log("Edit Message")}>
                    <FaUser className="mr-2" /> Edit Message
                </Item>
                <Item onClick={() => console.log("Delete Message")}>
                    <FaTrash className="mr-2" /> Delete Message
                </Item>
            </Menu>
            <Menu id={MENU_ID_TICKET} className="bg-gray-700 text-white rounded-lg shadow-lg contexify_theme-dark">
                <Item onClick={() => handleControlMenuClick('close')}>
                    <FaTimes className="mr-2" /> Close Ticket
                </Item>
                <Item onClick={() => handleControlMenuClick('transcript')}>
                    <FaClipboard className="mr-2" /> Create Transcript
                </Item>
            </Menu>
        </div>
    );
};

export default SupportTicketsView;
