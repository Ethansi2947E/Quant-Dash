export function computeMaxDrawdown(series: { value: number; date?: string }[]) {
  // series is cumulative equity values in order
  let peak = Number.NEGATIVE_INFINITY
  let peakIndex = -1
  let troughIndex = -1
  let maxDD = 0 // stored as positive drawdown value for calculation
  let currentPeakDate: string | undefined
  let currentTroughDate: string | undefined

  for (let i = 0; i < series.length; i++) {
    const v = series[i].value
    if (v > peak) {
      peak = v
      peakIndex = i
    }
    const dd = peak > 0 ? (peak - v) / (peak || 1) : 0
    if (dd > maxDD) {
      maxDD = dd
      troughIndex = i
    }
  }

  if (peakIndex >= 0) currentPeakDate = series[peakIndex]?.date
  if (troughIndex >= 0) currentTroughDate = series[troughIndex]?.date

  // return negative drawdown for UI consistency (e.g., -0.18 => -18%)
  return { value: -maxDD, peakDate: currentPeakDate, troughDate: currentTroughDate }
}
