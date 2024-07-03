import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import {getSession, useSession} from "next-auth/react";

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse>
) {
    const { id, actorId} = req.query;

    try {
        const response = await axios.post(`https://furraidapi.fluffici.eu/servers/${id}/quota`, {
            actorId: actorId
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
