import { format } from 'date-fns'
import { enUS, zhCN } from 'date-fns/locale'

// 类型定义
type Locale = 'en' | 'zh'

export type PresetDateKey =
  | 'fullDateTime'
  | 'dateOnly'
  | 'timeOnly'
  | 'chineseDate'

// 获取对应的locale对象
const getLocale = (lang: Locale) => {
  return {
    en: enUS,
    zh: zhCN,
  }[lang]
}

export const PRESET_FORMATS: Record<PresetDateKey, string> = {
  fullDateTime: 'yyyy-MM-dd HH:mm:ss',
  dateOnly: 'yyyy-MM-dd',
  timeOnly: 'HH:mm:ss',
  chineseDate: 'yyyy年MM月dd日 HH:mm:ss',
}

// 通用时间格式化函数
export const formatDateTime = (
  timestamp: number, // 秒级时间戳
  formatStr: string = PRESET_FORMATS.chineseDate,
  lang: Locale = 'zh'
): string => {
  // 转换为毫秒
  const date = new Date(timestamp * 1000)

  // 验证时间有效性
  if (isNaN(date.getTime())) {
    console.error('Invalid timestamp:', timestamp)
    return 'Invalid Date'
  }

  return format(date, formatStr, {
    locale: getLocale(lang),
  })
}
