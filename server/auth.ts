import { db } from './db';
import { users, sessions } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 12;
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate session token
export function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}

// Create session
export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  return sessionId;
}

// Get user by session
export async function getUserBySession(sessionId: string) {
  const result = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(
      eq(sessions.id, sessionId),
      eq(users.isActive, true)
    ))
    .limit(1);

  if (result.length === 0) return null;

  const { user, session } = result[0];

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return user;
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// Middleware for authentication
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = await getUserBySession(sessionId);
  if (!user) {
    res.clearCookie('sessionId');
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  req.user = user;
  next();
}

// Middleware for admin-only routes
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
        fullName: string;
        email: string | null;
        isActive: boolean;
      };
    }
  }
}