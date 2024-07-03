export interface Feature {
    enabled: boolean;
}

export interface Settings {
    staffRoles: string[];
    exemptedChannels: string[];
    exemptedRoles: string[];
    disabledCommands: string[];
    whitelistOverride: boolean;
    isUsingGlobalBlacklist: boolean;
    isUsingLocalBlacklist: boolean;
    isUsingJoinLeaveInformation: boolean;
    patchNotesAnnouncement: PatchNotesAnnouncement;
    language: string;
}

export interface PatchNotesAnnouncement {
    enabled: string;
    channel: string;
}

export interface TicketSettings extends Settings {
    categoryId: string;
    ticketLoggingChannel: string;
    transcript: boolean;
}

export interface VerificationSettings extends Settings {
    verificationGate: string;
    verificationLoggingChannel: string;
    verifiedRole: string;
    unverifiedRole: string;
    description: string;
    questions: Question[];
}

export interface AntiRaidSettings extends Settings {
    loggingChannel: string;
    sensitivity: string;
    joinThreshold: number;
    joinTimeThreshold: number;
}

export interface InviteTrackerSettings extends Settings {
    trackingChannel: string;
}

export interface BlacklistSettings extends Settings {
    loggingChannel: string;
}

export interface WelcomingSettings extends Settings {
    welcomeChannel: string;
    goodbyeChannel: string;
}

export interface AutoModerationSettings extends Settings {
    loggingChannel: string;
    modules: Module[];
}

export interface TicketFeature extends Feature {
    settings: TicketSettings;
}

export interface VerificationFeature extends Feature {
    settings: VerificationSettings;
}

export interface AntiRaidFeature extends Feature {
    settings: AntiRaidSettings;
}

export interface InviteTrackerFeature extends Feature {
    settings: InviteTrackerSettings;
}

export interface BlacklistFeature extends Feature {
    settings: BlacklistSettings;
}

export interface WelcomingFeature extends Feature {
    settings: WelcomingSettings;
}

export interface AutoModerationFeature extends Feature {
    settings: AutoModerationSettings;
}

export interface Question {
    title: string;
    placeholder: string;
    min: number;
    max: number;
}

export interface Module {
    enabled: boolean;
    slug: string;
    sensitivity: string;
}

export interface Features {
    ticket: TicketFeature;
    verification: VerificationFeature;
    antiRaid: AntiRaidFeature;
    inviteTracker: InviteTrackerFeature;
    globalBlacklist: BlacklistFeature;
    localBlacklist: BlacklistFeature;
    welcoming: WelcomingFeature;
    autoModeration: AutoModerationFeature;
}

export interface FurRaidConfig {
    settings: Settings;
    features: Features;
}

export interface GuildSettings {
    guildId: string;
    config: FurRaidConfig;
    loggingChannel: string;
}
