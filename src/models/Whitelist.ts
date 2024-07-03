export class Whitelist {
    id: string;
    username: string;
    avatar: string;
    createdAt: Date;

    constructor(id: string, username: string, avatar: string, createdAt: Date) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.createdAt = createdAt;
    }
}
