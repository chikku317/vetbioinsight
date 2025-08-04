import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { UserManagement } from "@/components/admin/user-management";
import { ReportManagement } from "@/components/admin/report-management";
import { ArrowLeft, Users, FileText, LogOut, User } from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"users" | "reports">("users");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const handleBackToReports = () => {
    window.location.href = "/";
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
            <Button onClick={handleBackToReports}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToReports}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reports
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-gray-600">Manage users and system settings</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.fullName}</span>
                <Badge variant="default" className="text-xs">Admin</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            User Management
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "outline"}
            onClick={() => setActiveTab("reports")}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Report Management
          </Button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "users" && <UserManagement />}
          {activeTab === "reports" && <ReportManagement />}
        </div>
      </div>
    </div>
  );
}