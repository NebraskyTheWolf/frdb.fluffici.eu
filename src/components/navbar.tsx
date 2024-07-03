"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  FaBars,
  FaTimes,
  FaPlusSquare,
  FaClipboardList,
  FaHome,
  FaUserCircle,
  FaCog,
  FaCreditCard,
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
} from "@/components/dialog.tsx";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLUListElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

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
        const response = await axios.get(`/api/is-staff/${session?.user.id}`);
        setIsStaff(response.data.isStaff);
      } else {
        setIsStaff(false);
      }
    };
    fetchStaff();
  }, [session]);

  return (
      <nav className="bg-gray-900 text-white py-4 relative z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
          <h1 className="text-2xl font-bold hidden md:block">
            <Link href="/">FurRaidDB</Link>
          </h1>
          <button
              className="block md:hidden text-white focus:outline-none"
              onClick={toggleMenu}
          >
            {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
          </button>
          <ul
              className={`${
                  isOpen ? "block" : "hidden"
              } md:flex md:space-x-4 md:items-center w-full md:w-auto transition-all duration-300`}
          >
            <li>
              <Link href="/">
                <Button variant="ghost">
                  <FaHome />
                </Button>
              </Link>
            </li>
            <li>
              <Link href="https://frdbdocs.fluffici.eu/">
                <Button variant="ghost">
                  <FaClipboardList />
                </Button>
              </Link>
            </li>
            <li>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <FaPlusSquare />
                  </Button>
                </DialogTrigger>
                <DialogContent
                    style={{
                      background: "#020817",
                    }}
                >
                  <DialogHeader className="text-white">
                    <DialogTitle>Invitation</DialogTitle>
                    <DialogDescription className="text-base md:text-lg text-gray-300 py-4">
                      By inviting FurRaidDB, you agree to our Terms of Service and Privacy Policy.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <Link href="https://discord.com/oauth2/authorize?client_id=803015962223837184&permissions=1101659163654&integration_type=0&scope=bot">
                      <Button type="button" variant="outline">
                        Understand
                      </Button>
                    </Link>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li>
            {status === "authenticated" ? (
                <li className="relative">
                  <button
                      onClick={toggleDropdown}
                      className="flex items-center space-x-2 focus:outline-none"
                  >
                    {session?.user.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <FaUserCircle size={30} />
                    )}
                    <span>{session.user.name}</span>
                  </button>
                  {dropdownOpen && (
                      <ul
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700"
                      >
                        <li className="w-full border-b border-gray-700">
                          <Link href="/dashboard">
                            <a
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                onClick={closeDropdown}
                            >
                              <FaTachometerAlt className="mr-2" />
                              Dashboard
                            </a>
                          </Link>
                        </li>
                        <li className="w-full border-b border-gray-700" hidden={true}>
                          <Link href="/account/settings">
                            <a
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                onClick={closeDropdown}
                            >
                              <FaCog className="mr-2" />
                              Settings
                            </a>
                          </Link>
                        </li>
                        <li className="w-full border-b border-gray-700" hidden={true}>
                          <Link href="/account/billing">
                            <a
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                onClick={closeDropdown}
                            >
                              <FaCreditCard className="mr-2" />
                              Billing
                            </a>
                          </Link>
                        </li>
                        <li className="w-full border-b border-gray-700" hidden={!isStaff}>
                          <Link href="/blacklist">
                            <a
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                onClick={closeDropdown}
                            >
                              <FaLock className="mr-2" />
                              Global Blacklist
                            </a>
                          </Link>
                        </li>
                        <li className="w-full">
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
                </li>
            ) : (
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
        {isOpen && (
            <div
                className="fixed top-0 left-0 w-full h-full bg-gray-900 text-gray-500 flex justify-center items-center z-50 transition-opacity duration-300"
                onClick={closeMenu}
            >
              <button
                  className="absolute top-4 left-4 text-white focus:outline-none"
                  onClick={toggleMenu}
              >
                {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
              </button>
              <div className="flex flex-col justify-center items-center">
                <ul className="flex flex-col justify-center items-center space-y-6">
                  <li className="px-4 cursor-pointer capitalize text-4xl">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="px-4 cursor-pointer capitalize text-4xl">
                    <Link href="/features">Features</Link>
                  </li>
                  <li className="px-4 cursor-pointer capitalize text-4xl">
                    <Link href="/invite">Invite</Link>
                  </li>
                </ul>
              </div>
            </div>
        )}
      </nav>
  );
};

export default Navbar;
