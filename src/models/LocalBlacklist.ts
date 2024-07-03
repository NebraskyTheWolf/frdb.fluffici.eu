export class LocalBlacklist {
    id: string;
    username: string;
    reason: string;
    avatar: string;
    createdAt: Date;
    issuedBy: string;

    constructor(id: string, username: string, reason: string, avatar: string, createdAt: Date, issuedBy: string) {
        this.id = id;
        this.username = username;
        this.reason = reason;
        this.avatar = avatar;
        this.createdAt = createdAt;
        this.issuedBy = issuedBy;
    }
}
