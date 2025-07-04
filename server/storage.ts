import { users, bins, alerts, settings, type User, type InsertUser, type Bin, type InsertBin, type Alert, type InsertAlert, type Settings, type InsertSettings } from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Bin operations
  createBin(bin: InsertBin): Promise<Bin>;
  getBinById(id: number): Promise<Bin | undefined>;
  getAllBins(): Promise<Bin[]>;
  updateBinFillLevel(id: number, fillLevel: number): Promise<Bin | undefined>;
  updateBinStatus(id: number, status: string): Promise<Bin | undefined>;
  getBinsByUserId(userId: number): Promise<Bin[]>;

  // Alert operations
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlertsByBinId(binId: number): Promise<Alert[]>;
  getAllAlerts(): Promise<Alert[]>;
  resolveAlert(id: number): Promise<Alert | undefined>;
  getUnresolvedAlerts(): Promise<Alert[]>;

  // Settings operations
  getSetting(key: string): Promise<Settings | undefined>;
  setSetting(key: string, value: string): Promise<Settings>;
  getAllSettings(): Promise<Settings[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private bins: Map<number, Bin> = new Map();
  private alerts: Map<number, Alert> = new Map();
  private settings: Map<string, Settings> = new Map();
  private currentUserId = 1;
  private currentBinId = 1;
  private currentAlertId = 1;
  private currentSettingsId = 1;

  constructor() {
    // Initialize default settings
    this.initializeDefaultSettings();
  }

  private initializeDefaultSettings() {
    const defaultSettings = [
      { key: "alertThreshold", value: "75" },
      { key: "criticalThreshold", value: "85" },
      { key: "adminEmail", value: "thetownet@gmail.com" },
      { key: "updateInterval", value: "5" },
      { key: "dataRetention", value: "30" },
    ];

    defaultSettings.forEach(setting => {
      const settingsRecord: Settings = {
        id: this.currentSettingsId++,
        key: setting.key,
        value: setting.value,
        updatedAt: new Date(),
      };
      this.settings.set(setting.key, settingsRecord);
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createBin(insertBin: InsertBin): Promise<Bin> {
    const bin: Bin = {
      ...insertBin,
      id: this.currentBinId++,
      fillLevel: insertBin.fillLevel || 0,
      status: insertBin.status || 'active',
      lastUpdated: new Date(),
    };
    this.bins.set(bin.id, bin);
    return bin;
  }

  async getBinById(id: number): Promise<Bin | undefined> {
    return this.bins.get(id);
  }

  async getAllBins(): Promise<Bin[]> {
    return Array.from(this.bins.values());
  }

  async updateBinFillLevel(id: number, fillLevel: number): Promise<Bin | undefined> {
    const bin = this.bins.get(id);
    if (!bin) return undefined;

    const updatedBin: Bin = {
      ...bin,
      fillLevel,
      lastUpdated: new Date(),
    };
    this.bins.set(id, updatedBin);
    return updatedBin;
  }

  async updateBinStatus(id: number, status: string): Promise<Bin | undefined> {
    const bin = this.bins.get(id);
    if (!bin) return undefined;

    const updatedBin: Bin = {
      ...bin,
      status,
      lastUpdated: new Date(),
    };
    this.bins.set(id, updatedBin);
    return updatedBin;
  }

  async getBinsByUserId(userId: number): Promise<Bin[]> {
    return Array.from(this.bins.values()).filter(bin => bin.userId === userId);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const alert: Alert = {
      ...insertAlert,
      id: this.currentAlertId++,
      isResolved: insertAlert.isResolved || false,
      createdAt: new Date(),
    };
    this.alerts.set(alert.id, alert);
    return alert;
  }

  async getAlertsByBinId(binId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => alert.binId === binId);
  }

  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;

    const updatedAlert: Alert = {
      ...alert,
      isResolved: true,
    };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async getUnresolvedAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => !alert.isResolved);
  }

  async getSetting(key: string): Promise<Settings | undefined> {
    return this.settings.get(key);
  }

  async setSetting(key: string, value: string): Promise<Settings> {
    const existing = this.settings.get(key);
    const setting: Settings = {
      id: existing?.id || this.currentSettingsId++,
      key,
      value,
      updatedAt: new Date(),
    };
    this.settings.set(key, setting);
    return setting;
  }

  async getAllSettings(): Promise<Settings[]> {
    return Array.from(this.settings.values());
  }
}

export const storage = new MemStorage();
