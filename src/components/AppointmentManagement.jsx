import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Plus, Download, RefreshCw, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase.js'
import * as XLSX from 'xlsx'

const AppointmentManagement = ({ onAppointmentUpdate }) => {
  const [appointments, setAppointments] = useState([])
  const [todayAppointments, setTodayAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // 表單欄位 - 完全按照 EXCEL 順序
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],           // 1. 台灣日期
    time: '',                                                // 2. 時間(24H制)
    patient_name: '',                                        // 3. 客戶姓名
    birthday: '',                                            // 4. 客戶生日
    phone: '',                                               // 5. 聯絡電話
    treatment: '',                                           // 6. 醫美療程項目
    room: '',                                                // 7. 使用房間
    equipment: '',                                           // 8. 使用設備
    source: '',                                              // 9. 客戶來源
    status: '尚未報到',                                      // 10. 預約狀態
    data_source: '',                                         // 11. 資料來源
    consultant: '',                                          // 12. 諮詢師
    staff: '',                                               // 13. 跟診人員
    doctor: '',                                              // 14. 主治醫師
    duration: '',                                            // 15. 療程時間(小時)
    notes: ''                                                // 16. 備註
  })

  // 載入預約資料
  const loadAppointments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('flos_appointments')
        .select('*')
        .gte('date', '2025-11-01')
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('載入預約數量:', data?.length || 0)
      setAppointments(data || [])
      const today = new Date().toISOString().split("T")[0]
      const todayApts = data.filter(apt => apt.date === today)
      setTodayAppointments(todayApts)
      if (onAppointmentUpdate) {
        onAppointmentUpdate(todayApts.length, data.length)
      }
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

  // 重置表單
  const resetForm = () => {
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
      data_source: '',
      consultant: '',
      staff: '',
      doctor: '',
      duration: '',
      notes: ''
    })
    setEditingId(null)
  }

  // 開啟新增對話框
  const openNewDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // 開啟編輯對話框
  const openEditDialog = (apt) => {
    setForm({
      date: apt.date || '',
      time: apt.time || '',
      patient_name: apt.patient_name || '',
      birthday: apt.birthday || '',
      phone: apt.phone || '',
      treatment: apt.treatment || '',
      room: apt.room || '',
      equipment: apt.equipment || '',
      source: apt.source || '',
      status: apt.status || '尚未報到',
      data_source: apt.data_source || apt.source || '',
      consultant: apt.consultant || '',
      staff: apt.staff || '',
      doctor: apt.doctor || '',
      duration: apt.duration || '',
      notes: apt.notes || ''
    })
    setEditingId(apt.id)
    setIsDialogOpen(true)
  }

  // 提交表單
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.date || !form.time || !form.patient_name) {
      alert('日期、時間和客戶姓名為必填項目')
      return
    }

    try {
      const appointmentData = {
        date: form.date,
        time: form.time,
        patient_name: form.patient_name,
        birthday: form.birthday || null,
        phone: form.phone || null,
        treatment: form.treatment || null,
        room: form.room || null,
        equipment: form.equipment || null,
        source: form.data_source || form.source || null,
        status: form.status || '尚未報到',
        consultant: form.consultant || null,
        staff: form.staff || null,
        doctor: form.doctor || null,
        duration: form.duration || null,
        notes: form.notes || null
      }

      if (editingId) {
        // 更新
        const { error } = await supabase
          .from('flos_appointments')
          .update(appointmentData)
          .eq('id', editingId)

        if (error) throw error
        alert('預約更新成功！')
      } else {
        // 新增
        appointmentData.id = `${Date.now()}${Math.random().toString(36).substr(2, 9)}`
        
        const { error } = await supabase
          .from('flos_appointments')
          .insert([appointmentData])

        if (error) throw error
        alert('預約新增成功！')
      }

      setIsDialogOpen(false)
      resetForm()
      loadAppointments()
    } catch (error) {
      console.error('儲存預約失敗:', error)
      alert('儲存預約失敗：' + error.message)
    }
  }

  // 刪除預約
  const handleDelete = async (id) => {
    if (!confirm('確定要刪除此預約嗎？')) return

    try {
      const { error } = await supabase
        .from('flos_appointments')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('預約刪除成功！')
      loadAppointments()
    } catch (error) {
      console.error('刪除預約失敗:', error)
      alert('刪除預約失敗：' + error.message)
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
    
    // 設定欄寬
    ws['!cols'] = [
      { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
      { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      { wch: 20 }
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '預約資料')
    
    const fileName = `FLOS預約資料_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  // 篩選當日預約


  const filteredAppointments = appointments.filter(apt => apt.date === selectedDate)

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">預約管理</h1>
        <div className="flex gap-2">
          <Button onClick={loadAppointments} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新整理
          </Button>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            匯出 EXCEL
          </Button>
          <Button onClick={openNewDialog} size="sm">
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
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-purple-300 p-2">時間(24H制)</th>
                    <th className="border border-purple-300 p-2">客戶姓名</th>
                    <th className="border border-purple-300 p-2">聯絡電話</th>
                    <th className="border border-purple-300 p-2">醫美療程項目</th>
                    <th className="border border-purple-300 p-2">使用房間</th>
                    <th className="border border-purple-300 p-2">使用設備</th>
                    <th className="border border-purple-300 p-2">客戶來源</th>
                    <th className="border border-purple-300 p-2">預約狀態</th>
                    <th className="border border-purple-300 p-2">諮詢師</th>
                    <th className="border border-purple-300 p-2">跟診人員</th>
                    <th className="border border-purple-300 p-2">主治醫師</th>
                    <th className="border border-purple-300 p-2">操作</th>
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
                      <td className="border p-2">{apt.equipment || '-'}</td>
                      <td className="border p-2">{apt.source || '-'}</td>
                      <td className="border p-2">{apt.status || '-'}</td>
                      <td className="border p-2">{apt.consultant || '-'}</td>
                      <td className="border p-2">{apt.staff || '-'}</td>
                      <td className="border p-2">{apt.doctor || '-'}</td>
                      <td className="border p-2">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEditDialog(apt)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(apt.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 新增/編輯預約對話框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? '編輯預約' : '新增預約'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {/* 1. 台灣日期 */}
              <div>
                <Label className="text-xs">1. 台灣日期 *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="h-9" />
              </div>
              
              {/* 2. 時間(24H制) */}
              <div>
                <Label className="text-xs">2. 時間(24H制) *</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required className="h-9" />
              </div>
              
              {/* 3. 客戶姓名 */}
              <div>
                <Label className="text-xs">3. 客戶姓名 *</Label>
                <Input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} required className="h-9" />
              </div>
              
              {/* 4. 客戶生日 */}
              <div>
                <Label className="text-xs">4. 客戶生日</Label>
                <Input type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} className="h-9" />
              </div>
              
              {/* 5. 聯絡電話 */}
              <div>
                <Label className="text-xs">5. 聯絡電話</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-9" />
              </div>
              
              {/* 6. 醫美療程項目 */}
              <div>
                <Label className="text-xs">6. 醫美療程項目</Label>
                <Input value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} className="h-9" />
              </div>
              
              {/* 7. 使用房間 */}
              <div>
                <Label className="text-xs">7. 使用房間</Label>
                <Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="h-9" />
              </div>
              
              {/* 8. 使用設備 */}
              <div>
                <Label className="text-xs">8. 使用設備</Label>
                <Input value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} className="h-9" />
              </div>
              
              {/* 9. 客戶來源 */}
              <div>
                <Label className="text-xs">9. 客戶來源</Label>
                <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="h-9" />
              </div>
              
              {/* 10. 預約狀態 */}
              <div>
                <Label className="text-xs">10. 預約狀態</Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                  <SelectTrigger className="h-9">
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
              
              {/* 11. 資料來源 */}
              <div>
                <Label className="text-xs">11. 資料來源</Label>
                <Input value={form.data_source} onChange={(e) => setForm({ ...form, data_source: e.target.value })} className="h-9" />
              </div>
              
              {/* 12. 諮詢師 */}
              <div>
                <Label className="text-xs">12. 諮詢師</Label>
                <Input value={form.consultant} onChange={(e) => setForm({ ...form, consultant: e.target.value })} className="h-9" />
              </div>
              
              {/* 13. 跟診人員 */}
              <div>
                <Label className="text-xs">13. 跟診人員</Label>
                <Input value={form.staff} onChange={(e) => setForm({ ...form, staff: e.target.value })} className="h-9" />
              </div>
              
              {/* 14. 主治醫師 */}
              <div>
                <Label className="text-xs">14. 主治醫師</Label>
                <Input value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className="h-9" />
              </div>
              
              {/* 15. 療程時間(小時) */}
              <div>
                <Label className="text-xs">15. 療程時間(小時)</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="h-9" />
              </div>
              
              {/* 16. 備註 */}
              <div className="col-span-4">
                <Label className="text-xs">16. 備註</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                取消
              </Button>
              <Button type="submit">
                {editingId ? '更新預約' : '新增預約'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AppointmentManagement
