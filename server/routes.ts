import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVetReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all vet reports
  app.get("/api/vet-reports", async (req, res) => {
    try {
      const reports = await storage.listVetReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Get single vet report
  app.get("/api/vet-reports/:id", async (req, res) => {
    try {
      const report = await storage.getVetReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  // Create new vet report
  app.post("/api/vet-reports", async (req, res) => {
    try {
      const validatedData = insertVetReportSchema.parse(req.body);
      const report = await storage.createVetReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Update vet report
  app.patch("/api/vet-reports/:id", async (req, res) => {
    try {
      const partialData = insertVetReportSchema.partial().parse(req.body);
      const report = await storage.updateVetReport(req.params.id, partialData);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
