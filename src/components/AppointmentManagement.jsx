import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Calendar, Plus, Download, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase.js'
import * as XLSX from 'xlsx'

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // 新增預約表單 - 完全符合 EXCEL 16 個欄位
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    patient_name: '',
    birthday: '',
    phone: '',
    treatment: '',
    room: '',
    equipment: '',
    source: '',
    status: '尚未報到',
    consultant: '',
    staff: '',
    doctor: '',
    duration: '',
    notes: ''
  })

  // 載入預約資料
  const loadAppointments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('flos_appointments')
        .select('*')
        .gte('date', '2025-11-01')  // 只顯示 11/1 之後的資料
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('載入預約失敗:', error)
      alert('載入預約資料失敗：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  // 新增預約
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.date || !form.time || !form.patient_name) {
      alert('日期、時間和客戶姓名為必填項目')
      return
    }

    try {
      const appointmentData = {
        id: `${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        date: form.date,
        time: form.time,
        patient_name: form.patient_name,
        birthday: form.birthday || null,
        phone: form.phone || null,
        treatment: form.treatment || null,
        room: form.room || null,
        equipment: form.equipment || null,
        source: form.source || null,
        status: form.status || '尚未報到',
        consultant: form.consultant || null,
        staff: form.staff || null,
        doctor: form.doctor || null,
        duration: form.duration || null,
        notes: form.notes || null
      }

      const { error } = await supabase
        .from('flos_appointments')
        .insert([appointmentData])

      if (error) throw error

      alert('預約新增成功！')
      setIsNewAppointmentOpen(false)
      setForm({
        date: new Date().toISOString().split('T')[0],
        time: '',
        patient_name: '',
        birthday: '',
        phone: '',
        treatment: '',
        room: '',
        equipment: '',
        source: '',
        status: '尚未報到',
        consultant: '',
        staff: '',
        doctor: '',
        duration: '',
        notes: ''
      })
      loadAppointments()
    } catch (error) {
      console.error('新增預約失敗:', error)
      alert('新增預約失敗：' + error.message)
    }
  }

  // 匯出 EXCEL - 完全符合範本格式
  const exportToExcel = () => {
    const excelData = appointments.map(apt => ({
      '台灣日期': apt.date,
      '時間(24H制)': apt.time,
      '客戶姓名': apt.patient_name,
      '客户生日': apt.birthday || '',
      '聯絡電話': apt.phone || '',
      '醫美療程項目': apt.treatment || '',
      '使用房間': apt.room || '',
      '使用設備': apt.equipment || '',
      '客戶來源': apt.source || '',
      '預約狀態': apt.status || '',
      '資料來源': apt.source || '',
      '諮詢師': apt.consultant || '',
      '跟診人員': apt.staff || '',
      '主治醫師': apt.doctor || '',
      '療程時間(小時)': apt.duration || '',
      '備註': apt.notes || ''
    }))

    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '預約資料')
    
    const fileName = `FLOS預約資料_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  // 今日預約
  const todayAppointments = appointments.filter(apt => apt.date === selectedDate)

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">預約管理</h1>
        <div className="flex gap-2">
          <Button onClick={loadAppointments} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新整理
          </Button>
          <Button onClick={exportToExcel} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            匯出 EXCEL
          </Button>
          <Button onClick={() => setIsNewAppointmentOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新增預約
          </Button>
        </div>
      </div>

      {/* 日期選擇 */}
      <Card>
        <CardHeader>
          <CardTitle>選擇日期</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="max-w-xs"
          />
        </CardContent>
      </Card>

      {/* 預約列表 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate} 的預約 ({todayAppointments.length} 筆)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">載入中...</div>
          ) : todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">本日無預約</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">時間</th>
                    <th className="border p-2 text-left">客戶姓名</th>
                    <th className="border p-2 text-left">聯絡電話</th>
                    <th className="border p-2 text-left">療程項目</th>
                    <th className="border p-2 text-left">使用房間</th>
                    <th className="border p-2 text-left">諮詢師</th>
                    <th className="border p-2 text-left">預約狀態</th>
                    <th className="border p-2 text-left">備註</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="border p-2">{apt.time}</td>
                      <td className="border p-2 font-medium">{apt.patient_name}</td>
                      <td className="border p-2">{apt.phone || '-'}</td>
                      <td className="border p-2">{apt.treatment || '-'}</td>
                      <td className="border p-2">{apt.room || '-'}</td>
                      <td className="border p-2">{apt.consultant || '-'}</td>
                      <td className="border p-2">{apt.status || '-'}</td>
                      <td className="border p-2">{apt.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 新增預約對話框 */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增預約</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>日期 *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>時間 *</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>客戶姓名 *</Label>
                <Input
                  value={form.patient_name}
                  onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>客戶生日</Label>
                <Input
                  type="date"
                  value={form.birthday}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                />
              </div>
              <div>
                <Label>聯絡電話</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>醫美療程項目</Label>
                <Input
                  value={form.treatment}
                  onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                />
              </div>
              <div>
                <Label>使用房間</Label>
                <Input
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                />
              </div>
              <div>
                <Label>使用設備</Label>
                <Input
                  value={form.equipment}
                  onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                />
              </div>
              <div>
                <Label>客戶來源</Label>
                <Input
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                />
              </div>
              <div>
                <Label>預約狀態</Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="尚未報到">尚未報到</SelectItem>
                    <SelectItem value="已報到">已報到</SelectItem>
                    <SelectItem value="已確認">已確認</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已取消">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>諮詢師</Label>
                <Input
                  value={form.consultant}
                  onChange={(e) => setForm({ ...form, consultant: e.target.value })}
                />
              </div>
              <div>
                <Label>跟診人員</Label>
                <Input
                  value={form.staff}
                  onChange={(e) => setForm({ ...form, staff: e.target.value })}
                />
              </div>
              <div>
                <Label>主治醫師</Label>
                <Input
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                />
              </div>
              <div>
                <Label>療程時間(小時)</Label>
                <Input
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
              <div className="col-span-3">
                <Label>備註</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                取消
              </Button>
              <Button type="submit">
                新增預約
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AppointmentManagement
