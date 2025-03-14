import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/date'

const Timer = () => {
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000) // 每秒更新一次

    return () => clearInterval(timer) // 组件卸载时清除定时器
  }, [])

  const time = formatDateTime(currentTime)

  return (
    <Badge variant="outline" className="ml-2">
      {time}
    </Badge>
  )
}

export default Timer
