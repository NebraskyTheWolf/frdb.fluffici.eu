export class AuditLogEntry {
    id: string;
    action: string;
    user: {
        id: string;
        username: string;
        avatarUrl: string;
    };
    target: {
        id: string;
        username?: string;
        avatarUrl?: string;
    };
    reason: string;
    createdAt: string;

    constructor(
        id: string,
        action: string,
        user: { id: string; username: string; avatarUrl: string },
        target: { id: string; username?: string; avatarUrl?: string },
        reason: string,
        createdAt: string
    ) {
        this.id = id;
        this.action = action;
        this.user = user;
        this.target = target;
        this.reason = reason;
        this.createdAt = createdAt;
    }
}
