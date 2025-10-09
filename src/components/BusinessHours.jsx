import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Clock, Calendar, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'

const BusinessHours = () => {
  const businessHours = [
    { day: '週一', hours: '12:00 - 20:30', isOpen: true },
    { day: '週二', hours: '12:00 - 20:30', isOpen: true },
    { day: '週三', hours: '12:00 - 20:30', isOpen: true },
    { day: '週四', hours: '12:00 - 20:30', isOpen: true },
    { day: '週五', hours: '12:00 - 20:30', isOpen: true },
    { day: '週六', hours: '10:30 - 19:00', isOpen: true },
    { day: '週日', hours: '休診', isOpen: false }
  ]

  const getCurrentStatus = () => {
    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes()

    if (currentDay === 0) { // Sunday
      return { isOpen: false, message: '今日休診' }
    } else if (currentDay === 6) { // Saturday
      if (currentTime >= 1030 && currentTime <= 1900) {
        return { isOpen: true, message: '營業中' }
      } else {
        return { isOpen: false, message: '非營業時間' }
      }
    } else { // Monday to Friday
      if (currentTime >= 1200 && currentTime <= 2030) {
        return { isOpen: true, message: '營業中' }
      } else {
        return { isOpen: false, message: '非營業時間' }
      }
    }
  }

  const status = getCurrentStatus()

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white">營業時間</CardTitle>
          </div>
          <Badge 
            variant={status.isOpen ? "default" : "secondary"}
            className={status.isOpen ? "bg-green-600 text-white" : "bg-red-600 text-white"}
          >
            {status.message}
          </Badge>
        </div>
        <CardDescription className="text-slate-400">
          FLOS曜診所營業時間表
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {businessHours.map((schedule, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-white font-medium">{schedule.day}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${schedule.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                {schedule.hours}
              </span>
              {!schedule.isOpen && (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-medium">特別提醒</p>
              <p className="text-blue-200 mt-1">週日及國定假日休診</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BusinessHours
