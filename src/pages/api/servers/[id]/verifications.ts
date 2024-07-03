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
    const { id} = req.query;
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ error: 'Unauthorized' });

    try {
        const response = await axios.post(`https://furraidapi.fluffici.eu/servers/${id}/verifications`,{
            actorId: session.user.id
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
