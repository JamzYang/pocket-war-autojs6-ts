export function getFormattedTimeNow(): string {
  const now = new Date();
  return now.toTimeString().split(' ')[0]; // 这将返回 HH:mm:ss 格式的时间
}

export function getFormattedTime(timestamp?: number): string {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toTimeString().split(' ')[0]; // 返回 HH:mm:ss 格式的时间
}