// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | undefined, digits?: number) => {
  if (!num) return '-'

  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return formatter.format(num)
}
