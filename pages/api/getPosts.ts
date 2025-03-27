import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next";

export default async function getPosts(req: NextApiRequest, res: NextApiResponse) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                likes: true,
                comments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        res.status(200).json(posts)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred while fetching posts' })
    }
}