"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]

export default function PostTypeBreakdown({ postTypes }) {
  const data = postTypes.map(pt => ({ name: pt.type, value: pt.count }))

  return (
    <Card className="h-[400px] bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className='text-white'>Post Type Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
