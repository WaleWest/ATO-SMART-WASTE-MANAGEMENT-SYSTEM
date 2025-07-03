import { storage } from '../storage';
import { emailService } from './emailService';
import cron from 'node-cron';

export class BinService {
  private alertThreshold = 70;
  private criticalThreshold = 85;

  constructor() {
    this.initializeCronJobs();
    this.loadSettings();
  }

  private async loadSettings() {
    const alertThresholdSetting = await storage.getSetting('alertThreshold');
    const criticalThresholdSetting = await storage.getSetting('criticalThreshold');
    
    if (alertThresholdSetting) {
      this.alertThreshold = parseInt(alertThresholdSetting.value);
    }
    if (criticalThresholdSetting) {
      this.criticalThreshold = parseInt(criticalThresholdSetting.value);
    }
  }

  private initializeCronJobs() {
    // Run every 5 minutes to simulate bin level increases
    cron.schedule('*/5 * * * *', async () => {
      await this.simulateBinLevelIncrease();
    });

    console.log('Bin level simulation cron job initialized - runs every 5 minutes');
  }

  private async simulateBinLevelIncrease() {
    try {
      const bins = await storage.getAllBins();
      
      for (const bin of bins) {
        // Simulate random increase between 5-15%
        const increase = Math.floor(Math.random() * 11) + 5;
        let newFillLevel = bin.fillLevel + increase;
        
        // If bin reaches 100%, simulate collection (reset to 10-20%)
        if (newFillLevel >= 100) {
          newFillLevel = Math.floor(Math.random() * 11) + 10;
          console.log(`Bin ${bin.id} at ${bin.location} collected and reset to ${newFillLevel}%`);
        }
        
        await storage.updateBinFillLevel(bin.id, newFillLevel);
        
        // Check if we need to send an alert
        if (newFillLevel >= this.alertThreshold && bin.fillLevel < this.alertThreshold) {
          await this.sendCollectionAlert(bin.id);
        }
      }
    } catch (error) {
      console.error('Error during bin level simulation:', error);
    }
  }

  async sendCollectionAlert(binId: number): Promise<void> {
    try {
      const bin = await storage.getBinById(binId);
      if (!bin) {
        throw new Error(`Bin with id ${binId} not found`);
      }

      const adminEmailSetting = await storage.getSetting('adminEmail');
      const adminEmail = adminEmailSetting?.value || 'thetownet@gmail.com';

      // Create alert record
      await storage.createAlert({
        binId: bin.id,
        alertType: 'collection_needed',
        message: `Bin at ${bin.location} has reached ${bin.fillLevel}% capacity`,
        isResolved: false,
      });

      // Send email to admin
      await emailService.sendAdminAlert(adminEmail, bin.location, bin.fillLevel);

      console.log(`Collection alert sent for bin ${binId} at ${bin.location} (${bin.fillLevel}%)`);
    } catch (error) {
      console.error('Failed to send collection alert:', error);
      throw error;
    }
  }

  async updateThresholds(alertThreshold: number, criticalThreshold: number): Promise<void> {
    this.alertThreshold = alertThreshold;
    this.criticalThreshold = criticalThreshold;
    
    await storage.setSetting('alertThreshold', alertThreshold.toString());
    await storage.setSetting('criticalThreshold', criticalThreshold.toString());
  }

  async getBinStatus(binId: number) {
    const bin = await storage.getBinById(binId);
    if (!bin) {
      throw new Error(`Bin with id ${binId} not found`);
    }

    const alerts = await storage.getAlertsByBinId(binId);
    const unresolvedAlerts = alerts.filter(alert => !alert.isResolved);

    return {
      ...bin,
      alertStatus: unresolvedAlerts.length > 0 ? 'collection_needed' : 'normal',
      alerts: unresolvedAlerts,
    };
  }
}

export const binService = new BinService();
