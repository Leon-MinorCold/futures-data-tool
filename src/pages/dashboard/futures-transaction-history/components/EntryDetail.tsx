import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from '@/components/ui/table'
import FieldTip from '@/pages/dashboard/futures-transaction-tool/FieldTip'
import { ExtendFuturesTransaction } from '@/pages/dashboard/futures-transaction-tool/schemas'

interface Props {
  data: ExtendFuturesTransaction | null
}

const EntryDetail = ({ data }: Props) => {
  if (!data) return null

  const {
    entry: { entryType, m1, m2, m3 },
  } = data

  return (
    <div className="flex items-center flex-col gap-y-2">
      <h1 className="font-bold text-lg text-center">开仓控制工具</h1>
      <Table className="border">
        <TableHeader>
          <TableRow className="text-white">
            <TableHead colSpan={1} className="text-center">
              {entryType === 'long' ? '做多单' : '做空单'}
            </TableHead>
            <TableHead colSpan={2} className="border">
              <div className="flex justify-center items-center gap-x-1">
                <span>开仓价格</span>
                <FieldTip field="entryPrice" />
              </div>
            </TableHead>
            <TableHead colSpan={1} className="border">
              <div className="flex justify-center items-center gap-x-1">
                <span>仓位</span>
                <FieldTip field="position" />
              </div>
            </TableHead>
            <TableHead colSpan={2} className="border">
              <div className="flex justify-center items-center gap-x-1">
                <span>止损单价格</span>
                <FieldTip field="stopLoss" />
              </div>
            </TableHead>
            <TableHead colSpan={2} className="border">
              <div className="flex justify-center items-center gap-x-1">
                <span>保本单价格</span>
                <FieldTip field="breakeven" />
              </div>
            </TableHead>
            <TableHead className="border">
              <div className="flex justify-center items-center gap-x-1">
                <span>风险金额（未包含手续费）</span>
                <FieldTip field="ristAmout" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell rowSpan={3} className="border text-center">
              20EMA指标
            </TableCell>
            <TableCell className="border text-center">
              {m1.entrySwing}元
            </TableCell>
            <TableCell className="text-center">{m1.entryPrice}元</TableCell>

            <TableCell className="border text-center">
              {m1.position}手
            </TableCell>
            <TableCell className="border text-center">
              {m1.stopLossSwing}元
            </TableCell>
            <TableCell className="text-center">{m1.stopLossPrice}元</TableCell>
            <TableCell className="border text-center">
              {m1.breakevenSwing}元
            </TableCell>
            <TableCell className="text-center">{m1.breakevenPrice}元</TableCell>
            <TableCell className="border text-center">
              RiskAmount--待计算
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="border text-center">
              {m2.entrySwing}元
            </TableCell>
            <TableCell className="text-center">{m2.entryPrice}元</TableCell>

            <TableCell className="border text-center">
              {m2.position}手
            </TableCell>
            <TableCell className="border text-center">
              {m2.stopLossSwing}元
            </TableCell>
            <TableCell className="text-center">{m2.stopLossPrice}元</TableCell>
            <TableCell className="border text-center">
              {m2.breakevenSwing}元
            </TableCell>
            <TableCell className="text-center">{m2.breakevenPrice}元</TableCell>
            <TableCell className="border text-center">
              RiskAmount--待计算
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="border text-center">
              {m3.entrySwing}元
            </TableCell>
            <TableCell className="text-center">{m3.entryPrice}元</TableCell>

            <TableCell className="border text-center">
              {m3.position}手
            </TableCell>
            <TableCell className="border text-center">
              {m3.stopLossSwing}元
            </TableCell>
            <TableCell className="text-center">{m3.stopLossPrice}元</TableCell>
            <TableCell className="border text-center">
              {m3.breakevenSwing}元
            </TableCell>
            <TableCell className="text-center">{m3.breakevenPrice}元</TableCell>
            <TableCell className="border text-center">
              RiskAmount--待计算
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default EntryDetail
