import { Icons } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  basisFormSchema,
  mSchema,
  profitFormSchema,
} from '@/pages/dashboard/futures-transaction-tool/schemas'
import { ReactNode } from 'react'

const messages = {
  // basis
  maxTradableLots:
    basisFormSchema.shape.basis.shape.maxTradableLots.description,
  minPriceTick:
    basisFormSchema.shape.futuresMeta.shape.minPriceTick.description,
  usedMargin: basisFormSchema.shape.basis.shape.usedMargin.description,
  tickValue: basisFormSchema.shape.futuresMeta.shape.tickValue.description,
  riskControl: basisFormSchema.shape.basis.shape.riskControl.description,

  // entry
  entryPrice: (
    <>
      <p>三行数据分别对应m1,m2,m3</p>
      <p>左侧为上下浮动金额</p>
      <p>右侧 {mSchema.shape.entryPrice.description}</p>
    </>
  ),
  position: mSchema.shape.position.description,
  stopLoss: (
    <>
      <p>做空时：止损单价格 = 开仓价格 + 止损价格波动 * 期货每跳波动价格</p>
      <p>做多时：止损单价格 = 开仓价格 - 止损价格波动 * 期货每跳波动价格</p>
    </>
  ),
  breakeven: (
    <>
      <p>做空时：保本单价格 = 开仓价格 - 保本价格波动 * 每跳波动价格</p>
      <p>做多时：保本单价格 = 开仓价格 + 保本价格波动 * 每跳波动价格</p>
    </>
  ),
  ristAmout: mSchema.shape.ristAmout.description,
  save: '保存数据后，不再进入浮盈管理工具',

  // profit
  takeProfitPrice: profitFormSchema.shape.takeProfitPrice.description,
  unrealizedProfit: profitFormSchema.shape.unrealizedProfit.description,
  unrealizedProfitRatio:
    profitFormSchema.shape.unrealizedProfitRatio.description,
  exitLotSize: profitFormSchema.shape.exitLotSize.description,
  breakevenPrice: profitFormSchema.shape.breakevenPrice.description,
  breakeven20EMADelta: profitFormSchema.shape.breakeven20EMADelta.description,

  default: 'this is a default tooltip',
}

interface Props {
  field?: keyof typeof messages
  customTip?: ReactNode
}

const FieldTip = ({ field = 'default', customTip }: Props) => {
  const tooltipMessage = messages[field]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icons.help size="16" className="cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          {customTip ?? <div>{tooltipMessage}</div>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default FieldTip
