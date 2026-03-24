"use client";

import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export function AnalyticsDashboardClient({ tickets }: { tickets: any[] }) {
  
  // Aggregate data by category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach(t => {
      const cat = t.category.name;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    })).sort((a, b) => b.value - a.value);
  }, [tickets]);

  // Aggregate data by priority
  const priorityData = useMemo(() => {
    const counts: Record<string, number> = { 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0 };
    tickets.forEach(t => {
      counts[t.priority] = (counts[t.priority] || 0) + 1;
    });
    return [
      { name: 'High', value: counts['HIGH'] },
      { name: 'Medium', value: counts['MEDIUM'] },
      { name: 'Low', value: counts['LOW'] }
    ];
  }, [tickets]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];
  const PRIORITY_COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

  if (tickets.length === 0) {
    return <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Not enough data to generate analytics.</div>;
  }

  return (
    <div className="responsive-grid-analytics">
      
      <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Complaints by Category</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-light)" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{ fill: 'var(--text-secondary)', fontSize: '0.85rem' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
              />
              <Bar dataKey="value" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} barSize={30}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Priority Distribution</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
