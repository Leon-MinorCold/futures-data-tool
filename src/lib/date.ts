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
  timestamp: number, // 秒级或毫秒级时间戳
  formatStr: string = PRESET_FORMATS.chineseDate,
  lang: Locale = 'zh'
): string => {
  // 检查时间戳是否为有效数字
  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    console.error('Invalid timestamp:', timestamp)
    return 'Invalid Date'
  }

  // 自动判断时间戳是秒级还是毫秒级
  let milliseconds: number
  if (timestamp < 1e10) {
    // 10 位数字，秒级时间戳
    milliseconds = timestamp * 1000
  } else if (timestamp < 1e13) {
    // 13 位数字，毫秒级时间戳
    milliseconds = timestamp
  } else {
    // 其他情况，视为无效时间戳
    console.error('Invalid timestamp:', timestamp)
    return 'Invalid Date'
  }

  // 创建 Date 对象
  const date = new Date(milliseconds)

  // 验证时间有效性
  if (isNaN(date.getTime())) {
    console.error('Invalid timestamp:', timestamp)
    return 'Invalid Date'
  }

  // 格式化时间
  return format(date, formatStr, {
    locale: getLocale(lang),
  })
}
