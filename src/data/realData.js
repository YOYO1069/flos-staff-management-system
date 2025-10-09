// FLOS曜診所真實資料配置
// 基於實際客戶紀錄表和排班系統

export const realDoctors = [
  { id: 'dr-zhong', name: '鍾曜任', color: '#e91e63', specialty: ['皮秒雷射', '音波拉提'] },
  { id: 'dr-cai', name: '蔡秉遑', color: '#2196f3', specialty: ['電波拉皮', 'EMB'] },
  { id: 'dr-lan', name: '藍子軒', color: '#4caf50', specialty: ['猛健樂', '震波'] },
  { id: 'dr-huang', name: '黃俊堯', color: '#ff9800', specialty: ['ONDA', 'NEO'] },
  { id: 'dr-wu', name: '伍詠聰', color: '#9c27b0', specialty: ['肉毒桿菌', '玻尿酸'] },
  { id: 'dr-lu', name: '盧仕鈞', color: '#3f51b5', specialty: ['海菲秀', 'SEYO'] },
  { id: 'dr-lin', name: '林思宇', color: '#f44336', specialty: ['點滴療程', '除毛'] },
  { id: 'dr-wang', name: '王昱淞', color: '#009688', specialty: ['酷捷', '震波'] },
  { id: 'dr-he', name: '何逸群', color: '#795548', specialty: ['皮秒雷射', 'EMB'] },
  { id: 'dr-guo', name: '郭昌𣿰', color: '#607d8b', specialty: ['猛健樂', '音波拉提'] }
];

export const realStaff = [
  { id: 'staff-wan', name: '萬晴', role: '諮詢師', clients: 0, performance: 'good' },
  { id: 'staff-chen', name: '陳韻安', role: '護理師', clients: 0, performance: 'good' },
  { id: 'staff-liu', name: '劉哲軒', role: '諮詢師', clients: 0, performance: 'good' },
  { id: 'staff-li', name: '李文華', role: '護理師', clients: 0, performance: 'good' },
  { id: 'staff-zhang', name: '張耿齊', role: '諮詢師', clients: 0, performance: 'good' },
  { id: 'staff-hong', name: '洪揚程', role: '護理師', clients: 0, performance: 'good' },
  { id: 'staff-xie', name: '謝鏵翧', role: '諮詢師', clients: 0, performance: 'good' },
  { id: 'staff-huang', name: '黃璦瑄', role: '護理師', clients: 0, performance: 'good' },
  { id: 'staff-wang', name: '王筑句', role: '諮詢師', clients: 0, performance: 'good' }
];

export const realReferralSources = [
  { source: 'Google搜尋', count: 0, percentage: 0 },
  { source: 'Facebook', count: 0, percentage: 0 },
  { source: 'Instagram', count: 0, percentage: 0 },
  { source: 'LINE', count: 0, percentage: 0 },
  { source: '親友推薦', count: 0, percentage: 0 },
  { source: '醫師介紹', count: 0, percentage: 0 },
  { source: '員工推薦', count: 0, percentage: 0 },
  { source: '其他', count: 0, percentage: 0 }
];

export const realTreatments = [
  { name: 'EMB', count: 17, category: '身體雕塑' },
  { name: '猛健樂', count: 14, category: '男性療程' },
  { name: '震波', count: 14, category: '男性療程' },
  { name: '猛健樂10mg', count: 5, category: '男性療程' },
  { name: '海菲秀+SEYO', count: 4, category: '臉部護理' },
  { name: 'NEO+EMB', count: 4, category: '身體雕塑' },
  { name: 'neo', count: 3, category: '身體雕塑' },
  { name: '點滴', count: 3, category: '保健療程' },
  { name: '除毛', count: 2, category: '美容療程' }
];

export const realStats = {
  totalClients: 0, // 等待真實客戶資料
  activeToday: 0, // 等待真實預約資料
  weeklyBookings: 0, // 等待真實預約資料
  monthlyRevenue: 'NT$0', // 等待真實營收資料
  completionRate: 0, // 等待真實完成率
  newClients: 0, // 等待真實新客戶資料
  vipClients: 0 // 等待真實VIP客戶資料
};

export const realRecentBookings = [
  // 等待真實預約資料
];
