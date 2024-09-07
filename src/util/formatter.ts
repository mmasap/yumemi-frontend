export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ja-JP').format(num)
}
