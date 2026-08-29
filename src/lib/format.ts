const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function formatDueAt(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}月${day}日 ${WEEKDAYS[date.getDay()]} ${hours}:${minutes}`
}
