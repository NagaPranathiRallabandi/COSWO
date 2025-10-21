import React, { useContext, useEffect } from "react";
import { Link, useLocation, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { createPageUrl } from "./utils/utils";
import { Heart, Gift, Users, Upload, LayoutDashboard } from "lucide-react";
import { Sidebar } from "./Components/ui/sidebar";
import HomePage from "./Pages/home";
import AdminDashboard from "./Pages/AdminDashboard";
import DonorDashboard from "./Pages/DonorDashboard";
import BatchStaffDashboard from "./Pages/BatchStaffDashboard";
import DonorsList from "./Pages/DonorsList";
import BatchStaffList from "./Pages/BatchStaffList";
import CreateDonation from "./Pages/CreateDonation";
import RegisterReceiver from "./Pages/RegisterReceiver";
import UploadProof from "./Pages/UploadProof";
import DonationDetails from "./Pages/DonationDetails";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { AuthContext } from "./context/authContext";

import { Button } from "./Components/ui/button";


const donorNavigationItems = [
  { title: "Donor Dashboard", url: createPageUrl("donordashboard"), icon: LayoutDashboard, component: DonorDashboard },
  { title: "Create Donation", url: createPageUrl("createdonation"), icon: Gift, component: CreateDonation },
];

const batchStaffNavigationItems = [
  { title: "Batch Staff Dashboard", url: createPageUrl("batch-staff-dashboard"), icon: LayoutDashboard, component: BatchStaffDashboard },
  { title: "Register Receiver", url: createPageUrl("registerreceiver"), icon: Users, component: RegisterReceiver },
  { title: "Upload Proof", url: createPageUrl("uploadproof"), icon: Upload, component: UploadProof },
];

const adminNavigationItems = [
  { title: "Admin Dashboard", url: createPageUrl("admin-dashboard"), icon: LayoutDashboard, component: AdminDashboard },
  { title: "Donors List", url: createPageUrl("donorslist"), icon: Users, component: DonorsList },
  { title: "Batch Staff List", url: createPageUrl("batchstafflist"), icon: Users, component: BatchStaffList },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const authPages = ['/login', '/signup'];
    if (user && authPages.includes(location.pathname)) {
      const role = user.role;
      if (role === 'Administrator') {
        navigate('/admin-dashboard');
      } else if (role === 'Batch staff') {
        navigate('/batch-staff-dashboard');
      } else {
        navigate('/donordashboard');
      }
    }
  }, [user, navigate, location.pathname]);

  // Determine if the sidebar should be shown based on the current route
  const noSidebarRoutes = ["/home", "/", "/login", "/signup"];
  const showSidebar = user && !noSidebarRoutes.includes(location.pathname);

  // Determine which navigation items to show based on user role
  let sidebarItems = [];
  if (user) {
    if (user.role === 'Administrator') {
      sidebarItems = adminNavigationItems;
    } else if (user.role === 'Batch staff') {
      sidebarItems = batchStaffNavigationItems;
    } else if (user.role === 'Donor') {
      sidebarItems = donorNavigationItems;
    }
  }

  return (
    <div className={`min-h-screen w-full ${showSidebar ? 'flex' : ''}`}>
      <div className={`${!showSidebar ? 'bg-gradient-to-br from-blue-50 via-white to-orange-50' : ''} absolute inset-0 -z-10`} />
      {showSidebar ? (
        <Sidebar className="border-r border-gray-200/80 backdrop-blur-sm bg-white/70 flex flex-col h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                  COSWO
                </h2>
                <p className="text-xs text-gray-500">Transparent Giving</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </p>
              <div>
                <div>
                  {sidebarItems.map((item) => (
                    <div key={item.title}>
                      <Link to={item.url} className={`mb-1 transition-all duration-200 rounded-xl flex items-center gap-3 px-4 py-3 ${
                          (location.pathname === item.url || (location.pathname === '/' && item.url === '/home'))
                            ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-md' 
                            : 'hover:bg-gray-100'
                        }`}>
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200/80">
              <Button
                variant="outline"
                className="w-full font-semibold text-red-600 hover:bg-red-50"
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    logout();
                    navigate('/home');
                  }
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </Sidebar>
      ) : (
        <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/80">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to={createPageUrl("home")} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                            COSWO
                        </h2>
                        <p className="text-xs text-gray-500">Transparent Giving</p>
                    </div>
                </Link>
                {(location.pathname === "/" || location.pathname === "/home") && (
                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <Button variant="outline" className="font-semibold px-4 py-2 text-md">Login</Button>
                    </Link>
                    <Link to="/signup">
                        <Button className="font-semibold bg-gradient-to-r from-blue-600 to-orange-600 text-white px-4 py-2 text-md">Sign Up</Button>
                    </Link>
                </div>
                )}
            </div>
        </header>
      )}

      <main className="flex-1 flex flex-col relative">
        <div className={`flex-1 overflow-auto ${!showSidebar ? '' : 'p-6'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/donordashboard" element={user ? <DonorDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/admin-dashboard" element={user && user.role === 'Administrator' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/donorslist" element={user && user.role === 'Administrator' ? <DonorsList /> : <Navigate to="/login" replace />} />
            <Route path="/batchstafflist" element={user && user.role === 'Administrator' ? <BatchStaffList /> : <Navigate to="/login" replace />} />
            <Route path="/batch-staff-dashboard" element={user && user.role === 'Batch staff' ? <BatchStaffDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            {/* Remove navigationItems.map, use sidebarItems.map instead */}
            {sidebarItems.map(item => (
              <Route key={item.url} path={item.url} element={user ? <item.component /> : <Navigate to="/login" replace />} />
            ))}
            <Route path="/donations/:id" element={user ? <DonationDetails /> : <Navigate to="/login" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
