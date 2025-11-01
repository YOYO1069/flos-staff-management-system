// Supabase 配置 - FLOS曜診所動態資料管理
import { createClient } from '@supabase/supabase-js'

// 使用真實的 Supabase 配置
const supabaseUrl = 'https://clzjdlykhjwrlksyjlfz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsempkbHlraGp3cmxrc3lqbGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3OTM2ODAsImV4cCI6MjA3NTM2OTY4MH0.V6QAoh4N2aSF5CgDYfKTnY8cMQnDV3AYilj7TbpWJcU'

// 建立 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseKey)

// 資料庫表格結構
export const tables = {
  appointments: 'flos_appointments',  // 使用 flos_appointments 表
  customers: 'flos_patients',
  staff: 'staff',
  doctors: 'doctors',
  treatments: 'flos_treatments',
  consent_forms: 'consent_forms',
  schedules: 'schedules'
}

// 即時訂閱功能
export const subscribeToChanges = (table, callback) => {
  const subscription = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: table }, callback)
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

export default supabase
