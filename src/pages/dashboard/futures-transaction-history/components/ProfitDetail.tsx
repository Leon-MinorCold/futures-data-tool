import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import FieldTip from '@/pages/dashboard/futures-transaction-tool/FieldTip'
import { ExtendFuturesTransaction } from '@/pages/dashboard/futures-transaction-tool/schemas'

interface Props {
  data: ExtendFuturesTransaction | null
}

const ProfitDetail = ({ data }: Props) => {
  if (!data) return null

  const {
    profit: {
      avgPrice,
      marketPrice,
      exitLotSize,
      takeProfitPrice,
      breakeven20EMADelta,
      unrealizedProfit,
      exitLotPrice,
      breakevenPrice,
      unrealizedProfitRatio,
      current20EMA,
    },
    futuresMeta: { commission },
  } = data

  return (
    <div className="flex items-center flex-col gap-y-2">
      <h1 className="font-bold text-lg text-center">浮盈管理</h1>
      <Table className="border">
        <TableBody>
          <TableRow>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              平均价格
            </TableCell>
            <TableCell className="flex justify-center items-center gap-x-2">
              {avgPrice}元
            </TableCell>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              手续费
            </TableCell>
            <TableCell className="text-center">{commission}元</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              当前价格
            </TableCell>

            <TableCell className="flex items-center justify-center gap-x-2">
              {marketPrice}元
            </TableCell>

            <TableCell className="text-center bg-slate-100 dark:bg-gray-600">
              出仓手数
            </TableCell>

            <TableCell className="text-center">{exitLotSize}手</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>盈利点位</span>
                <FieldTip field="takeProfitPrice" />
              </div>
            </TableCell>
            <TableCell className="text-center">{takeProfitPrice}元</TableCell>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              出仓价格
            </TableCell>
            <TableCell className="flex justify-center items-center gap-x-1">
              {exitLotPrice}元
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>浮盈金额</span>
                <FieldTip field="unrealizedProfit" />
              </div>
            </TableCell>
            <TableCell className="text-center">{unrealizedProfit}元</TableCell>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>盈亏平衡价格（不含手续费）</span>
                <FieldTip field="breakevenPrice" />
              </div>
            </TableCell>
            <TableCell className="text-center">{breakevenPrice}元</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span>浮盈比例</span>
                <FieldTip field="unrealizedProfitRatio" />
              </div>
            </TableCell>
            <TableCell className="text-center">
              {isNaN(unrealizedProfitRatio) ? 0 : unrealizedProfitRatio}
            </TableCell>
            <TableCell className="bg-slate-100 text-center  dark:bg-gray-600">
              当前20EMA价格
            </TableCell>
            <TableCell className="flex justify-center gap-x-2 items-center">
              {current20EMA}元
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="bg-slate-100 dark:bg-gray-600" />
            <TableCell />
            <TableCell className="bg-slate-100 dark:bg-gray-600">
              <div className="flex justify-center items-center gap-x-1">
                <span> 盈亏平衡价格与20EMA距离</span>
                <FieldTip field="breakeven20EMADelta" />
              </div>
            </TableCell>
            <TableCell className="text-center">
              {breakeven20EMADelta}元
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ProfitDetail
