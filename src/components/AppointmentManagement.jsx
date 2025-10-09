import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Calendar, Clock, Plus, Search, Filter, Edit, Trash2, Phone, Mail } from 'lucide-react'

const AppointmentManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState('calendar') // calendar, list, timeline
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)

  // 模擬預約資料
  const appointments = [
    {
      id: 1,
      date: '2025-10-09',
      time: '09:00',
      endTime: '10:00',
      customer: { name: '王小美', phone: '0912-345-678', email: 'wang@example.com' },
      service: '皮秒雷射',
      staff: '李醫師',
      status: 'confirmed',
      notes: '首次療程，需要詳細說明',
      duration: 60
    },
    {
      id: 2,
      date: '2025-10-09',
      time: '10:30',
      endTime: '11:00',
      customer: { name: '陳先生', phone: '0923-456-789', email: 'chen@example.com' },
      service: '玻尿酸注射',
      staff: '張護理師',
      status: 'pending',
      notes: '需要過敏測試',
      duration: 30
    },
    {
      id: 3,
      date: '2025-10-09',
      time: '14:00',
      endTime: '15:30',
      customer: { name: '林小姐', phone: '0934-567-890', email: 'lin@example.com' },
      service: '電波拉皮',
      staff: '李醫師',
      status: 'confirmed',
      notes: '回診客戶',
      duration: 90
    },
    {
      id: 4,
      date: '2025-10-09',
      time: '15:30',
      endTime: '16:30',
      customer: { name: '黃太太', phone: '0945-678-901', email: 'huang@example.com' },
      service: '音波拉提',
      staff: '王醫師',
      status: 'in-progress',
      notes: '進行中',
      duration: 60
    },
    {
      id: 5,
      date: '2025-10-09',
      time: '16:30',
      endTime: '17:00',
      customer: { name: '劉小姐', phone: '0956-789-012', email: 'liu@example.com' },
      service: '肉毒桿菌',
      staff: '張護理師',
      status: 'confirmed',
      notes: '定期保養',
      duration: 30
    },
    // 添加一些時間衝突的預約來測試重複預約處理
    {
      id: 6,
      date: '2025-10-09',
      time: '15:30',
      endTime: '16:00',
      customer: { name: '趙小姐', phone: '0967-890-123', email: 'zhao@example.com' },
      service: '雷射除毛',
      staff: '陳護理師',
      status: 'confirmed',
      notes: '時間衝突但保留記錄',
      duration: 30
    }
  ]

  const services = [
    { id: 1, name: '皮秒雷射', duration: 60, category: '雷射療程' },
    { id: 2, name: '玻尿酸注射', duration: 30, category: '注射療程' },
    { id: 3, name: '肉毒桿菌', duration: 20, category: '注射療程' },
    { id: 4, name: '電波拉皮', duration: 90, category: '拉提療程' },
    { id: 5, name: '音波拉提', duration: 60, category: '拉提療程' },
    { id: 6, name: '雷射除毛', duration: 45, category: '雷射療程' }
  ]

  const staff = [
    { id: 1, name: '李醫師', specialties: ['皮秒雷射', '電波拉皮'] },
    { id: 2, name: '王醫師', specialties: ['音波拉提', '玻尿酸'] },
    { id: 3, name: '張護理師', specialties: ['注射療程', '術後護理'] },
    { id: 4, name: '陳護理師', specialties: ['雷射除毛', '術後護理'] }
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00'
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return '已確認'
      case 'pending': return '待確認'
      case 'in-progress': return '進行中'
      case 'completed': return '已完成'
      case 'cancelled': return '已取消'
      default: return '未知'
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.staff.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus
    const matchesDate = appointment.date === selectedDate
    return matchesSearch && matchesStatus && matchesDate
  })

  // 檢測時間衝突
  const getConflictingAppointments = (time, excludeId = null) => {
    return appointments.filter(apt => 
      apt.date === selectedDate && 
      apt.time === time && 
      apt.id !== excludeId
    )
  }

  const renderCalendarView = () => {
    return (
      <div className="space-y-4">
        {/* 時間軸視圖 */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-2">
            {timeSlots.map(time => {
              const appointmentsAtTime = filteredAppointments.filter(apt => apt.time === time)
              const conflicts = getConflictingAppointments(time)
              
              return (
                <div key={time} className="flex items-center space-x-4 p-2 border-b border-slate-600 last:border-b-0">
                  <div className="w-16 text-sm font-medium text-blue-400 flex-shrink-0">
                    {time}
                  </div>
                  <div className="flex-1 min-h-[40px] flex items-center">
                    {appointmentsAtTime.length > 0 ? (
                      <div className="flex flex-wrap gap-2 w-full">
                        {appointmentsAtTime.map(appointment => (
                          <div
                            key={appointment.id}
                            className={`flex-1 min-w-[200px] p-2 rounded border ${
                              conflicts.length > 1 ? 'ring-2 ring-orange-400' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-white text-sm">
                                  {appointment.customer.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {appointment.service} • {appointment.staff}
                                </div>
                                {conflicts.length > 1 && (
                                  <div className="text-xs text-orange-400 mt-1">
                                    ⚠️ 時間衝突 ({conflicts.length}筆預約)
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(appointment.status)}>
                                  {getStatusText(appointment.status)}
                                </Badge>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm italic">
                        無預約
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderListView = () => {
    return (
      <div className="space-y-4">
        {filteredAppointments.map(appointment => {
          const conflicts = getConflictingAppointments(appointment.time, appointment.id)
          
          return (
            <Card key={appointment.id} className={`bg-slate-700/30 border-slate-600 ${
              conflicts.length > 0 ? 'ring-2 ring-orange-400' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-blue-400 font-medium">
                      {appointment.time} - {appointment.endTime}
                    </div>
                    <div>
                      <div className="font-medium text-white">{appointment.customer.name}</div>
                      <div className="text-sm text-slate-400">{appointment.service}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-slate-300">{appointment.staff}</div>
                      <div className="text-xs text-slate-400">{appointment.duration}分鐘</div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-2 text-sm text-slate-400 bg-slate-800/50 p-2 rounded">
                    備註: {appointment.notes}
                  </div>
                )}
                {conflicts.length > 0 && (
                  <div className="mt-2 p-2 bg-orange-900/20 border border-orange-400/30 rounded">
                    <div className="text-xs text-orange-400">
                      ⚠️ 檢測到時間衝突，但已保留所有預約記錄 ({conflicts.length + 1}筆預約在同一時段)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                預約管理中心
              </CardTitle>
              <CardDescription className="text-slate-400">
                管理所有預約，支援時間衝突檢測和批量操作
              </CardDescription>
            </div>
            <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  新增預約
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>建立新預約</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    填寫預約詳細資訊
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">客戶姓名</Label>
                    <Input id="customer-name" placeholder="請輸入客戶姓名" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">聯絡電話</Label>
                    <Input id="customer-phone" placeholder="請輸入聯絡電話" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">療程項目</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="選擇療程" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name} ({service.duration}分鐘)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff">負責人員</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="選擇人員" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {staff.map(member => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">預約日期</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-slate-700 border-slate-600" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">預約時間</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="選擇時間" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">備註</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="請輸入備註資訊" 
                      className="bg-slate-700 border-slate-600"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                    取消
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    建立預約
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* 篩選和搜尋 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="搜尋客戶姓名、療程或員工..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">全部狀態</SelectItem>
                  <SelectItem value="pending">待確認</SelectItem>
                  <SelectItem value="confirmed">已確認</SelectItem>
                  <SelectItem value="in-progress">進行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="calendar">時間軸</SelectItem>
                  <SelectItem value="list">列表檢視</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 預約統計 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <div className="text-sm text-slate-400">總預約數</div>
              <div className="text-xl font-bold text-white">{filteredAppointments.length}</div>
            </div>
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <div className="text-sm text-slate-400">待確認</div>
              <div className="text-xl font-bold text-yellow-400">
                {filteredAppointments.filter(apt => apt.status === 'pending').length}
              </div>
            </div>
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <div className="text-sm text-slate-400">已確認</div>
              <div className="text-xl font-bold text-green-400">
                {filteredAppointments.filter(apt => apt.status === 'confirmed').length}
              </div>
            </div>
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <div className="text-sm text-slate-400">時間衝突</div>
              <div className="text-xl font-bold text-orange-400">
                {new Set(appointments.filter(apt => 
                  getConflictingAppointments(apt.time, apt.id).length > 0
                ).map(apt => apt.time)).size}
              </div>
            </div>
          </div>

          {/* 預約檢視 */}
          {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
        </CardContent>
      </Card>
    </div>
  )
}

export default AppointmentManagement
