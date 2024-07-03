import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";

type Data = {
    id: string;
    icon: string;
    name: string;
    memberCount: number;
}[];

type ErrorResponse = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | ErrorResponse>
) {
    try {
        const response = await axios.get('https://furraidapi.fluffici.eu/get-servers', {
            headers: {
                "Authorization": `${process.env.API_TOKEN}`
            }
        });
        res.status(200).json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
