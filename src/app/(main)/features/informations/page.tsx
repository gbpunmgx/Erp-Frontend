"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Bell,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Download,
  Filter,
  MessageSquare,
  Plus,
  Search,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const statsCards = [
    {
      title: "Total Users",
      value: "2,420",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: "+12%",
      changeColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: "1,210",
      icon: ShoppingCart,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      change: "+8%",
      changeColor: "text-green-600",
    },
    {
      title: "Revenue",
      value: "$15,300",
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
      change: "+15%",
      changeColor: "text-green-600",
    },
    {
      title: "Growth",
      value: "25%",
      icon: TrendingUp,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      change: "+5%",
      changeColor: "text-green-600",
    },
    {
      title: "Avg Rating",
      value: "4.8",
      icon: Star,
      color: "text-orange-600",
      bg: "bg-orange-50",
      change: "+0.2",
      changeColor: "text-green-600",
    },
  ];

  const monthlyData = [
    { name: "Jan", revenue: 4000, orders: 240, users: 150 },
    { name: "Feb", revenue: 3000, orders: 139, users: 120 },
    { name: "Mar", revenue: 2000, orders: 980, users: 200 },
    { name: "Apr", revenue: 2780, orders: 390, users: 180 },
    { name: "May", revenue: 1890, orders: 480, users: 220 },
    { name: "Jun", revenue: 2390, orders: 380, users: 190 },
    { name: "Jul", revenue: 3490, orders: 430, users: 250 },
    { name: "Aug", revenue: 3000, orders: 400, users: 210 },
    { name: "Sep", revenue: 3500, orders: 450, users: 230 },
    { name: "Oct", revenue: 4000, orders: 500, users: 280 },
    { name: "Nov", revenue: 4200, orders: 520, users: 290 },
    { name: "Dec", revenue: 4500, orders: 550, users: 310 },
  ];

  const topProducts = [
    {
      name: "Wireless Headphones",
      category: "Electronics",
      price: "$299",
      sales: 1234,
      revenue: "$370,266",
      trend: "+12%",
      image: "🎧",
    },
    {
      name: "Smart Watch",
      category: "Wearables",
      price: "$199",
      sales: 987,
      revenue: "$196,413",
      trend: "+8%",
      image: "⌚",
    },
    {
      name: "Laptop Stand",
      category: "Accessories",
      price: "$49",
      sales: 756,
      revenue: "$37,044",
      trend: "+15%",
      image: "💻",
    },
    { name: "USB-C Cable", category: "Cables", price: "$15", sales: 654, revenue: "$9,810", trend: "+5%", image: "🔌" },
    { name: "Desk Lamp", category: "Office", price: "$89", sales: 543, revenue: "$48,327", trend: "+3%", image: "💡" },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      product: "Wireless Headphones",
      amount: "$299",
      status: "Completed",
      date: "2024-01-15",
      avatar: "👨",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      product: "Smart Watch",
      amount: "$199",
      status: "Processing",
      date: "2024-01-15",
      avatar: "👩",
    },
    {
      id: "#ORD-003",
      customer: "Bob Johnson",
      email: "bob@example.com",
      product: "Laptop Stand",
      amount: "$49",
      status: "Pending",
      date: "2024-01-14",
      avatar: "👨‍🦲",
    },
    {
      id: "#ORD-004",
      customer: "Alice Brown",
      email: "alice@example.com",
      product: "USB Cable",
      amount: "$15",
      status: "Completed",
      date: "2024-01-14",
      avatar: "👱‍♀️",
    },
    {
      id: "#ORD-005",
      customer: "Charlie Wilson",
      email: "charlie@example.com",
      product: "Desk Lamp",
      amount: "$89",
      status: "Shipped",
      date: "2024-01-13",
      avatar: "👨‍🦱",
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Connor",
      role: "Product Manager",
      email: "sarah@company.com",
      status: "online",
      avatar: "👩‍💼",
      tasks: 12,
      completed: 8,
    },
    {
      name: "John Matrix",
      role: "Senior Developer",
      email: "john@company.com",
      status: "away",
      avatar: "👨‍💻",
      tasks: 8,
      completed: 6,
    },
    {
      name: "Jane Foster",
      role: "UI/UX Designer",
      email: "jane@company.com",
      status: "online",
      avatar: "👩‍🎨",
      tasks: 15,
      completed: 12,
    },
    {
      name: "Mike Ross",
      role: "Data Analyst",
      email: "mike@company.com",
      status: "offline",
      avatar: "👨‍📊",
      tasks: 10,
      completed: 7,
    },
    {
      name: "Emily Davis",
      role: "Marketing Lead",
      email: "emily@company.com",
      status: "online",
      avatar: "👩‍📈",
      tasks: 14,
      completed: 11,
    },
  ];

  const activities = [
    { user: "John Doe", action: "placed an order", item: "Wireless Headphones", time: "5 minutes ago", type: "order" },
    { user: "Sarah Connor", action: "completed task", item: "Product Review", time: "10 minutes ago", type: "task" },
    {
      user: "Jane Smith",
      action: "left a review",
      item: "5 stars for Smart Watch",
      time: "15 minutes ago",
      type: "review",
    },
    { user: "Mike Ross", action: "updated report", item: "Monthly Analytics", time: "30 minutes ago", type: "update" },
    {
      user: "Emily Davis",
      action: "created campaign",
      item: "Summer Sale 2024",
      time: "45 minutes ago",
      type: "campaign",
    },
  ];

  const projects = [
    {
      name: "E-commerce Redesign",
      progress: 75,
      team: 5,
      deadline: "2024-02-15",
      status: "In Progress",
      priority: "High",
    },
    {
      name: "Mobile App Development",
      progress: 40,
      team: 3,
      deadline: "2024-03-01",
      status: "In Progress",
      priority: "Medium",
    },
    { name: "Dashboard Analytics", progress: 90, team: 2, deadline: "2024-01-30", status: "Review", priority: "High" },
    {
      name: "Customer Support Portal",
      progress: 25,
      team: 4,
      deadline: "2024-04-01",
      status: "Planning",
      priority: "Low",
    },
  ];

  const pieData = [
    { name: "Desktop", value: 45, color: "#3b82f6" },
    { name: "Mobile", value: 35, color: "#10b981" },
    { name: "Tablet", value: 20, color: "#f59e0b" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              <p>Welcome back, here&apos;s what&apos;s happening with your business today.</p>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input placeholder="Search everything..." className="w-64 border-gray-200 bg-gray-50 pl-10" />
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            </div>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs"></span>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Avatar className="h-10 w-10 ring-2 ring-blue-100">
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="space-y-8 p-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className={`${stat.changeColor} border-green-200 bg-green-50`}>
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Revenue Chart - Larger */}
          <Card className="border-0 shadow-md lg:col-span-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Revenue Analytics</CardTitle>
                <p className="mt-1 text-sm text-gray-600">Monthly performance overview</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Sources & Calendar */}
          <div className="space-y-6 lg:col-span-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <p className="text-sm text-gray-600">User acquisition channels</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex justify-center">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="mb-2 text-sm text-gray-600">Today: {date?.toLocaleDateString()}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded bg-white p-2 text-sm">
                      <span>Team Meeting</span>
                      <span className="text-gray-500">10:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-white p-2 text-sm">
                      <span>Project Review</span>
                      <span className="text-gray-500">2:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-white p-2 text-sm">
                      <span>Client Call</span>
                      <span className="text-gray-500">4:30 PM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <p className="mt-1 text-sm text-gray-600">Latest customer transactions</p>
              </div>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="transition-colors hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="mr-3 text-2xl">{order.avatar}</div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                              <p className="text-xs text-gray-500">{order.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{order.product}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Products</CardTitle>
                <p className="mt-1 text-sm text-gray-600">Best performing items</p>
              </div>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50/50 p-4 transition-colors hover:bg-gray-100/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{product.image}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.category} • {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                    <Badge variant="secondary" className="bg-green-50 text-green-600">
                      {product.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Team Members */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <p className="text-sm text-gray-600">Active team overview</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="text-2xl">{member.avatar}</div>
                      <div
                        className={`absolute -right-0 -bottom-0 h-3 w-3 rounded-full border-2 border-white ${
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {member.completed}/{member.tasks} tasks
                    </p>
                    <Progress value={(member.completed / member.tasks) * 100} className="mt-1 h-1 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-gray-600">Latest system events</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`rounded-full p-2 ${
                      activity.type === "order"
                        ? "bg-blue-100"
                        : activity.type === "task"
                          ? "bg-green-100"
                          : activity.type === "review"
                            ? "bg-yellow-100"
                            : activity.type === "update"
                              ? "bg-purple-100"
                              : "bg-orange-100"
                    }`}
                  >
                    {activity.type === "order" && <ShoppingCart className="h-3 w-3 text-blue-600" />}
                    {activity.type === "task" && <Clock className="h-3 w-3 text-green-600" />}
                    {activity.type === "review" && <Star className="h-3 w-3 text-yellow-600" />}
                    {activity.type === "update" && <TrendingUp className="h-3 w-3 text-purple-600" />}
                    {activity.type === "campaign" && <MessageSquare className="h-3 w-3 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-600">{activity.item}</p>
                    <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Projects Overview */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <p className="text-sm text-gray-600">Current project status</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 p-4 transition-colors hover:border-gray-200"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{project.name}</p>
                    <Badge
                      variant={
                        project.priority === "High"
                          ? "destructive"
                          : project.priority === "Medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {project.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{project.team} team members</span>
                      <span>Due {project.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
