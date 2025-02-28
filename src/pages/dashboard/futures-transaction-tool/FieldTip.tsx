import { Icons } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  basisFormSchema,
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
  tickValue: basisFormSchema.shape.basis.shape.tickValue.description,
  riskControl: basisFormSchema.shape.basis.shape.riskControl.description,

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
        <TooltipContent>{customTip ?? <p>{tooltipMessage}</p>}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default FieldTip
