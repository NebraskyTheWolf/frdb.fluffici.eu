type Timestamp = string;

export class Sanction {
    sanctionId: number;
    typeId: number;
    guildId: string;
    userId: string;
    reason: string;
    authorId: string;
    expirationTime: Timestamp;
    createdAt: Timestamp;
    updateDate: Timestamp;
    isDeleted: boolean;
    attachmentUrl: string;

    constructor(
        sanctionId: number,
        typeId: number,
        guildId: string,
        userId: string,
        reason: string,
        authorId: string,
        expirationTime: Timestamp,
        createdAt: Timestamp,
        updateDate: Timestamp,
        isDeleted: boolean,
        attachmentUrl: string
    ) {
        this.sanctionId = sanctionId;
        this.typeId = typeId;
        this.guildId = guildId;
        this.userId = userId;
        this.reason = reason;
        this.authorId = authorId;
        this.expirationTime = expirationTime;
        this.createdAt = createdAt;
        this.updateDate = updateDate;
        this.isDeleted = isDeleted;
        this.attachmentUrl = attachmentUrl;
    }
}
