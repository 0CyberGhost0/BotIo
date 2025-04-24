import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "../../../packages/db";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("AUTH MIDDLEWARE");
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("NO TOKEN");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
      algorithms: ["RS256"],
    }) as any;
    console.log("DECODED");
    const userId = decoded.sub;
    const email = decoded.email;
    const name = decoded.name || "Unnamed";

    if (!userId) {
        console.log("NO SUB IN TOKEN");
      return res.status(401).json({ message: "Unauthorized: No sub in token" });
    }

    // Check if user exists in DB
    let user = await prismaClient.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create user in DB
      user = await prismaClient.user.create({
        data: {
          clerkId: userId,
          email: email || "no-email@unknown.com",
          name,
          password: "", // Empty string since you're using Clerk
        },
      });
      console.log("CREATED USER");
    }

    req.userId = user.id;
    console.log("USER ID", req.userId);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}