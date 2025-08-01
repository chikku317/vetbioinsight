import { type VetReport, type InsertVetReport } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getVetReport(id: string): Promise<VetReport | undefined>;
  createVetReport(report: InsertVetReport): Promise<VetReport>;
  updateVetReport(id: string, report: Partial<InsertVetReport>): Promise<VetReport | undefined>;
  listVetReports(): Promise<VetReport[]>;
}

export class MemStorage implements IStorage {
  private reports: Map<string, VetReport>;

  constructor() {
    this.reports = new Map();
  }

  async getVetReport(id: string): Promise<VetReport | undefined> {
    return this.reports.get(id);
  }

  async createVetReport(insertReport: InsertVetReport): Promise<VetReport> {
    const id = randomUUID();
    const report: VetReport = { 
      ...insertReport, 
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.reports.set(id, report);
    return report;
  }

  async updateVetReport(id: string, updateData: Partial<InsertVetReport>): Promise<VetReport | undefined> {
    const existing = this.reports.get(id);
    if (!existing) return undefined;
    
    const updated: VetReport = { ...existing, ...updateData };
    this.reports.set(id, updated);
    return updated;
  }

  async listVetReports(): Promise<VetReport[]> {
    return Array.from(this.reports.values());
  }
}

export const storage = new MemStorage();
