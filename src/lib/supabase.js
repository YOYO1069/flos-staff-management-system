// Supabase 配置 - FLOS曜診所動態資料管理
// 使用環境變數中的Supabase配置

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

// 模擬Supabase客戶端 (開發階段)
export const supabase = {
  from: (table) => ({
    select: (columns = '*') => ({
      eq: (column, value) => Promise.resolve({ data: [], error: null }),
      order: (column, options) => Promise.resolve({ data: [], error: null }),
      limit: (count) => Promise.resolve({ data: [], error: null }),
      then: (callback) => callback({ data: [], error: null })
    }),
    insert: (data) => Promise.resolve({ data: null, error: null }),
    update: (data) => ({
      eq: (column, value) => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: (column, value) => Promise.resolve({ data: null, error: null })
    })
  }),
  
  auth: {
    signUp: (credentials) => Promise.resolve({ data: null, error: null }),
    signIn: (credentials) => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  },

  storage: {
    from: (bucket) => ({
      upload: (path, file) => Promise.resolve({ data: null, error: null }),
      download: (path) => Promise.resolve({ data: null, error: null })
    })
  }
}

// 資料庫表格結構
export const tables = {
  appointments: 'appointments',
  customers: 'customers', 
  staff: 'staff',
  doctors: 'doctors',
  treatments: 'treatments',
  consent_forms: 'consent_forms',
  schedules: 'schedules'
}

// 即時訂閱功能
export const subscribeToChanges = (table, callback) => {
  // 模擬即時更新
  console.log(`訂閱 ${table} 表格變更`)
  return () => console.log(`取消訂閱 ${table}`)
}

export default supabase
