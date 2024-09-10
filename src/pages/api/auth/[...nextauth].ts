import NextAuth, {NextAuthOptions} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'identify email guilds'
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.user = user;
            }

            return token;
        },

        async session({ session, token }: { session: any, token: any }) {
            session.user = token.user;
            session.accessToken = token.accessToken;
            session.guilds = token.guilds;
            return session;
        },
    },
}

export default NextAuth(authOptions);
