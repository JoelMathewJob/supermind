"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { LayoutDashboard, UploadCloud, BarChart2, Settings, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Chatbot from "./Chatbot"

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, id: "overview" },
  { name: "CSV Upload", icon: UploadCloud, id: "csvUpload" },
  { name: "Content Analytics", icon: BarChart2, id: "contentAnalytics" },
  // { name: "Settings", icon: Settings, id: "settings" },
]

export default function Sidebar({ activeTab, setActiveTab, metrics, postTypes, engagementHistory }) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col">
      <div className="flex items-center justify-center h-16 border-b">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">Socialytics</h2>

      </div>
      <ScrollArea className="flex-grow">
        <nav className="space-y-2 p-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id ? "bg-gray-200" : ""
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-5 w-5 mr-2" />
              <span>{item.name}</span>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-2">
        <Button 
          onClick={() => setIsChatOpen(true)}
          className="w-full bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
        >
          <MessageCircle className="mr-2 h-4 w-4" /> Open AI Assistant
        </Button>
      </div>
      {isChatOpen && (
        <Chatbot 
          metrics={metrics} 
          postTypes={postTypes} 
          engagementHistory={engagementHistory} 
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  )
}

