import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, UserPlus, Mail, MapPin, Package } from "lucide-react";

export default function AdminRegistrationForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      setRegisteredUser(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      
      toast({
        title: "User registered successfully!",
        description: "Confirmation email sent to user and admin notification sent.",
      });
      
      setTimeout(() => {
        setShowSuccess(false);
        setRegisteredUser(null);
      }, 8000);
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    registrationMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Register New User</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Register users for the ATO Smart Waste Management service. Users will receive confirmation emails and bins will be automatically created.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              User Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer's full name" {...field} />
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
                        <FormLabel className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter customer's email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Service Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the complete service address where the bin will be located"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="binType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Bin Type
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appropriate bin type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="residential">Residential (240L) - For homes and small properties</SelectItem>
                          <SelectItem value="commercial">Commercial (660L) - For businesses and offices</SelectItem>
                          <SelectItem value="industrial">Industrial (1100L) - For large facilities</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registrationMutation.isPending}
                  size="lg"
                >
                  {registrationMutation.isPending ? "Registering User..." : "Register User"}
                </Button>
              </form>
            </Form>

            {showSuccess && registeredUser && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-green-900">Registration Successful!</h3>
                </div>
                <div className="space-y-2 text-sm text-green-800">
                  <p><strong>User ID:</strong> {registeredUser.userId}</p>
                  <p><strong>Status:</strong> Active</p>
                  <p><strong>Confirmation Email:</strong> {registeredUser.confirmationSent ? "Sent" : "Failed"}</p>
                  <p><strong>Admin Notification:</strong> Sent to thetownet@gmail.com</p>
                  <p><strong>Bin Creation:</strong> Automated bin created and assigned</p>
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Next Steps:</p>
                  <ul className="text-sm text-green-800 mt-1 space-y-1">
                    <li>• User will receive confirmation email with service details</li>
                    <li>• Bin will be scheduled for installation within 3-5 business days</li>
                    <li>• Monitoring will begin automatically once installed</li>
                    <li>• Collection alerts will be sent when bin reaches 75% capacity</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}