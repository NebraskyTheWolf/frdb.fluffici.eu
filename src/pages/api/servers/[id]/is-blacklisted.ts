import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth].ts";
import { ENDPOINT } from '@/lib/constants';

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse>
) {
    const { id } = req.query;

    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ error: 'Unauthorized' });

    try {
        const response = await axios.post(`${ENDPOINT}/servers/${id}/is-blacklisted`,{
            actorId: session.user.id,
            data: req.body
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
