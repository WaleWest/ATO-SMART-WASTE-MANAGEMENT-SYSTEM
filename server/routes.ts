import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./services/emailService";
import { binService } from "./services/binService";
import { insertUserSchema, insertBinSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration endpoint
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: "User with this email already exists" 
        });
      }

      // Create user
      const user = await storage.createUser(userData);

      // Create bin for the user
      const binCapacity = userData.binType === 'residential' ? 240 : 
                         userData.binType === 'commercial' ? 660 : 1100;
      
      await storage.createBin({
        userId: user.id,
        location: userData.address,
        binType: userData.binType,
        capacity: binCapacity,
        fillLevel: Math.floor(Math.random() * 30) + 10, // Start with 10-40% fill
        status: 'active',
      });

      // Send confirmation email to user
      await emailService.sendUserConfirmationEmail(user.email, user.name);

      // Send admin notification
      const adminEmailSetting = await storage.getSetting('adminEmail');
      const adminEmail = adminEmailSetting?.value || 'thetownet@gmail.com';
      await emailService.sendAdminRegistrationNotification(
        adminEmail,
        user.name,
        user.email,
        userData.address,
        userData.binType
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: user.id,
        confirmationSent: true,
        adminNotified: true,
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid input data",
          errors: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  });

  // Get all bins
  app.get("/api/bins", async (req, res) => {
    try {
      const bins = await storage.getAllBins();
      const users = await storage.getAllUsers();
      const userMap = new Map(users.map(u => [u.id, u]));
      
      const binsWithUsers = bins.map(bin => {
        const user = userMap.get(bin.userId);
        return {
          ...bin,
          userName: user?.name || 'Unknown',
          userEmail: user?.email || 'Unknown',
        };
      });

      const alerts = await storage.getUnresolvedAlerts();
      
      res.json({
        bins: binsWithUsers,
        totalBins: bins.length,
        alertCount: alerts.length,
      });
    } catch (error) {
      console.error("Error fetching bins:", error);
      res.status(500).json({ message: "Failed to fetch bins" });
    }
  });

  // Get specific bin status
  app.get("/api/bins/:id/status", async (req, res) => {
    try {
      const binId = parseInt(req.params.id);
      const binStatus = await binService.getBinStatus(binId);
      res.json(binStatus);
    } catch (error) {
      console.error("Error fetching bin status:", error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ message: "Bin not found" });
      } else {
        res.status(500).json({ message: "Failed to fetch bin status" });
      }
    }
  });

  // Update bin fill level
  app.put("/api/bins/:id/level", async (req, res) => {
    try {
      const binId = parseInt(req.params.id);
      const { fillLevel } = req.body;
      
      if (typeof fillLevel !== 'number' || fillLevel < 0 || fillLevel > 100) {
        return res.status(400).json({ message: "Invalid fill level" });
      }

      const updatedBin = await storage.updateBinFillLevel(binId, fillLevel);
      if (!updatedBin) {
        return res.status(404).json({ message: "Bin not found" });
      }

      // Check if alert should be triggered
      const alertThresholdSetting = await storage.getSetting('alertThreshold');
      const alertThreshold = alertThresholdSetting ? parseInt(alertThresholdSetting.value) : 70;
      
      let alertTriggered = false;
      let emailSent = false;

      if (fillLevel >= alertThreshold) {
        try {
          await binService.sendCollectionAlert(binId);
          alertTriggered = true;
          emailSent = true;
        } catch (error) {
          console.error("Failed to send alert:", error);
        }
      }

      res.json({
        success: true,
        binId,
        fillLevel,
        alertTriggered,
        emailSent,
      });
    } catch (error) {
      console.error("Error updating bin level:", error);
      res.status(500).json({ message: "Failed to update bin level" });
    }
  });

  // Get all alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      const bins = await storage.getAllBins();
      const binMap = new Map(bins.map(b => [b.id, b]));
      
      const alertsWithBinInfo = alerts.map(alert => {
        const bin = binMap.get(alert.binId);
        return {
          ...alert,
          binLocation: bin?.location || 'Unknown',
          binFillLevel: bin?.fillLevel || 0,
        };
      });

      res.json(alertsWithBinInfo);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Get settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
      
      res.json(settingsMap);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update settings
  app.put("/api/settings", async (req, res) => {
    try {
      const settings = req.body;
      
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === 'string') {
          await storage.setSetting(key, value);
        }
      }

      // Update bin service thresholds if they changed
      if (settings.alertThreshold && settings.criticalThreshold) {
        await binService.updateThresholds(
          parseInt(settings.alertThreshold),
          parseInt(settings.criticalThreshold)
        );
      }

      res.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Delete bin endpoint
  app.delete("/api/bins/:id", async (req, res) => {
    try {
      const binId = parseInt(req.params.id);
      const bin = await storage.getBinById(binId);
      
      if (!bin) {
        return res.status(404).json({ message: "Bin not found" });
      }

      // In a real implementation, you would delete from database
      // For now, we'll just mark it as inactive
      await storage.updateBinStatus(binId, 'inactive');
      
      res.json({ success: true, message: "Bin deleted successfully" });
    } catch (error) {
      console.error("Error deleting bin:", error);
      res.status(500).json({ message: "Failed to delete bin" });
    }
  });

  // Optimize bin endpoint
  app.post("/api/bins/:id/optimize", async (req, res) => {
    try {
      const binId = parseInt(req.params.id);
      const bin = await storage.getBinById(binId);
      
      if (!bin) {
        return res.status(404).json({ message: "Bin not found" });
      }

      // Optimize bin (reset to optimal level and update settings)
      await storage.updateBinFillLevel(binId, 25);
      
      res.json({ 
        success: true, 
        message: "Bin optimized successfully",
        newFillLevel: 25
      });
    } catch (error) {
      console.error("Error optimizing bin:", error);
      res.status(500).json({ message: "Failed to optimize bin" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
