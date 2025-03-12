import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import FieldTip from '@/pages/dashboard/futures-transaction-tool/FieldTip'
import { ExtendFuturesTransaction } from '@/pages/dashboard/futures-transaction-tool/schemas'

interface Props {
  data: ExtendFuturesTransaction | null
}

const BasisDetail = ({ data }: Props) => {
  if (!data) return null

  const {
    basis: {
      totalCapital,
      captitalTrading,
      margin,
      maxTradableLots,
      usedMargin,
      riskControl,
      actualTickValue,
    },
    futuresMeta: { minPriceTick, name, tickValue },
  } = data

  return (
    <div className="flex items-center flex-col gap-y-2">
      <h1 className="font-bold text-lg text-center">基本信息</h1>
      <Table className="border">
        <TableBody>
          <TableRow>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              总资金
            </TableCell>
            <TableCell className="text-center">{totalCapital}元</TableCell>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              交易品种
            </TableCell>
            <TableCell className="text-center">{name}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-center bg-slate-100 dark:bg-gray-600">
              交易使用资金
            </TableCell>
            <TableCell className="text-center">{captitalTrading}元</TableCell>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              保证金
            </TableCell>
            <TableCell className="text-center">{margin}元</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>可交易总手数</span>
                <FieldTip field="maxTradableLots" />
              </div>
            </TableCell>
            <TableCell className="text-center">{maxTradableLots}手</TableCell>
            <TableCell className="bg-slate-100  dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>最小价格变动</span>
                <FieldTip field="minPriceTick" />
              </div>
            </TableCell>
            <TableCell className="text-center">{minPriceTick}元</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="bg-slate-100  dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>交易使用保证金</span>
                <FieldTip field="usedMargin" />
              </div>
            </TableCell>
            <TableCell className="text-center">{usedMargin}元</TableCell>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>期货每跳波动价格</span>
                <FieldTip field="tickValue" />
              </div>
            </TableCell>
            <TableCell className="text-center">{tickValue}元</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-slate-100  dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>资金风控</span>
                <FieldTip field="riskControl" />
              </div>
            </TableCell>
            <TableCell className="text-center">{riskControl}元</TableCell>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              实际交易每跳波动
            </TableCell>
            <TableCell className="text-center">{actualTickValue}元</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default BasisDetail
