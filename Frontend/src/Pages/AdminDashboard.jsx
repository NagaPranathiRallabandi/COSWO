
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Loader2, User, Mail, Phone, Award, Users, Package, CheckCircle, TrendingUp } from "lucide-react";
import { getAdminStats } from "../api/adminApi";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getAdminStats,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  if (isError || !stats) {
    return <div className="p-6 text-red-500">Failed to load admin stats.</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Welcome back, {user?.name || user?.full_name || 'Admin'}
            </h1>
            <p className="text-gray-600 mt-2">Admin Dashboard</p>
          </div>
        </div>

        {/* Admin Info Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-gray-200/80 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award className="w-6 h-6 text-blue-600" /> Admin Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{user?.name || user?.full_name}</p></div></div>
              <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user?.email}</p></div></div>
              <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{user?.phone_number || 'N/A'}</p></div></div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Badge className="bg-gradient-to-r from-blue-600 to-orange-600 text-white text-base px-4 py-2">Admin ID: {user?._id}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-none shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 opacity-10 rounded-full transform translate-x-12 -translate-y-12" />
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeDonors}</p>
            </div>
          </Card>
          <Card className="bg-green-50 border-none shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 opacity-10 rounded-full transform translate-x-12 -translate-y-12" />
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">Active Batch Staff</p>
                <div className="p-2 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeBatchStaff}</p>
            </div>
          </Card>
          <Card className="bg-orange-50 border-none shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 opacity-10 rounded-full transform translate-x-12 -translate-y-12" />
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">Batches to be Assigned</p>
                <div className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.toBeAssigned}</p>
            </div>
          </Card>
          <Card className="bg-pink-50 border-none shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500 to-pink-600 opacity-10 rounded-full transform translate-x-12 -translate-y-12" />
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">Batches Delivered</p>
                <div className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </Card>
          <Card className="bg-yellow-50 border-none shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-10 rounded-full transform translate-x-12 -translate-y-12" />
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-600">Ongoing Batches</p>
                <div className="p-2 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.ongoing}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}