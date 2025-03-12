import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { extendFuturesTransactionItem } from '@/lib/futures-transaction'
import BasisDetail from '@/pages/dashboard/futures-transaction-history/components/BasisDetail'
import EntryDetail from '@/pages/dashboard/futures-transaction-history/components/EntryDetail'
import ProfitDetail from '@/pages/dashboard/futures-transaction-history/components/ProfitDetail'
import { FuturesTransaction } from '@/types/futures-transaction/futures-transaction'
import { useMemo } from 'react'

interface Props {
  detailsData: FuturesTransaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DetailsDrawer = ({ detailsData, open, onOpenChange }: Props) => {
  const extendedDetailData = useMemo(() => {
    if (!detailsData) return null
    return extendFuturesTransactionItem(detailsData)
  }, [detailsData])

  if (!extendedDetailData) return null

  const {
    entry: { profitType },
  } = extendedDetailData

  const displayProfit = profitType === 'sum'

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>交易具体信息</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col gap-y-4">
          <BasisDetail data={extendedDetailData} />
          <Separator />
          <EntryDetail data={extendedDetailData} />

          {displayProfit && <ProfitDetail data={extendedDetailData} />}
          <DrawerClose asChild>
            <Button variant="outline">关闭</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default DetailsDrawer
