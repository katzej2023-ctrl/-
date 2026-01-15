import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartDataPoint } from '../types';

interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
}

export const Chart: React.FC<ChartProps> = ({ data, title }) => {
  const colors = ['#245499', '#D03025', '#F3C50F', '#1A1A1A'];

  return (
    <div className="w-full h-80 border-2 border-bauhaus-black p-4 bg-white my-4">
      {title && <h3 className="text-center font-bold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
          <XAxis type="number" stroke="#1A1A1A" tick={{fill: '#1A1A1A', fontSize: 12}} />
          <YAxis dataKey="name" type="category" stroke="#1A1A1A" tick={{fill: '#1A1A1A', fontSize: 12}} width={80} />
          <Tooltip 
            cursor={{fill: '#f5f5f5'}} 
            contentStyle={{ border: '2px solid #1A1A1A', borderRadius: '0', boxShadow: '4px 4px 0px 0px #1A1A1A' }}
          />
          <Bar dataKey="value" fill="#245499" barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="#1A1A1A" strokeWidth={2} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};