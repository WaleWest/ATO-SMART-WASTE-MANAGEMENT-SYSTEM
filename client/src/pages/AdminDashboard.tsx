import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBins } from "@/hooks/useBins";
import { useSettings } from "@/hooks/useSettings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, 
  Users, 
  AlertTriangle, 
  Settings, 
  TrendingUp,
  CheckCircle,
  UserPlus,
  Wrench
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AdminRegistrationForm from "../components/AdminRegistrationForm";
import AdminSettingsPanel from "../components/AdminSettingsPanel";
import { Link } from "wouter";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: binData, isLoading: binsLoading } = useBins();
  const { data: settings } = useSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const collectBinMutation = useMutation({
    mutationFn: async (binId: number) => {
      const response = await apiRequest("PUT", `/api/bins/${binId}/level`, { fillLevel: 15 });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Collection completed",
        description: "Bin has been collected and reset to 15% capacity",
      });
    },
    onError: () => {
      toast({
        title: "Collection failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const deleteBinMutation = useMutation({
    mutationFn: async (binId: number) => {
      const response = await apiRequest("DELETE", `/api/bins/${binId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Bin deleted",
        description: "Bin has been removed from the system",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const optimizeBinMutation = useMutation({
    mutationFn: async (binId: number) => {
      const response = await apiRequest("POST", `/api/bins/${binId}/optimize`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Bin optimized",
        description: "Bin capacity and settings have been optimized",
      });
    },
    onError: () => {
      toast({
        title: "Optimization failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const bins = (binData as any)?.bins || [];
  const alertCount = (binData as any)?.alertCount || 0;
  const totalBins = bins.length;
  const criticalBins = bins.filter((bin: any) => bin.fillLevel >= 85).length;
  const alertBins = bins.filter((bin: any) => bin.fillLevel >= 70).length;

  const getStatusColor = (fillLevel: number) => {
    if (fillLevel >= 85) return "bg-red-500";
    if (fillLevel >= 70) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStatusBadge = (fillLevel: number) => {
    if (fillLevel >= 85) return <Badge variant="destructive">Critical</Badge>;
    if (fillLevel >= 70) return <Badge variant="destructive">Alert</Badge>;
    return <Badge variant="secondary">Normal</Badge>;
  };

  if (binsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Admin Dashboard...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-semibold text-gray-900">ATO Smart Waste Management</h1>
                  <p className="text-sm text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/public/register">
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Public Registration
                </Button>
              </Link>
              <Badge variant="secondary">Admin</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bins">Bin Management</TabsTrigger>
            <TabsTrigger value="register">Register User</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Trash2 className="w-8 h-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Bins</p>
                      <p className="text-2xl font-bold text-gray-900">{totalBins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Alert Bins</p>
                      <p className="text-2xl font-bold text-gray-900">{alertBins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Critical Bins</p>
                      <p className="text-2xl font-bold text-gray-900">{criticalBins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{totalBins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            {alertCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                    Priority Alerts ({alertCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bins.filter(bin => bin.fillLevel >= 70).map((bin) => (
                      <div key={bin.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                          <div>
                            <p className="font-medium text-red-900">{bin.location}</p>
                            <p className="text-sm text-red-700">{bin.fillLevel}% full - {bin.userName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(bin.fillLevel)}
                          <Button
                            size="sm"
                            onClick={() => collectBinMutation.mutate(bin.id)}
                            disabled={collectBinMutation.isPending}
                          >
                            Collect
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bins" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Bin Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Optimize All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bins.map((bin) => (
                <Card key={bin.id} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {bin.binType.charAt(0).toUpperCase() + bin.binType.slice(1)} #{bin.id}
                      </h3>
                      {getStatusBadge(bin.fillLevel)}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Fill Level</span>
                        <span className="text-sm font-bold text-gray-900">{bin.fillLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${getStatusColor(bin.fillLevel)}`}
                          style={{ width: `${bin.fillLevel}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p><strong>Location:</strong> {bin.location}</p>
                      <p><strong>User:</strong> {bin.userName}</p>
                      <p><strong>Email:</strong> {bin.userEmail}</p>
                      <p><strong>Capacity:</strong> {bin.capacity}L</p>
                      <p><strong>Last Updated:</strong> {formatDistanceToNow(new Date(bin.lastUpdated), { addSuffix: true })}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => collectBinMutation.mutate(bin.id)}
                        disabled={collectBinMutation.isPending}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Collect
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => optimizeBinMutation.mutate(bin.id)}
                        disabled={optimizeBinMutation.isPending}
                      >
                        <Wrench className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBinMutation.mutate(bin.id)}
                        disabled={deleteBinMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {bins.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bins registered</h3>
                  <p className="text-gray-600">Register your first user to start monitoring bins</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="register">
            <AdminRegistrationForm />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}