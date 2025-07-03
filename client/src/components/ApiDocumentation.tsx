import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApiDocumentation() {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral mb-4">API Documentation</h2>
        <p className="text-gray-600">Complete reference for ATO Smart Waste Management API</p>
      </div>

      <div className="space-y-6">
        {/* Authentication */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-neutral mb-4">Authentication</h3>
            <p className="text-gray-600 mb-4">
              All API requests are currently open for development. In production, authentication would be required using API keys passed in the header.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800">
                <code>{`curl -X GET "https://api.atosmartwastemanagement.com/v1/bins" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-neutral mb-4">Endpoints</h3>
            
            <div className="space-y-6">
              {/* Register User */}
              <div className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">POST</Badge>
                  <h4 className="font-semibold text-neutral">/api/users/register</h4>
                </div>
                <p className="text-gray-600 mb-3">Register a new user for waste management service</p>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-sm mb-2">Request Body:</h5>
                    <pre className="text-sm text-gray-800">
                      <code>{`{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St, City, State",
  "binType": "residential"
}`}</code>
                    </pre>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-sm mb-2">Response:</h5>
                    <pre className="text-sm text-gray-800">
                      <code>{`{
  "success": true,
  "message": "User registered successfully",
  "userId": 123,
  "confirmationSent": true
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Get All Bins */}
              <div className="border-l-4 border-secondary pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">GET</Badge>
                  <h4 className="font-semibold text-neutral">/api/bins</h4>
                </div>
                <p className="text-gray-600 mb-3">Get status of all bins in the system</p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-sm mb-2">Response:</h5>
                  <pre className="text-sm text-gray-800">
                    <code>{`{
  "bins": [
    {
      "id": 1,
      "userId": 123,
      "location": "123 Oak Street",
      "binType": "residential",
      "capacity": 240,
      "fillLevel": 75,
      "status": "active",
      "lastUpdated": "2024-01-15T10:30:00Z",
      "userName": "John Doe",
      "userEmail": "john@example.com"
    }
  ],
  "totalBins": 15,
  "alertCount": 2
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Get Bin Status */}
              <div className="border-l-4 border-accent pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">GET</Badge>
                  <h4 className="font-semibold text-neutral">/api/bins/{"{id}"}/status</h4>
                </div>
                <p className="text-gray-600 mb-3">Get current status of a specific bin</p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-sm mb-2">Response:</h5>
                  <pre className="text-sm text-gray-800">
                    <code>{`{
  "id": 1,
  "userId": 123,
  "location": "123 Oak Street",
  "binType": "residential",
  "capacity": 240,
  "fillLevel": 75,
  "status": "active",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "alertStatus": "collection_needed",
  "alerts": [
    {
      "id": 1,
      "alertType": "collection_needed",
      "message": "Bin at 123 Oak Street has reached 75% capacity",
      "isResolved": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Update Bin Level */}
              <div className="border-l-4 border-neutral pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">PUT</Badge>
                  <h4 className="font-semibold text-neutral">/api/bins/{"{id}"}/level</h4>
                </div>
                <p className="text-gray-600 mb-3">Update the fill level of a specific bin</p>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-sm mb-2">Request Body:</h5>
                    <pre className="text-sm text-gray-800">
                      <code>{`{
  "fillLevel": 85
}`}</code>
                    </pre>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-sm mb-2">Response:</h5>
                    <pre className="text-sm text-gray-800">
                      <code>{`{
  "success": true,
  "binId": 1,
  "fillLevel": 85,
  "alertTriggered": true,
  "emailSent": true
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Get Settings */}
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">GET</Badge>
                  <h4 className="font-semibold text-neutral">/api/settings</h4>
                </div>
                <p className="text-gray-600 mb-3">Get current system settings</p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-sm mb-2">Response:</h5>
                  <pre className="text-sm text-gray-800">
                    <code>{`{
  "alertThreshold": "70",
  "criticalThreshold": "85",
  "adminEmail": "thetownet@gmail.com",
  "updateInterval": "5",
  "dataRetention": "30"
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Codes */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-neutral mb-4">Status Codes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Success Codes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>200</strong> - OK</li>
                  <li><strong>201</strong> - Created</li>
                  <li><strong>204</strong> - No Content</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-red-600 mb-2">Error Codes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>400</strong> - Bad Request</li>
                  <li><strong>401</strong> - Unauthorized</li>
                  <li><strong>404</strong> - Not Found</li>
                  <li><strong>409</strong> - Conflict</li>
                  <li><strong>500</strong> - Internal Server Error</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-neutral mb-4">Rate Limiting</h3>
            <p className="text-gray-600 mb-4">API requests are limited to prevent abuse:</p>
            
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Registration:</strong> 5 requests per minute</li>
              <li>• <strong>Bin Status:</strong> 100 requests per minute</li>
              <li>• <strong>Level Updates:</strong> 200 requests per minute</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Rate limit headers are included in all responses to help you track your usage.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
