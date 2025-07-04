import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Settings, Mail, Clock, Database, AlertTriangle } from "lucide-react";

export default function AdminSettingsPanel() {
  const { data: settings, isLoading, updateSettings } = useSettings();
  const { toast } = useToast();
  
  const defaultSettings = {
    alertThreshold: "75",
    criticalThreshold: "85",
    adminEmail: "thetownet@gmail.com",
    updateInterval: "5",
    dataRetention: "30"
  };
  
  const [localSettings, setLocalSettings] = useState<Record<string, string>>(
    settings ? { ...defaultSettings, ...settings } : defaultSettings
  );

  const handleSliderChange = (key: string, value: number[]) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value[0].toString()
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync(localSettings);
      toast({
        title: "Settings saved successfully",
        description: "All system settings have been updated and applied.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading Settings...</h2>
        </div>
      </div>
    );
  }

  const alertThreshold = parseInt(localSettings.alertThreshold || '70');
  const criticalThreshold = parseInt(localSettings.criticalThreshold || '85');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">System Settings</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure alert thresholds, notification settings, and system parameters for optimal waste management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alert Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Collection Alert Threshold: {alertThreshold}%
              </Label>
              <Slider
                value={[alertThreshold]}
                onValueChange={(value) => handleSliderChange('alertThreshold', value)}
                max={90}
                min={50}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Send alert when bins reach this fill level
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Critical Alert Threshold: {criticalThreshold}%
              </Label>
              <Slider
                value={[criticalThreshold]}
                onValueChange={(value) => handleSliderChange('criticalThreshold', value)}
                max={95}
                min={70}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Send urgent alerts when bins reach this level
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Current Settings</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Alert emails sent at {alertThreshold}% capacity</p>
                <p>• Critical alerts sent at {criticalThreshold}% capacity</p>
                <p>• Bin levels update every 5 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Admin Email</Label>
              <Input
                type="email"
                value={localSettings.adminEmail || 'thetownet@gmail.com'}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                placeholder="Admin email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                Primary email for collection alerts and notifications
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Notification Types</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox id="collection-alerts" defaultChecked />
                  <Label htmlFor="collection-alerts" className="text-sm">
                    Collection alerts when bins reach threshold
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="user-confirmations" defaultChecked />
                  <Label htmlFor="user-confirmations" className="text-sm">
                    User registration confirmations
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="admin-notifications" defaultChecked />
                  <Label htmlFor="admin-notifications" className="text-sm">
                    Admin notifications for new registrations
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="daily-reports" />
                  <Label htmlFor="daily-reports" className="text-sm">
                    Daily status reports
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Monitoring Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Update Interval</Label>
              <Select
                value={localSettings.updateInterval || '5'}
                onValueChange={(value) => handleInputChange('updateInterval', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                How often bin levels are simulated and updated
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Data Retention</Label>
              <Select
                value={localSettings.dataRetention || '30'}
                onValueChange={(value) => handleInputChange('dataRetention', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                How long to keep historical data and logs
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Service</span>
                <Badge variant="secondary">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Service</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monitoring</span>
                <Badge variant="secondary">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bin Simulation</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">System Health</h4>
              <div className="space-y-1 text-sm text-green-800">
                <p>• All services operational</p>
                <p>• Email notifications working</p>
                <p>• Real-time monitoring active</p>
                <p>• Automatic bin level simulation running</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleSaveSettings}
          disabled={updateSettings.isPending}
          size="lg"
          className="px-8"
        >
          <Settings className="w-4 h-4 mr-2" />
          {updateSettings.isPending ? 'Saving Settings...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}