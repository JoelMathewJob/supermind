"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function EngagementTrend({ engagementHistory }) {
  const data = engagementHistory.map((metrics, index) => ({
    name: index.toString(),
    likes: metrics.likes,
    shares: metrics.shares,
    comments: metrics.comments,
    reach: metrics.reach,
  }))

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Engagement Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="likes" stroke="#8884d8" />
            <Line type="monotone" dataKey="shares" stroke="#82ca9d" />
            <Line type="monotone" dataKey="comments" stroke="#ffc658" />
            <Line type="monotone" dataKey="reach" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
