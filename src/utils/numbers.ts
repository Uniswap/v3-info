import numbro from 'numbro'

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | undefined, digits = 2, round = true) => {
  if (!num) return '-'

  return numbro(num).formatCurrency({ average: round, mantissa: digits })
}
