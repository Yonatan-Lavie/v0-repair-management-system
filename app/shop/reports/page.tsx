"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart3, Download, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

// Mock reports data
const mockReportsData = {
  summary: {
    totalRepairs: 156,
    completedRepairs: 144,
    activeRepairs: 12,
    avgRepairTime: 3.2,
    customerSatisfaction: 4.8,
    revenue: 45600,
  },
  monthlyStats: [
    { month: "ינואר", repairs: 25, completed: 23, revenue: 8500 },
    { month: "פברואר", repairs: 28, completed: 26, revenue: 9200 },
    { month: "מרץ", repairs: 32, completed: 30, revenue: 10800 },
    { month: "אפריל", repairs: 29, completed: 28, revenue: 9600 },
    { month: "מאי", repairs: 35, completed: 32, revenue: 11400 },
    { month: "יוני", repairs: 38, completed: 36, revenue: 12200 },
    { month: "יולי", repairs: 42, completed: 39, revenue: 13500 },
  ],
  commonIssues: [
    { issue: "מסך שבור", count: 45, percentage: 28.8 },
    { issue: "בעיית סוללה", count: 32, percentage: 20.5 },
    { issue: "לא נדלק", count: 28, percentage: 17.9 },
    { issue: "בעיית טעינה", count: 22, percentage: 14.1 },
    { issue: "בעיית רמקול", count: 18, percentage: 11.5 },
    { issue: "אחר", count: 11, percentage: 7.1 },
  ],
  technicianPerformance: [
    { name: "יוסי בן-חיים", completed: 89, avgTime: 2.8, satisfaction: 4.9 },
    { name: "טכנאי 2", completed: 55, avgTime: 3.6, satisfaction: 4.7 },
  ],
  slowRepairs: [
    { repairId: "REPAIR045", customer: "אבי לוי", product: "iPhone 12", days: 8, issue: "בעיה מורכבת" },
    { repairId: "REPAIR052", customer: "שרה כהן", product: "Samsung S20", days: 6, issue: "חלק לא זמין" },
    { repairId: "REPAIR061", customer: "דני רוזן", product: "iPad Air", days: 5, issue: "בדיקות נוספות" },
  ],
}

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-month")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/shop/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  חזור
                </Link>
              </Button>
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">דוחות ואנליטיקה</h1>
                <p className="text-gray-600">נתונים מפורטים על ביצועי החנות</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">שבוע אחרון</SelectItem>
                  <SelectItem value="last-month">חודש אחרון</SelectItem>
                  <SelectItem value="last-quarter">רבעון אחרון</SelectItem>
                  <SelectItem value="last-year">שנה אחרונה</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                ייצא דוח
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">סה"כ תיקונים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportsData.summary.totalRepairs}</div>
              <p className="text-xs text-muted-foreground">+12% מהחודש הקודם</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">הושלמו</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportsData.summary.completedRepairs}</div>
              <p className="text-xs text-muted-foreground">92.3% שיעור השלמה</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">זמן ממוצע</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportsData.summary.avgRepairTime} ימים</div>
              <p className="text-xs text-muted-foreground">-0.3 ימים מהחודש הקודם</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">שביעות רצון</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportsData.summary.customerSatisfaction}/5</div>
              <p className="text-xs text-muted-foreground">+0.2 מהחודש הקודם</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">הכנסות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪{mockReportsData.summary.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% מהחודש הקודם</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">פעילים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportsData.summary.activeRepairs}</div>
              <p className="text-xs text-muted-foreground">כרגע במעבדה</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="issues">תקלות נפוצות</TabsTrigger>
            <TabsTrigger value="performance">ביצועי טכנאים</TabsTrigger>
            <TabsTrigger value="problems">בעיות ועיכובים</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>נתונים חודשיים</CardTitle>
                  <CardDescription>מגמות תיקונים והכנסות לאורך זמן</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>חודש</TableHead>
                        <TableHead>תיקונים</TableHead>
                        <TableHead>הושלמו</TableHead>
                        <TableHead>הכנסות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockReportsData.monthlyStats.map((stat, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{stat.month}</TableCell>
                          <TableCell>{stat.repairs}</TableCell>
                          <TableCell>{stat.completed}</TableCell>
                          <TableCell>₪{stat.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>מדדי ביצועים</CardTitle>
                  <CardDescription>KPIs עיקריים של החנות</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">שיעור השלמה</span>
                    <span className="text-2xl font-bold text-green-600">92.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">זמן ממוצע לתיקון</span>
                    <span className="text-2xl font-bold text-blue-600">3.2 ימים</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">שביעות רצון לקוחות</span>
                    <span className="text-2xl font-bold text-purple-600">4.8/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">הכנסה ממוצעת לתיקון</span>
                    <span className="text-2xl font-bold text-orange-600">₪292</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>תקלות נפוצות</CardTitle>
                <CardDescription>התקלות הנפוצות ביותר בתיקונים</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>סוג תקלה</TableHead>
                      <TableHead>כמות</TableHead>
                      <TableHead>אחוז</TableHead>
                      <TableHead>מגמה</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReportsData.commonIssues.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{issue.issue}</TableCell>
                        <TableCell>{issue.count}</TableCell>
                        <TableCell>{issue.percentage}%</TableCell>
                        <TableCell>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>ביצועי טכנאים</CardTitle>
                <CardDescription>נתוני ביצועים של הטכנאים</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>שם טכנאי</TableHead>
                      <TableHead>תיקונים שהושלמו</TableHead>
                      <TableHead>זמן ממוצע</TableHead>
                      <TableHead>שביעות רצון</TableHead>
                      <TableHead>ביצועים</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReportsData.technicianPerformance.map((tech, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{tech.name}</TableCell>
                        <TableCell>{tech.completed}</TableCell>
                        <TableCell>{tech.avgTime} ימים</TableCell>
                        <TableCell>{tech.satisfaction}/5</TableCell>
                        <TableCell>
                          <Badge variant="default">מעולה</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems">
            <Card>
              <CardHeader>
                <CardTitle>תיקונים איטיים</CardTitle>
                <CardDescription>תיקונים שלוקחים זמן רב מהרגיל</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>מזהה תיקון</TableHead>
                      <TableHead>לקוח</TableHead>
                      <TableHead>מוצר</TableHead>
                      <TableHead>ימים</TableHead>
                      <TableHead>סיבה</TableHead>
                      <TableHead>סטטוס</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReportsData.slowRepairs.map((repair, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{repair.repairId}</TableCell>
                        <TableCell>{repair.customer}</TableCell>
                        <TableCell>{repair.product}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            {repair.days}
                          </div>
                        </TableCell>
                        <TableCell>{repair.issue}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">בטיפול</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
