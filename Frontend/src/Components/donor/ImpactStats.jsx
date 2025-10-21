import React from "react";
import { Card } from "../ui/card";
import { TrendingUp, Heart, Users, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function ImpactStats({ stats }) {
  const statCards = [
    {
      label: "Total Donations",
      value: stats.totalDonations || 0,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Amount Donated",
      value: `$${(stats.totalAmount || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "People Helped",
      value: stats.peopleHelped || 0,
      icon: Users,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      label: "Confirmed Deliveries",
      value: stats.confirmedDeliveries || 0,
      icon: Heart,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`${stat.bgColor} border-none shadow-lg overflow-hidden relative`}>
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
        </motion.div>
      ))}
    </div>
  );
}