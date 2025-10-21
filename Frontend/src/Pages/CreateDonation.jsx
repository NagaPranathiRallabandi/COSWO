import React, { useState, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { Label } from "../Components/ui/label";
import { Textarea } from "../Components/ui/textarea";
import { Select, SelectItem } from "../Components/ui/select";
import { Plus, Trash2, Gift, Loader2 } from "lucide-react";

export default function CreateDonation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    receiver_id: "",
    donation_type: "food",
    amount: "",
    items: [{ name: "", quantity: 1, category: "food" }],
    delivery_notes: "",
    scheduled_delivery: ""
  });
  
  // NEW: Fetch verified receivers from your backend
  const { data: verifiedReceivers = [] } = useQuery({
    queryKey: ['verifiedReceivers'],
    queryFn: async () => {
        const { data } = await apiClient.get('/receivers/verified');
        return data;
    },
  });

  // NEW: Use a mutation that calls your local backend
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const createDonationMutation = useMutation({
    mutationFn: (donationData) => apiClient.post('/donations', donationData),
    onMutate: () => {
      setFeedback({ type: 'info', message: 'Submitting donation…' });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['donorDashboard'] });
      setFeedback({ type: 'success', message: 'Donation created successfully!' });
      try { alert('Donation created successfully!'); } catch (_) {}
      setTimeout(() => {
        setFeedback({ type: '', message: '' });
        navigate(createPageUrl("DonorDashboard"), {
          state: { flash: { type: 'success', message: 'Donation created successfully!' } },
          replace: true
        });
      }, 800);
    },
    onError: (error) => {
      let msg = 'Could not create donation.';
      if (error.response?.data?.msg) msg = error.response.data.msg;
      else if (error.response?.data?.error) msg = error.response.data.error;
      setFeedback({ type: 'error', message: `Error: ${msg}` });
    }
  });

  const handleAddItem = () => setFormData(prev => ({ ...prev, items: [...prev.items, { name: "", quantity: 1, category: "food" }] }));
  const handleRemoveItem = (index) => setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  const handleItemChange = (index, field, value) => {
    const newItems = formData.items.map((item, i) => i === index ? { ...item, [field]: value } : item);
    setFormData(prev => ({...prev, items: newItems}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[CreateDonation] Submit clicked', { user, formData });
    // Fallback immediate UX feedback
    setFeedback({ type: 'info', message: 'Submitting donation…' });
    if (!user) {
      setFeedback({ type: 'error', message: 'You must be logged in to donate.' });
      return;
    }
    if (!formData.receiver_id) {
      setFeedback({ type: 'error', message: 'Please select a receiver.' });
      return;
    }
    const finalData = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : null,
      items: formData.donation_type !== "funds" ? formData.items.filter(item => item.name) : [],
    };
    console.log('[CreateDonation] Mutating with payload', finalData);
    createDonationMutation.mutate(finalData);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/80 border-gray-200/80 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <Gift className="w-8 h-8 text-blue-600" />
              Create a New Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedback.message && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{feedback.message}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* ...existing code... */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="receiver">Select Receiver</Label>
                  <Select
                    id="receiver"
                    onChange={e => setFormData(prev => ({ ...prev, receiver_id: e.target.value }))}
                    value={formData.receiver_id}
                    placeholder="Choose a verified receiver..."
                  >
                    {verifiedReceivers.map(r => (
                      <SelectItem key={r._id} value={r._id}>{r.full_name} - {r.address}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donation_type">Donation Type</Label>
                  <Select
                    id="donation_type"
                    onChange={e => setFormData(prev => ({ ...prev, donation_type: e.target.value }))}
                    value={formData.donation_type}
                    placeholder="Select a donation type"
                  >
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="funds">Funds</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </Select>
                </div>
              </div>
              {/* ...existing code... */}
              {formData.donation_type === 'funds' ? (
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 50.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Items to Donate</Label>
                    <Button type="button" variant="outline" onClick={handleAddItem}>
                      <Plus className="w-4 h-4 mr-2" /> Add Item
                    </Button>
                  </div>
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg border">
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        <div className="space-y-2">
                          <Label htmlFor={`item-name-${index}`} className="text-sm">Item Name</Label>
                          <Input id={`item-name-${index}`} value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} placeholder="e.g., Rice Bag" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-quantity-${index}`} className="text-sm">Quantity</Label>
                          <Input id={`item-quantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-category-${index}`} className="text-sm">Category</Label>
                          <Input id={`item-category-${index}`} value={item.category} onChange={(e) => handleItemChange(index, 'category', e.target.value)} />
                        </div>
                      </div>
                      <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {/* ...existing code... */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_delivery">Scheduled Delivery Date</Label>
                  <Input
                    id="scheduled_delivery"
                    type="date"
                    value={formData.scheduled_delivery}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_delivery: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_notes">Delivery Notes</Label>
                  <Textarea
                    id="delivery_notes"
                    placeholder="Any special instructions for delivery..."
                    value={formData.delivery_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_notes: e.target.value }))}
                  />
                </div>
              </div>
              {/* ...existing code... */}
              <div className="flex justify-end">
                <Button type="submit" size="lg" className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 shadow-lg" disabled={createDonationMutation.isLoading} onClick={() => console.log('[CreateDonation] Submit button clicked')}>
                  {createDonationMutation.isLoading ? (
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  ) : (
                    <Gift className="w-6 h-6 mr-3" />
                  )}
                  Create Donation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}