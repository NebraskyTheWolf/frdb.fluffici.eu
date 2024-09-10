import type { NextApiRequest, NextApiResponse } from 'next';
import {Plan} from "@/models/Plan.ts";
import { ENDPOINT } from '@/lib/constants';

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Plan[] | ErrorResponse>
) {
    try {
        const response = await fetch(`${ENDPOINT}/offers`, {
            headers: {
                "Authorization": `${process.env.API_TOKEN}`
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
