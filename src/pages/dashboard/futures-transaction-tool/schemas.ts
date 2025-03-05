import { z } from 'zod'
import {
  futuresTransactionMSchema,
  futuresTransactionEntrySchema,
  futuresTransactionBasisSchema,
  FuturesTransactionMetaSchema,
  futuresTransactionProfitSchema,
  DEFAULT_FUTURES_TRANSACTION_PROFIT,
  DEFAULT_FUTURES_TRANSACTION_ENTRY,
  DEFAULT_FUTURES_TRANSACTION_META,
  DEFAULT_FUTURES_TRANSACTION_BASIS,
} from '@/types/futures-transaction/futures-transaction'

// basis form

export const basisFormSchema = z.object({
  basis: futuresTransactionBasisSchema.extend({
    // 以下5个字段只有前端用，纯用来展示
    captitalTrading: z
      .number()
      .positive('交易使用资金必须大于0')
      .describe('交易使用资金 = 总资金 * (交易使用资金比例/100)'),
    maxTradableLots: z
      .number()
      .describe('可交易总手数 = 交易使用资金 / 保证金'),
    usedMargin: z.number().describe('交易使用保证金 = 保证金 * 可交易总手数'),
    riskControl: z
      .number()
      .describe('资金风控 = (保证金 * 可交易总手数) / 交易使用资金'),
    actualTickValue: z
      .number()
      .describe('实际交易每跳波动价格 = 期货每跳波动价格 * 可交易总手数'),
  }),
  futuresId: z.string().min(1, '期货数据不能为空'),
  futuresMeta: FuturesTransactionMetaSchema,
})

export type BasisFormValues = z.infer<typeof basisFormSchema>

export const DEFAULT_BASIS_FORM_VALUES: BasisFormValues = {
  basis: {
    maxTradableLots: 0,
    usedMargin: 0,
    riskControl: 0,
    actualTickValue: 0,
    captitalTrading: 0,
    ...DEFAULT_FUTURES_TRANSACTION_BASIS,
  },
  futuresId: '',
  futuresMeta: DEFAULT_FUTURES_TRANSACTION_META,
}

// Entry Form
export const mSchema = futuresTransactionMSchema.extend({
  entryPrice: z
    .number()
    .describe('开仓价格 = m2开仓价格 + 上下浮动金额 * 期货每跳波动价格'),
  position: z.number().describe('仓位 = 可交易总手数 * 仓位百分比数'),
  stopLossPrice: z
    .number()
    .describe(
      '做空时：止损单价格 = 开仓价格 + 止损价格波动 * 期货每跳波动价格;做多时：止损单价格 = 开仓价格 - 止损价格波动 * 期货每跳波动价格'
    ),
  breakevenPrice: z
    .number()
    .describe(
      '做空时：保本单价格 = 开仓价格 - 保本价格波动 * 每跳波动价格;做多时：保本单价格 = 开仓价格 + 保本价格波动 * 每跳波动价格'
    ),
  ristAmout: z.number().describe('风险金额待定'),
})

export type MValues = z.infer<typeof mSchema>

export const entryFormSchema = futuresTransactionEntrySchema.extend({
  m1: mSchema,
  m2: mSchema,
  m3: mSchema,
})

export type EntryFormValues = z.infer<typeof entryFormSchema>

export const DEFAULT_ENTRY_VALUES: EntryFormValues = {
  entryType: 'long',
  profitType: 'm1',
  entryPrice: 200,
  m1: {
    ...DEFAULT_FUTURES_TRANSACTION_ENTRY.m1,
    entryPrice: 0,
    position: 0,
    stopLossPrice: 0,
    breakevenPrice: 0,
    ristAmout: 0,
  },
  m2: {
    entrySwing: 0, // Add default values for base schema fields
    positionRatio: 0,
    stopLossSwing: 0,
    breakevenSwing: 0,
    ...DEFAULT_FUTURES_TRANSACTION_ENTRY.m2,
    entryPrice: 100,
    position: 0,
    stopLossPrice: 0,
    breakevenPrice: 0,
    ristAmout: 0,
  },
  m3: {
    entrySwing: 0, // Add default values for base schema fields
    positionRatio: 0,
    stopLossSwing: 0,
    breakevenSwing: 0,
    ...DEFAULT_FUTURES_TRANSACTION_ENTRY.m3,
    entryPrice: 0,
    position: 0,
    stopLossPrice: 0,
    breakevenPrice: 0,
    ristAmout: 0,
  },
}

// profit form
export const profitFormSchema = futuresTransactionProfitSchema.extend({
  // 前端展示用
  takeProfitPrice: z.number().describe('盈利点位 = 平均价格 - 当前价格'),
  unrealizedProfit: z
    .number()
    .describe('浮盈金额 = （平均价格 - 当前价格）* 每跳波动价格'),
  unrealizedProfitRatio: z
    .number()
    .describe(
      '浮盈比例 = （平均价格 - 当前价格）* 实际交易每跳波动 / 保证金 * 可交易总手数'
    ),
  exitLotSize: z.number().describe('出仓手数 = 可交易总手数 * 出仓比例'),
  breakevenPrice: z.number().describe('盈亏平衡价格 = 2 * 平均价格 - 当前价格'),
  breakeven20EMADelta: z
    .number()
    .describe('盈亏平衡价格与20ema差距 = 盈亏平衡价格 - 当前20EMA价格'),
})

export type ProfitFormValues = z.infer<typeof profitFormSchema>

export const DEFAULT_PROFIT_FORM_VALUES: ProfitFormValues = {
  ...DEFAULT_FUTURES_TRANSACTION_PROFIT,

  takeProfitPrice: 0,
  unrealizedProfit: 0,
  unrealizedProfitRatio: 0,
  exitLotSize: 0,
  breakevenPrice: 0,
  breakeven20EMADelta: 0,
}
