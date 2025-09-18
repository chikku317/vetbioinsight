import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVetReportSchema, insertUserSchema, loginSchema, User, LoginCredentials, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema } from "@shared/schema";
import { requireAuth, requireAdmin, createSession, deleteSession, verifyPassword, hashPassword } from "./memory-auth";
import cookieParser from "cookie-parser";
import { z } from "zod";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add cookie parser middleware
  app.use(cookieParser());

  // Debug endpoint to check available users (development only)
  if (process.env.NODE_ENV !== 'production') {
    app.get("/api/debug/users", async (req, res) => {
      try {
        const users = await storage.getAllUsers();
        res.json({
          totalUsers: users.length,
          usernames: users.map(u => u.username),
          environment: process.env.NODE_ENV || 'unknown'
        });
      } catch (error) {
        res.status(500).json({ error: "Debug failed", details: (error as Error).message });
      }
    });
  }

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      console.log("Login attempt for username:", credentials.username);
      
      const user = await storage.getUserByUsername(credentials.username);
      if (!user || !user.isActive) {
        console.log("User not found or inactive:", credentials.username);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValidPassword = await verifyPassword(credentials.password, user.password);
      if (!isValidPassword) {
        console.log("Invalid password for username:", credentials.username);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const sessionId = await createSession(user.id);
      console.log("Session created for user:", credentials.username);
      
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        path: '/',
      });
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          fullName: user.fullName,
          email: user.email,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      await deleteSession(sessionId);
      res.clearCookie('sessionId');
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    res.json({
      user: {
        id: req.user!.id,
        username: req.user!.username,
        role: req.user!.role,
        fullName: req.user!.fullName,
        email: req.user!.email,
      }
    });
  });

  // User management routes (admin only)
  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })));
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = insertUserSchema.partial().parse(req.body);
      
      const user = await storage.updateUser(userId, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Report routes (protected)
  app.get("/api/vet-reports", requireAuth, async (req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.get("/api/vet-reports/:id", requireAuth, async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.post("/api/vet-reports", requireAuth, async (req, res) => {
    try {
      const reportData = insertVetReportSchema.parse(req.body);
      const report = await storage.createReport(reportData, req.user!.id);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(400).json({ error: "Failed to create report" });
    }
  });

  app.delete("/api/vet-reports/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteReport(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json({ message: "Report deleted successfully" });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ error: "Failed to delete report" });
    }
  });

  // Password reset routes
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
      }

      // Clean up expired tokens first
      await storage.cleanupExpiredTokens();
      
      // Generate reset token
      const resetToken = nanoid(32);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      
      await storage.createPasswordResetToken(user.id, resetToken, expiresAt);
      
      const response: any = { 
        message: "If an account with that email exists, a password reset link has been sent."
      };
      
      // Only include reset token in development (for testing without email)
      if (process.env.NODE_ENV !== 'production') {
        response.resetToken = resetToken;
      }
      
      res.json(response);
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(400).json({ error: "Failed to process request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
      
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }
      
      // Update user password (storage will handle hashing)
      await storage.updateUser(resetToken.userId, { password: newPassword });
      
      // Mark token as used
      await storage.markTokenAsUsed(token);
      
      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(400).json({ error: "Failed to reset password" });
    }
  });

  // Admin profile management routes
  app.put("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const { username, fullName, email, currentPassword, newPassword } = updateProfileSchema.parse(req.body);
      const userId = req.user!.id;
      
      // Verify current password
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const isValidPassword = await verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      // Check if username is already taken by another user
      if (username !== user.username) {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Username is already taken" });
        }
      }
      
      // Prepare updates
      const updates: any = {
        username,
        fullName,
        email: email || null,
      };
      
      // Update password if provided and not empty
      if (newPassword && newPassword.trim()) {
        updates.password = newPassword; // hashPassword will be called in storage
      }
      
      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "Failed to update user" });
      }
      
      res.json({
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
        }
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(400).json({ error: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
