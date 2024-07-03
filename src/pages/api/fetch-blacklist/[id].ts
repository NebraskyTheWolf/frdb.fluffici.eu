import type { NextApiRequest, NextApiResponse } from 'next';

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

    try {
        const response = await fetch(`https://furraidapi.fluffici.eu/fetch-global-blacklist/${id}`, {
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
