import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs";

const updatePasswordSchema = z.object({
    id: z.string(),
    oldPassword: z.string().min(6, "Password is too short, minimum 6 characters required"),
    newPassword: z.string().min(6, "Password is too short, minimum 6 characters required"),
    confirmPassword: z.string().min(6, "Password is too short, minimum 6 characters required"),
})

export default async function updatePassword(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const {id, oldPassword, newPassword, confirmPassword} = updatePasswordSchema.parse(req.body);
        if (!id) {
            return res.status(400).json({message: "User ID not found"});
        }
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({message: "All fields are required"});
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({message: "New passwords do not match"});
        }

        const user = await prisma.user.findUnique({
            where: {id}
        });
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Last password incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await prisma.user.update({
            where: {id},
            data: {password: hashedPassword}
        });

        return res.status(200).json({ user: updatedUser, message: "Password updated successfully" });
    }
    catch(error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        
        return res.status(500).json({ message: "Internal server error" });
    }
}