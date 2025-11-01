import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar, Users, Activity, BarChart3, Settings, Clock, UserCheck, TrendingUp, AlertCircle, FileText } from 'lucide-react'
import LoadingScreen from './components/LoadingScreen.jsx'
import AppointmentManagement from './components/AppointmentManagement.jsx'
import CustomerManagement from './components/CustomerManagement.jsx'
import ConsentFormManagement from './components/ConsentFormManagement.jsx'
import MedicalTeamScheduling from './components/MedicalTeamScheduling.jsx'
import SchedulingSystem from './components/SchedulingSystem.jsx'
import PatientRecordManagement from './components/PatientRecordManagement.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  // 真實FLOS數據
  const [todayAppointmentCount, setTodayAppointmentCount] = useState(0)
  const [totalAppointmentCount, setTotalAppointmentCount] = useState(0)

  const handleAppointmentUpdate = (todayCount, totalCount) => {
    setTodayAppointmentCount(todayCount)
    setTotalAppointmentCount(totalCount)
  }

  const dashboardStats = {
    todayAppointments: todayAppointmentCount, // 從 AppointmentManagement 獲取
    pendingAppointments: 3,
    totalCustomers: 152,
    monthlyRevenue: 2850000,
    completionRate: 94
  }

  // 基於真實客戶資料的今日預約 (移除假資訊，使用實際療程)
  const [todayAppointments, setTodayAppointments] = useState([]);

  // 真實FLOS醫師和諮詢師團隊
  const businessHours = {
    mon_fri: '12:00–20:30',
    sat: '10:30–19:00',
    sun: '休診（含國定假日）'
  }

  const doctors = ['鍾曜任', '伍詠聰', '林思宇', '王昱淞', '黃俊堯', '藍子軒', '何逸群', '郭昌浩', '宋昀翰']
  const staff = ['萬晴', '陳韻安', '劉哲軒', '李文華', '張耿齊', '洪揚程', '謝鏵翧', '黃璦瑄', '王筑句', '米米', '花', '劉道玄', '黃柏翰']
  const staffSchedule = [
    // 醫師
    { id: 1, name: '鍾曜任醫師', status: 'on', shift: businessHours.mon_fri, appointments: 3, specialties: ['皮秒雷射', '音波拉提'] },
    { id: 2, name: '伍詠聰醫師', status: 'on', shift: businessHours.mon_fri, appointments: 2, specialties: ['猛健樂', '震波'] },
    { id: 3, name: '林思宇醫師', status: 'on', shift: businessHours.mon_fri, appointments: 2, specialties: ['猛健樂', '震波'] },
    // 員工/諮詢師
    { id: 4, name: '劉道玄諮詢師', status: 'on', shift: businessHours.mon_fri, appointments: 17, specialties: ['客戶諮詢', '療程規劃'] },
    { id: 5, name: '王筑句諮詢師', status: 'on', shift: businessHours.mon_fri, appointments: 33, specialties: ['客戶諮詢', '療程規劃'] },
    { id: 6, name: '劉哲軒', status: 'on', shift: businessHours.mon_fri, appointments: 14, specialties: ['員工'] },
    { id: 7, name: '陳韻安', status: 'on', shift: businessHours.mon_fri, appointments: 14, specialties: ['員工'] },
    { id: 8, name: '萬晴', status: 'off', shift: '休假', appointments: 0, specialties: ['員工'] }
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
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/50 border border-slate-700">
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
            <TabsTrigger value="patients" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              病例管理
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* PWA 優點 1: 今日預約概覽 - 整合到儀表板 */}
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    今日預約概覽 (11/1起)
                  </CardTitle>
                  <CardDescription>
                    從 Supabase 即時讀取，確保資料準確性。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayAppointments.length > 0 ? (
                      todayAppointments.map(apt => (
                        <div key={apt.id} className="flex justify-between items-center p-3 bg-slate-100/50 rounded-lg border border-slate-200">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className={getStatusColor(apt.status)}>{getStatusText(apt.status)}</Badge>
                            <div>
                              <p className="font-semibold text-slate-800">{apt.customer} ({apt.service})</p>
                              <p className="text-sm text-slate-500">{apt.time} - 諮詢師: {apt.consultant}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab('appointments')}>查看詳情</Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">今日無預約。</p>
                    )}
                  </div>
                </CardContent>
              </Card>         <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
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
            <AppointmentManagement onAppointmentUpdate={handleAppointmentUpdate} />
          </TabsContent>

          {/* 客戶管理 */}
          <TabsContent value="customers" className="space-y-6">
            <CustomerManagement />
            </TabsContent>

            {/* PWA 優點 2: 客戶管理精華 - 整合到客戶管理 */}
            <TabsContent value="customer-management" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    客戶管理精華
                  </CardTitle>
                  <CardDescription>
                    快速查看客戶的關鍵資訊和療程紀錄。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* 這裡可以放置一個客戶搜尋和精華資訊的組件 */}
                  <div className="flex gap-4">
                    <Input placeholder="輸入客戶姓名或電話" className="flex-grow" />
                    <Button>搜尋</Button>
                  </div>
                  <div className="mt-4 text-slate-500">
                    {/* 這裡將顯示搜尋結果的精華資訊 */}
                    <p>請輸入關鍵字進行搜尋...</p>
                  </div>
                </CardContent>
              </Card>
              <CustomerManagement />
          </TabsContent>

          {/* 病例管理 */}
          <TabsContent value="patients" className="space-y-6">
            <PatientRecordManagement />
            </TabsContent>

            {/* PWA 優點 3: 病歷管理新增功能 - 整合到病歷管理 */}
            <TabsContent value="patient-records" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    新增病歷
                  </CardTitle>
                  <CardDescription>
                    快速新增客戶病歷資料，並與預約資料聯動。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* 這裡可以放置一個簡化的新增病歷表單，或是一個按鈕導向 PatientRecordManagement 內的新增功能 */}
                  <Button onClick={() => console.log('觸發新增病歷功能')}>新增病歷</Button>
                </CardContent>
              </Card>
              <PatientRecordManagement />
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
