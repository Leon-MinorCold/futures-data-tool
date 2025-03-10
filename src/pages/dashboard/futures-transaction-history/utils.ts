import { extendFuturesTransactionItem } from '@/lib/futures-transaction'
import { FuturesTransaction } from '@/types/futures-transaction/futures-transaction'

// 根据期货数据得出 手数、资金、开仓价格、浮盈 4个数据
// 计算方式如下：
// 1. 如果profitType = m1 or m2 or m3,
//  1.1 手数为m1orm2orm3 的仓位，开仓价格为m1 or m2 or m3的 entryPrice
//  1.2 资金为 开仓价格 * 仓位
//  1.3 开仓价格为m1 or m2 or m3的 entryPrice - entrySwing
//  Todo:浮盈暂时计算方式未知

// 2. 如果 profitType = sum
//  2.1 手数为 m1 m2 m3 的仓位之和
//  2.2 资金为 m1 m2 m3 的开仓价格 * 仓位 之和
//  2.3 浮盈金额为 profit.unrealizedProfit
//  2.4 开仓价格为 profit.exitLotPrice

// 3. tickValue = size * minPriceTick
// 4. 总仓位（可交易总手数)= 交易使用资金 / 保证金

interface FuturesTransactionCalculationReturn {
  size: number // 手数
  funding: number // 资金
  entryPrice: number // 开仓价格
  profit: number // 浮盈
}

// Todo: profit非sum的情况下 profit 计算待确定
export const futuresTransactionCalculation = (
  data: FuturesTransaction
): FuturesTransactionCalculationReturn => {
  const newData = extendFuturesTransactionItem(data)
  const {
    entry: { m1, m2, m3, profitType },
    profit: { exitLotPrice, unrealizedProfit },
  } = newData

  let size = 0,
    funding = 0,
    entryPrice = 0,
    profit = 0

  if (profitType === 'sum') {
    size = m1.position + m2.position + m3.position
    funding =
      m1.position * m1.entryPrice +
      m2.position * m2.entryPrice +
      m3.position * m3.entryPrice
    entryPrice = exitLotPrice
    profit = unrealizedProfit
  } else {
    const mItem = profitType === 'm1' ? m1 : profitType === 'm2' ? m2 : m3
    size = mItem.position
    entryPrice = mItem.entryPrice
    funding = +(mItem.position * mItem.entryPrice).toFixed(6)
    profit = 0
  }

  return {
    size,
    funding,
    entryPrice,
    profit,
  }
}
