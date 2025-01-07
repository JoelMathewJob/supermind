"use client"

import React, { useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { UploadCloud, CheckCircle, XCircle, TrendingUp, BarChartIcon, PieChartIcon, CalendarIcon, HashIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from "recharts"
// import { TagCloud } from 'react-tagcloud'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function EnhancedCSVAnalyzer() {
    const [file, setFile] = useState(null)
    const [data, setData] = useState([])
    const [showAllRows, setShowAllRows] = useState(false)
    const [rowsToShow, setRowsToShow] = useState(5)
    const [uploadStatus, setUploadStatus] = useState("idle")
    const fileInputRef = useRef(null)

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setFile(event.target.files[0])
            setUploadStatus("idle")
        }
    }

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target.result
                const rows = text.split("\n")
                const parsedData = rows.slice(1).map(row => {
                    const [date, type, likes, comments, shares] = row.split(",")
                    return {
                        date: new Date(date),
                        type,
                        likes: parseInt(likes),
                        comments: parseInt(comments),
                        shares: parseInt(shares)
                    }
                })
                setData(parsedData)
                setUploadStatus("success")
            }
            reader.onerror = () => {
                setUploadStatus("error")
            }
            reader.readAsText(file)
            setFile(null)
        }
    }

    const handleShowMore = () => {
        setRowsToShow(data.length)
        setShowAllRows(true)
    }

    const handleShowLess = () => {
        setRowsToShow(5)
        setShowAllRows(false)
    }

    const resetUpload = () => {
        setUploadStatus("idle")
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const memoizedAnalytics = useMemo(() => {
        if (data.length === 0) return null

        const totalLikes = data.reduce((acc, row) => acc + row.likes, 0)
        const totalComments = data.reduce((acc, row) => acc + row.comments, 0)
        const totalShares = data.reduce((acc, row) => acc + row.shares, 0)

        const avgLikes = (totalLikes / data.length).toFixed(2)
        const avgComments = (totalComments / data.length).toFixed(2)
        const avgShares = (totalShares / data.length).toFixed(2)

        const maxLikes = Math.max(...data.map(row => row.likes))
        const minLikes = Math.min(...data.map(row => row.likes))

        const dateRange = {
            earliestDate: new Date(Math.min(...data.map(row => row.date))).toLocaleDateString(),
            latestDate: new Date(Math.max(...data.map(row => row.date))).toLocaleDateString()
        }

        const postTypeCount = data.reduce((acc, row) => {
            acc[row.type] = (acc[row.type] || 0) + 1
            return acc
        }, {})

        const postTypeChartData = Object.keys(postTypeCount).map(type => ({
            type,
            count: postTypeCount[type]
        }))

        const topPosts = [...data]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 5)

        const engagementOverTime = data.map(row => ({
            date: row.date.toLocaleDateString(),
            likes: row.likes,
            comments: row.comments,
            shares: row.shares
        }))

        const engagementDistribution = [
            { name: 'Likes', value: totalLikes },
            { name: 'Comments', value: totalComments },
            { name: 'Shares', value: totalShares }
        ]

        // New analytics features
        const trendAnalysis = data.map(row => ({
            date: row.date.toLocaleDateString(),
            engagement: row.likes + row.comments + row.shares
        }))

        const engagementRateData = data.map(row => ({
            date: row.date.toLocaleDateString(),
            engagementRate: ((row.likes + row.comments + row.shares) / (totalLikes + totalComments + totalShares) * 100).toFixed(2)
        }))

        const dayOfWeekAnalysis = data.reduce((acc, row) => {
            const dayOfWeek = row.date.toLocaleDateString('en-US', { weekday: 'long' })
            if (!acc[dayOfWeek]) {
                acc[dayOfWeek] = { posts: 0, likes: 0, comments: 0, shares: 0 }
            }
            acc[dayOfWeek].posts++
            acc[dayOfWeek].likes += row.likes
            acc[dayOfWeek].comments += row.comments
            acc[dayOfWeek].shares += row.shares
            return acc
        }, {})

        const dayOfWeekChartData = Object.entries(dayOfWeekAnalysis).map(([day, stats]) => ({
            day,
            avgLikes: (stats.likes / stats.posts).toFixed(2),
            avgComments: (stats.comments / stats.posts).toFixed(2),
            avgShares: (stats.shares / stats.posts).toFixed(2)
        }))

        const wordCloudData = Object.entries(postTypeCount).map(([type, count]) => ({
            value: type,
            count: count
        }))

        const correlationData = data.map(row => ({
            likes: row.likes,
            comments: row.comments,
            shares: row.shares
        }))

        return {
            totalLikes,
            totalComments,
            totalShares,
            avgLikes,
            avgComments,
            avgShares,
            maxLikes,
            minLikes,
            dateRange,
            postTypeChartData,
            topPosts,
            engagementOverTime,
            engagementDistribution,
            trendAnalysis,
            engagementRateData,
            dayOfWeekChartData,
            wordCloudData,
            correlationData
        }
    }, [data]) // Add data as a dependency

    const MotionCard = motion(Card)

    return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div
                // initial={{ opacity: 0, y: -20 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.5 }}
            >
                <Card className="w-full bg-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-800">Enhanced CSV Analyzer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <AnimatePresence mode="wait">
                                {uploadStatus === "idle" && (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <label
                                            htmlFor="dropzone-file"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-16 h-16 mb-4 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">CSV file (MAX. 10MB)</p>
                                            </div>
                                            <Input 
                                                id="dropzone-file" 
                                                type="file" 
                                                className="hidden" 
                                                onChange={handleFileChange} 
                                                accept=".csv" 
                                                ref={fileInputRef}
                                            />
                                        </label>
                                    </motion.div>
                                )}
                                {uploadStatus === "success" && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex flex-col items-center justify-center h-64 bg-green-50 rounded-lg"
                                    >
                                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                        <p className="text-lg font-semibold text-green-700">File uploaded successfully!</p>
                                        <Button onClick={resetUpload} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
                                            Upload Another File
                                        </Button>
                                    </motion.div>
                                )}
                                {uploadStatus === "error" && (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg"
                                    >
                                        <XCircle className="w-16 h-16 text-red-500 mb-4" />
                                        <p className="text-lg font-semibold text-red-700">Error uploading file</p>
                                        <Button onClick={resetUpload} className="mt-4 bg-red-500 hover:bg-red-600 text-white">
                                            Try Again
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {file && uploadStatus === "idle" && (
                                <div className="text-sm text-gray-500">Selected file: {file.name}</div>
                            )}
                            {uploadStatus === "idle" && (
                                <div className="flex justify-center">
                                <Button 
                                    onClick={handleUpload} 
                                    disabled={!file} 
                                    className="w-60 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                                >
                                    Analyze
                                </Button>
                            </div>
                            
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {memoizedAnalytics && (
                <div
                    // initial={{ opacity: 0, y: 20 }}
                    // animate={{ opacity: 1, y: 0 }}
                    // transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MotionCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Summary Statistics</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <dt className="font-medium">Total Likes</dt>
                                        <dd className="text-2xl font-bold">{memoizedAnalytics.totalLikes}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">Total Comments</dt>
                                        <dd className="text-2xl font-bold">{memoizedAnalytics.totalComments}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">Total Shares</dt>
                                        <dd className="text-2xl font-bold">{memoizedAnalytics.totalShares}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">Avg. Likes</dt>
                                        <dd className="text-2xl font-bold">{memoizedAnalytics.avgLikes}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">Max Likes</dt>
                                        <dd className="text-2xl font-bold">{memoizedAnalytics.maxLikes}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">Min Likes</dt>
                                        <dd className="text-2xl font-bold">{memoizedAnalytics.minLikes}</dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </MotionCard>

                        <MotionCard
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Top 5 Posts by Likes</CardTitle>
                                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {memoizedAnalytics.topPosts.map((post, index) => (
                                        <li key={index} className="text-sm">
                                            <span className="font-medium">{post.date.toLocaleDateString()}</span>: {post.likes} likes, {post.comments} comments, {post.shares} shares
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </MotionCard>
                    </div>

                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-6"
                    >
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Engagement Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={memoizedAnalytics.engagementOverTime}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="likes" stroke="#8884d8" />
                                        <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
                                        <Line type="monotone" dataKey="shares" stroke="#ffc658" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </MotionCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <MotionCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Post Type Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={memoizedAnalytics.postTypeChartData}
                                                dataKey="count"
                                                nameKey="type"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label
                                            >
                                                {memoizedAnalytics.postTypeChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </MotionCard>

                        <MotionCard
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Engagement Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={memoizedAnalytics.engagementDistribution}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label
                                            >
                                                {memoizedAnalytics.engagementDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </MotionCard>
                    </div>

                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="mt-6"
                    >
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Trend Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={memoizedAnalytics.trendAnalysis}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </MotionCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <MotionCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                        >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Engagement Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={memoizedAnalytics.engagementRateData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="engagementRate" stroke="#82ca9d" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </MotionCard>

                        <MotionCard
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                        >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Day of Week Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={memoizedAnalytics.dayOfWeekChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="avgLikes" fill="#8884d8" />
                                            <Bar dataKey="avgComments" fill="#82ca9d" />
                                            <Bar dataKey="avgShares" fill="#ffc658" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </MotionCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* <MotionCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                        >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Word Cloud</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center">
                                    <TagCloud
                                        minSize={12}
                                        maxSize={35}
                                        tags={memoizedAnalytics.wordCloudData}
                                        onClick={tag => console.log('clicking on tag:', tag)}
                                    />
                                </div>
                            </CardContent>
                        </MotionCard> */}

                        <MotionCard
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                        >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Correlation Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart>
                                            <CartesianGrid />
                                            <XAxis type="number" dataKey="likes" name="likes" />
                                            <YAxis type="number" dataKey="comments" name="comments" />
                                            <ZAxis type="number" dataKey="shares" name="shares" range={[0, 1000]} />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                            <Legend />
                                            <Scatter name="Correlation" data={memoizedAnalytics.correlationData} fill="#8884d8" />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </MotionCard>
                    </div>

                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.3 }}
                        className="mt-6"
                    >
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">CSV Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Likes</TableHead>
                                            <TableHead>Comments</TableHead>
                                            <TableHead>Shares</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.slice(0, rowsToShow).map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.date.toLocaleDateString()}</TableCell>
                                                <TableCell>{row.type}</TableCell>
                                                <TableCell>{row.likes}</TableCell>
                                                <TableCell>{row.comments}</TableCell>
                                                <TableCell>{row.shares}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="mt-4 flex justify-center">
                                {!showAllRows ? (
                                    <Button onClick={handleShowMore} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Show More
                                    </Button>
                                ) : (
                                    <Button onClick={handleShowLess} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Show Less
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </MotionCard>
                </div>
            )}
        </div>
    )
}

export default React.memo(EnhancedCSVAnalyzer)

