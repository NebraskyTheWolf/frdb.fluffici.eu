import type { NextApiRequest, NextApiResponse } from 'next';

import Redis from 'ioredis';
import { ENDPOINT } from '@/lib/constants';
const redis = new Redis(process.env.REDIS_URL!);

type ErrorResponse = {
    error: string;
};

interface Changelog {
    title: string;
    description: string;
    bannerURL: string;
    version: string;
    build: string;
    features: string[];
    bugs: string[];
    note: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Changelog | ErrorResponse>
) {
    try {
        const response = await fetch(`${ENDPOINT}/changelogs`, {
            headers: {
                "Authorization": `${process.env.API_TOKEN}`
            }
        });
        const data = await response.json();

        if (data.status) {
            if (await redis.exists('changelogs')) {
                var cachedData: any = await redis.get('changelogs');
                
                res.status(200).json(JSON.parse(cachedData));
            } else {
                await redis.set('changelogs', JSON.stringify(data))
                await redis.expire('changelogs', 3600)
    
                res.status(200).json(data);
            }
        } else {
            res.status(404).end()
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
