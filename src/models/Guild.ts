export class Guild {
    id: string;
    name: string;
    icon: string;
    permissions: number;
    memberCount: number;

    constructor(
        id: string,
        name: string,
        icon: string,
        permissions: number,
        memberCount: number,
    ) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.permissions = permissions;
        this.memberCount = memberCount;
    }
}
