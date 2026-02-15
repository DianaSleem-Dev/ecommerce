
import React, { useState, useEffect } from 'react';
import { useApp } from '../App.jsx';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Clock, Package, Users, Sparkles, ChevronRight } from 'lucide-react';
import { SALES_DATA } from '../constants.js';

const AdminDashboard = () => {
  const { products, orders } = useApp();
  const [growthTips, setGrowthTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(false);



  const stats = [
    { label: 'Revenue', value: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: DollarSign, color: 'text-success', bg: 'bg-success-subtle' },
    { label: 'Active Orders', value: orders.filter(o => o.status === 'Pending').length, icon: Clock, color: 'text-warning', bg: 'bg-warning-subtle' },
    { label: 'Products', value: products.length, icon: Package, color: 'text-indigo', bg: 'bg-indigo-light' },
    { label: 'Customers', value: 1420, icon: Users, color: 'text-primary', bg: 'bg-primary-subtle' },
  ];

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
        <div>
          <h1 className="display-5 fw-bold">Admin Dashboard</h1>
          <p className="text-muted">Overview of your store performance</p>
        </div>
        <Link to="/admin/products" className="btn btn-indigo px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2 text-decoration-none">
           Manage Inventory <ChevronRight size={18} />
        </Link>
      </div>

      <div className="row g-4 mb-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-3">
            <div className="card p-4 shadow-sm border-0 d-flex flex-row align-items-center gap-3 h-100">
              <div className={`p-3 rounded-4 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="small text-muted fw-medium mb-0">{stat.label}</p>
                <p className="h4 fw-bold mb-0">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-5">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <h5 className="fw-bold mb-4">Revenue Overview</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_DATA}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card border-0 shadow-sm p-4 rounded-4">
            <h5 className="fw-bold mb-4">Recent Orders</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase tracking-wider">
                    <th className="border-0 px-3 py-3">ID</th>
                    <th className="border-0 px-3 py-3">Customer</th>
                    <th className="border-0 px-3 py-3">Status</th>
                    <th className="border-0 px-3 py-3 text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="px-3 py-3 fw-bold text-indigo">{order.id}</td>
                      <td className="px-3 py-3">{order.customerName}</td>
                      <td className="px-3 py-3">
                        <span className={`badge rounded-pill ${
                          order.status === 'Delivered' ? 'bg-success' : 'bg-warning'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-end fw-bold">${order.total}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  
      </div>
    </div>
  );
};

export default AdminDashboard;
