import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsersByRole } from "../api/adminApi";
import { Card } from "../Components/ui/card";
import { Input } from "../Components/ui/input";

export default function BatchStaffList() {
  const { data: staff, isLoading, isError } = useQuery({
    queryKey: ["batch-staff-list"],
    queryFn: () => getUsersByRole("Batch staff"),
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filteredStaff = useMemo(() => {
    if (!staff) return [];
    return staff.filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.phone_number || "").toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter ? s.name.toLowerCase().startsWith(filter.toLowerCase()) : true;
      return matchesSearch && matchesFilter;
    });
  }, [staff, search, filter]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load batch staff.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Batch Staff List</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:w-1/2"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm sm:w-1/4"
        >
          <option value="">All</option>
          {Array.from(new Set((staff || []).map(s => s.name[0]?.toUpperCase()))).sort().map(letter => (
            <option key={letter} value={letter}>{letter}</option>
          ))}
        </select>
      </div>
      <Card className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-4 text-gray-500">No batch staff found.</td></tr>
            ) : filteredStaff.map(staff => (
              <tr key={staff._id} className="border-b">
                <td className="px-4 py-2">{staff.name}</td>
                <td className="px-4 py-2">{staff.email}</td>
                <td className="px-4 py-2">{staff.phone_number || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
