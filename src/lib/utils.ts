import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {PERMISSIONS} from "@/lib/constants.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hasAdministratorPermission = (permissions: number): boolean => {
  return (permissions & PERMISSIONS.ADMINISTRATOR) === PERMISSIONS.ADMINISTRATOR;
};

// utils.ts
export const getServerIconUrl = (serverId: string, iconId: string | null): string => {
  if (iconId) {
    return `https://cdn.discordapp.com/icons/${serverId}/${iconId}.png`;
  }
  return 'https://cdn.discordapp.com/embed/avatars/0.png'; // Default icon if the server has no custom icon
};

export const getAvatarsIconUrl = (serverId: string, iconId: string | null): string => {
  if (iconId) {
    return `https://cdn.discordapp.com/icons/${serverId}/${iconId}.png`;
  }
  return 'https://cdn.discordapp.com/embed/avatars/0.png'; // Default icon if the server has no custom icon
};

export const getServerIconUrlValid = (icon?: string | null): string => {
  if (icon != null) {
    return icon;
  }
  return 'https://cdn.discordapp.com/embed/avatars/0.png'; // Default icon if the server has no custom icon
};

// @ts-ignore
export const getOwO  = (): string => process.env.AES_ENCRYPT_KEY ?? "owo"
