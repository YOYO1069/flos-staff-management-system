import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar, FileText, User, Plus, Search, Edit, Trash2, Download, UserPlus, Activity, TrendingUp } from 'lucide-react'
import { realDoctors, realStaff, realTreatments, realReferralSources, sourceNoteOptions } from '../data/realData.js'

const PatientRecordManagement = () => {
  const [activeTab, setActiveTab] = useState('records')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // 病例記錄資料 (示例結構，實際使用時從資料庫載入)
  const [patientRecords, setPatientRecords] = useState([
    {
      id: 1,
      patientName: '王小美',
      birthDate: '1990-05-15',
      medicalNumber: 'FL2025001',
      phone: '0912-345-678',
      email: 'wang@example.com',
      address: '台北市信義區',
      emergencyContact: '王媽媽',
      emergencyPhone: '0912-345-679',
      treatmentType: 'EMB',
      doctor: '鍾曜任',
      consultant: '王筑句',
      referralSource: 'LINE Bot',
      sourceNote: '朋友介紹',
      medicalHistory: '無特殊病史',
      allergies: '無已知過敏',
      currentMedications: '無',
      treatmentGoals: '身體雕塑',
      notes: '客戶對療程期望很高',
      createdDate: '2025-10-01',
      status: '進行中',
      lastVisit: '2025-10-08'
    },
    {
      id: 2,
      patientName: '陳先生',
      birthDate: '1985-12-03',
      medicalNumber: 'FL2025002',
      phone: '0923-456-789',
      email: 'chen@example.com',
      address: '新北市板橋區',
      emergencyContact: '陳太太',
      emergencyPhone: '0923-456-790',
      treatmentType: '猛健樂',
      doctor: '林思宇',
      consultant: '張耿齊',
      referralSource: '官網預約',
      sourceNote: 'Google搜尋',
      medicalHistory: '高血壓',
      allergies: '無',
      currentMedications: '降血壓藥',
      treatmentGoals: '改善男性功能',
      notes: '需要定期追蹤血壓',
      createdDate: '2025-09-28',
      status: '進行中',
      lastVisit: '2025-10-05'
    }
  ])

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

  const generateMedicalNumber = () => {
    const year = new Date().getFullYear()
    const nextNumber = patientRecords.length + 1
    return `FL${year}${String(nextNumber).padStart(3, '0')}`
  }

  const handleSaveRecord = () => {
    const recordToSave = {
      ...newRecord,
      id: Date.now(),
      medicalNumber: newRecord.medicalNumber || generateMedicalNumber(),
      createdDate: new Date().toISOString().split('T')[0],
      lastVisit: new Date().toISOString().split('T')[0],
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      '進行中': { color: 'bg-blue-100 text-blue-800', icon: Activity },
      '已完成': { color: 'bg-green-100 text-green-800', icon: TrendingUp },
      '暫停': { color: 'bg-yellow-100 text-yellow-800', icon: Calendar }
    }
    const config = statusConfig[status] || statusConfig['進行中']
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* 標題區域 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">病例基本資料管理</h2>
          <p className="text-slate-400 mt-1">完整的病患資料管理系統</p>
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
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">總病例數</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{patientRecords.length}</div>
            <p className="text-xs text-slate-400">
              +{patientRecords.length} 較上月
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">進行中療程</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {patientRecords.filter(r => r.status === '進行中').length}
            </div>
            <p className="text-xs text-slate-400">
              活躍病患
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">本月新增</CardTitle>
            <UserPlus className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{patientRecords.length}</div>
            <p className="text-xs text-slate-400">
              新病患數量
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">完成療程</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {patientRecords.filter(r => r.status === '已完成').length}
            </div>
            <p className="text-xs text-slate-400">
              成功案例
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要內容區域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="records" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            病例記錄
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            新增病例
          </TabsTrigger>
        </TabsList>

        {/* 病例記錄列表 */}
        <TabsContent value="records" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">病例記錄</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="搜尋病患姓名、病歷號碼或電話..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-white">尚無病例記錄</h3>
                  <p className="mt-1 text-sm text-slate-400">開始建立第一筆病例記錄</p>
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
                    <div key={record.id} className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-white">{record.patientName}</h3>
                            {getStatusBadge(record.status)}
                          </div>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
                            <div>
                              <span className="font-medium text-slate-400">病歷號碼:</span> {record.medicalNumber}
                            </div>
                            <div>
                              <span className="font-medium text-slate-400">聯絡電話:</span> {record.phone}
                            </div>
                            <div>
                              <span className="font-medium text-slate-400">療程類型:</span> {record.treatmentType}
                            </div>
                            <div>
                              <span className="font-medium text-slate-400">主治醫師:</span> {record.doctor}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-slate-400">
                            建立日期: {record.createdDate} | 最後來訪: {record.lastVisit} | 來源: {record.referralSource}
                          </div>
                          {record.notes && (
                            <div className="mt-2 text-sm text-slate-300">
                              <span className="font-medium text-slate-400">備註:</span> {record.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:text-red-300">
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
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">新增病例基本資料</CardTitle>
              <CardDescription className="text-slate-400">請填寫完整的病患基本資料和療程資訊</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本資料 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">基本資料</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName" className="text-white">病患姓名 *</Label>
                    <Input
                      id="patientName"
                      value={newRecord.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      placeholder="請輸入病患姓名"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-white">出生日期</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={newRecord.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medicalNumber" className="text-white">病歷號碼</Label>
                    <Input
                      id="medicalNumber"
                      value={newRecord.medicalNumber}
                      onChange={(e) => handleInputChange('medicalNumber', e.target.value)}
                      placeholder={`自動生成: ${generateMedicalNumber()}`}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">聯絡電話 *</Label>
                    <Input
                      id="phone"
                      value={newRecord.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="請輸入聯絡電話"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">電子郵件</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newRecord.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="請輸入電子郵件"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-white">聯絡地址</Label>
                    <Input
                      id="address"
                      value={newRecord.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="請輸入聯絡地址"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact" className="text-white">緊急聯絡人</Label>
                    <Input
                      id="emergencyContact"
                      value={newRecord.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="請輸入緊急聯絡人"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone" className="text-white">緊急聯絡電話</Label>
                    <Input
                      id="emergencyPhone"
                      value={newRecord.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      placeholder="請輸入緊急聯絡電話"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 療程資訊 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">療程資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="treatmentType" className="text-white">療程類型 *</Label>
                    <Select value={newRecord.treatmentType} onValueChange={(value) => handleInputChange('treatmentType', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="請選擇療程類型" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {realTreatments.map((treatment) => (
                          <SelectItem key={treatment.name} value={treatment.name}>
                            {treatment.name} ({treatment.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="doctor" className="text-white">主治醫師</Label>
                    <Select value={newRecord.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="請選擇主治醫師" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {realDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.name}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="consultant" className="text-white">諮詢師</Label>
                    <Select value={newRecord.consultant} onValueChange={(value) => handleInputChange('consultant', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="請選擇諮詢師" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {realStaff.filter(staff => staff.role === '諮詢師').map((staff) => (
                          <SelectItem key={staff.id} value={staff.name}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="referralSource" className="text-white">客戶來源</Label>
                    <Select value={newRecord.referralSource} onValueChange={(value) => handleInputChange('referralSource', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="請選擇客戶來源" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {realReferralSources.map((source, index) => (
                          <SelectItem key={index} value={source.source}>
                            {source.source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="sourceNote" className="text-white">來源備註</Label>
                    <Select value={newRecord.sourceNote} onValueChange={(value) => handleInputChange('sourceNote', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="請選擇來源備註" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {sourceNoteOptions.map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 醫療資訊 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">醫療資訊</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="medicalHistory" className="text-white">病史</Label>
                    <Textarea
                      id="medicalHistory"
                      value={newRecord.medicalHistory}
                      onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                      placeholder="請輸入相關病史"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="allergies" className="text-white">過敏史</Label>
                    <Textarea
                      id="allergies"
                      value={newRecord.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="請輸入過敏史"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentMedications" className="text-white">目前用藥</Label>
                    <Textarea
                      id="currentMedications"
                      value={newRecord.currentMedications}
                      onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                      placeholder="請輸入目前用藥"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="treatmentGoals" className="text-white">療程目標</Label>
                    <Textarea
                      id="treatmentGoals"
                      value={newRecord.treatmentGoals}
                      onChange={(e) => handleInputChange('treatmentGoals', e.target.value)}
                      placeholder="請輸入療程目標"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-white">備註</Label>
                    <Textarea
                      id="notes"
                      value={newRecord.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="請輸入其他備註"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('records')}
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  取消
                </Button>
                <Button 
                  onClick={handleSaveRecord}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!newRecord.patientName || !newRecord.phone}
                >
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
