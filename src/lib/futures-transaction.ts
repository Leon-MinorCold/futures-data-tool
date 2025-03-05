import {
  BasisFormValues,
  EntryFormValues,
  MValues,
  ProfitFormValues,
} from '@/pages/dashboard/futures-transaction-tool/schemas'

interface FuturesCalculateDerivedValuesParams {
  size: number // 期货交易规模
  minPriceTick: number // 期货最小价格波动
  precision?: number // 精度
}

interface FuturesCalculateDerivedValuesReturn {
  tickValue: number // 每跳波动价格
}

export const futuresCalculateDerivedValues = ({
  size = 0,
  minPriceTick,
  precision = 6,
}: FuturesCalculateDerivedValuesParams): FuturesCalculateDerivedValuesReturn => {
  return {
    tickValue: +(size * minPriceTick).toFixed(precision),
  }
}

interface BasisCalculateDerivedValuesParams {
  formValues: BasisFormValues
  precision?: number // 精度
}

// 基本风险控制工具计算公式
export const basisCalculateDerivedValues = ({
  formValues,
  precision = 6,
}: BasisCalculateDerivedValuesParams): BasisFormValues => {
  const { futuresMeta, basis } = formValues
  const { tickValue } = futuresMeta
  const { capitalRatio = 0, totalCapital = 0, margin = 0 } = basis

  if (margin <= 0) {
    console.warn('保证金不能小于0')
    return formValues
  } else {
    basis.maxTradableLots = +(
      (totalCapital * capitalRatio) /
      (100 * margin)
    ).toFixed(precision)
    basis.captitalTrading = +(totalCapital * (capitalRatio / 100)).toFixed(
      precision
    )
    basis.usedMargin = +(margin * basis.maxTradableLots).toFixed(precision)
    basis.riskControl = +(
      (margin * basis.maxTradableLots) /
      ((totalCapital * capitalRatio) / 100)
    ).toFixed(precision)
    basis.actualTickValue = +(tickValue * basis.maxTradableLots).toFixed(
      precision
    )
  }

  return formValues
}

interface EntryCalculateDerivedValuesParams {
  entryFormValues: EntryFormValues
  basisFormValues: BasisFormValues

  precision?: number
}

// 开仓控制工具计算公式
export const entryCalculateDerivedValues = ({
  entryFormValues,
  basisFormValues,
  precision = 6,
}: EntryCalculateDerivedValuesParams): EntryFormValues => {
  const {
    basis: { maxTradableLots = 0 },
    futuresMeta: { tickValue = 0 },
  } = basisFormValues

  if (tickValue <= 0 || maxTradableLots <= 0) {
    console.warn('每跳波动价格或可交易手数必须大于0')
  } else {
    entryFormValues.m2.entryPrice = entryFormValues.entryPrice

    // 计算 m1 和 m3 的开仓价格
    // 开仓价格 = 开仓价格 + 开仓波动价格 * 每跳波动价格
    entryFormValues.m1.entryPrice = +(
      entryFormValues.entryPrice +
      entryFormValues.m1.entrySwing * tickValue
    ).toFixed(precision)
    entryFormValues.m3.entryPrice = +(
      entryFormValues.entryPrice +
      entryFormValues.m3.entrySwing * tickValue
    ).toFixed(precision)

    // 计算 m1, m2, m3 的 position
    // 仓位 = 可交易总手数 * (仓位百分比/100)
    entryFormValues.m1.position = +(
      maxTradableLots *
      (entryFormValues.m1.positionRatio / 100)
    ).toFixed(precision)
    entryFormValues.m2.position = +(
      maxTradableLots *
      (entryFormValues.m2.positionRatio / 100)
    ).toFixed(precision)
    entryFormValues.m3.position = +(
      maxTradableLots *
      (entryFormValues.m3.positionRatio / 100)
    ).toFixed(precision)

    // 计算止损单价格和保本单价格
    entryFormValues.m1.stopLossPrice = +(
      entryFormValues.entryType === 'short'
        ? entryFormValues.m1.entryPrice -
          tickValue * entryFormValues.m1.stopLossSwing
        : entryFormValues.m1.entryPrice +
          tickValue * entryFormValues.m1.stopLossSwing
    ).toFixed(precision)

    entryFormValues.m1.breakevenPrice = +(
      entryFormValues.entryType === 'short'
        ? entryFormValues.m1.entryPrice +
          tickValue * entryFormValues.m1.breakevenSwing
        : entryFormValues.m1.entryPrice -
          tickValue * entryFormValues.m1.breakevenSwing
    ).toFixed(precision)

    entryFormValues.m2.stopLossPrice = +(
      entryFormValues.entryType === 'short'
        ? entryFormValues.m2.entryPrice -
          tickValue * entryFormValues.m2.stopLossSwing
        : entryFormValues.m2.entryPrice +
          tickValue * entryFormValues.m2.stopLossSwing
    ).toFixed(precision)

    entryFormValues.m2.breakevenPrice = +(
      entryFormValues.entryType === 'short'
        ? entryFormValues.m2.entryPrice +
          tickValue * entryFormValues.m2.breakevenSwing
        : entryFormValues.m2.entryPrice -
          tickValue * entryFormValues.m2.breakevenSwing
    ).toFixed(precision)

    entryFormValues.m3.stopLossPrice = +(
      entryFormValues.entryType === 'short'
        ? entryFormValues.m3.entryPrice -
          tickValue * entryFormValues.m3.stopLossSwing
        : entryFormValues.m3.entryPrice +
          tickValue * entryFormValues.m3.stopLossSwing
    ).toFixed(precision)

    entryFormValues.m3.breakevenPrice = +(
      entryFormValues.entryType === 'short'
        ? entryFormValues.m3.entryPrice +
          tickValue * entryFormValues.m3.breakevenSwing
        : entryFormValues.m3.entryPrice -
          tickValue * entryFormValues.m3.breakevenSwing
    ).toFixed(precision)
  }

  return entryFormValues
}

interface ProfitCalculateDerivedValuesParams {
  profitFormValues: ProfitFormValues
  basisFormValues: BasisFormValues

  precision?: number
}

// 浮盈管理工具计算公式
export const profitCalculateDerivedValues = ({
  profitFormValues,
  basisFormValues,
  precision = 6,
}: ProfitCalculateDerivedValuesParams): ProfitFormValues => {
  const {
    basis: { actualTickValue = 0, maxTradableLots = 0, margin = 0 },
    futuresMeta: { commission = 0, tickValue = 0 },
  } = basisFormValues

  if (tickValue <= 0 || maxTradableLots <= 0) {
    console.warn('每跳波动价格或可交易手数必须大于0')
  } else {
    profitFormValues.takeProfitPrice = +(
      profitFormValues.avgPrice - profitFormValues.marketPrice
    ).toFixed(precision)

    profitFormValues.unrealizedProfit = +(
      profitFormValues.takeProfitPrice * tickValue
    ).toFixed(precision)

    profitFormValues.unrealizedProfitRatio = +(
      (profitFormValues.takeProfitPrice * actualTickValue) /
      (margin * maxTradableLots)
    ).toFixed(precision)

    profitFormValues.exitLotSize = +(
      maxTradableLots *
      (profitFormValues.exitLotRatio / 100)
    ).toFixed(precision)

    profitFormValues.breakevenPrice = +(
      2 * profitFormValues.avgPrice -
      profitFormValues.marketPrice
    ).toFixed(precision)

    profitFormValues.breakeven20EMADelta = +(
      profitFormValues.breakevenPrice - profitFormValues.current20EMA
    ).toFixed(precision)
  }

  return profitFormValues
}
