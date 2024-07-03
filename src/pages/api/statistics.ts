import type { NextApiRequest, NextApiResponse } from 'next';

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse>
) {
    try {
        const response = await fetch(`https://furraidapi.fluffici.eu/statistics`, {
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
