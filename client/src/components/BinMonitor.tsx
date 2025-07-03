import { useBins } from "@/hooks/useBins";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function BinMonitor() {
  const { data: binData, isLoading, error } = useBins();

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral mb-4">Bin Monitoring Dashboard</h2>
          <p className="text-gray-600">Loading bin data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral mb-4">Bin Monitoring Dashboard</h2>
          <p className="text-red-600">Error loading bin data: {error.message}</p>
        </div>
      </section>
    );
  }

  const bins = binData?.bins || [];
  const alertCount = binData?.alertCount || 0;

  const getStatusColor = (fillLevel: number) => {
    if (fillLevel >= 85) return "bg-red-500";
    if (fillLevel >= 70) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStatusBadge = (fillLevel: number) => {
    if (fillLevel >= 85) return <Badge variant="destructive" className="alert-pulse">Critical</Badge>;
    if (fillLevel >= 70) return <Badge variant="destructive" className="alert-pulse">Alert</Badge>;
    return <Badge variant="secondary">Active</Badge>;
  };

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral mb-4">Bin Monitoring Dashboard</h2>
        <p className="text-gray-600">Real-time monitoring of waste bin levels across all registered locations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {bins.map((bin) => (
          <Card key={bin.id} className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral">
                  {bin.binType.charAt(0).toUpperCase() + bin.binType.slice(1)} - {bin.location}
                </h3>
                {getStatusBadge(bin.fillLevel)}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Fill Level</span>
                  <span className="text-sm font-bold text-neutral">{bin.fillLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <div
                    className={`bin-fill h-full rounded-full ${getStatusColor(bin.fillLevel)}`}
                    style={{ width: `${bin.fillLevel}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Type:</strong> {bin.capacity}L {bin.binType}</p>
                <p><strong>User:</strong> {bin.userName}</p>
                <p><strong>Last Updated:</strong> {formatDistanceToNow(new Date(bin.lastUpdated), { addSuffix: true })}</p>
                <p><strong>Status:</strong> {bin.fillLevel >= 70 ? "Collection Needed" : "Normal"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bins.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No bins registered yet. Please register first to see monitoring data.</p>
        </div>
      )}

      {alertCount > 0 && (
        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-red-900">Active Alerts</p>
                    <p className="text-sm text-red-700">{alertCount} bin(s) require collection</p>
                  </div>
                </div>
                <Badge variant="destructive">{alertCount}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">System Status</p>
                    <p className="text-sm text-green-700">Monitoring active - Updates every 5 minutes</p>
                  </div>
                </div>
                <Badge variant="secondary">Online</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">Next Update</p>
                    <p className="text-sm text-blue-700">Automatic level simulation in progress</p>
                  </div>
                </div>
                <Badge variant="outline">5 min</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
