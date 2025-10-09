import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar, FileText, User, Plus, Search, Edit, Trash2, Download } from 'lucide-react'
import { realDoctors, realStaff, realTreatments, realReferralSources, sourceNoteOptions } from '../data/realData.js'

const PatientRecordManagement = () => {
  const [activeTab, setActiveTab] = useState('records')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // 病例記錄資料 (示例結構，實際使用時從資料庫載入)
  const [patientRecords, setPatientRecords] = useState([])

  // 新增病例表單狀態
  const [newRecord, setNewRecord] = useState({
    patientName: '',
    birthDate: '',
    medicalNumber: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    treatmentType: '',
    doctor: '',
    consultant: '',
    referralSource: '',
    sourceNote: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    treatmentGoals: '',
    notes: ''
  })

  const handleInputChange = (field, value) => {
    setNewRecord(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveRecord = () => {
    const recordToSave = {
      ...newRecord,
      id: Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
      status: '進行中'
    }
    
    setPatientRecords(prev => [...prev, recordToSave])
    setNewRecord({
      patientName: '',
      birthDate: '',
      medicalNumber: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      treatmentType: '',
      doctor: '',
      consultant: '',
      referralSource: '',
      sourceNote: '',
      medicalHistory: '',
      allergies: '',
      currentMedications: '',
      treatmentGoals: '',
      notes: ''
    })
    setActiveTab('records')
  }

  const filteredRecords = patientRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.medicalNumber.includes(searchTerm) ||
    record.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* 標題區域 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">病例基本資料管理</h2>
          <p className="text-gray-600 mt-1">完整的病患資料管理系統</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setActiveTab('new')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            新增病例
          </Button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總病例數</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientRecords.length}</div>
            <p className="text-xs text-muted-foreground">
              +0 較上月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">進行中療程</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patientRecords.filter(r => r.status === '進行中').length}
            </div>
            <p className="text-xs text-muted-foreground">
              活躍病患
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月新增</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              新病患數量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完成療程</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patientRecords.filter(r => r.status === '已完成').length}
            </div>
            <p className="text-xs text-muted-foreground">
              成功案例
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要內容區域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="records">病例記錄</TabsTrigger>
          <TabsTrigger value="new">新增病例</TabsTrigger>
        </TabsList>

        {/* 病例記錄列表 */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>病例記錄</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜尋病患姓名、病歷號碼或電話..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">尚無病例記錄</h3>
                  <p className="mt-1 text-sm text-gray-500">開始建立第一筆病例記錄</p>
                  <div className="mt-6">
                    <Button onClick={() => setActiveTab('new')}>
                      <Plus className="w-4 h-4 mr-2" />
                      新增病例
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{record.patientName}</h3>
                            <Badge variant={record.status === '進行中' ? 'default' : 'secondary'}>
                              {record.status}
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">病歷號碼:</span> {record.medicalNumber}
                            </div>
                            <div>
                              <span className="font-medium">聯絡電話:</span> {record.phone}
                            </div>
                            <div>
                              <span className="font-medium">療程類型:</span> {record.treatmentType}
                            </div>
                            <div>
                              <span className="font-medium">主治醫師:</span> {record.doctor}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            建立日期: {record.createdDate} | 來源: {record.referralSource}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 新增病例表單 */}
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>新增病例基本資料</CardTitle>
              <CardDescription>請填寫完整的病患基本資料和療程資訊</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本資料 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">基本資料</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">病患姓名 *</Label>
                    <Input
                      id="patientName"
                      value={newRecord.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      placeholder="請輸入病患姓名"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">出生日期</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={newRecord.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="medicalNumber">病歷號碼</Label>
                    <Input
                      id="medicalNumber"
                      value={newRecord.medicalNumber}
                      onChange={(e) => handleInputChange('medicalNumber', e.target.value)}
                      placeholder="自動生成或手動輸入"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">聯絡電話 *</Label>
                    <Input
                      id="phone"
                      value={newRecord.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="請輸入聯絡電話"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">電子郵件</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newRecord.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="請輸入電子郵件"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">聯絡地址</Label>
                    <Input
                      id="address"
                      value={newRecord.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="請輸入聯絡地址"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">緊急聯絡人</Label>
                    <Input
                      id="emergencyContact"
                      value={newRecord.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="請輸入緊急聯絡人"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">緊急聯絡電話</Label>
                    <Input
                      id="emergencyPhone"
                      value={newRecord.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      placeholder="請輸入緊急聯絡電話"
                    />
                  </div>
                </div>
              </div>

              {/* 療程資訊 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">療程資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="treatmentType">療程類型 *</Label>
                    <Select value={newRecord.treatmentType} onValueChange={(value) => handleInputChange('treatmentType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇療程類型" />
                      </SelectTrigger>
                      <SelectContent>
                        {realTreatments.map((treatment) => (
                          <SelectItem key={treatment.name} value={treatment.name}>
                            {treatment.name} ({treatment.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="doctor">主治醫師</Label>
                    <Select value={newRecord.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇主治醫師" />
                      </SelectTrigger>
                      <SelectContent>
                        {realDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.name}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="consultant">諮詢師</Label>
                    <Select value={newRecord.consultant} onValueChange={(value) => handleInputChange('consultant', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇諮詢師" />
                      </SelectTrigger>
                      <SelectContent>
                        {realStaff.filter(staff => staff.role === '諮詢師').map((staff) => (
                          <SelectItem key={staff.id} value={staff.name}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="referralSource">客戶來源</Label>
                    <Select value={newRecord.referralSource} onValueChange={(value) => handleInputChange('referralSource', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇客戶來源" />
                      </SelectTrigger>
                      <SelectContent>
                        {realReferralSources.map((source, index) => (
                          <SelectItem key={index} value={source.source}>
                            {source.source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sourceNote">來源備註</Label>
                    <Select value={newRecord.sourceNote} onValueChange={(value) => handleInputChange('sourceNote', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇來源備註" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceNoteOptions.map((note, index) => (
                          <SelectItem key={index} value={note}>
                            {note}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 醫療資訊 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">醫療資訊</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="medicalHistory">病史</Label>
                    <Textarea
                      id="medicalHistory"
                      value={newRecord.medicalHistory}
                      onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                      placeholder="請輸入相關病史..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="allergies">過敏史</Label>
                    <Textarea
                      id="allergies"
                      value={newRecord.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="請輸入過敏史..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentMedications">目前用藥</Label>
                    <Textarea
                      id="currentMedications"
                      value={newRecord.currentMedications}
                      onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                      placeholder="請輸入目前用藥..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="treatmentGoals">療程目標</Label>
                    <Textarea
                      id="treatmentGoals"
                      value={newRecord.treatmentGoals}
                      onChange={(e) => handleInputChange('treatmentGoals', e.target.value)}
                      placeholder="請輸入療程目標..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">備註</Label>
                    <Textarea
                      id="notes"
                      value={newRecord.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="其他備註..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => setActiveTab('records')}>
                  取消
                </Button>
                <Button onClick={handleSaveRecord} className="bg-blue-600 hover:bg-blue-700">
                  儲存病例
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PatientRecordManagement
