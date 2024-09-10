import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import {DataModel} from "@/models/Paginate.ts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth].ts";
import { ENDPOINT } from '@/lib/constants';

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DataModel | ErrorResponse>
) {
    const serverId = req.query['id'];
    const { page, limit } = req.query
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ error: 'Unauthorized' });

    try {
        const response = await axios.post(`${ENDPOINT}/servers/${serverId}/members?page=${page}&limit=${limit}`, {
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
