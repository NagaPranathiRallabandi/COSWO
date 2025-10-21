
import React from "react";
import base44 from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Button } from "../Components/ui/button";
import { ArrowLeft, MapPin, Calendar, Package, User, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/utils";
import { Skeleton } from "../Components/ui/skeleton";

import ProofGallery from "../Components/donation/ProofGallery";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_transit: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  confirmed: "bg-purple-100 text-purple-800 border-purple-200"
};

export default function DonationDetails() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const donationId = urlParams.get('id');

  const { data: donation, isLoading: donationLoading } = useQuery({
    queryKey: ['donation', donationId],
    queryFn: async () => {
      const donations = await base44.entities.Donation.list();
      return donations.find(d => d.id === donationId);
    },
    enabled: !!donationId
  });

  const { data: receiver, isLoading: receiverLoading } = useQuery({
    queryKey: ['receiver', donation?.receiver_id],
    queryFn: async () => {
      if (!donation?.receiver_id) return null;
      const receivers = await base44.entities.Receiver.list();
      return receivers.find(r => r.id === donation.receiver_id);
    },
    enabled: !!donation?.receiver_id
  });

  const { data: proofs = [] } = useQuery({
    queryKey: ['proofs', donationId],
    queryFn: () => base44.entities.DonationProof.filter({ donation_id: donationId }),
    enabled: !!donationId,
    initialData: []
  });

  if (!donationId) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-gray-500">No donation selected</p>
      </div>
    );
  }

  const isLoading = donationLoading || receiverLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" /> {/* Skeleton for receiver card */}
          <Skeleton className="h-96 w-full" /> {/* Skeleton for proofs gallery */}
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-gray-500">Donation not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("DonorDashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Donation Details
            </h1>
            <p className="text-gray-600 mt-1">Complete donation information and delivery proofs</p>
          </div>
        </div>

        {/* Donation Info */}
        <Card className="backdrop-blur-sm bg-white/90 border-gray-200/80 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">Donation Information</CardTitle>
              <Badge className={`${statusColors[donation.status]} border text-base px-4 py-2`}>
                {donation.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Donor ID</p>
                  <Badge variant="outline" className="text-base px-4 py-2">
                    {donation.donor_id}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Donation Type</p>
                    <p className="font-medium capitalize">{donation.donation_type}</p>
                  </div>
                </div>
                {donation.amount && (
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-3xl font-bold text-blue-600">${donation.amount.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created Date</p>
                    <p className="font-medium">{format(new Date(donation.created_date), "PPP")}</p>
                  </div>
                </div>
                {donation.scheduled_delivery && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Scheduled Delivery</p>
                      <p className="font-medium">{format(new Date(donation.scheduled_delivery), "PPP")}</p>
                    </div>
                  </div>
                )}
                {donation.actual_delivery && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Actual Delivery</p>
                      <p className="font-medium">{format(new Date(donation.actual_delivery), "PPpp")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {donation.items && donation.items.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Donated Items</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {donation.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} • Category: {item.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {donation.delivery_notes && (
              <div>
                <h3 className="font-semibold mb-2">Delivery Notes</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{donation.delivery_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receiver Info */}
        {receiver && (
          <Card className="backdrop-blur-sm bg-white/90 border-gray-200/80 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <User className="w-6 h-6 text-blue-600" />
                Receiver Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-lg">{receiver.full_name}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{receiver.address}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{receiver.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{receiver.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              {receiver.family_size && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Family Size</p>
                  <p className="font-medium">{receiver.family_size} members</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Delivery Proofs */}
        <ProofGallery proofs={proofs} />
      </div>
    </div>
  );
}
