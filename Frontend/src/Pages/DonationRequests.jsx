import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { format } from "date-fns";
import { Loader2, ThumbsUp, ThumbsDown, Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";

// API function to get all donations for the admin view
const getAllDonations = async () => {
    const { data } = await apiClient.get("/admin/donations");
    return data;
};

// Re-usable approve/reject mutations
const approveDonation = async (donationId) => {
    const { data } = await apiClient.post(`/admin/donations/${donationId}/approve`);
    return data;
};

const rejectDonation = async (donationId) => {
    const { data } = await apiClient.post(`/admin/donations/${donationId}/reject`);
    return data;
};

const DonationCard = ({ donation }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending_approval':
                return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'rejected':
                return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="success"><Check className="w-3 h-3 mr-1" />Accepted</Badge>;
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50/50">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold">{donation.donor.name}</h4>
                    <p className="text-sm text-gray-500">{donation.donor.email}</p>
                </div>
                {getStatusBadge(donation.status)}
            </div>
            <div className="mt-2">
                <p><strong>Type:</strong> {donation.donation_type}</p>
                {donation.amount > 0 && <p><strong>Amount:</strong> ${donation.amount}</p>}
                {donation.items?.length > 0 && <p><strong>Items:</strong> {donation.items.map(i => i.name).join(', ')}</p>}
            </div>
            <p className="text-xs text-gray-400 mt-2">
                Submitted: {format(new Date(donation.createdAt), 'PPp')}
            </p>
            {donation.donationId && (
                 <p className="text-xs font-mono text-blue-600 mt-1">ID: {donation.donationId}</p>
            )}
        </div>
    );
};

const RequestCategory = ({ title, donations, onApprove, onReject, isLoadingMutations }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {donations.length > 0 ? (
                donations.map(donation => (
                    <div key={donation._id}>
                        <DonationCard donation={donation} />
                        {title === 'Pending Approval' && (
                            <div className="flex justify-end space-x-2 mt-2">
                                <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => onApprove(donation._id)} disabled={isLoadingMutations}>
                                    <ThumbsUp className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => onReject(donation._id)} disabled={isLoadingMutations}>
                                    <ThumbsDown className="w-4 h-4 mr-1" /> Reject
                                </Button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center py-4">No requests in this category.</p>
            )}
        </CardContent>
    </Card>
);


export default function DonationRequests() {
    const queryClient = useQueryClient();

    const { data: donations, isLoading, isError } = useQuery({
        queryKey: ["allDonations"],
        queryFn: getAllDonations,
    });

    const approveMutation = useMutation({
        mutationFn: approveDonation,
        onSuccess: () => queryClient.invalidateQueries(["allDonations"]),
    });

    const rejectMutation = useMutation({
        mutationFn: rejectDonation,
        onSuccess: () => queryClient.invalidateQueries(["allDonations"]),
    });

    if (isLoading) {
        return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (isError) {
        return <div className="p-6 text-red-500">Failed to load donation requests.</div>;
    }

    const pending = donations?.filter(d => d.status === 'pending_approval') || [];
    const accepted = donations?.filter(d => d.status !== 'pending_approval' && d.status !== 'rejected') || [];
    const rejected = donations?.filter(d => d.status === 'rejected') || [];

    const isLoadingMutations = approveMutation.isPending || rejectMutation.isPending;

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Donation Requests</h1>
                <div className="grid lg:grid-cols-3 gap-6">
                    <RequestCategory 
                        title="Pending Approval" 
                        donations={pending} 
                        onApprove={approveMutation.mutate}
                        onReject={rejectMutation.mutate}
                        isLoadingMutations={isLoadingMutations}
                    />
                    <RequestCategory title="Accepted" donations={accepted} />
                    <RequestCategory title="Rejected" donations={rejected} />
                </div>
            </div>
        </div>
    );
}
