import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {PERMISSIONS} from "@/lib/constants.ts";
import {StylesConfig} from "react-select";
import {randomUUID} from "node:crypto";

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

export const customSelectStyles: StylesConfig<any, false> = {
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
