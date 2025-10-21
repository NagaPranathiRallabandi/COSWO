import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, MapPin, Package, Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils/utils";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_transit: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  confirmed: "bg-purple-100 text-purple-800 border-purple-200"
};

export default function DonationCard({ donation, receiver, proofCount }) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/90 border-gray-200/80">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{receiver?.full_name || "Unknown Receiver"}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {receiver?.address || "Address not available"}
            </p>
          </div>
          <Badge className={`${statusColors[donation.status]} border`}>
            {donation.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            {donation.donation_type}
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            {format(new Date(donation.created_date), "MMM d, yyyy")}
          </span>
        </div>

        {donation.amount && (
          <div className="text-2xl font-bold text-blue-600">
            ${donation.amount.toFixed(2)}
          </div>
        )}

        {donation.items && donation.items.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Items:</p>
            {donation.items.slice(0, 2).map((item, idx) => (
              <p key={idx} className="text-sm">
                {item.quantity}x {item.name}
              </p>
            ))}
            {donation.items.length > 2 && (
              <p className="text-xs text-gray-500">+{donation.items.length - 2} more items</p>
            )}
          </div>
        )}

        {proofCount > 0 && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {proofCount} Proof{proofCount > 1 ? 's' : ''} Available
          </Badge>
        )}

        <Link to={createPageUrl(`DonationDetails?id=${donation.id}`)}>
          <Button variant="outline" className="w-full mt-2 group">
            <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}