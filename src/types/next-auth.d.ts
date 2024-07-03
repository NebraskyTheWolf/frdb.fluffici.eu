import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
        };
        accessToken: string;
        guilds: Array<{
            id: string;
            name: string;
            icon: string;
            permissions: number;
        }>;
    }

    interface JWT {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
        };
        guilds: Array<{
            id: string;
            name: string;
            icon: string;
            permissions: number;
        }>;
    }
}
