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

export interface TicketSettings {
    categoryId: string;
    closingCategoryId: string;
    initialTitle: string;
    initialMessage: string;
    ticketLoggingChannel: string;
    transcript: boolean;
    autoCloseOnUserLeave: boolean;
}

export interface VerificationSettings {
    verificationGate: string;
    verificationLoggingChannel: string;
    verifiedRole: string;
    unverifiedRole: string;
    description: string;
    questions: Question[];
}

export interface AntiRaidSettings {
    loggingChannel: string;
    sensitivity: string;
    joinThreshold: number;
    joinTimeThreshold: number;
}

export interface InviteTrackerSettings {
    trackingChannel: string;
}

export interface BlacklistSettings {
    loggingChannel: string;
}

export interface WelcomingSettings {
    welcomeChannel: string;
    goodbyeChannel: string;
    joinMessage: string;
    leftMessage: string;
}

export interface AutoModerationSettings {
    loggingChannel: string;
    modules: Module[];
}

export interface AntiScamSettings {
    loggingChannel: string;
    quarantinedRole: string;
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

export interface AntiScamFeature extends Feature {
    settings: AntiScamSettings;
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
    customSettings?: {
        threshold?: number;
        timeThreshold?: number;
    };
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
    antiScamFeature: AntiScamFeature;
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
