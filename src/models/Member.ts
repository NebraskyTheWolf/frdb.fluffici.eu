import {Role} from "@/models/Role.ts";

export class Member {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    joinedAt: Date;
    roles: Role[];
    isSpam: boolean;

    constructor(id: string, username: string, discriminator: string, avatar: string, joinedAt: Date, roles: Role[], isSpam: boolean) {
        this.id = id;
        this.username = username;
        this.discriminator = discriminator;
        this.avatar = avatar;
        this.joinedAt = joinedAt;
        this.roles = roles;
        this.isSpam = isSpam;
    }
}
