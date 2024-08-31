import type { NextApiRequest, NextApiResponse } from 'next';

type ErrorResponse = {
    error: string;
};

import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL!);

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

        if (await redis.exists('statistics')) {
            var cachedData: any = await redis.get('statistics');
            
            res.status(200).json(JSON.parse(cachedData));
        } else {
            await redis.set('statistics', JSON.stringify(data))
            await redis.expire('statistics', 3600)

            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
