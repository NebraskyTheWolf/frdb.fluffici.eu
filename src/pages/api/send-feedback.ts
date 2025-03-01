import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth].ts";

type ErrorResponse = {
    status: boolean;
    error?: string;
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse>
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ status: false, error: 'Unauthorized' });

    try {
        const response = await axios.post(`https://discord.com/api/webhooks/1291920888488263773/${process.env.FEEDBACK_TOKEN}`, {
            username: session.user.name,
            avatar_url: session.user.image,
            content: req.body.message
        });

        if (response.status === 200) {
            res.status(200).json({ status: true, message: 'Feedback sent successfully' });
        } else {
            res.status(500).json({ status: false, error: 'Failed to send feedback' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Failed to send feedback' });
    }
}
