"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    FaPlusSquare,
    FaClipboardList,
    FaHome,
    FaUserCircle,
    FaTachometerAlt,
    FaSignOutAlt,
    FaLock,
} from "react-icons/fa";
import { Button } from "@/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/dialog";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
    { href: "/", icon: FaHome, label: "Home" },
    { href: "https://docs.sentralyx.com", icon: FaClipboardList, label: "Documentation" },
    {
        icon: FaPlusSquare,
        label: "Invite",
        dialog: true,
        dialogContent: {
            title: "Invitation",
            description:
                "By inviting Sentralyx, you agree to our Terms of Service and Privacy Policy.",
            link: "https://discord.com/oauth2/authorize?client_id=1281924846690762794&permissions=1101659220054&response_type=code&redirect_uri=https%3A%2F%2Fsentralyx.com&integration_type=0&scope=bot",
        },
    }
];

const Navbar = () => {
    const [isStaff, setIsStaff] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data: session, status } = useSession();
    const dropdownRef = useRef<HTMLUListElement>(null);
    const router = useRouter();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    useEffect(() => {
        const fetchStaff = async () => {
            if (session) {
                const response = await axios.get(`/api/is-staff`);
                setIsStaff(response.data.isStaff);
            } else {
                setIsStaff(false);
            }
        };
        fetchStaff();
    }, [session]);

    const handleLinkClick = (href: string) => {
        closeDropdown();
        router.push(href);
    };

    return (
        <nav className="bg-gray-900 text-white py-4 relative z-10 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
                <h1 className="text-2xl font-bold">
                    <Link href="/">Sentralyx</Link>
                </h1>
                <ul className="hidden md:flex space-x-4 items-center">
                    {NAV_ITEMS.map((item, index) =>
                        item.dialog ? (
                            <li key={index}>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost">
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <item.icon />
                                            </motion.div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent style={{ background: "#020817" }}>
                                        <DialogHeader className="text-white">
                                            <DialogTitle>{item.dialogContent?.title}</DialogTitle>
                                            <DialogDescription className="text-base md:text-lg text-gray-300 py-4">
                                                {item.dialogContent?.description}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="sm:justify-start">
                                            <Link href={item.dialogContent?.link ?? "#"}>
                                                <Button type="button" variant="outline">
                                                    Understand
                                                </Button>
                                            </Link>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </li>
                        ) : (
                            <li key={index}>
                                <Link href={item.href ?? "#"}>
                                    <Button variant="ghost">
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <item.icon />
                                        </motion.div>
                                    </Button>
                                </Link>
                            </li>
                        )
                    )}
                    {status === "authenticated" && (
                        <>
                            <li>
                                <Link href="/dashboard">
                                    <Button variant="premium">
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            Dashboard
                                        </motion.div>
                                    </Button>
                                </Link>
                            </li>
                            {isStaff && (
                                <li>
                                    <Link href="/blacklist">
                                        <Button variant="outline">
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                Global blacklist
                                            </motion.div>
                                        </Button>
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Button
                                    onClick={() => signOut({
                                        callbackUrl: window.location.href,
                                        redirect: false,
                                    })}
                                    variant="destructive"
                                >
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        Log out
                                    </motion.div>
                                </Button>
                            </li>
                        </>
                    )}
                    {status !== "authenticated" && (
                        <li>
                            <Button
                                variant="login"
                                onClick={() =>
                                    signIn("discord", {
                                        callbackUrl: window.location.href,
                                        redirect: false,
                                    })
                                }
                            >
                                Login
                            </Button>
                        </li>
                    )}
                </ul>
            </div>
            <div
                className="md:hidden flex justify-around items-center bg-gray-900 text-white fixed bottom-0 w-full py-4 border-t border-gray-700">
                {NAV_ITEMS.map((item, index) =>
                    item.dialog ? (
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <item.icon size={24} />
                                </motion.div>
                            </DialogTrigger>
                            <DialogContent style={{ background: "#020817" }}>
                                <DialogHeader className="text-white">
                                    <DialogTitle>{item.dialogContent?.title}</DialogTitle>
                                    <DialogDescription className="text-base md:text-lg text-gray-300 py-4">
                                        {item.dialogContent?.description}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start">
                                    <Link href={item.dialogContent?.link ?? "#"}>
                                        <Button type="button" variant="outline">
                                            Understand
                                        </Button>
                                    </Link>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Link href={item.href ?? "#"} key={index}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <item.icon size={24} />
                            </motion.div>
                        </Link>
                    )
                )}
                {status === "authenticated" && (
                    <button onClick={toggleDropdown} className="relative">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            {session?.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <FaUserCircle size={24} />
                            )}
                        </motion.div>
                        {dropdownOpen && (
                            <ul
                                ref={dropdownRef}
                                className="absolute bottom-14 right-0 mb-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50"
                            >
                                <li className="w-full border-b border-gray-700">
                                    <Link href="/dashboard">
                                        <a
                                            className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                            onClick={() => handleLinkClick("/dashboard")}
                                        >
                                            <FaTachometerAlt className="mr-2" />
                                            Dashboard
                                        </a>
                                    </Link>
                                </li>
                                {isStaff && (
                                    <li className="w-full border-b border-gray-700">
                                        <Link href="/blacklist">
                                            <a
                                                className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                                onClick={() => handleLinkClick("/blacklist")}
                                            >
                                                <FaLock className="mr-2" />
                                                Global Blacklist
                                            </a>
                                        </Link>
                                    </li>
                                )}
                                <li className="w-full border-b border-gray-700">
                                    <button
                                        onClick={() => {
                                            signOut({
                                                callbackUrl: window.location.href,
                                                redirect: false,
                                            });
                                            closeDropdown();
                                        }}
                                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700"
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        )}
                    </button>
                )}
                {status !== "authenticated" && (
                    <Button
                        variant="login"
                        onClick={() =>
                            signIn("discord", {
                                callbackUrl: window.location.href,
                                redirect: false,
                            })
                        }
                    >
                        Login
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
