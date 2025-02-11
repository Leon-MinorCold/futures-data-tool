import { formatDateTime, PresetDateKey, PRESET_FORMATS } from '@/lib/date'

interface Props {
  timestamp: number
  format?: PresetDateKey
  lang?: 'en' | 'zh'
}

const DateTimeDisplay = ({
  timestamp,
  format = 'chineseDate',
  lang = 'zh',
}: Props) => {
  return <span>{formatDateTime(timestamp, PRESET_FORMATS[format], lang)}</span>
}

export default DateTimeDisplay
