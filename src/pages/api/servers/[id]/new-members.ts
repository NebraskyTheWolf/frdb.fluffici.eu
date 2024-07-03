import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import {ChartData} from "@/models/ChartData.ts";
import {getSession, useSession} from "next-auth/react";

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ChartData | ErrorResponse>
) {
    const serverId = req.query['id'];
    const session = await getSession({ req })

    try {
        const response = await axios.post(`https://furraidapi.fluffici.eu/servers/${serverId}/new-members`,{
            actorId: session?.user.id
        }, {
            headers: {
                "Authorization": `${process.env.API_TOKEN}`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
