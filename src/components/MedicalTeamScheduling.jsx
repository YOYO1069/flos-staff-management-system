import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar, Users, Stethoscope, User, Clock, Plus, Edit, Eye, AlertCircle, CheckCircle } from 'lucide-react'

const MedicalTeamScheduling = () => {
  const [selectedDate, setSelectedDate] = useState('2025-10-09')
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // 醫師資料
  const doctors = [
    {
      id: 'dr-lee',
      name: '李醫師',
      specialties: ['皮秒雷射', '電波拉皮', '音波拉提'],
      status: 'available',
      workingHours: '12:00-20:30',
      currentLoad: 6,
      maxLoad: 8,
      experience: '10年',
      rating: 4.9
    },
    {
      id: 'dr-wang',
      name: '王醫師',
      specialties: ['玻尿酸注射', '肉毒桿菌', '雷射除毛'],
      status: 'busy',
      workingHours: '14:00-20:30',
      currentLoad: 7,
      maxLoad: 8,
      experience: '8年',
      rating: 4.8
    },
    {
      id: 'dr-chen',
      name: '陳醫師',
      specialties: ['電波拉皮', '音波拉提', '皮秒雷射'],
      status: 'available',
      workingHours: '12:00-18:00',
      currentLoad: 4,
      maxLoad: 6,
      experience: '12年',
      rating: 4.9
    }
  ]

  // 護理師/跟診人員資料
  const assistants = [
    {
      id: 'nurse-zhang',
      name: '張護理師',
      type: '護理師',
      specialties: ['注射協助', '雷射操作', '客戶照護'],
      status: 'available',
      workingHours: '12:00-20:30',
      currentLoad: 5,
      maxLoad: 10,
      experience: '6年',
      certifications: ['護理師執照', '雷射操作證照']
    },
    {
      id: 'nurse-chen',
      name: '陳護理師',
      type: '護理師',
      specialties: ['手術協助', '術後照護', '設備管理'],
      status: 'busy',
      workingHours: '10:30-19:00',
      currentLoad: 8,
      maxLoad: 10,
      experience: '8年',
      certifications: ['護理師執照', '手術室護理證照']
    },
    {
      id: 'nurse-liu',
      name: '劉護理師',
      type: '護理師',
      specialties: ['客戶諮詢', '術前準備', '檔案管理'],
      status: 'available',
      workingHours: '12:00-20:30',
      currentLoad: 3,
      maxLoad: 8,
      experience: '4年',
      certifications: ['護理師執照']
    },
    {
      id: 'assistant-wu',
      name: '吳助理',
      type: '醫療助理',
      specialties: ['設備準備', '客戶接待', '檔案整理'],
      status: 'available',
      workingHours: '10:30-19:00',
      currentLoad: 4,
      maxLoad: 12,
      experience: '3年',
      certifications: ['醫療助理證照']
    }
  ]

  // 今日預約與人員分配
  const todaySchedule = [
    {
      id: 1,
      time: '12:00',
      patient: '王小美',
      treatment: '皮秒雷射',
      duration: 60,
      doctor: 'dr-lee',
      assistant: 'nurse-zhang',
      status: 'confirmed',
      room: 'A1',
      notes: '首次治療，需詳細說明'
    },
    {
      id: 2,
      time: '13:30',
      patient: '陳先生',
      treatment: '玻尿酸注射',
      duration: 30,
      doctor: 'dr-wang',
      assistant: 'nurse-chen',
      status: 'confirmed',
      room: 'B1',
      notes: '回診客戶'
    },
    {
      id: 3,
      time: '14:00',
      patient: '林小姐',
      treatment: '電波拉皮',
      duration: 90,
      doctor: 'dr-chen',
      assistant: 'nurse-zhang',
      status: 'pending',
      room: 'A2',
      notes: '需要兩位助理協助'
    },
    {
      id: 4,
      time: '15:30',
      patient: '黃太太',
      treatment: '音波拉提',
      duration: 75,
      doctor: null,
      assistant: null,
      status: 'unassigned',
      room: null,
      notes: '緊急加號，需安排人員'
    },
    {
      id: 5,
      time: '17:00',
      patient: '張小姐',
      treatment: '肉毒桿菌',
      duration: 20,
      doctor: 'dr-wang',
      assistant: 'nurse-liu',
      status: 'confirmed',
      room: 'B2',
      notes: '定期保養'
    }
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: '可用', variant: 'default', color: 'text-green-400' },
      busy: { label: '忙碌', variant: 'secondary', color: 'text-yellow-400' },
      unavailable: { label: '不可用', variant: 'destructive', color: 'text-red-400' }
    }
    const config = statusConfig[status] || statusConfig.available
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getAppointmentStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: '已確認', variant: 'default', icon: CheckCircle },
      pending: { label: '待確認', variant: 'secondary', icon: Clock },
      unassigned: { label: '未分配', variant: 'destructive', icon: AlertCircle }
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId)
    return doctor ? doctor.name : '未分配'
  }

  const getAssistantName = (assistantId) => {
    const assistant = assistants.find(a => a.id === assistantId)
    return assistant ? assistant.name : '未分配'
  }

  const getWorkloadPercentage = (current, max) => {
    return Math.round((current / max) * 100)
  }

  return (
    <div className="space-y-6">
      {/* 標題和日期選擇 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">醫療團隊調配</h2>
          <p className="text-gray-400 mt-2">管理醫師和跟診人員的排班與分配</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-600">
            今日排程
          </TabsTrigger>
          <TabsTrigger value="doctors" className="data-[state=active]:bg-blue-600">
            醫師管理
          </TabsTrigger>
          <TabsTrigger value="assistants" className="data-[state=active]:bg-blue-600">
            跟診人員
          </TabsTrigger>
          <TabsTrigger value="workload" className="data-[state=active]:bg-blue-600">
            工作負荷
          </TabsTrigger>
        </TabsList>

        {/* 今日排程 */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                今日預約排程 ({selectedDate})
              </CardTitle>
              <CardDescription className="text-gray-400">
                查看和調整今日的醫療團隊分配
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">時間</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">客戶</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">療程</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">主治醫師</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">跟診人員</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">診間</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">狀態</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaySchedule.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span className="text-white font-medium">{appointment.time}</span>
                            <span className="text-gray-400 text-sm">({appointment.duration}分)</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{appointment.patient}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-purple-400 border-purple-400">
                            {appointment.treatment}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-blue-400" />
                            <span className="text-white">{getDoctorName(appointment.doctor)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-400" />
                            <span className="text-white">{getAssistantName(appointment.assistant)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{appointment.room || '未分配'}</td>
                        <td className="py-3 px-4">{getAppointmentStatusBadge(appointment.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedAppointment(appointment)
                                setIsAssignmentOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 醫師管理 */}
        <TabsContent value="doctors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{doctor.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          經驗 {doctor.experience} | 評分 {doctor.rating}★
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(doctor.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">專長療程</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">工作時間</span>
                      <span className="text-white">{doctor.workingHours}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">今日負荷</span>
                      <span className="text-white">{doctor.currentLoad}/{doctor.maxLoad}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getWorkloadPercentage(doctor.currentLoad, doctor.maxLoad)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 跟診人員管理 */}
        <TabsContent value="assistants" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assistants.map((assistant) => (
              <Card key={assistant.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{assistant.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {assistant.type} | 經驗 {assistant.experience}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(assistant.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">專長領域</p>
                    <div className="flex flex-wrap gap-1">
                      {assistant.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">證照資格</p>
                    <div className="flex flex-wrap gap-1">
                      {assistant.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">工作時間</span>
                      <span className="text-white">{assistant.workingHours}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">今日負荷</span>
                      <span className="text-white">{assistant.currentLoad}/{assistant.maxLoad}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${getWorkloadPercentage(assistant.currentLoad, assistant.maxLoad)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 工作負荷分析 */}
        <TabsContent value="workload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">醫師工作負荷</CardTitle>
                <CardDescription className="text-gray-400">
                  今日醫師工作負荷分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Stethoscope className="h-5 w-5 text-blue-400" />
                        <span className="text-white">{doctor.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${getWorkloadPercentage(doctor.currentLoad, doctor.maxLoad)}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-16 text-right">
                          {getWorkloadPercentage(doctor.currentLoad, doctor.maxLoad)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">跟診人員工作負荷</CardTitle>
                <CardDescription className="text-gray-400">
                  今日跟診人員工作負荷分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assistants.map((assistant) => (
                    <div key={assistant.id} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-green-400" />
                        <span className="text-white">{assistant.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${getWorkloadPercentage(assistant.currentLoad, assistant.maxLoad)}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-16 text-right">
                          {getWorkloadPercentage(assistant.currentLoad, assistant.maxLoad)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 人員分配對話框 */}
      <Dialog open={isAssignmentOpen} onOpenChange={setIsAssignmentOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>調整人員分配</DialogTitle>
            <DialogDescription className="text-gray-400">
              為預約分配合適的醫師和跟診人員
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">客戶</Label>
                  <p className="text-gray-300">{selectedAppointment.patient}</p>
                </div>
                <div>
                  <Label className="text-white">療程</Label>
                  <p className="text-gray-300">{selectedAppointment.treatment}</p>
                </div>
                <div>
                  <Label className="text-white">時間</Label>
                  <p className="text-gray-300">{selectedAppointment.time} ({selectedAppointment.duration}分鐘)</p>
                </div>
                <div>
                  <Label className="text-white">診間</Label>
                  <Select defaultValue={selectedAppointment.room}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="選擇診間" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="A1">A1診間</SelectItem>
                      <SelectItem value="A2">A2診間</SelectItem>
                      <SelectItem value="B1">B1診間</SelectItem>
                      <SelectItem value="B2">B2診間</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">主治醫師</Label>
                  <Select defaultValue={selectedAppointment.doctor}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="選擇醫師" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} ({getWorkloadPercentage(doctor.currentLoad, doctor.maxLoad)}% 負荷)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">跟診人員</Label>
                  <Select defaultValue={selectedAppointment.assistant}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="選擇跟診人員" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {assistants.map((assistant) => (
                        <SelectItem key={assistant.id} value={assistant.id}>
                          {assistant.name} ({getWorkloadPercentage(assistant.currentLoad, assistant.maxLoad)}% 負荷)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  確認分配
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsAssignmentOpen(false)}>
                  取消
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MedicalTeamScheduling
