"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function ContentAnalytics() {
  const [contentType, setContentType] = useState("reel")  // Removed the TypeScript-like type annotation
  const [contentUrl, setContentUrl] = useState("")

  const handleAnalyze = () => {
    // Here you would typically send the contentType and contentUrl to your analytics service
    console.log("Analyzing:", contentType, contentUrl)
    // Reset the form
    setContentUrl("")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Content Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={contentType}
            onValueChange={(value) => {
              if (["reel", "post", "carousel"].includes(value)) {
                setContentType(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reel">Reel</SelectItem>
              <SelectItem value="post">Post</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter content URL"
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
          />
          <Button onClick={handleAnalyze} disabled={!contentUrl} className="w-full">
            Analyze Content
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
