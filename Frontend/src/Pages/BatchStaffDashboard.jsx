
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBatchStats } from "../api/batchStaffApi";
import { Card } from "../Components/ui/card";
import { TrendingUp, CheckCircle, Loader2, Package } from "lucide-react";

export default function BatchStaffDashboard() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["batch-staff-stats"],
    queryFn: getBatchStats,
  });

  const statCards = [
    {
      label: "Batches Assigned This Month",
      value: stats?.assignedThisMonth ?? 0,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Batches Successfully Delivered",
      value: stats?.delivered ?? 0,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Ongoing Batches",
      value: stats?.ongoing ?? 0,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Batch Staff Dashboard</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center">Failed to load stats.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className={`${stat.bgColor} border-none shadow-lg overflow-hidden relative`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-12 -translate-y-12`} />
              <div className="p-5 relative">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className={`p-2 rounded-full bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
