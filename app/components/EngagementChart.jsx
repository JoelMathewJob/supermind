"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["red", "#00C49F", "#FFBB28"]

export default function EngagementChart({ metrics }) {
  const data = [
    { name: "Likes", value: metrics.likes },
    { name: "Shares", value: metrics.shares },
    { name: "Comments", value: metrics.comments },
  ]

  return (
    <Card className="h-[400px] bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className='text-white'>Engagement Breakdown</CardTitle>
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
            <Legend  />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
