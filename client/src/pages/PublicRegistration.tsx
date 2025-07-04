import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Trash2, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function PublicRegistration() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      binType: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const response = await apiRequest("POST", "/api/users/register", userData);
      return response.json();
    },
    onSuccess: (data) => {
      setShowSuccess(true);
      form.reset();
      toast({
        title: "Registration successful!",
        description: "Check your email for confirmation details.",
      });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 8000);
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    registrationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-0 sm:h-16">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">ATO Smart Waste Management</h1>
                  <p className="text-xs sm:text-sm text-gray-500">Public Registration</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600">Need help? Call us: 1-800-ATO-WASTE</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Join Smart Waste Management Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8">
            Register for our intelligent waste collection service and never worry about overflowing bins again. 
            We monitor your waste levels and schedule collections automatically.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 sm:mb-12">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Smart Monitoring</h3>
              <p className="text-sm sm:text-base text-gray-600">Automatic bin level monitoring with IoT sensors</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Email Alerts</h3>
              <p className="text-sm sm:text-base text-gray-600">Get notified when collection is scheduled</p>
            </div>
            <div className="text-center lg:col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Convenient Service</h3>
              <p className="text-sm sm:text-base text-gray-600">Hassle-free waste management for your location</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-6">
              <CardTitle className="text-center text-xl sm:text-2xl">
                Register for Service
              </CardTitle>
              <p className="text-center text-blue-100 mt-2 text-sm sm:text-base">
                Complete the form below to get started with our smart waste management service
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base md:text-lg">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            className="h-10 sm:h-12 text-sm sm:text-base md:text-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base md:text-lg">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="h-10 sm:h-12 text-sm sm:text-base md:text-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs sm:text-sm text-gray-500">
                          You'll receive confirmation and service updates at this email
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base md:text-lg">Service Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the complete address where you need waste management service"
                            className="min-h-[80px] sm:min-h-[100px] md:min-h-[120px] text-sm sm:text-base md:text-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs sm:text-sm text-gray-500">
                          This is where your smart bin will be installed
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="binType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base md:text-lg">Service Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base md:text-lg">
                              <SelectValue placeholder="Select the service type that best fits your needs" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">
                              <div className="py-2">
                                <div className="font-medium">Residential Service (240L)</div>
                                <div className="text-sm text-gray-500">Perfect for homes and small properties</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="commercial">
                              <div className="py-2">
                                <div className="font-medium">Commercial Service (660L)</div>
                                <div className="text-sm text-gray-500">Ideal for businesses and offices</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="industrial">
                              <div className="py-2">
                                <div className="font-medium">Industrial Service (1100L)</div>
                                <div className="text-sm text-gray-500">For large facilities and high-volume waste</div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg font-semibold"
                    disabled={registrationMutation.isPending}
                  >
                    {registrationMutation.isPending ? "Processing Registration..." : "Register Now"}
                  </Button>
                </form>
              </Form>

              {showSuccess && (
                <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                    <h3 className="text-xl font-semibold text-green-900">Registration Successful!</h3>
                  </div>
                  <div className="space-y-3 text-green-800">
                    <p className="font-medium">Thank you for choosing ATO Smart Waste Management!</p>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">What happens next:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✓ You'll receive a confirmation email within 5 minutes</li>
                        <li>✓ Our team will contact you within 24 hours to schedule installation</li>
                        <li>✓ Smart bin installation within 3-5 business days</li>
                        <li>✓ Automatic monitoring and collection scheduling begins</li>
                      </ul>
                    </div>
                    <p className="text-sm">
                      <strong>Questions?</strong> Contact us at support@atosmartwastemanagement.com
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Service Benefits</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Never miss a collection - we monitor your bins 24/7</li>
                  <li>• Reduce overflows and pest problems</li>
                  <li>• Environmentally friendly waste management</li>
                  <li>• Flexible service plans to fit your needs</li>
                  <li>• Real-time notifications and updates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}