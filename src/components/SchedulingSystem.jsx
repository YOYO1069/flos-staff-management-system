import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, Users, Clock, BarChart3 } from 'lucide-react'

const SchedulingSystem = () => {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [selectedMonth, setSelectedMonth] = useState(10)
  const [activeView, setActiveView] = useState('doctors')

  // 真實FLOS醫師資料 (從排班系統整合)
  const doctors = [
    { id: 'zhong', name: '鍾曜任', color: '#e91e63', status: 'off' },
    { id: 'wu', name: '伍詠聰', color: '#2196f3', status: 'off' },
    { id: 'lin', name: '林思宇', color: '#4caf50', status: 'off' },
    { id: 'wang', name: '王昱淞', color: '#ff9800', status: 'off' },
    { id: 'huang', name: '黃俊堯', color: '#9c27b0', status: 'off' },
    { id: 'lan', name: '藍子軒', color: '#3f51b5', status: 'off' },
    { id: 'he', name: '何逸群', color: '#f44336', status: 'off' },
    { id: 'guo', name: '郭昌浩', color: '#009688', status: 'off' }
  ]

  // 員工資料 (諮詢師)
  const staff = [
    { id: 'juju', name: '句句', color: '#e91e63', status: 'on', clients: 33 },
    { id: 'daoxuan', name: '道玄', color: '#2196f3', status: 'on', clients: 17 },
    { id: 'anan', name: '安安', color: '#4caf50', status: 'on', clients: 14 },
    { id: 'zhexuan', name: '哲軒', color: '#ff9800', status: 'off', clients: 9 },
    { id: 'mimi', name: '米米', color: '#9c27b0', status: 'on', clients: 4 },
    { id: 'huar', name: '花兒', color: '#f44336', status: 'on', clients: 8 }
  ]

  const [doctorSchedule, setDoctorSchedule] = useState(doctors)
  const [staffSchedule, setStaffSchedule] = useState(staff)

  // 生成日曆天數
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const firstDay = new Date(year, month - 1, 1).getDay()
    const days = []
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i)
      const dayOfWeek = date.getDay()
      const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
      days.push({
        day: i,
        weekday: weekdays[dayOfWeek],
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6
      })
    }
    return days
  }

  const toggleSchedule = (personId, type) => {
    if (type === 'doctor') {
      setDoctorSchedule(prev => prev.map(doctor => 
        doctor.id === personId 
          ? { ...doctor, status: doctor.status === 'on' ? 'off' : 'on' }
          : doctor
      ))
    } else {
      setStaffSchedule(prev => prev.map(staff => 
        staff.id === personId 
          ? { ...staff, status: staff.status === 'on' ? 'off' : 'on' }
          : staff
      ))
    }
  }

  const days = getDaysInMonth(selectedYear, selectedMonth)
  const currentData = activeView === 'doctors' ? doctorSchedule : staffSchedule

  return (
    <div className="space-y-6">
      {/* 標題和控制區 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">整合排班系統</h2>
          <p className="text-gray-400">醫師與員工排班管理 - {selectedYear}年{selectedMonth}月</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
          >
            <option value={2025}>2025年</option>
          </select>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
          >
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={i+1}>{i+1}月</option>
            ))}
          </select>
        </div>
      </div>

      {/* 視圖切換 */}
      <div className="flex gap-2">
        <Button 
          variant={activeView === 'doctors' ? 'default' : 'outline'}
          onClick={() => setActiveView('doctors')}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          👨‍⚕️ 醫師排班
        </Button>
        <Button 
          variant={activeView === 'staff' ? 'default' : 'outline'}
          onClick={() => setActiveView('staff')}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          👥 員工排班
        </Button>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          📊 統計報表
        </Button>
      </div>

      {/* 人員陣容展示 */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            {activeView === 'doctors' ? '👨‍⚕️ 醫師陣容 (8位)' : '👥 諮詢師團隊 (6位)'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            點擊排班狀態按鈕切換ON/OFF，系統已根據診所營業時間預設排班
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentData.map((person) => (
              <div key={person.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: person.color }}
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{person.name}</div>
                  {activeView === 'staff' && (
                    <div className="text-xs text-gray-400">{person.clients}位客戶</div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={person.status === 'on' ? 'default' : 'outline'}
                  onClick={() => toggleSchedule(person.id, activeView === 'doctors' ? 'doctor' : 'staff')}
                  className={`text-xs ${person.status === 'on' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'}`}
                >
                  {person.status === 'on' ? 'ON' : 'OFF'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 排班表格 */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            📅 {selectedYear}年{selectedMonth}月 排班表
          </CardTitle>
          <CardDescription className="text-gray-400">
            點擊格子切換排班狀態：OFF → ON → OFF，不提供半天班選項
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 text-white border-b border-gray-600">
                    {activeView === 'doctors' ? '醫師' : '員工'} / 日期
                  </th>
                  {days.map((day) => (
                    <th key={day.day} className="text-center p-2 text-white border-b border-gray-600 min-w-[60px]">
                      <div className="text-sm">{day.day}</div>
                      <div className="text-xs text-gray-400">{day.weekday}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((person) => (
                  <tr key={person.id}>
                    <td className="p-2 border-b border-gray-700">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: person.color }}
                        />
                        <span className="text-white text-sm">{person.name}</span>
                      </div>
                    </td>
                    {days.map((day) => (
                      <td key={day.day} className="p-1 border-b border-gray-700 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-12 h-8 text-xs bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                        >
                          OFF
                        </Button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 統計資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-white font-semibold">營業時間</div>
                <div className="text-gray-400 text-sm">週一～五 12:00-20:30</div>
                <div className="text-gray-400 text-sm">週六 10:30-19:00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-white font-semibold">在班人員</div>
                <div className="text-gray-400 text-sm">
                  醫師: {doctorSchedule.filter(d => d.status === 'on').length}/8位
                </div>
                <div className="text-gray-400 text-sm">
                  員工: {staffSchedule.filter(s => s.status === 'on').length}/6位
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-white font-semibold">本月統計</div>
                <div className="text-gray-400 text-sm">總預約: 152筆</div>
                <div className="text-gray-400 text-sm">完成率: 94%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SchedulingSystem
