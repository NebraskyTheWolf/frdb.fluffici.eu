import type { NextApiRequest, NextApiResponse } from 'next';
import getRawBody from 'raw-body';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth].ts";
import axios from "axios";
import { ENDPOINT } from '@/lib/constants';

type ErrorResponse = {
    error: string;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{} | ErrorResponse>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ error: 'Unauthorized' });

    try {
        const body = await getRawBody(req);
        const parsedBody = JSON.parse(body.toString('utf-8'));

        if (!parsedBody)
            return res.status(400).json({ error: 'Bad Request', data: parsedBody });

        const response = await axios.post(`${ENDPOINT}/servers/${id}/patch-ticket`, {
            actorId: session.user.id,
            data: parsedBody
        },{
            headers: {
                "Authorization": `${process.env.API_TOKEN}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error parsing body:", error);
        res.status(500).json({ error: 'Failed to parse body' });
    }
}
