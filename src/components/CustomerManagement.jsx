import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Users, Plus, Search, Phone, Mail, Calendar, Star, Gift, TrendingUp, Eye, Edit, Trash2, MessageCircle } from 'lucide-react'

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // 模擬客戶資料
  const customers = [
    {
      id: 1,
      name: '王小美',
      phone: '0912-345-678',
      email: 'wang@example.com',
      birthday: '1990-05-15',
      gender: 'female',
      source: 'LINE Bot',
      referralSource: '朋友介紹',
      marketingChannel: 'Instagram廣告',
      tags: ['VIP', '回頭客'],
      totalSpent: 45000,
      visitCount: 8,
      lastVisit: '2025-10-05',
      nextAppointment: '2025-10-12',
      preferences: {
        services: ['皮秒雷射', '玻尿酸注射'],
        staff: '李醫師',
        timeSlots: ['14:00-16:00']
      },
      treatmentHistory: [
        { date: '2025-10-05', service: '皮秒雷射', staff: '李醫師', amount: 15000, satisfaction: 5 },
        { date: '2025-09-20', service: '玻尿酸注射', staff: '李醫師', amount: 18000, satisfaction: 5 },
        { date: '2025-08-15', service: '皮秒雷射', staff: '李醫師', amount: 12000, satisfaction: 4 }
      ],
      notes: '對皮秒雷射效果很滿意，偏好下午時段'
    },
    {
      id: 2,
      name: '陳先生',
      phone: '0923-456-789',
      email: 'chen@example.com',
      birthday: '1985-12-03',
      gender: 'male',
      source: '官網預約',
      referralSource: 'Google搜尋',
      marketingChannel: 'SEO自然流量',
      tags: ['新客'],
      totalSpent: 12000,
      visitCount: 2,
      lastVisit: '2025-09-28',
      nextAppointment: '2025-10-09',
      preferences: {
        services: ['玻尿酸注射'],
        staff: '張護理師',
        timeSlots: ['10:00-12:00']
      },
      treatmentHistory: [
        { date: '2025-09-28', service: '玻尿酸注射', staff: '張護理師', amount: 8000, satisfaction: 4 },
        { date: '2025-09-10', service: '諮詢', staff: '張護理師', amount: 0, satisfaction: 5 }
      ],
      notes: '首次療程，需要詳細說明過程'
    },
    {
      id: 3,
      name: '林小姐',
      phone: '0934-567-890',
      email: 'lin@example.com',
      birthday: '1992-08-22',
      gender: 'female',
      source: '朋友推薦',
      referralSource: '王小美推薦',
      marketingChannel: '口碑推薦',
      tags: ['VIP', '高消費'],
      totalSpent: 85000,
      visitCount: 12,
      lastVisit: '2025-10-01',
      nextAppointment: '2025-10-09',
      preferences: {
        services: ['電波拉皮', '音波拉提'],
        staff: '李醫師',
        timeSlots: ['14:00-17:00']
      },
      treatmentHistory: [
        { date: '2025-10-01', service: '電波拉皮', staff: '李醫師', amount: 35000, satisfaction: 5 },
        { date: '2025-09-15', service: '音波拉提', staff: '李醫師', amount: 28000, satisfaction: 5 },
        { date: '2025-08-20', service: '電波拉皮', staff: '李醫師', amount: 22000, satisfaction: 5 }
      ],
      notes: '長期客戶，對高端療程有需求'
    },
    {
      id: 4,
      name: '黃太太',
      phone: '0945-678-901',
      email: 'huang@example.com',
      birthday: '1978-03-10',
      gender: 'female',
      source: 'Google廣告',
      referralSource: 'Facebook廣告',
      marketingChannel: 'Facebook Ads',
      tags: ['回頭客'],
      totalSpent: 32000,
      visitCount: 5,
      lastVisit: '2025-09-25',
      nextAppointment: '2025-10-09',
      preferences: {
        services: ['音波拉提', '肉毒桿菌'],
        staff: '王醫師',
        timeSlots: ['15:00-18:00']
      },
      treatmentHistory: [
        { date: '2025-09-25', service: '音波拉提', staff: '王醫師', amount: 18000, satisfaction: 4 },
        { date: '2025-08-10', service: '肉毒桿菌', staff: '王醫師', amount: 14000, satisfaction: 5 }
      ],
      notes: '偏好王醫師，下午時段較方便'
    }
  ]

  const customerTags = ['VIP', '新客', '回頭客', '高消費', '潛在客戶']
  const sources = ['LINE Bot', '官網預約', '朋友推薦', 'Google廣告', 'Facebook', '其他']

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = filterTag === 'all' || customer.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'recent':
        return new Date(b.lastVisit) - new Date(a.lastVisit)
      case 'spending':
        return b.totalSpent - a.totalSpent
      case 'visits':
        return b.visitCount - a.visitCount
      default:
        return 0
    }
  })

  const getTagColor = (tag) => {
    switch (tag) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-200'
      case '新客': return 'bg-green-100 text-green-800 border-green-200'
      case '回頭客': return 'bg-blue-100 text-blue-800 border-blue-200'
      case '高消費': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case '潛在客戶': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCustomerStats = () => {
    return {
      total: customers.length,
      vip: customers.filter(c => c.tags.includes('VIP')).length,
      newCustomers: customers.filter(c => c.tags.includes('新客')).length,
      avgSpending: Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)
    }
  }

  const stats = getCustomerStats()

  const renderCustomerDetail = (customer) => {
    return (
      <Dialog open={selectedCustomer?.id === customer.id} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{customer.name} - 客戶詳細資料</span>
              <div className="flex space-x-2">
                {customer.tags.map(tag => (
                  <Badge key={tag} className={getTagColor(tag)}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="basic">基本資料</TabsTrigger>
              <TabsTrigger value="history">療程歷史</TabsTrigger>
              <TabsTrigger value="preferences">偏好設定</TabsTrigger>
              <TabsTrigger value="analytics">數據分析</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>姓名</Label>
                  <Input value={customer.name} className="bg-slate-700 border-slate-600" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>聯絡電話</Label>
                  <Input value={customer.phone} className="bg-slate-700 border-slate-600" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>電子郵件</Label>
                  <Input value={customer.email} className="bg-slate-700 border-slate-600" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>生日</Label>
                  <Input value={customer.birthday} className="bg-slate-700 border-slate-600" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>性別</Label>
                  <Input value={customer.gender === 'female' ? '女性' : '男性'} className="bg-slate-700 border-slate-600" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>來源管道</Label>
                  <Input value={customer.source} className="bg-slate-700 border-slate-600" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>備註</Label>
                <Textarea value={customer.notes} className="bg-slate-700 border-slate-600" rows={3} readOnly />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3">
                {customer.treatmentHistory.map((treatment, index) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{treatment.service}</div>
                        <div className="text-sm text-slate-400">{treatment.date} • {treatment.staff}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < treatment.satisfaction ? 'text-yellow-400 fill-current' : 'text-slate-500'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-400">({treatment.satisfaction}/5)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>偏好療程</Label>
                  <div className="flex flex-wrap gap-2">
                    {customer.preferences.services.map(service => (
                      <Badge key={service} variant="outline" className="text-blue-400 border-blue-400">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>偏好醫師/護理師</Label>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {customer.preferences.staff}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>偏好時段</Label>
                  <div className="flex flex-wrap gap-2">
                    {customer.preferences.timeSlots.map(slot => (
                      <Badge key={slot} variant="outline" className="text-purple-400 border-purple-400">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-300">總消費金額</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">
                      NT$ {customer.totalSpent.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-300">來訪次數</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400">
                      {customer.visitCount} 次
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-300">平均消費</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400">
                      NT$ {Math.round(customer.totalSpent / customer.visitCount).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-300">滿意度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">
                      {(customer.treatmentHistory.reduce((sum, t) => sum + t.satisfaction, 0) / customer.treatmentHistory.length).toFixed(1)}/5
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
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
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                客戶資料管理
              </CardTitle>
              <CardDescription className="text-slate-400">
                管理客戶基本資料、療程歷史和偏好設定
              </CardDescription>
            </div>
            <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  新增客戶
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>建立新客戶</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    填寫客戶基本資料
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">客戶姓名</Label>
                    <Input id="name" placeholder="請輸入客戶姓名" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">聯絡電話</Label>
                    <Input id="phone" placeholder="請輸入聯絡電話" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">電子郵件</Label>
                    <Input id="email" type="email" placeholder="請輸入電子郵件" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">生日</Label>
                    <Input id="birthday" type="date" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">性別</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="選擇性別" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="female">女性</SelectItem>
                        <SelectItem value="male">男性</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">來源管道</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="選擇來源" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {sources.map(source => (
                          <SelectItem key={source} value={source}>
                            {source}
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
                  <Button variant="outline" onClick={() => setIsNewCustomerOpen(false)}>
                    取消
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    建立客戶
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* 客戶統計 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">總客戶數</div>
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">VIP客戶</div>
                  <div className="text-2xl font-bold text-purple-400">{stats.vip}</div>
                </div>
                <Star className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">新客戶</div>
                  <div className="text-2xl font-bold text-green-400">{stats.newCustomers}</div>
                </div>
                <Gift className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">平均消費</div>
                  <div className="text-2xl font-bold text-yellow-400">NT$ {stats.avgSpending.toLocaleString()}</div>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* 篩選和搜尋 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="搜尋客戶姓名、電話或郵件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">全部標籤</SelectItem>
                  {customerTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="recent">最近來訪</SelectItem>
                  <SelectItem value="name">姓名排序</SelectItem>
                  <SelectItem value="spending">消費金額</SelectItem>
                  <SelectItem value="visits">來訪次數</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 客戶列表 */}
          <div className="space-y-4">
            {sortedCustomers.map(customer => (
              <Card key={customer.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{customer.name}</div>
                        <div className="text-sm text-slate-400">{customer.phone} • {customer.email}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          {customer.tags.map(tag => (
                            <Badge key={tag} className={getTagColor(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm text-slate-300">總消費: NT$ {customer.totalSpent.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">來訪: {customer.visitCount}次 • 最後: {customer.lastVisit}</div>
                        {customer.nextAppointment && (
                          <div className="text-sm text-blue-400">下次預約: {customer.nextAppointment}</div>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-white"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 客戶詳細資料對話框 */}
      {selectedCustomer && renderCustomerDetail(selectedCustomer)}
    </div>
  )
}

export default CustomerManagement
