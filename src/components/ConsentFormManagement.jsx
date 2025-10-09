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
import { FileText, Plus, Search, Download, Eye, Edit, Trash2, Calendar, User, Stethoscope } from 'lucide-react'

const ConsentFormManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isNewFormOpen, setIsNewFormOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState(null)

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
      status: 'active'
    },
    {
      id: 2,
      name: '玻尿酸皮下植入物注射劑處置同意書',
      type: '注射治療',
      category: 'filler',
      description: '玻尿酸注射治療相關風險說明與同意',
      lastUpdated: '2025-09-28',
      usageCount: 38,
      status: 'active'
    },
    {
      id: 3,
      name: '雷射光電治療同意書',
      type: '雷射治療',
      category: 'laser',
      description: '各種雷射光電治療相關風險說明',
      lastUpdated: '2025-09-25',
      usageCount: 62,
      status: 'active'
    },
    {
      id: 4,
      name: '低能量體外震波療程同意書',
      type: '震波治療',
      category: 'shockwave',
      description: '體外震波治療相關風險說明與同意',
      lastUpdated: '2025-09-20',
      usageCount: 23,
      status: 'active'
    },
    {
      id: 5,
      name: '臉部整形手術同意書',
      type: '手術治療',
      category: 'surgery',
      description: '臉部整形手術相關風險說明與同意',
      lastUpdated: '2025-09-15',
      usageCount: 12,
      status: 'active'
    },
    {
      id: 6,
      name: '身體雕塑治療同意書',
      type: '體雕治療',
      category: 'body',
      description: '身體雕塑相關治療風險說明與同意',
      lastUpdated: '2025-09-10',
      usageCount: 28,
      status: 'active'
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
      doctor: '李醫師',
      assistant: '張護理師',
      createdDate: '2025-10-08',
      appointmentDate: '2025-10-09',
      status: 'signed',
      amount: 15000
    },
    {
      id: 2,
      patientName: '陳先生',
      patientId: 'P002',
      treatmentType: '玻尿酸注射',
      consentType: '玻尿酸皮下植入物注射劑處置同意書',
      doctor: '王醫師',
      assistant: '陳護理師',
      createdDate: '2025-10-07',
      appointmentDate: '2025-10-09',
      status: 'pending',
      amount: 18000
    },
    {
      id: 3,
      patientName: '林小姐',
      patientId: 'P003',
      treatmentType: '肉毒桿菌',
      consentType: '肉毒桿菌素注射劑處置同意書',
      doctor: '李醫師',
      assistant: '張護理師',
      createdDate: '2025-10-06',
      appointmentDate: '2025-10-08',
      status: 'signed',
      amount: 12000
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
      signed: { label: '已簽署', variant: 'default' },
      pending: { label: '待簽署', variant: 'secondary' },
      expired: { label: '已過期', variant: 'destructive' }
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* 標題和統計 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">同意書管理</h2>
          <p className="text-gray-400 mt-2">管理療程同意書範本和簽署記錄</p>
        </div>
        <div className="flex gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">範本總數</p>
                  <p className="text-2xl font-bold text-white">{consentTemplates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">本月簽署</p>
                  <p className="text-2xl font-bold text-white">{consentRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600">
            同意書範本
          </TabsTrigger>
          <TabsTrigger value="records" className="data-[state=active]:bg-blue-600">
            簽署記錄
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-blue-600">
            建立同意書
          </TabsTrigger>
        </TabsList>

        {/* 同意書範本管理 */}
        <TabsContent value="templates" className="space-y-6">
          {/* 搜尋和篩選 */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜尋同意書範本..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
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
              <Card key={template.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-gray-400 mt-2">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">使用次數</span>
                      <span className="text-white">{template.usageCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">最後更新</span>
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
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">同意書簽署記錄</CardTitle>
              <CardDescription className="text-gray-400">
                查看和管理客戶同意書簽署狀況
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">客戶</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">療程</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">醫師</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">跟診人員</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">預約日期</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">金額</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">狀態</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consentRecords.map((record) => (
                      <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">{record.patientName}</p>
                            <p className="text-gray-400 text-sm">{record.patientId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white">{record.treatmentType}</p>
                            <p className="text-gray-400 text-sm">{record.consentType}</p>
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
                        <td className="py-3 px-4 text-white">NT${record.amount.toLocaleString()}</td>
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
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">建立新同意書</CardTitle>
              <CardDescription className="text-gray-400">
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
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientId" className="text-white">病歷號碼</Label>
                    <Input
                      id="patientId"
                      placeholder="請輸入病歷號碼"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-white">出生日期</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="treatmentType" className="text-white">治療類型 *</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="請選擇治療類型" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="botox">肉毒桿菌注射</SelectItem>
                        <SelectItem value="filler">玻尿酸注射</SelectItem>
                        <SelectItem value="laser">皮秒雷射</SelectItem>
                        <SelectItem value="rf">電波拉皮</SelectItem>
                        <SelectItem value="hifu">音波拉提</SelectItem>
                        <SelectItem value="hair">雷射除毛</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="doctor" className="text-white">主治醫師 *</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="請選擇主治醫師" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="dr-lee">李醫師</SelectItem>
                        <SelectItem value="dr-wang">王醫師</SelectItem>
                        <SelectItem value="dr-chen">陳醫師</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assistant" className="text-white">跟診人員 *</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="請選擇跟診人員" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="nurse-zhang">張護理師</SelectItem>
                        <SelectItem value="nurse-chen">陳護理師</SelectItem>
                        <SelectItem value="nurse-liu">劉護理師</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="reason" className="text-white">建議原因</Label>
                <Textarea
                  id="reason"
                  placeholder="醫師建議此治療的原因"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  建立同意書
                </Button>
                <Button variant="outline" className="flex-1">
                  預覽範本
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
