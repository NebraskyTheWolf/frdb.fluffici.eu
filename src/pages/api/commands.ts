import type { NextApiRequest, NextApiResponse } from 'next';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth].ts";

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse>
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ error: 'Unauthorized' });

    try {
        const response = await fetch(`https://furraidapi.fluffici.eu/commands`, {
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
