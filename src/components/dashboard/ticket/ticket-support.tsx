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

interface Ticket {
    id: string;
    title: string;
    status: string;
    createdAt: string;
}

interface Message {
    id: string;
    sender: {
        id: string;
        username: string;
        avatarUrl: string;
    };
    content: string;
    createdAt: string;
    attachmentUrl?: string;
}

interface SupportTicketsProps {
    actorId?: string;
    serverId?: string;
}

const MENU_ID_USER = "user-context-menu";
const MENU_ID_CHAT = "chat-context-menu";
const MENU_ID_TICKET = "ticket-context-menu";

const sampleTickets: Ticket[] = [
    { id: '1', title: 'Login Issues', status: 'Open', createdAt: '2023-01-01' },
    { id: '2', title: 'Payment Failure', status: 'Closed', createdAt: '2023-01-02' },
    { id: '3', title: 'Bug Report', status: 'Pending', createdAt: '2023-01-03' },
];

const sampleMessages: Message[] = [
    {
        id: '1',
        sender: {
            id: 'user1',
            username: 'JohnDoe',
            avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        content: 'I am unable to login to my account.',
        createdAt: '2023-01-01 10:00',
    },
    {
        id: '2',
        sender: {
            id: 'support1',
            username: 'SupportAgent',
            avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        content: 'Can you please provide more details?',
        createdAt: '2023-01-01 10:05',
    },
];

const SupportTicketsView: React.FC<SupportTicketsProps> = ({ serverId }) => {
    const [tickets, setTickets] = useState<Ticket[]>(sampleTickets);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>(sampleMessages);
    const [newMessage, setNewMessage] = useState<string>("");
    const { data: session } = useSession();
    const [loading, setLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<File[]>([]);
    const [showTranscript, setShowTranscript] = useState<boolean>(false);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => setFiles([...files, ...acceptedFiles])
    });

    const { show: showUserContextMenu } = useContextMenu({ id: MENU_ID_USER });
    const { show: showChatContextMenu } = useContextMenu({ id: MENU_ID_CHAT });
    const { show: showTicketContextMenu } = useContextMenu({ id: MENU_ID_TICKET });

    useEffect(() => {
        const pusher = new Pusher('42f3a4cad068043e1452', {
            cluster: 'eu'
        });

        if (selectedTicket) {
            const channel = pusher.subscribe(`ticket-${selectedTicket.id}`);
            channel.bind('new-message', (data: Message) => {
                setMessages((prevMessages) => [...prevMessages, data]);
            });

            channel.bind('ticket-closed', () => {
                setShowTranscript(true);
                const audio = new Audio('/path/to/your/sound/file.mp3');
                audio.play();
            });

            return () => {
                pusher.unsubscribe(`ticket-${selectedTicket.id}`);
            };
        }
    }, [selectedTicket]);

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowTranscript(false);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() && files.length === 0) return;

        const newMsg: Message = {
            id: (messages.length + 1).toString(),
            sender: {
                id: session?.user.id as string,
                username: session?.user.name as string,
                avatarUrl: session?.user.image as string,
            },
            content: newMessage,
            createdAt: new Date().toISOString(),
            attachmentUrl: files.length > 0 ? URL.createObjectURL(files[0]) : undefined,
        };

        // Send message to server to broadcast via Pusher
        await axios.post(`/api/servers/${serverId}/tickets/${selectedTicket?.id}/messages`, newMsg);

        setNewMessage("");
        setFiles([]);
    };

    const handleUserContextMenu = (event: React.MouseEvent, message: Message) => {
        event.preventDefault();
        showUserContextMenu({ event, props: { message } });
    };

    const handleChatContextMenu = (event: React.MouseEvent, message: Message) => {
        event.preventDefault();
        showChatContextMenu({ event, props: { message } });
    };

    const handleTicketContextMenu = (event: React.MouseEvent, ticket: Ticket) => {
        event.preventDefault();
        showTicketContextMenu({ event, props: { ticket } });
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
                                <h2 className="text-2xl font-bold text-white">{selectedTicket.title}</h2>
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
                                <div key={message.id} className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <img src={message.sender.avatarUrl} alt={`${message.sender.username}'s avatar`} className="w-8 h-8 rounded-full mr-2" />
                                        <span className="text-white font-semibold">{message.sender.username}</span>
                                        <span className="text-sm text-gray-400 ml-2">{message.createdAt}</span>
                                    </div>
                                    <p className="text-gray-300">{message.content}</p>
                                    {message.attachmentUrl && <a href={message.attachmentUrl} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View Attachment</a>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 h-64 overflow-y-scroll">
                                {messages.map((message) => (
                                    <div key={message.id} className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <img src={message.sender.avatarUrl} alt={`${message.sender.username}'s avatar`} className="w-8 h-8 rounded-full mr-2" />
                                            <span className="text-white font-semibold" onContextMenu={(e) => handleUserContextMenu(e, message)}>{message.sender.username}</span>
                                            <span className="text-sm text-gray-400 ml-2">{message.createdAt}</span>
                                            <FaEllipsisV className="ml-auto cursor-pointer text-white" onContextMenu={(e) => handleChatContextMenu(e, message)} />
                                        </div>
                                        <p className="text-gray-300">{message.content}</p>
                                        {message.attachmentUrl && <a href={message.attachmentUrl} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View Attachment</a>}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center">
                                <div {...getRootProps()} className="flex items-center p-2 bg-gray-900 rounded-lg cursor-pointer">
                                    <input {...getInputProps()} />
                                    <FaUpload className="text-white mr-2" />
                                    <span className="text-white">Upload</span>
                                </div>
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
                    <h2 className="text-3xl font-bold mb-6 text-white">Support Tickets</h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                        </div>
                    ) : tickets.length === 0 ? (
                        <p className="text-gray-400">No tickets found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer flex flex-col justify-between" onClick={() => handleTicketClick(ticket)} onContextMenu={(e) => handleTicketContextMenu(e, ticket)}>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{ticket.title}</h3>
                                        <p className="text-sm text-gray-400 mb-1">Status: <span className={`font-bold ${ticket.status === 'Open' ? 'text-green-400' : ticket.status === 'Pending' ? 'text-yellow-400' : 'text-red-400'}`}>{ticket.status}</span></p>
                                        <p className="text-sm text-gray-400">Created At: {ticket.createdAt}</p>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <FaEllipsisV className="cursor-pointer text-white" onContextMenu={(e) => handleTicketContextMenu(e, ticket)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            <Menu id={MENU_ID_USER} className="bg-gray-700 text-white rounded-lg shadow-lg contexify_theme-dark">
                <Item onClick={() => console.log("View Profile")}>
                    <FaUser className="mr-2" /> View Profile
                </Item>
                <Item onClick={() => console.log("Mute User")}>
                    <FaUser className="mr-2" /> Mute User
                </Item>
            </Menu>
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
                <Item onClick={() => console.log("Other Action")}>
                    <FaPlus className="mr-2" /> Other Action
                </Item>
            </Menu>
        </div>
    );
};

export default SupportTicketsView;
