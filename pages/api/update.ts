import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs";

const updateUserSchema = z.object({
    username: z.string().min(3, "Username is too short, minimum 3 characters required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password is too short, minimum 6 characters required"),
})

export default async function updateUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const {id} = req.body;
        const {username, email, password} = updateUserSchema.parse(req.body);
        if (!id) {
            return res.status(400).json({message: "User ID not found"});
        }
        if (!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await prisma.user.findUnique({
            where: {id}
        });
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const updatedData: {username?: string, email?: string} = {};
        if (username !== user.username) {
            updatedData.username = username;
        }
        if (email !== user.email) {
            updatedData.email = email;
        }

        const updateUser = await prisma.user.update({
            where: {id},
            data: updatedData
        });

        return res.status(200).json({ user: updateUser, message: "User infos updated successfully" });
    }
    catch(error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        
        return res.status(500).json({ message: "Internal server error" });
    }
}