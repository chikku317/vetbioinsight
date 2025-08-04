import { db } from './db';
import { users, vetReports, User, InsertUser, VetReport, InsertVetReport } from "@shared/schema";
import { eq } from 'drizzle-orm';
import { hashPassword } from './auth';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Report operations
  getReport(id: string): Promise<VetReport | undefined>;
  createReport(report: InsertVetReport, userId: number): Promise<VetReport>;
  updateReport(id: string, report: Partial<InsertVetReport>): Promise<VetReport | undefined>;
  deleteReport(id: string): Promise<boolean>;
  getAllReports(): Promise<VetReport[]>;
  
  // Legacy method names (for backward compatibility)
  getVetReport(id: string): Promise<VetReport | undefined>;
  createVetReport(report: InsertVetReport): Promise<VetReport>;
  updateVetReport(id: string, report: Partial<InsertVetReport>): Promise<VetReport | undefined>;
  listVetReports(): Promise<VetReport[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await hashPassword(user.password);
    
    const [newUser] = await db
      .insert(users)
      .values({
        ...user,
        password: hashedPassword,
      })
      .returning();
    
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Report operations
  async getReport(id: string): Promise<VetReport | undefined> {
    const [report] = await db.select().from(vetReports).where(eq(vetReports.id, id));
    return report || undefined;
  }

  async createReport(report: InsertVetReport, userId: number): Promise<VetReport> {
    const [newReport] = await db
      .insert(vetReports)
      .values({
        ...report,
        createdBy: userId,
      })
      .returning();
    
    return newReport;
  }

  async updateReport(id: string, updates: Partial<InsertVetReport>): Promise<VetReport | undefined> {
    const [updatedReport] = await db
      .update(vetReports)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(vetReports.id, id))
      .returning();
    
    return updatedReport || undefined;
  }

  async deleteReport(id: string): Promise<boolean> {
    const result = await db.delete(vetReports).where(eq(vetReports.id, id));
    return result.rowCount > 0;
  }

  async getAllReports(): Promise<VetReport[]> {
    return db.select().from(vetReports);
  }

  // Legacy method names (for backward compatibility)
  async getVetReport(id: string): Promise<VetReport | undefined> {
    return this.getReport(id);
  }

  async createVetReport(report: InsertVetReport): Promise<VetReport> {
    // For backward compatibility, use a default user ID (we'll handle this better in routes)
    return this.createReport(report, 1);
  }

  async updateVetReport(id: string, report: Partial<InsertVetReport>): Promise<VetReport | undefined> {
    return this.updateReport(id, report);
  }

  async listVetReports(): Promise<VetReport[]> {
    return this.getAllReports();
  }
}

export const storage = new DatabaseStorage();
