"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import MetricsOverview from "./MetricsOverview"
import EngagementChart from "./EngagementChart"
import PostTypeBreakdown from "./PostTypeBreakdown"
import EngagementTrend from "./EngagementTrend"
import PostPerformance from "./PostPerformance"
import CSVUploader from "./CSVUploader"
import ContentAnalytics from "./ContentAnalytics"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [metrics, setMetrics] = useState({
    likes: 0, shares: 0, comments: 0, posts: 0, followers: 0, reach: 0
  })
  const [postTypes, setPostTypes] = useState([
    { type: "reel", count: 0 },
    { type: "carousel", count: 0 },
    { type: "post", count: 0 },
  ])
  const [engagementHistory, setEngagementHistory] = useState([])

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      const newMetrics = {
        likes: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 30),
        posts: Math.floor(Math.random() * 5),
        followers: Math.floor(Math.random() * 1000),
        reach: Math.floor(Math.random() * 500),
      }
      setMetrics(newMetrics)
      setEngagementHistory(prev => [...prev, newMetrics].slice(-30))

      setPostTypes(prev =>
        prev.map(pt => ({
          ...pt,
          count: pt.count + (Math.random() > 0.7 ? 1 : 0)
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <MetricsOverview metrics={metrics} />
          <div className='flex flex-col gap-5'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <EngagementChart metrics={metrics} />
              <PostTypeBreakdown postTypes={postTypes} />
            </div>
            <EngagementTrend engagementHistory={engagementHistory} />
            <PostPerformance postTypes={postTypes} />
          </div>
          </>
        )
      case "csvUpload":
        return <CSVUploader />
      case "contentAnalytics":
        return <ContentAnalytics />
      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        metrics={metrics}
        postTypes={postTypes}
        engagementHistory={engagementHistory}
      />
      <div className="flex-1 overflow-auto bg-white p-6 space-y-6 rounded-l-xl shadow-xl">
        {/* <h1 className="text-4xl font-bold text-gray-800">Socialytics</h1> */}
        <div className="transition-all duration-300">{renderContent()}</div>
      </div>
    </div>
  )
}

export default Dashboard;
