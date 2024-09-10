import type { NextApiRequest, NextApiResponse } from 'next';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth].ts";
import { ENDPOINT } from '@/lib/constants';

interface Data {
    status: boolean;
    message?: string;
    user?: { id: string };
    author?: { id: string };
    reason?: string;
    attachmentUrl?: string;
    createdAt?: string;
}

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | ErrorResponse>
) {
    const id = req.query['id']
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ error: 'Unauthorized' });

    try {
        const response = await fetch(`${ENDPOINT}/fetch-global-blacklist/${id}`, {
            headers: {
                "Authorization": `${process.env.API_TOKEN}`,
                "X-Actor-ID": session.user.id
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
