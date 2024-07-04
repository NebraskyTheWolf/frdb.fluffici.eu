import type { NextApiRequest, NextApiResponse } from 'next';
import {Plan} from "@/models/Plan.ts";

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
        const response = await fetch(`https://furraidapi.fluffici.eu/changelogs`, {
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
