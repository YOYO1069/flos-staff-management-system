import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { FileText, Plus, Search, Download, Eye, Edit, Trash2, Calendar, User, Stethoscope, AlertTriangle, CheckCircle } from 'lucide-react'

const ConsentFormManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isNewFormOpen, setIsNewFormOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState(null)
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    birthDate: '',
    treatmentType: '',
    doctor: '',
    assistant: '',
    appointmentDate: '',
    reason: '',
    costItems: [{ name: '', unitPrice: 0, quantity: 1 }]
  })

  // 快速建立範本
  const quickTemplates = [
    { id: 'shock', name: '低能量體外震波療程同意書', icon: '⚡' },
    { id: 'laser', name: '雷射光電治療同意書', icon: '💡' },
    { id: 'injection', name: '注射治療同意書', icon: '💉' }
  ]

  // 同意書範本資料
  const consentTemplates = [
    {
      id: 1,
      name: '肉毒桿菌素注射劑處置同意書',
      type: '注射治療',
      category: 'botox',
      description: '肉毒桿菌注射治療相關風險說明與同意',
      lastUpdated: '2025-10-01',
      usageCount: 45,
      status: 'active',
      riskLevel: 'medium'
    },
    {
      id: 2,
      name: '玻尿酸皮下植入物注射劑處置同意書',
      type: '注射治療',
      category: 'filler',
      description: '玻尿酸注射治療相關風險說明與同意',
      lastUpdated: '2025-09-28',
      usageCount: 38,
      status: 'active',
      riskLevel: 'medium'
    },
    {
      id: 3,
      name: '雷射光電治療同意書',
      type: '雷射治療',
      category: 'laser',
      description: '各種雷射光電治療相關風險說明',
      lastUpdated: '2025-09-25',
      usageCount: 62,
      status: 'active',
      riskLevel: 'low'
    },
    {
      id: 4,
      name: '低能量體外震波療程同意書',
      type: '震波治療',
      category: 'shockwave',
      description: '體外震波治療相關風險說明與同意',
      lastUpdated: '2025-09-20',
      usageCount: 23,
      status: 'active',
      riskLevel: 'low'
    },
    {
      id: 5,
      name: '臉部整形手術同意書',
      type: '手術治療',
      category: 'surgery',
      description: '臉部整形手術相關風險說明與同意',
      lastUpdated: '2025-09-15',
      usageCount: 12,
      status: 'active',
      riskLevel: 'high'
    },
    {
      id: 6,
      name: '身體雕塑治療同意書',
      type: '體雕治療',
      category: 'body',
      description: '身體雕塑相關治療風險說明與同意',
      lastUpdated: '2025-09-10',
      usageCount: 28,
      status: 'active',
      riskLevel: 'medium'
    }
  ]

  // 已建立的同意書記錄
  const consentRecords = [
    {
      id: 1,
      patientName: '王小美',
      patientId: 'P001',
      treatmentType: '皮秒雷射',
      consentType: '雷射光電治療同意書',
      doctor: '鍾曜任醫師',
      assistant: '王筑句諮詢師',
      createdDate: '2025-10-08',
      appointmentDate: '2025-10-09',
      status: 'signed',
      amount: 15000,
      riskLevel: 'low'
    },
    {
      id: 2,
      patientName: '陳先生',
      patientId: 'P002',
      treatmentType: '玻尿酸注射',
      consentType: '玻尿酸皮下植入物注射劑處置同意書',
      doctor: '林思宇醫師',
      assistant: '張耿齊諮詢師',
      createdDate: '2025-10-07',
      appointmentDate: '2025-10-09',
      status: 'pending',
      amount: 18000,
      riskLevel: 'medium'
    },
    {
      id: 3,
      patientName: '林小姐',
      patientId: 'P003',
      treatmentType: '肉毒桿菌',
      consentType: '肉毒桿菌素注射劑處置同意書',
      doctor: '鍾曜任醫師',
      assistant: '劉哲軒諮詢師',
      createdDate: '2025-10-06',
      appointmentDate: '2025-10-08',
      status: 'signed',
      amount: 12000,
      riskLevel: 'medium'
    }
  ]

  const filteredTemplates = consentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || template.category === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      signed: { label: '已簽署', variant: 'default', color: 'bg-green-100 text-green-800' },
      pending: { label: '待簽署', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      expired: { label: '已過期', variant: 'destructive', color: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getRiskBadge = (riskLevel) => {
    const riskConfig = {
      low: { label: '低風險', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      medium: { label: '中風險', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      high: { label: '高風險', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    }
    const config = riskConfig[riskLevel] || riskConfig.medium
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const addCostItem = () => {
    setFormData(prev => ({
      ...prev,
      costItems: [...prev.costItems, { name: '', unitPrice: 0, quantity: 1 }]
    }))
  }

  const removeCostItem = (index) => {
    setFormData(prev => ({
      ...prev,
      costItems: prev.costItems.filter((_, i) => i !== index)
    }))
  }

  const updateCostItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      costItems: prev.costItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  return (
    <div className="space-y-6">
      {/* 標題和統計 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">同意書管理</h2>
          <p className="text-slate-400 mt-2">管理療程同意書範本和簽署記錄</p>
        </div>
        <div className="flex gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-400">範本總數</p>
                  <p className="text-2xl font-bold text-white">{consentTemplates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">本月簽署</p>
                  <p className="text-2xl font-bold text-white">{consentRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            同意書範本
          </TabsTrigger>
          <TabsTrigger value="records" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            簽署記錄
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            建立同意書
          </TabsTrigger>
        </TabsList>

        {/* 同意書範本管理 */}
        <TabsContent value="templates" className="space-y-6">
          {/* 快速建立範本 */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-400" />
                快速建立標準表單
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="h-auto p-4 bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 hover:border-blue-500"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{template.icon}</div>
                      <div className="text-sm text-white">{template.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 搜尋和篩選 */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="搜尋同意書範本..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">所有類型</SelectItem>
                <SelectItem value="botox">肉毒桿菌</SelectItem>
                <SelectItem value="filler">玻尿酸</SelectItem>
                <SelectItem value="laser">雷射治療</SelectItem>
                <SelectItem value="shockwave">震波治療</SelectItem>
                <SelectItem value="surgery">手術治療</SelectItem>
                <SelectItem value="body">體雕治療</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 範本列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-slate-400 mt-2">
                        {template.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {template.type}
                      </Badge>
                      {getRiskBadge(template.riskLevel)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">使用次數</span>
                      <span className="text-white">{template.usageCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">最後更新</span>
                      <span className="text-white">{template.lastUpdated}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        預覽
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        編輯
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 簽署記錄 */}
        <TabsContent value="records" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">同意書簽署記錄</CardTitle>
              <CardDescription className="text-slate-400">
                查看和管理客戶同意書簽署狀況
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">客戶</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">療程</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">醫師</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">諮詢師</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">預約日期</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">風險等級</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">狀態</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consentRecords.map((record) => (
                      <tr key={record.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">{record.patientName}</p>
                            <p className="text-slate-400 text-sm">{record.patientId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white">{record.treatmentType}</p>
                            <p className="text-slate-400 text-sm">{record.consentType}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-blue-400" />
                            <span className="text-white">{record.doctor}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-400" />
                            <span className="text-white">{record.assistant}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{record.appointmentDate}</td>
                        <td className="py-3 px-4">{getRiskBadge(record.riskLevel)}</td>
                        <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
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

        {/* 建立新同意書 */}
        <TabsContent value="create" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">建立新同意書</CardTitle>
              <CardDescription className="text-slate-400">
                為客戶建立療程同意書
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patientName" className="text-white">客戶姓名 *</Label>
                    <Input
                      id="patientName"
                      placeholder="請輸入客戶姓名"
                      className="bg-slate-700 border-slate-600 text-white"
                      value={formData.patientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientId" className="text-white">病歷號碼</Label>
                    <Input
                      id="patientId"
                      placeholder="請輸入病歷號碼"
                      className="bg-slate-700 border-slate-600 text-white"
                      value={formData.patientId}
                      onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-white">出生日期</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      className="bg-slate-700 border-slate-600 text-white"
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="treatmentType" className="text-white">治療類型 *</Label>
                    <Select value={formData.treatmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, treatmentType: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="請選擇治療類型" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="低能量體外震波療程">低能量體外震波療程</SelectItem>
                        <SelectItem value="雷射光電治療">雷射光電治療</SelectItem>
                        <SelectItem value="玻尿酸注射">玻尿酸注射</SelectItem>
                        <SelectItem value="肉毒桿菌注射">肉毒桿菌注射</SelectItem>
                        <SelectItem value="電波拉皮">電波拉皮</SelectItem>
                        <SelectItem value="音波拉提">音波拉提</SelectItem>
                        <SelectItem value="皮秒雷射">皮秒雷射</SelectItem>
                        <SelectItem value="冷凍減脂">冷凍減脂</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="doctor" className="text-white">主治醫師 *</Label>
                    <Select value={formData.doctor} onValueChange={(value) => setFormData(prev => ({ ...prev, doctor: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="請選擇主治醫師" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="鍾曜任醫師">鍾曜任醫師</SelectItem>
                        <SelectItem value="林思宇醫師">林思宇醫師</SelectItem>
                        <SelectItem value="蔡秉遑醫師">蔡秉遑醫師</SelectItem>
                        <SelectItem value="藍子軒醫師">藍子軒醫師</SelectItem>
                        <SelectItem value="黃俊堯醫師">黃俊堯醫師</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assistant" className="text-white">諮詢師</Label>
                    <Select value={formData.assistant} onValueChange={(value) => setFormData(prev => ({ ...prev, assistant: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="請選擇諮詢師" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="萬晴諮詢師">萬晴諮詢師</SelectItem>
                        <SelectItem value="劉哲軒諮詢師">劉哲軒諮詢師</SelectItem>
                        <SelectItem value="張耿齊諮詢師">張耿齊諮詢師</SelectItem>
                        <SelectItem value="謝鏵翧諮詢師">謝鏵翧諮詢師</SelectItem>
                        <SelectItem value="王筑句諮詢師">王筑句諮詢師</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="reason" className="text-white">建議原因</Label>
                <Input
                  id="reason"
                  placeholder="醫師建議此治療的原因"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>

              {/* 費用明細 */}
              <div>
                <Label className="text-white">費用明細</Label>
                <div className="space-y-3 mt-2">
                  {formData.costItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Input
                          placeholder="治療項目名稱"
                          className="bg-slate-700 border-slate-600 text-white"
                          value={item.name}
                          onChange={(e) => updateCostItem(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="單價"
                          className="bg-slate-700 border-slate-600 text-white"
                          value={item.unitPrice}
                          onChange={(e) => updateCostItem(index, 'unitPrice', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="數量"
                          className="bg-slate-700 border-slate-600 text-white"
                          value={item.quantity}
                          onChange={(e) => updateCostItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCostItem(index)}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCostItem}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    新增項目
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">
                  預覽同意書
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  建立同意書
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConsentFormManagement
