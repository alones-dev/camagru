import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs";

const registerUserSchema = z.object({
    username: z.string().min(3, "Username is too short, minimum 3 characters required"),
    password: z.string().min(6, "Password is too short, minimum 6 characters required"),
    email: z.string().email("Invalid email address"),
})

export default async function registerUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { username, password, email } = registerUserSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (user != null) {
            return res.status(400).json({ user: null, message: "User already exists" });
        }

        const emailMatch = await prisma.user.findUnique({
            where: { email }
        });
        if (emailMatch != null) {
            return res.status(400).json({ user: null, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { username, password: hashedPassword, email }
        });

        return res.status(201).json({ user: newUser, message: "User created successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation failed", errors: error.errors });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
