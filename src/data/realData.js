// FLOS曜診所真實資料配置
// 基於實際客戶紀錄表和排班系統

export const realDoctors = [
  { id: 'dr-zhong', name: '鍾曜任', color: '#e91e63', specialty: ['皮秒雷射', '音波拉提'] },
  { id: 'dr-wu', name: '伍詠聰', color: '#2196f3', specialty: ['電波拉皮', 'EMB'] },
  { id: 'dr-lin', name: '林思宇', color: '#4caf50', specialty: ['猛健樂', '震波'] },
  { id: 'dr-wang', name: '王昱淞', color: '#ff9800', specialty: ['ONDA', 'NEO'] },
  { id: 'dr-huang', name: '黃俊堯', color: '#9c27b0', specialty: ['肉毒桿菌', '玻尿酸'] },
  { id: 'dr-lan', name: '藍子軒', color: '#3f51b5', specialty: ['海菲秀', 'SEYO'] },
  { id: 'dr-he', name: '何逸群', color: '#f44336', specialty: ['點滴療程', '除毛'] },
  { id: 'dr-guo', name: '郭昌浩', color: '#009688', specialty: ['酷捷', '震波'] }
];

export const realConsultants = [
  { id: 'juju', name: '句句', clients: 33, performance: 'excellent' },
  { id: 'daoxuan', name: '道玄', clients: 17, performance: 'good' },
  { id: 'anan', name: '安安', clients: 14, performance: 'good' },
  { id: 'zhexuan', name: '哲軒', clients: 9, performance: 'average' },
  { id: 'mimi', name: '米米', clients: 4, performance: 'average' },
  { id: 'huar', name: '花兒', clients: 8, performance: 'average' }
];

export const realReferralSources = [
  { source: '句句推薦', count: 33, percentage: 21.7 },
  { source: '道玄推薦', count: 17, percentage: 11.2 },
  { source: 'Google搜尋', count: 17, percentage: 11.2 },
  { source: '安安推薦', count: 14, percentage: 9.2 },
  { source: '親友推薦', count: 14, percentage: 9.2 },
  { source: '道玄介紹', count: 10, percentage: 6.6 },
  { source: 'FB/IG', count: 7, percentage: 4.6 },
  { source: '醫師介紹', count: 6, percentage: 3.9 }
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
  totalClients: 152,
  activeToday: 11,
  weeklyBookings: 36,
  monthlyRevenue: 'NT$2,850,000', // 估算基於療程數量
  completionRate: 94,
  newClients: 23,
  vipClients: 15
};

export const realRecentBookings = [
  { date: '2025-10-08', count: 11 },
  { date: '2025-10-07', count: 36 },
  { date: '2025-10-04', count: 23 },
  { date: '2025-10-03', count: 36 },
  { date: '2025-10-02', count: 23 },
  { date: '2025-10-01', count: 23 }
];
