import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar, Users, Activity, BarChart3, Settings, Clock, UserCheck, TrendingUp, AlertCircle } from 'lucide-react'
import AppointmentManagement from './components/AppointmentManagement.jsx'
import CustomerManagement from './components/CustomerManagement.jsx'
import ConsentFormManagement from './components/ConsentFormManagement.jsx'
import MedicalTeamScheduling from './components/MedicalTeamScheduling.jsx'
import SchedulingSystem from './components/SchedulingSystem.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // 真實FLOS數據
  const dashboardStats = {
    todayAppointments: 11, // 2025-10-08實際預約數
    pendingAppointments: 3,
    totalCustomers: 152, // 實際客戶總數
    monthlyRevenue: 2850000, // 基於實際療程估算
    completionRate: 94
  }

  // 基於真實客戶資料的今日預約 (移除假資訊，使用實際療程)
  const todayAppointments = [
    { id: 1, time: '09:00', customer: '郭怡萱', service: 'EMB', status: 'confirmed', staff: '道玄', consultant: '道玄' },
    { id: 2, time: '10:30', customer: '翁玉蘭', service: '猛健樂', status: 'pending', staff: '米米', consultant: '米米' },
    { id: 3, time: '14:00', customer: '謝政均', service: '震波', status: 'confirmed', staff: '句句', consultant: '句句' },
    { id: 4, time: '15:30', customer: '潘承延', service: '猛健樂', status: 'in-progress', staff: '句句', consultant: '句句' },
    { id: 5, time: '16:30', customer: '廖喬芝', service: 'EMB', status: 'confirmed', staff: '哲軒', consultant: '哲軒' }
  ]

  // 真實FLOS醫師和諮詢師團隊
  const staffSchedule = [
    { id: 1, name: '鍾曜任醫師', status: 'on', shift: '12:00-20:30', appointments: 3, specialties: ['皮秒雷射', '音波拉提'] },
    { id: 2, name: '林思宇醫師', status: 'on', shift: '12:00-20:30', appointments: 2, specialties: ['猛健樂', '震波'] },
    { id: 3, name: '句句諮詢師', status: 'on', shift: '12:00-20:30', appointments: 33, specialties: ['客戶諮詢', '療程規劃'] },
    { id: 4, name: '道玄諮詢師', status: 'on', shift: '12:00-20:30', appointments: 17, specialties: ['客戶諮詢', '療程規劃'] },
    { id: 5, name: '安安諮詢師', status: 'on', shift: '12:00-20:30', appointments: 14, specialties: ['客戶諮詢', '療程規劃'] },
    { id: 6, name: '哲軒諮詢師', status: 'off', shift: '休假', appointments: 0, specialties: ['客戶諮詢', '療程規劃'] }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return '已確認'
      case 'pending': return '待確認'
      case 'in-progress': return '進行中'
      case 'completed': return '已完成'
      default: return '未知'
    }
  }

  const toggleStaffStatus = (staffId) => {
    // 這裡將來會連接到實際的API
    console.log(`切換員工 ${staffId} 的排班狀態`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* 頂部導航 */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FLOS曜診所</h1>
                <p className="text-sm text-slate-300">員工內部管理系統</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                系統正常運行
              </Badge>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* 標籤導航 */}
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              儀表板
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              預約管理
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              客戶管理
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <UserCheck className="w-4 h-4 mr-2" />
              員工管理
            </TabsTrigger>
            <TabsTrigger value="consent" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              同意書管理
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              醫療團隊
            </TabsTrigger>
            <TabsTrigger value="scheduling" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              整合排班
            </TabsTrigger>
          </TabsList>

          {/* 儀表板 */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* 統計卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">今日預約</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{dashboardStats.todayAppointments}</div>
                  <p className="text-xs text-slate-400">較昨日 +2</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">待確認</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{dashboardStats.pendingAppointments}</div>
                  <p className="text-xs text-slate-400">需要處理</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">總客戶數</CardTitle>
                  <Users className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{dashboardStats.totalCustomers}</div>
                  <p className="text-xs text-slate-400">本月 +12</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">月營收</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">NT$ {dashboardStats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-slate-400">較上月 +15%</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">完成率</CardTitle>
                  <Activity className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{dashboardStats.completionRate}%</div>
                  <p className="text-xs text-slate-400">本月平均</p>
                </CardContent>
              </Card>
            </div>

            {/* 今日預約概覽 */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  今日預約概覽
                </CardTitle>
                <CardDescription className="text-slate-400">
                  今天的預約安排和狀態
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-blue-400 min-w-[60px]">
                          {appointment.time}
                        </div>
                        <div>
                          <div className="font-medium text-white">{appointment.customer}</div>
                          <div className="text-sm text-slate-400">{appointment.service}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-slate-300">{appointment.staff}</div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 預約管理 */}
          <TabsContent value="appointments" className="space-y-6">
            <AppointmentManagement />
          </TabsContent>

          {/* 客戶管理 */}
          <TabsContent value="customers" className="space-y-6">
            <CustomerManagement />
          </TabsContent>

          {/* 員工管理 */}
          <TabsContent value="staff" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-blue-400" />
                  員工排班管理
                </CardTitle>
                <CardDescription className="text-slate-400">
                  管理員工排班、工作狀態和績效追蹤
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffSchedule.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStaffStatus(staff.id)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            staff.status === 'on' 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-slate-500 hover:bg-slate-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            staff.status === 'on' ? 'translate-x-3' : '-translate-x-3'
                          }`} />
                        </Button>
                        <div>
                          <div className="font-medium text-white">{staff.name}</div>
                          <div className="text-sm text-slate-400">{staff.shift}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-slate-300">今日預約: {staff.appointments}筆</div>
                          <div className="text-xs text-slate-400">
                            專長: {staff.specialties.join(', ')}
                          </div>
                        </div>
                        <Badge variant={staff.status === 'on' ? 'default' : 'secondary'}>
                          {staff.status === 'on' ? '在班' : '休假'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 同意書管理 */}
          <TabsContent value="consent" className="space-y-6">
            <ConsentFormManagement />
          </TabsContent>

          {/* 醫療團隊調配 */}
          <TabsContent value="team" className="space-y-6">
            <MedicalTeamScheduling />
          </TabsContent>

          {/* 整合排班系統 */}
          <TabsContent value="scheduling" className="space-y-6">
            <SchedulingSystem />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
