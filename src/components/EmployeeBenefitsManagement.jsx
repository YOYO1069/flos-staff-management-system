import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Gift, Users, FileText, Plus, Edit, Trash2, Check, X, Calendar, DollarSign, TrendingUp, Award, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase.js'

const EmployeeBenefitsManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview')
  const [benefitTypes, setBenefitTypes] = useState([])
  const [employees, setEmployees] = useState([])
  const [employeeBenefits, setEmployeeBenefits] = useState([])
  const [benefitRecords, setBenefitRecords] = useState([])
  const [loading, setLoading] = useState(true)

  // 對話框狀態
  const [benefitTypeDialog, setBenefitTypeDialog] = useState(false)
  const [employeeDialog, setEmployeeDialog] = useState(false)
  const [benefitRecordDialog, setBenefitRecordDialog] = useState(false)
  
  // 表單狀態
  const [currentBenefitType, setCurrentBenefitType] = useState(null)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [currentRecord, setCurrentRecord] = useState(null)

  // 載入資料
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    await Promise.all([
      loadBenefitTypes(),
      loadEmployees(),
      loadEmployeeBenefits(),
      loadBenefitRecords()
    ])
    setLoading(false)
  }

  const loadBenefitTypes = async () => {
    const { data, error } = await supabase
      .from('benefit_types')
      .select('*')
      .order('category', { ascending: true })
    if (!error) setBenefitTypes(data || [])
  }

  const loadEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true })
    if (!error) setEmployees(data || [])
  }

  const loadEmployeeBenefits = async () => {
    const { data, error } = await supabase
      .from('employee_benefits')
      .select(`
        *,
        employees(name, employee_id),
        benefit_types(name, category)
      `)
      .order('created_at', { ascending: false })
    if (!error) setEmployeeBenefits(data || [])
  }

  const loadBenefitRecords = async () => {
    const { data, error } = await supabase
      .from('benefit_records')
      .select(`
        *,
        employees(name, employee_id),
        benefit_types(name, category)
      `)
      .order('record_date', { ascending: false })
    if (!error) setBenefitRecords(data || [])
  }

  // 福利項目CRUD
  const saveBenefitType = async () => {
    if (!currentBenefitType?.name || !currentBenefitType?.category) {
      alert('請填寫必填欄位')
      return
    }

    const { error } = currentBenefitType.id
      ? await supabase.from('benefit_types').update(currentBenefitType).eq('id', currentBenefitType.id)
      : await supabase.from('benefit_types').insert([currentBenefitType])

    if (!error) {
      setBenefitTypeDialog(false)
      setCurrentBenefitType(null)
      loadBenefitTypes()
    } else {
      alert('儲存失敗: ' + error.message)
    }
  }

  const deleteBenefitType = async (id) => {
    if (!confirm('確定要刪除此福利項目嗎?')) return
    const { error } = await supabase.from('benefit_types').delete().eq('id', id)
    if (!error) loadBenefitTypes()
  }

  // 員工CRUD
  const saveEmployee = async () => {
    if (!currentEmployee?.name || !currentEmployee?.employee_id) {
      alert('請填寫必填欄位')
      return
    }

    const { error } = currentEmployee.id
      ? await supabase.from('employees').update(currentEmployee).eq('id', currentEmployee.id)
      : await supabase.from('employees').insert([currentEmployee])

    if (!error) {
      setEmployeeDialog(false)
      setCurrentEmployee(null)
      loadEmployees()
    } else {
      alert('儲存失敗: ' + error.message)
    }
  }

  const deleteEmployee = async (id) => {
    if (!confirm('確定要刪除此員工嗎?')) return
    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (!error) loadEmployees()
  }

  // 福利記錄CRUD
  const saveBenefitRecord = async () => {
    if (!currentRecord?.employee_id || !currentRecord?.benefit_type_id || !currentRecord?.record_date) {
      alert('請填寫必填欄位')
      return
    }

    const { error } = currentRecord.id
      ? await supabase.from('benefit_records').update(currentRecord).eq('id', currentRecord.id)
      : await supabase.from('benefit_records').insert([{ ...currentRecord, status: 'pending' }])

    if (!error) {
      setBenefitRecordDialog(false)
      setCurrentRecord(null)
      loadBenefitRecords()
    } else {
      alert('儲存失敗: ' + error.message)
    }
  }

  const deleteBenefitRecord = async (id) => {
    if (!confirm('確定要刪除此記錄嗎?')) return
    const { error } = await supabase.from('benefit_records').delete().eq('id', id)
    if (!error) loadBenefitRecords()
  }

  const updateRecordStatus = async (id, status) => {
    const { error } = await supabase
      .from('benefit_records')
      .update({ status, approved_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) loadBenefitRecords()
  }

  // 統計數據
  const stats = {
    totalBenefitTypes: benefitTypes.filter(b => b.is_active).length,
    totalEmployees: employees.filter(e => e.status === 'active').length,
    totalBenefits: employeeBenefits.filter(b => b.status === 'active').length,
    pendingRecords: benefitRecords.filter(r => r.status === 'pending').length
  }

  // 類別顏色映射
  const categoryColors = {
    insurance: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    leave: 'bg-green-500/10 text-green-600 border-green-500/20',
    allowance: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    bonus: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    other: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  }

  const categoryLabels = {
    insurance: '保險',
    leave: '假期',
    allowance: '津貼',
    bonus: '獎金',
    other: '其他'
  }

  const statusColors = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    inactive: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    resigned: 'bg-red-500/10 text-red-600 border-red-500/20',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    approved: 'bg-green-500/10 text-green-600 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  }

  const statusLabels = {
    active: '在職',
    inactive: '停職',
    resigned: '離職',
    pending: '待審核',
    approved: '已核准',
    rejected: '已拒絕',
    completed: '已完成'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Gift className="w-8 h-8 text-white" />
            </div>
            員工福利追蹤系統
          </h1>
          <p className="text-gray-500 mt-2">管理員工福利項目、配置與申請記錄</p>
        </div>
      </div>

      {/* 子標籤導航 */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-100 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            總覽
          </TabsTrigger>
          <TabsTrigger 
            value="benefit-types" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all"
          >
            <Award className="w-4 h-4 mr-2" />
            福利項目
          </TabsTrigger>
          <TabsTrigger 
            value="employees" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all"
          >
            <Users className="w-4 h-4 mr-2" />
            員工管理
          </TabsTrigger>
          <TabsTrigger 
            value="records" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all"
          >
            <FileText className="w-4 h-4 mr-2" />
            福利記錄
          </TabsTrigger>
        </TabsList>

        {/* 總覽 */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-700">福利項目總數</CardTitle>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{stats.totalBenefitTypes}</div>
                <p className="text-xs text-blue-600 mt-1">啟用中的福利項目</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-green-700">員工總數</CardTitle>
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{stats.totalEmployees}</div>
                <p className="text-xs text-green-600 mt-1">在職員工人數</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-purple-700">福利配置數</CardTitle>
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{stats.totalBenefits}</div>
                <p className="text-xs text-purple-600 mt-1">啟用中的福利配置</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-amber-50 to-amber-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-amber-700">待審核申請</CardTitle>
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900">{stats.pendingRecords}</div>
                <p className="text-xs text-amber-600 mt-1">等待處理的申請</p>
              </CardContent>
            </Card>
          </div>

          {/* 系統說明 */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">系統功能說明</CardTitle>
              <CardDescription>員工福利追蹤系統提供完整的福利管理框架</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    福利項目管理
                  </h3>
                  <p className="text-sm text-blue-700">
                    管理各類福利項目,包含保險、假期、津貼、獎金等,可設定適用資格和計算方式。
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    員工管理
                  </h3>
                  <p className="text-sm text-green-700">
                    維護員工基本資料,包含姓名、部門、職位、到職日期等,並管理員工狀態。
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    福利配置
                  </h3>
                  <p className="text-sm text-purple-700">
                    為員工配置福利項目,設定生效期間、金額和發放頻率。
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    福利記錄
                  </h3>
                  <p className="text-sm text-amber-700">
                    記錄福利申請與使用情況,支援審核流程,追蹤福利發放狀態。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 福利項目管理 */}
        <TabsContent value="benefit-types" className="space-y-6 mt-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">福利項目列表</CardTitle>
                  <CardDescription>管理所有福利項目類型</CardDescription>
                </div>
                <Dialog open={benefitTypeDialog} onOpenChange={setBenefitTypeDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setCurrentBenefitType({ is_active: true })}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      新增福利項目
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{currentBenefitType?.id ? '編輯' : '新增'}福利項目</DialogTitle>
                      <DialogDescription>填寫福利項目的詳細資訊</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">項目名稱 *</Label>
                          <Input
                            id="name"
                            value={currentBenefitType?.name || ''}
                            onChange={(e) => setCurrentBenefitType({ ...currentBenefitType, name: e.target.value })}
                            placeholder="例如:年終獎金"
                            className="border-gray-300 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">類別 *</Label>
                          <Select
                            value={currentBenefitType?.category || ''}
                            onValueChange={(value) => setCurrentBenefitType({ ...currentBenefitType, category: value })}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500">
                              <SelectValue placeholder="選擇類別" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="insurance">保險</SelectItem>
                              <SelectItem value="leave">假期</SelectItem>
                              <SelectItem value="allowance">津貼</SelectItem>
                              <SelectItem value="bonus">獎金</SelectItem>
                              <SelectItem value="other">其他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">說明</Label>
                        <Textarea
                          id="description"
                          value={currentBenefitType?.description || ''}
                          onChange={(e) => setCurrentBenefitType({ ...currentBenefitType, description: e.target.value })}
                          placeholder="福利項目的詳細說明"
                          className="border-gray-300 focus:border-blue-500 min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eligibility">適用資格</Label>
                        <Input
                          id="eligibility"
                          value={currentBenefitType?.eligibility_rules || ''}
                          onChange={(e) => setCurrentBenefitType({ ...currentBenefitType, eligibility_rules: e.target.value })}
                          placeholder="例如:到職滿3個月的正職員工"
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="calculation">計算方式</Label>
                        <Input
                          id="calculation"
                          value={currentBenefitType?.calculation_method || ''}
                          onChange={(e) => setCurrentBenefitType({ ...currentBenefitType, calculation_method: e.target.value })}
                          placeholder="例如:依績效及年資計算"
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setBenefitTypeDialog(false)}>
                        取消
                      </Button>
                      <Button onClick={saveBenefitType} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        儲存
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">項目名稱</TableHead>
                      <TableHead className="font-semibold">類別</TableHead>
                      <TableHead className="font-semibold">說明</TableHead>
                      <TableHead className="font-semibold">適用資格</TableHead>
                      <TableHead className="font-semibold">狀態</TableHead>
                      <TableHead className="font-semibold text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {benefitTypes.map((benefit) => (
                      <TableRow key={benefit.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{benefit.name}</TableCell>
                        <TableCell>
                          <Badge className={`${categoryColors[benefit.category]} border font-medium`}>
                            {categoryLabels[benefit.category]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600">
                          {benefit.description || '-'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600">
                          {benefit.eligibility_rules || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${benefit.is_active ? statusColors.active : statusColors.inactive} border font-medium`}>
                            {benefit.is_active ? '啟用' : '停用'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentBenefitType(benefit)
                                setBenefitTypeDialog(true)
                              }}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBenefitType(benefit.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 員工管理 */}
        <TabsContent value="employees" className="space-y-6 mt-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">員工列表</CardTitle>
                  <CardDescription>管理所有員工資料</CardDescription>
                </div>
                <Dialog open={employeeDialog} onOpenChange={setEmployeeDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setCurrentEmployee({ status: 'active' })}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      新增員工
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{currentEmployee?.id ? '編輯' : '新增'}員工</DialogTitle>
                      <DialogDescription>填寫員工的基本資料</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emp-name">姓名 *</Label>
                          <Input
                            id="emp-name"
                            value={currentEmployee?.name || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
                            placeholder="員工姓名"
                            className="border-gray-300 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emp-id">員工編號 *</Label>
                          <Input
                            id="emp-id"
                            value={currentEmployee?.employee_id || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, employee_id: e.target.value })}
                            placeholder="唯一識別碼"
                            className="border-gray-300 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">部門</Label>
                          <Input
                            id="department"
                            value={currentEmployee?.department || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, department: e.target.value })}
                            placeholder="所屬部門"
                            className="border-gray-300 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">職位</Label>
                          <Input
                            id="position"
                            value={currentEmployee?.position || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, position: e.target.value })}
                            placeholder="職位名稱"
                            className="border-gray-300 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hire-date">到職日期</Label>
                          <Input
                            id="hire-date"
                            type="date"
                            value={currentEmployee?.hire_date || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, hire_date: e.target.value })}
                            className="border-gray-300 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">狀態</Label>
                          <Select
                            value={currentEmployee?.status || 'active'}
                            onValueChange={(value) => setCurrentEmployee({ ...currentEmployee, status: value })}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-green-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">在職</SelectItem>
                              <SelectItem value="inactive">停職</SelectItem>
                              <SelectItem value="resigned">離職</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={currentEmployee?.email || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
                            placeholder="email@example.com"
                            className="border-gray-300 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">電話</Label>
                          <Input
                            id="phone"
                            value={currentEmployee?.phone || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
                            placeholder="聯絡電話"
                            className="border-gray-300 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEmployeeDialog(false)}>
                        取消
                      </Button>
                      <Button onClick={saveEmployee} className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                        儲存
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">姓名</TableHead>
                      <TableHead className="font-semibold">員工編號</TableHead>
                      <TableHead className="font-semibold">部門</TableHead>
                      <TableHead className="font-semibold">職位</TableHead>
                      <TableHead className="font-semibold">到職日期</TableHead>
                      <TableHead className="font-semibold">狀態</TableHead>
                      <TableHead className="font-semibold text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell className="text-gray-600">{employee.employee_id}</TableCell>
                        <TableCell className="text-gray-600">{employee.department || '-'}</TableCell>
                        <TableCell className="text-gray-600">{employee.position || '-'}</TableCell>
                        <TableCell className="text-gray-600">
                          {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('zh-TW') : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[employee.status]} border font-medium`}>
                            {statusLabels[employee.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentEmployee(employee)
                                setEmployeeDialog(true)
                              }}
                              className="hover:bg-green-50 hover:text-green-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteEmployee(employee.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 福利記錄 */}
        <TabsContent value="records" className="space-y-6 mt-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">福利記錄列表</CardTitle>
                  <CardDescription>管理所有福利申請與使用記錄</CardDescription>
                </div>
                <Dialog open={benefitRecordDialog} onOpenChange={setBenefitRecordDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setCurrentRecord({})}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      新增記錄
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{currentRecord?.id ? '編輯' : '新增'}福利記錄</DialogTitle>
                      <DialogDescription>填寫福利申請或使用記錄</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rec-employee">員工 *</Label>
                          <Select
                            value={currentRecord?.employee_id?.toString() || ''}
                            onValueChange={(value) => setCurrentRecord({ ...currentRecord, employee_id: parseInt(value) })}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-purple-500">
                              <SelectValue placeholder="選擇員工" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.filter(e => e.status === 'active').map((emp) => (
                                <SelectItem key={emp.id} value={emp.id.toString()}>
                                  {emp.name} ({emp.employee_id})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rec-benefit">福利項目 *</Label>
                          <Select
                            value={currentRecord?.benefit_type_id?.toString() || ''}
                            onValueChange={(value) => setCurrentRecord({ ...currentRecord, benefit_type_id: parseInt(value) })}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-purple-500">
                              <SelectValue placeholder="選擇福利項目" />
                            </SelectTrigger>
                            <SelectContent>
                              {benefitTypes.filter(b => b.is_active).map((benefit) => (
                                <SelectItem key={benefit.id} value={benefit.id.toString()}>
                                  {benefit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rec-date">日期 *</Label>
                          <Input
                            id="rec-date"
                            type="date"
                            value={currentRecord?.record_date || ''}
                            onChange={(e) => setCurrentRecord({ ...currentRecord, record_date: e.target.value })}
                            className="border-gray-300 focus:border-purple-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rec-amount">金額</Label>
                          <Input
                            id="rec-amount"
                            type="number"
                            value={currentRecord?.amount || ''}
                            onChange={(e) => setCurrentRecord({ ...currentRecord, amount: parseFloat(e.target.value) })}
                            placeholder="0.00"
                            className="border-gray-300 focus:border-purple-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rec-desc">說明</Label>
                        <Textarea
                          id="rec-desc"
                          value={currentRecord?.description || ''}
                          onChange={(e) => setCurrentRecord({ ...currentRecord, description: e.target.value })}
                          placeholder="申請原因或詳細說明"
                          className="border-gray-300 focus:border-purple-500 min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rec-notes">備註</Label>
                        <Textarea
                          id="rec-notes"
                          value={currentRecord?.notes || ''}
                          onChange={(e) => setCurrentRecord({ ...currentRecord, notes: e.target.value })}
                          placeholder="其他備註資訊"
                          className="border-gray-300 focus:border-purple-500 min-h-[60px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setBenefitRecordDialog(false)}>
                        取消
                      </Button>
                      <Button onClick={saveBenefitRecord} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        儲存
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">日期</TableHead>
                      <TableHead className="font-semibold">員工</TableHead>
                      <TableHead className="font-semibold">福利項目</TableHead>
                      <TableHead className="font-semibold">金額</TableHead>
                      <TableHead className="font-semibold">說明</TableHead>
                      <TableHead className="font-semibold">狀態</TableHead>
                      <TableHead className="font-semibold text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {benefitRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">
                          {new Date(record.record_date).toLocaleDateString('zh-TW')}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {record.employees?.name}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${categoryColors[record.benefit_types?.category]} border font-medium`}>
                            {record.benefit_types?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {record.amount ? `NT$ ${record.amount.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600">
                          {record.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[record.status]} border font-medium`}>
                            {statusLabels[record.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {record.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateRecordStatus(record.id, 'approved')}
                                  className="hover:bg-green-50 hover:text-green-600"
                                  title="核准"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateRecordStatus(record.id, 'rejected')}
                                  className="hover:bg-red-50 hover:text-red-600"
                                  title="拒絕"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentRecord(record)
                                setBenefitRecordDialog(true)
                              }}
                              className="hover:bg-purple-50 hover:text-purple-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBenefitRecord(record.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EmployeeBenefitsManagement
