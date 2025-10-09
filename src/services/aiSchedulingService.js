// FLOS曜診所AI智能排班系統
import { staffService, appointmentService } from './dataService.js'

// AI排班優化算法
export class AISchedulingOptimizer {
  constructor() {
    this.workingHours = {
      weekday: { start: '12:00', end: '20:30' },
      saturday: { start: '10:30', end: '19:00' },
      sunday: 'closed'
    }
    
    this.staffCapacity = {
      doctor: 8, // 每日最大預約數
      consultant: 12 // 每日最大諮詢數
    }
  }

  // 智能排班建議
  async generateOptimalSchedule(date, appointments = []) {
    try {
      const dayOfWeek = new Date(date).getDay()
      
      // 週日休診
      if (dayOfWeek === 0) {
        return {
          recommendations: [],
          message: '週日休診，無需排班'
        }
      }

      // 獲取當日預約需求
      const dailyAppointments = await appointmentService.getAppointments(date)
      
      // 分析預約類型和時段分布
      const appointmentAnalysis = this.analyzeAppointments(dailyAppointments)
      
      // 生成最佳排班建議
      const recommendations = this.calculateOptimalStaffing(appointmentAnalysis, dayOfWeek)
      
      return {
        success: true,
        recommendations,
        analysis: appointmentAnalysis,
        efficiency: this.calculateEfficiency(recommendations, appointmentAnalysis)
      }
    } catch (error) {
      console.error('AI排班生成失敗:', error)
      return {
        success: false,
        error: error.message,
        recommendations: []
      }
    }
  }

  // 分析預約需求
  analyzeAppointments(appointments) {
    const analysis = {
      totalAppointments: appointments.length,
      treatmentTypes: {},
      timeSlots: {},
      staffRequirements: {
        doctors: 0,
        consultants: 0
      }
    }

    appointments.forEach(apt => {
      // 療程類型統計
      const treatment = apt.treatment_type || apt.service
      analysis.treatmentTypes[treatment] = (analysis.treatmentTypes[treatment] || 0) + 1

      // 時段分布統計
      const timeSlot = this.getTimeSlot(apt.appointment_time)
      analysis.timeSlots[timeSlot] = (analysis.timeSlots[timeSlot] || 0) + 1

      // 人員需求計算
      if (this.requiresDoctor(treatment)) {
        analysis.staffRequirements.doctors++
      }
      analysis.staffRequirements.consultants++
    })

    return analysis
  }

  // 計算最佳人員配置
  calculateOptimalStaffing(analysis, dayOfWeek) {
    const recommendations = []
    
    // 醫師排班建議
    const requiredDoctors = Math.ceil(analysis.staffRequirements.doctors / this.staffCapacity.doctor)
    const doctorRecommendation = this.recommendDoctors(requiredDoctors, analysis.treatmentTypes)
    
    // 諮詢師排班建議
    const requiredConsultants = Math.ceil(analysis.staffRequirements.consultants / this.staffCapacity.consultant)
    const consultantRecommendation = this.recommendConsultants(requiredConsultants, analysis)

    recommendations.push(...doctorRecommendation, ...consultantRecommendation)

    return recommendations
  }

  // 醫師推薦算法
  recommendDoctors(requiredCount, treatmentTypes) {
    const doctors = [
      { name: '鍾曜任', specialties: ['皮秒雷射', '音波拉提'], efficiency: 0.95 },
      { name: '林思宇', specialties: ['猛健樂', '震波'], efficiency: 0.92 },
      { name: '王昱淞', specialties: ['ONDA', 'NEO'], efficiency: 0.90 },
      { name: '伍詠聰', specialties: ['電波拉皮', 'EMB'], efficiency: 0.88 }
    ]

    // 根據療程需求和醫師專長匹配
    const recommendations = []
    const treatmentList = Object.keys(treatmentTypes)
    
    doctors.forEach(doctor => {
      const matchScore = this.calculateMatchScore(doctor.specialties, treatmentList)
      if (matchScore > 0.3 && recommendations.length < requiredCount) {
        recommendations.push({
          type: 'doctor',
          name: doctor.name,
          reason: `專長匹配度: ${(matchScore * 100).toFixed(0)}%`,
          priority: matchScore * doctor.efficiency,
          status: 'recommended'
        })
      }
    })

    return recommendations.sort((a, b) => b.priority - a.priority)
  }

  // 諮詢師推薦算法
  recommendConsultants(requiredCount, analysis) {
    const consultants = [
      { name: '句句', performance: 33, efficiency: 0.98 },
      { name: '道玄', performance: 17, efficiency: 0.95 },
      { name: '安安', performance: 14, efficiency: 0.92 },
      { name: '哲軒', performance: 9, efficiency: 0.88 }
    ]

    return consultants
      .sort((a, b) => (b.performance * b.efficiency) - (a.performance * a.efficiency))
      .slice(0, requiredCount)
      .map(consultant => ({
        type: 'consultant',
        name: consultant.name,
        reason: `業績表現: ${consultant.performance}位客戶`,
        priority: consultant.performance * consultant.efficiency,
        status: 'recommended'
      }))
  }

  // 計算專長匹配度
  calculateMatchScore(specialties, treatments) {
    if (treatments.length === 0) return 0
    
    let matches = 0
    treatments.forEach(treatment => {
      if (specialties.some(specialty => 
        treatment.toLowerCase().includes(specialty.toLowerCase()) ||
        specialty.toLowerCase().includes(treatment.toLowerCase())
      )) {
        matches++
      }
    })
    
    return matches / treatments.length
  }

  // 判斷是否需要醫師
  requiresDoctor(treatment) {
    const doctorRequired = [
      '皮秒雷射', '音波拉提', '電波拉皮', 'ONDA', 'NEO', 
      '猛健樂', '震波', 'EMB', '肉毒桿菌', '玻尿酸'
    ]
    
    return doctorRequired.some(required => 
      treatment.toLowerCase().includes(required.toLowerCase())
    )
  }

  // 獲取時段分類
  getTimeSlot(time) {
    const hour = parseInt(time.split(':')[0])
    if (hour < 14) return '上午'
    if (hour < 17) return '下午'
    return '晚上'
  }

  // 計算排班效率
  calculateEfficiency(recommendations, analysis) {
    const totalStaff = recommendations.length
    const totalAppointments = analysis.totalAppointments
    
    if (totalStaff === 0) return 0
    
    const efficiency = (totalAppointments / totalStaff) / 10 // 假設每人最佳負載為10
    return Math.min(efficiency, 1) * 100 // 轉換為百分比，最高100%
  }
}

// 預測分析服務
export class PredictiveAnalytics {
  // 客流量預測
  async predictCustomerFlow(date) {
    try {
      const dayOfWeek = new Date(date).getDay()
      const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
      
      // 基於歷史資料的預測模型 (簡化版)
      const baseFlow = {
        0: 0,    // 週日休診
        1: 12,   // 週一
        2: 15,   // 週二  
        3: 18,   // 週三
        4: 16,   // 週四
        5: 20,   // 週五
        6: 14    // 週六
      }
      
      const predicted = baseFlow[dayOfWeek]
      const confidence = dayOfWeek === 0 ? 100 : 85 // 週日確定休診，其他日期85%信心度
      
      return {
        date,
        dayOfWeek: weekdays[dayOfWeek],
        predictedAppointments: predicted,
        confidence,
        recommendation: this.getFlowRecommendation(predicted)
      }
    } catch (error) {
      console.error('客流量預測失敗:', error)
      return null
    }
  }

  // 獲取客流量建議
  getFlowRecommendation(predicted) {
    if (predicted === 0) return '休診日，無需準備'
    if (predicted < 10) return '客流量較少，可安排較少人員'
    if (predicted < 15) return '正常客流量，標準人員配置'
    if (predicted < 20) return '客流量較多，建議增加人員'
    return '高峰期，建議全員到齊'
  }

  // 營收預測
  async predictRevenue(month, year) {
    try {
      // 基於歷史資料和趨勢的營收預測
      const baseRevenue = 2850000 // 基準月營收
      const seasonalFactor = this.getSeasonalFactor(month)
      const trendFactor = 1.05 // 5%成長趨勢
      
      const predictedRevenue = baseRevenue * seasonalFactor * trendFactor
      
      return {
        month,
        year,
        predictedRevenue: Math.round(predictedRevenue),
        confidence: 78,
        factors: {
          seasonal: seasonalFactor,
          trend: trendFactor
        }
      }
    } catch (error) {
      console.error('營收預測失敗:', error)
      return null
    }
  }

  // 季節性因子
  getSeasonalFactor(month) {
    const factors = {
      1: 0.9,   // 一月 (新年後較淡)
      2: 0.95,  // 二月
      3: 1.1,   // 三月 (春季保養)
      4: 1.15,  // 四月
      5: 1.2,   // 五月 (夏季前準備)
      6: 1.25,  // 六月 (夏季高峰)
      7: 1.3,   // 七月
      8: 1.25,  // 八月
      9: 1.1,   // 九月
      10: 1.15, // 十月 (秋季保養)
      11: 1.05, // 十一月
      12: 0.95  // 十二月 (年末較忙)
    }
    
    return factors[month] || 1.0
  }
}

// 匯出服務
export const aiSchedulingService = new AISchedulingOptimizer()
export const predictiveAnalytics = new PredictiveAnalytics()

export default {
  aiSchedulingService,
  predictiveAnalytics
}
