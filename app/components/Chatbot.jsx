"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { X } from "lucide-react"

export function Chatbot({ metrics, postTypes, engagementHistory, onClose }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your Social Media Analytics Assistant. How can I help you analyze data today?"
      }
    ]
  })

  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleAskInsights = () => {
    const insightPrompt = `Based on the following data, provide insights and recommendations:
    Metrics: ${JSON.stringify(metrics)}
    Post Types: ${JSON.stringify(postTypes)}
    Engagement History: ${JSON.stringify(engagementHistory.slice(-5))}`
    
    handleSubmit({ preventDefault: () => {}, target: { elements: { input: { value: insightPrompt } } } })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Analytics Assistant</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
            {messages.map(m => (
              <div key={m.id} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
                <span className={`inline-block p-2 rounded-lg ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.content}
                </span>
              </div>
            ))}
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your social media performance..."
              className="flex-grow"
            />
            <Button type="submit" className='bg-black text-white'>Send</Button>
          </form>
          <Button onClick={handleAskInsights} className="mt-2 bg-black text-white">Get Insights</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Chatbot;

