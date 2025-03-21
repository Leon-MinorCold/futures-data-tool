import { dateSchema, paginationSchema, createZodDto } from '../common'
import { z } from 'zod'
import { futuresSchema } from '../futures/futures'

const FuturesTransactionProfitEnum = z.enum(['m1', 'm2', 'm3', 'sum'])
export type FuturesTransactionProfitType = z.infer<
  typeof FuturesTransactionProfitEnum
>
const FuturesTransactionEntryEnum = z.enum(['short', 'long']).default('long')
export type FuturesTransactionEntryType = z.infer<
  typeof FuturesTransactionEntryEnum
>

export const FuturesTransactionMetaSchema = futuresSchema
  .pick({
    name: true,
    minPriceTick: true,
    size: true,
  })
  .extend({
    commission: z.number().nonnegative().describe('期货手续费'),
    tickValue: z
      .number()
      .positive('每跳波动价格必须大于0')
      .describe('每跳波动价格 = 最小价格波动 * 交易规模'),
  })

export type FuturesTransactionMeta = z.infer<
  typeof FuturesTransactionMetaSchema
>

export const DEFAULT_FUTURES_TRANSACTION_META: FuturesTransactionMeta = {
  name: '',
  minPriceTick: 0,
  size: 0,
  commission: 0,
  tickValue: 0,
}

// 基础风险控制配置
export const futuresTransactionBasisSchema = z.object({
  totalCapital: z
    .number()
    .positive('总资金必须大于0')
    .default(0)
    .describe('总资金'),
  capitalRatio: z
    .number()
    .positive('资金比例必须大于0')
    .default(0)
    .describe('资金比例'),
  margin: z.number().positive('保证金必须大于0').describe('保证金'),
})

export type FuturesTransactionBasis = z.infer<
  typeof futuresTransactionBasisSchema
>

export const DEFAULT_FUTURES_TRANSACTION_BASIS: FuturesTransactionBasis = {
  totalCapital: 1000,
  capitalRatio: 10,
  margin: 1,
}

// 开仓控制工具（做空or做多）
export const futuresTransactionMSchema = z.object({
  entrySwing: z.number().default(0).describe('开仓波动价格'),
  positionRatio: z
    .number()
    .positive('仓位百分比必须大于0')
    .default(0)
    .describe('仓位百分比'),
  stopLossSwing: z
    .number()
    .nonnegative('止损价格波动必须大于等于0')
    .default(0)
    .describe('止损价格波动'),
  breakevenSwing: z
    .number()
    .nonnegative('保本价格波动必须大于等于0')
    .default(0)
    .describe('保本价格波动'),
})

export type FuturesTransactionM = z.infer<typeof futuresTransactionMSchema>

export const futuresTransactionEntrySchema = z.object({
  entryType: FuturesTransactionEntryEnum.describe(
    '交易类型：做空(short)or做多(long)'
  ),
  entryPrice: z
    .number()
    .positive('开仓价格必须大于0')
    .describe('开仓价格保持与M2开仓价格同步'),
  profitType: FuturesTransactionProfitEnum.describe('浮盈计算方式'),
  m1: futuresTransactionMSchema,
  m2: futuresTransactionMSchema,
  m3: futuresTransactionMSchema,
})

export type FuturesTransactionEntry = z.infer<
  typeof futuresTransactionEntrySchema
>

export const DEFAULT_FUTURES_TRANSACTION_ENTRY: FuturesTransactionEntry = {
  entryType: 'long',
  entryPrice: 0,
  profitType: 'm1',
  m1: {
    entrySwing: 5,
    positionRatio: 50,
    stopLossSwing: 5,
    breakevenSwing: 2,
  },
  m2: {
    entrySwing: 0,
    positionRatio: 30,
    stopLossSwing: 5,
    breakevenSwing: 2,
  },
  m3: {
    entrySwing: -5,
    positionRatio: 20,
    stopLossSwing: 5,
    breakevenSwing: 2,
  },
}

// 浮盈管理工具
export const futuresTransactionProfitSchema = z.object({
  avgPrice: z
    .number()
    .positive('平均价格必须大于0')
    .default(0)
    .describe('平均价格'),
  marketPrice: z
    .number()
    .positive('当前价格必须大于0')
    .default(0)
    .describe('当前市场价格'),
  exitLotPrice: z
    .number()
    .positive('出仓价格必须大于0')
    .default(0)
    .describe('出仓价格'),
  exitLotRatio: z
    .number()
    .positive('出仓比例必须大于0')
    .default(0)
    .describe('出仓比例'),
  current20EMA: z
    .number()
    .positive('当前20EMA价格必须大于0')
    .default(0)
    .describe('当前20EMA价格'),
})

export type FuturesTransactionProfit = z.infer<
  typeof futuresTransactionProfitSchema
>

export const DEFAULT_FUTURES_TRANSACTION_PROFIT: FuturesTransactionProfit = {
  avgPrice: 10,
  marketPrice: 5,
  exitLotPrice: 5,
  exitLotRatio: 10,
  current20EMA: 5,
}

export const futuresTransactionSchema = z
  .object({
    id: z.string(),
    futuresId: z.string(),
    futuresMeta: FuturesTransactionMetaSchema,
    description: z.string().optional(),

    basis: futuresTransactionBasisSchema.default(
      DEFAULT_FUTURES_TRANSACTION_BASIS
    ),
    entry: futuresTransactionEntrySchema.default(
      DEFAULT_FUTURES_TRANSACTION_ENTRY
    ),
    profit: futuresTransactionProfitSchema.default(
      DEFAULT_FUTURES_TRANSACTION_PROFIT
    ),
  })
  .merge(dateSchema)

export const createFuturesTransactionSchema = futuresTransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateFuturesTransactionSchema = futuresTransactionSchema.partial()

export const getFuturesTransactionSchema = z.object({}).merge(paginationSchema)

export class FuturesTransaction extends createZodDto(
  futuresTransactionSchema
) {}

export class GetAllFuturesTransactionDto extends createZodDto(
  getFuturesTransactionSchema
) {}

export class GetPaginatedFuturesTransactionDto extends createZodDto(
  getFuturesTransactionSchema.merge(paginationSchema)
) {}

export class CreateFuturesTransactionDto extends createZodDto(
  createFuturesTransactionSchema
) {}

export class UpdateFuturesTransactionDto extends createZodDto(
  updateFuturesTransactionSchema
) {}
