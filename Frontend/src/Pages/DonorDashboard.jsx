import React, { useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { AuthContext } from "../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/utils";
import { User, Mail, Phone, Award, Plus, Loader2 } from "lucide-react";

import DonorRegistrationCard from "../Components/donor/DonorRegistrationCard";
import ImpactStats from "../Components/donor/ImpactStats";
import DonationCard from "../Components/donation/DonationCard";

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash);
      // Clear the flash from history state so it doesn't persist on refresh
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['donorDashboard', user?.email],
    queryFn: async () => {
      // NEW: Single, efficient API call
      const { data } = await apiClient.get('/users/dashboard');
      return data;
    },
    enabled: !!user,
  });

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  const { needsRegistration, donor, stats, recentDonations } = dashboardData;

  if (needsRegistration) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-2xl mx-auto pt-12">
          {/* The registration card will now call our local backend */}
          <DonorRegistrationCard onComplete={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {flash && (
          <div className={`p-3 rounded-lg border ${flash.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {flash.message}
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Welcome back, {user.full_name}
            </h1>
            <p className="text-gray-600 mt-2">Track your impact and manage your donations</p>
          </div>
          <Link to={createPageUrl("CreateDonation")}>
            <Button size="lg" className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 shadow-lg">
              <Plus className="w-6 h-6 mr-3" />
              New Donation
            </Button>
          </Link>
        </div>

        {/* Donor Info Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-gray-200/80 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award className="w-6 h-6 text-blue-600" /> Donor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{donor.name}</p></div></div>
              <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{donor.email}</p></div></div>
              <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{donor.phone_number || 'N/A'}</p></div></div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Badge className="bg-gradient-to-r from-blue-600 to-orange-600 text-white text-base px-4 py-2">Donor ID: {donor.donorId}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Impact Stats */}
        <ImpactStats stats={stats} />

        {/* Recent Donations */}
        <Card className="backdrop-blur-sm bg-white/80 border-gray-200/80 shadow-xl">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDonations && recentDonations.length > 0 ? (
              <div className="space-y-4">
                {recentDonations.map(donation => (
                  <DonationCard key={donation._id} donation={donation} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">You haven't made any donations yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonorDashboard;