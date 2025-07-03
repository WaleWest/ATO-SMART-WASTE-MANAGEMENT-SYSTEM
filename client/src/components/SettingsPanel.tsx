import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPanel() {
  const { data: settings, isLoading, updateSettings } = useSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings || {});

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
        title: "Settings saved",
        description: "Your system settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral mb-4">System Settings</h2>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </section>
    );
  }

  const alertThreshold = parseInt(localSettings.alertThreshold || '70');
  const criticalThreshold = parseInt(localSettings.criticalThreshold || '85');

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral mb-4">System Settings</h2>
        <p className="text-gray-600">Configure your smart waste management system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral mb-4">Alert Thresholds</h3>
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
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
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Admin Email</Label>
                <Input
                  type="email"
                  value={localSettings.adminEmail || 'thetownet@gmail.com'}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  placeholder="Admin email address"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Notification Types</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="collection-alerts" defaultChecked />
                    <Label htmlFor="collection-alerts" className="text-sm">Collection alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="user-confirmations" defaultChecked />
                    <Label htmlFor="user-confirmations" className="text-sm">User registration confirmations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="daily-reports" />
                    <Label htmlFor="daily-reports" className="text-sm">Daily status reports</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral mb-4">Monitoring Settings</h3>
            <div className="space-y-4">
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
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
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSaveSettings}
          disabled={updateSettings.isPending}
          className="px-6 py-2"
        >
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </section>
  );
}
