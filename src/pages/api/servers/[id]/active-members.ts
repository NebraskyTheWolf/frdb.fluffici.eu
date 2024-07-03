import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth].ts";

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse>
) {
    const serverId = req.query['id'];
    const session = await getServerSession(req, res, authOptions)

    try {
        const response = await axios.post(`https://furraidapi.fluffici.eu/servers/${serverId}/active-members`, {
            actorId: session?.user.id
        },{
            headers: {
                "Authorization": `${process.env.API_TOKEN}`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
