export class Role {
    id: string;
    name: string;
    color: number;
    position: number;

    constructor(id: string, name: string, color: number, position: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.position = position;
    }
}
