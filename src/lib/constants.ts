import {GuildSettings} from "@/models/GuildSettings.ts";

export const PERMISSIONS = {
    CREATE_INSTANT_INVITE: 1 << 0,
    KICK_MEMBERS: 1 << 1,
    BAN_MEMBERS: 1 << 2,
    ADMINISTRATOR: 1 << 3,
    MANAGE_CHANNELS: 1 << 4,
    MANAGE_GUILD: 1 << 5,
    ADD_REACTIONS: 1 << 6,
    VIEW_AUDIT_LOG: 1 << 7,
    PRIORITY_SPEAKER: 1 << 8,
    STREAM: 1 << 9,
    VIEW_CHANNEL: 1 << 10,
    SEND_MESSAGES: 1 << 11,
    SEND_TTS_MESSAGES: 1 << 12,
    MANAGE_MESSAGES: 1 << 13,
    EMBED_LINKS: 1 << 14,
    ATTACH_FILES: 1 << 15,
    READ_MESSAGE_HISTORY: 1 << 16,
    MENTION_EVERYONE: 1 << 17,
    USE_EXTERNAL_EMOJIS: 1 << 18,
    VIEW_GUILD_INSIGHTS: 1 << 19,
    CONNECT: 1 << 20,
    SPEAK: 1 << 21,
    MUTE_MEMBERS: 1 << 22,
    DEAFEN_MEMBERS: 1 << 23,
    MOVE_MEMBERS: 1 << 24,
    USE_VAD: 1 << 25,
    CHANGE_NICKNAME: 1 << 26,
    MANAGE_NICKNAMES: 1 << 27,
    MANAGE_ROLES: 1 << 28,
    MANAGE_WEBHOOKS: 1 << 29
};


export const defaultSettings = (id: string): GuildSettings => {
    return {
        guildId: id,
        loggingChannel: "",
        config: {
            settings: {
                disabledCommands: [],
                exemptedChannels: [],
                exemptedRoles: [],
                isUsingGlobalBlacklist: true,
                isUsingJoinLeaveInformation: true,
                isUsingLocalBlacklist: true,
                language: 'en',
                patchNotesAnnouncement: {
                    channel: "",
                    enabled: ""
                },
                staffRoles: [],
                whitelistOverride: true
            },
            features: {
                welcoming: {
                    enabled: false,
                    settings: {
                        welcomeChannel: "",
                        goodbyeChannel: ""
                    }
                },
                autoModeration: {
                    enabled: false,
                    settings: {
                        modules: [],
                        loggingChannel: ""
                    }
                },
                antiRaid: {
                    enabled: false,
                    settings: {
                        joinThreshold: 0,
                        joinTimeThreshold: 0,
                        sensitivity: "LOW",
                        loggingChannel: ""
                    }
                },
                inviteTracker: {
                    enabled: false,
                    settings: {
                        trackingChannel: ""
                    }
                },
                verification: {
                    enabled: false,
                    settings: {
                        description: "",
                        verifiedRole: "",
                        verificationLoggingChannel: "",
                        verificationGate: "",
                        unverifiedRole: "",
                        questions: []
                    }
                },
                antiScamFeature: {
                    enabled: false,
                    settings: {
                        loggingChannel: "",
                        quarantinedRole: ""
                    }
                },
                globalBlacklist: {
                    enabled: false,
                    settings: {
                        loggingChannel: ""
                    }
                },
                localBlacklist: {
                    enabled: false,
                    settings: {
                        loggingChannel: ""
                    }
                },
                ticket: {
                    enabled: false,
                    settings: {
                        autoCloseOnUserLeave: true,
                        categoryId: "",
                        closingCategoryId: "",
                        initialMessage: "",
                        initialTitle: "",
                        ticketLoggingChannel: "",
                        transcript: true
                    }
                }
            }
        }
    }
}
