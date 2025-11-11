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
import { Gift, Users, FileText, Plus, Edit, Trash2, Check, X, Calendar, DollarSign } from 'lucide-react'
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
      alert('操作失敗: ' + error.message)
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
      alert('操作失敗: ' + error.message)
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
      : await supabase.from('benefit_records').insert([currentRecord])

    if (!error) {
      setBenefitRecordDialog(false)
      setCurrentRecord(null)
      loadBenefitRecords()
    } else {
      alert('操作失敗: ' + error.message)
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
      .update({ status, approved_at: status === 'approved' ? new Date().toISOString() : null })
      .eq('id', id)
    if (!error) loadBenefitRecords()
  }

  // 類別顏色
  const getCategoryColor = (category) => {
    const colors = {
      insurance: 'bg-blue-100 text-blue-800',
      leave: 'bg-green-100 text-green-800',
      allowance: 'bg-purple-100 text-purple-800',
      bonus: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.other
  }

  const getCategoryText = (category) => {
    const texts = {
      insurance: '保險',
      leave: '假期',
      allowance: '津貼',
      bonus: '獎金',
      other: '其他'
    }
    return texts[category] || '其他'
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || colors.inactive
  }

  const getStatusText = (status) => {
    const texts = {
      active: '啟用',
      inactive: '停用',
      pending: '待審核',
      approved: '已核准',
      rejected: '已拒絕',
      completed: '已完成'
    }
    return texts[status] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">載入中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">福利項目</CardTitle>
            <Gift className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{benefitTypes.length}</div>
            <p className="text-xs text-slate-400">可用福利類型</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">員工總數</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{employees.length}</div>
            <p className="text-xs text-slate-400">在職員工</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">福利配置</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{employeeBenefits.length}</div>
            <p className="text-xs text-slate-400">已配置項目</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">待審核</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {benefitRecords.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-slate-400">待處理申請</p>
          </CardContent>
        </Card>
      </div>

      {/* 子標籤 */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="benefit-types">福利項目管理</TabsTrigger>
          <TabsTrigger value="employees">員工管理</TabsTrigger>
          <TabsTrigger value="records">福利記錄</TabsTrigger>
        </TabsList>

        {/* 總覽 */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">員工福利追蹤系統</CardTitle>
              <CardDescription className="text-slate-400">
                管理診所員工福利項目、配置與申請記錄
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">系統功能</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>福利項目管理:定義各類福利項目(保險、假期、津貼、獎金等)</li>
                  <li>員工管理:維護員工基本資料與狀態</li>
                  <li>福利配置:為員工分配適用的福利項目</li>
                  <li>福利記錄:追蹤員工福利申請與使用情況</li>
                </ul>
              </div>
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <h3 className="font-semibold text-blue-300 mb-2">💡 使用說明</h3>
                <p className="text-sm text-slate-300">
                  此系統提供基礎框架,管理層可以根據公司實際規定填入福利政策內容。
                  系統已預設12種常見福利項目供參考,可自行修改或新增。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 福利項目管理 */}
        <TabsContent value="benefit-types" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">福利項目管理</h2>
            <Dialog open={benefitTypeDialog} onOpenChange={setBenefitTypeDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setCurrentBenefitType({ is_active: true })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增福利項目
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>{currentBenefitType?.id ? '編輯' : '新增'}福利項目</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>項目名稱 *</Label>
                    <Input
                      value={currentBenefitType?.name || ''}
                      onChange={(e) => setCurrentBenefitType({...currentBenefitType, name: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>類別 *</Label>
                    <Select
                      value={currentBenefitType?.category || ''}
                      onValueChange={(value) => setCurrentBenefitType({...currentBenefitType, category: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
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
                  <div>
                    <Label>說明</Label>
                    <Textarea
                      value={currentBenefitType?.description || ''}
                      onChange={(e) => setCurrentBenefitType({...currentBenefitType, description: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>適用資格</Label>
                    <Textarea
                      value={currentBenefitType?.eligibility_rules || ''}
                      onChange={(e) => setCurrentBenefitType({...currentBenefitType, eligibility_rules: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                      rows={2}
                      placeholder="例如:到職滿3個月的正職員工"
                    />
                  </div>
                  <div>
                    <Label>計算方式</Label>
                    <Textarea
                      value={currentBenefitType?.calculation_method || ''}
                      onChange={(e) => setCurrentBenefitType({...currentBenefitType, calculation_method: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                      rows={2}
                      placeholder="例如:每月固定金額3000元"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBenefitTypeDialog(false)}>取消</Button>
                  <Button onClick={saveBenefitType} className="bg-blue-600 hover:bg-blue-700">儲存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">項目名稱</TableHead>
                    <TableHead className="text-slate-300">類別</TableHead>
                    <TableHead className="text-slate-300">說明</TableHead>
                    <TableHead className="text-slate-300">適用資格</TableHead>
                    <TableHead className="text-slate-300">計算方式</TableHead>
                    <TableHead className="text-slate-300">狀態</TableHead>
                    <TableHead className="text-slate-300">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benefitTypes.map((type) => (
                    <TableRow key={type.id} className="border-slate-700">
                      <TableCell className="text-white font-medium">{type.name}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(type.category)}>
                          {getCategoryText(type.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-xs truncate">{type.description}</TableCell>
                      <TableCell className="text-slate-300 max-w-xs truncate">{type.eligibility_rules}</TableCell>
                      <TableCell className="text-slate-300 max-w-xs truncate">{type.calculation_method}</TableCell>
                      <TableCell>
                        <Badge className={type.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {type.is_active ? '啟用' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentBenefitType(type)
                              setBenefitTypeDialog(true)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteBenefitType(type.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 員工管理 */}
        <TabsContent value="employees" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">員工管理</h2>
            <Dialog open={employeeDialog} onOpenChange={setEmployeeDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setCurrentEmployee({ status: 'active' })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增員工
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>{currentEmployee?.id ? '編輯' : '新增'}員工</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>姓名 *</Label>
                      <Input
                        value={currentEmployee?.name || ''}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, name: e.target.value})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label>員工編號 *</Label>
                      <Input
                        value={currentEmployee?.employee_id || ''}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, employee_id: e.target.value})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>部門</Label>
                      <Input
                        value={currentEmployee?.department || ''}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, department: e.target.value})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label>職位</Label>
                      <Input
                        value={currentEmployee?.position || ''}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, position: e.target.value})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>到職日期</Label>
                    <Input
                      type="date"
                      value={currentEmployee?.hire_date || ''}
                      onChange={(e) => setCurrentEmployee({...currentEmployee, hire_date: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={currentEmployee?.email || ''}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label>電話</Label>
                      <Input
                        value={currentEmployee?.phone || ''}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, phone: e.target.value})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>狀態</Label>
                    <Select
                      value={currentEmployee?.status || 'active'}
                      onValueChange={(value) => setCurrentEmployee({...currentEmployee, status: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
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
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEmployeeDialog(false)}>取消</Button>
                  <Button onClick={saveEmployee} className="bg-blue-600 hover:bg-blue-700">儲存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">姓名</TableHead>
                    <TableHead className="text-slate-300">員工編號</TableHead>
                    <TableHead className="text-slate-300">部門</TableHead>
                    <TableHead className="text-slate-300">職位</TableHead>
                    <TableHead className="text-slate-300">到職日期</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">電話</TableHead>
                    <TableHead className="text-slate-300">狀態</TableHead>
                    <TableHead className="text-slate-300">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id} className="border-slate-700">
                      <TableCell className="text-white font-medium">{emp.name}</TableCell>
                      <TableCell className="text-slate-300">{emp.employee_id}</TableCell>
                      <TableCell className="text-slate-300">{emp.department}</TableCell>
                      <TableCell className="text-slate-300">{emp.position}</TableCell>
                      <TableCell className="text-slate-300">{emp.hire_date}</TableCell>
                      <TableCell className="text-slate-300">{emp.email}</TableCell>
                      <TableCell className="text-slate-300">{emp.phone}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(emp.status)}>
                          {getStatusText(emp.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentEmployee(emp)
                              setEmployeeDialog(true)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteEmployee(emp.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 福利記錄 */}
        <TabsContent value="records" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">福利申請記錄</h2>
            <Dialog open={benefitRecordDialog} onOpenChange={setBenefitRecordDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setCurrentRecord({ status: 'pending', record_date: new Date().toISOString().split('T')[0] })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增記錄
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>{currentRecord?.id ? '編輯' : '新增'}福利記錄</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>員工 *</Label>
                    <Select
                      value={currentRecord?.employee_id?.toString() || ''}
                      onValueChange={(value) => setCurrentRecord({...currentRecord, employee_id: parseInt(value)})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="選擇員工" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name} ({emp.employee_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>福利項目 *</Label>
                    <Select
                      value={currentRecord?.benefit_type_id?.toString() || ''}
                      onValueChange={(value) => setCurrentRecord({...currentRecord, benefit_type_id: parseInt(value)})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="選擇福利項目" />
                      </SelectTrigger>
                      <SelectContent>
                        {benefitTypes.filter(t => t.is_active).map(type => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name} ({getCategoryText(type.category)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>日期 *</Label>
                    <Input
                      type="date"
                      value={currentRecord?.record_date || ''}
                      onChange={(e) => setCurrentRecord({...currentRecord, record_date: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>金額</Label>
                    <Input
                      type="number"
                      value={currentRecord?.amount || ''}
                      onChange={(e) => setCurrentRecord({...currentRecord, amount: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>說明</Label>
                    <Textarea
                      value={currentRecord?.description || ''}
                      onChange={(e) => setCurrentRecord({...currentRecord, description: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>備註</Label>
                    <Textarea
                      value={currentRecord?.notes || ''}
                      onChange={(e) => setCurrentRecord({...currentRecord, notes: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBenefitRecordDialog(false)}>取消</Button>
                  <Button onClick={saveBenefitRecord} className="bg-blue-600 hover:bg-blue-700">儲存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">日期</TableHead>
                    <TableHead className="text-slate-300">員工</TableHead>
                    <TableHead className="text-slate-300">福利項目</TableHead>
                    <TableHead className="text-slate-300">金額</TableHead>
                    <TableHead className="text-slate-300">說明</TableHead>
                    <TableHead className="text-slate-300">狀態</TableHead>
                    <TableHead className="text-slate-300">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benefitRecords.map((record) => (
                    <TableRow key={record.id} className="border-slate-700">
                      <TableCell className="text-slate-300">{record.record_date}</TableCell>
                      <TableCell className="text-white">
                        {record.employees?.name}
                        <div className="text-xs text-slate-400">{record.employees?.employee_id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">{record.benefit_types?.name}</div>
                        <Badge className={getCategoryColor(record.benefit_types?.category)} size="sm">
                          {getCategoryText(record.benefit_types?.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {record.amount ? `NT$ ${parseFloat(record.amount).toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-xs truncate">{record.description}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusText(record.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {record.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateRecordStatus(record.id, 'approved')}
                                className="text-green-400 hover:text-green-300"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateRecordStatus(record.id, 'rejected')}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentRecord(record)
                              setBenefitRecordDialog(true)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteBenefitRecord(record.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EmployeeBenefitsManagement
