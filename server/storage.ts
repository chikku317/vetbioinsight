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

// Memory storage implementation as fallback
class MemStorage implements IStorage {
  private users: User[] = [
    {
      id: 1,
      username: "admin",
      password: "$2b$12$u8AWYY2JMGFI221oFBjAA.OWBRFWH6Ei7WukFyDtVn4KIPgtuz7ke", // Chikku@1989
      role: "admin",
      fullName: "Administrator",
      email: "admin@vetnest.com",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      username: "vet1",
      password: "$2b$12$PzebgRxudLmV4mHdAipiceOSwHsktgD2C90gKT1jPQW9qwJFtUg6C", // user1pass
      role: "user",
      fullName: "Dr. Sarah Johnson",
      email: "vet1@vetnest.com",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      username: "vet2",
      password: "$2b$12$PzebgRxudLmV4mHdAipiceOSwHsktgD2C90gKT1jPQW9qwJFtUg6C", // user2pass
      role: "user",
      fullName: "Dr. Michael Chen",
      email: "vet2@vetnest.com",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  private reports: VetReport[] = [];
  private nextUserId = 4;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(user.password);
    const newUser: User = {
      ...user,
      id: this.nextUserId++,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return undefined;
    
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }
    
    this.users[userIndex] = { 
      ...this.users[userIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    return this.users[userIndex];
  }

  async deleteUser(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;
    this.users.splice(userIndex, 1);
    return true;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getReport(id: string): Promise<VetReport | undefined> {
    return this.reports.find(r => r.id === id);
  }

  async createReport(report: InsertVetReport, userId: number): Promise<VetReport> {
    const newReport: VetReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reports.push(newReport);
    return newReport;
  }

  async updateReport(id: string, updates: Partial<InsertVetReport>): Promise<VetReport | undefined> {
    const reportIndex = this.reports.findIndex(r => r.id === id);
    if (reportIndex === -1) return undefined;
    
    this.reports[reportIndex] = { 
      ...this.reports[reportIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    return this.reports[reportIndex];
  }

  async deleteReport(id: string): Promise<boolean> {
    const reportIndex = this.reports.findIndex(r => r.id === id);
    if (reportIndex === -1) return false;
    this.reports.splice(reportIndex, 1);
    return true;
  }

  async getAllReports(): Promise<VetReport[]> {
    return [...this.reports];
  }

  async getVetReport(id: string): Promise<VetReport | undefined> {
    return this.getReport(id);
  }

  async createVetReport(report: InsertVetReport): Promise<VetReport> {
    return this.createReport(report, 1);
  }

  async updateVetReport(id: string, report: Partial<InsertVetReport>): Promise<VetReport | undefined> {
    return this.updateReport(id, report);
  }

  async listVetReports(): Promise<VetReport[]> {
    return this.getAllReports();
  }
}

// Use memory storage temporarily due to database connection issues
export const storage = new MemStorage();
