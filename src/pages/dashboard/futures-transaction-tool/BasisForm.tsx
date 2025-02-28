import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DEFAULT_FUTURES_TRANSACTION_BASIS,
  DEFAULT_FUTURES_TRANSACTION_META,
  FuturesTransactionEntryType,
} from '@/types/futures-transaction/futures-transaction'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FuturesSelector from '@/components/futures-selector'
import { useAllFutures } from '@/services/futures/futures'
import { useEffect } from 'react'
import { useFuturesTransactionStore } from '@/store/futuresTransaction'
import { BasisFormValues, basisFormSchema } from './schemas'
import FieldTip from '@/pages/dashboard/futures-transaction-tool/FieldTip'

// 创建计算函数集合
const calculateDerivedValues = (
  totalCapital: number,
  capitalRatio: number,
  margin: number,
  tickValue: number,
  maxTradableLots: number
) => ({
  captitalTrading: +(totalCapital * (capitalRatio / 100)).toFixed(6),
  usedMargin: +(margin * maxTradableLots).toFixed(6),
  riskControl: +(
    (margin * maxTradableLots) /
    ((totalCapital * capitalRatio) / 100)
  ).toFixed(6),
  actualTickValue: +(tickValue * maxTradableLots).toFixed(6),
})

const BasisForm = () => {
  const { data: futuresList } = useAllFutures()
  const { setBasisFormData, setTab, setEntryType, setTabDisabledStatus } =
    useFuturesTransactionStore()
  const form = useForm<BasisFormValues>({
    resolver: zodResolver(basisFormSchema),
    defaultValues: {
      futuresId: '',
      futuresMeta: DEFAULT_FUTURES_TRANSACTION_META,
      basis: {
        ...DEFAULT_FUTURES_TRANSACTION_BASIS,
        totalCapital: 1000,
        maxTradableLots: 0,
        usedMargin: 0,
        riskControl: 0,
        actualTickValue: 0,
        tickValue: 0,
        captitalTrading: 0,
      },
    },
  })

  // 合并监听字段
  const watchedValues = form.watch([
    'futuresId',
    'basis.totalCapital',
    'basis.margin',
    'basis.capitalRatio',
    'basis.tickValue',
    'basis.maxTradableLots',
  ])

  useEffect(() => {
    const [
      futuresId,
      totalCapital,
      margin,
      capitalRatio,
      tickValue,
      maxTradableLots,
    ] = watchedValues

    // 处理期货选择逻辑
    if (futuresId) {
      const futuresItem = futuresList?.find((item) => item.id === futuresId)
      if (futuresItem) {
        const tickValue = futuresItem.size * futuresItem.minPriceTick
        form.setValue('futuresMeta', {
          minPriceTick: futuresItem.minPriceTick,
          name: futuresItem.name,
          size: futuresItem.size,
          commission: futuresItem.fee,
        })
        form.setValue('basis.tickValue', tickValue)
      }
    }

    // 合并计算逻辑
    if (totalCapital && margin && capitalRatio) {
      const maxTradableLots = +(
        (totalCapital * capitalRatio) /
        (100 * margin)
      ).toFixed(6)

      form.setValue('basis.maxTradableLots', maxTradableLots)

      // 计算衍生值
      const { usedMargin, riskControl, actualTickValue, captitalTrading } =
        calculateDerivedValues(
          totalCapital,
          capitalRatio,
          margin,
          tickValue,
          maxTradableLots
        )

      form.setValue('basis.captitalTrading', captitalTrading)
      form.setValue('basis.usedMargin', usedMargin)
      form.setValue('basis.riskControl', riskControl)
      form.setValue('basis.actualTickValue', actualTickValue)
    }
  }, [watchedValues, futuresList, form])

  const handlePreSubmit = async (action: FuturesTransactionEntryType) => {
    setEntryType(action)

    // 然后执行提交
    await form.handleSubmit(async (values) => {
      // 根据按钮的不同执行不同的逻辑
      setBasisFormData(values)
      setTab('entry')
      setTabDisabledStatus('entry', false)
    })()
  }

  return (
    <div className="space-y-3 w-[800px]">
      <Alert>
        <AlertTitle>计算公式如下:</AlertTitle>
        <AlertDescription className="text-slate-500">
          <p>{basisFormSchema.shape.basis.shape.captitalTrading.description}</p>
          <p>{basisFormSchema.shape.basis.shape.maxTradableLots.description}</p>
          <p>{basisFormSchema.shape.basis.shape.usedMargin.description}</p>
          <p>{basisFormSchema.shape.basis.shape.riskControl.description}</p>
          <p>{basisFormSchema.shape.basis.shape.actualTickValue.description}</p>
          <p>{basisFormSchema.shape.basis.shape.tickValue.description}</p>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form>
          <Table className="border">
            <TableBody>
              <TableRow>
                <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                  总资金
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-x-1">
                    <FormField
                      control={form.control}
                      name="basis.totalCapital"
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(event) =>
                                field.onChange(+event.target.value)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>元</span>
                  </div>
                </TableCell>
                <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                  交易品种
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name="futuresId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FuturesSelector
                            className="w-44"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-slate-100 dark:bg-gray-600">
                  <div className="flex justify-center items-center gap-x-2">
                    <span>交易使用资金%</span>
                    <FormField
                      control={form.control}
                      name="basis.capitalRatio"
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(event) =>
                                field.onChange(+event.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {form.getValues('basis.captitalTrading')}元
                </TableCell>
                <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                  保证金
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-x-1">
                    <FormField
                      control={form.control}
                      name="basis.margin"
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(event) =>
                                field.onChange(+event.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <span>元</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                  <div className="flex justify-center items-center gap-x-1">
                    <span>可交易总手数</span>
                    <FieldTip field="maxTradableLots" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {form.getValues('basis.maxTradableLots')}手
                </TableCell>
                <TableCell className="bg-slate-100  dark:bg-gray-600">
                  <div className="flex justify-center items-center gap-x-1">
                    <span>最小价格变动</span>
                    <FieldTip field="minPriceTick" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {form.getValues('futuresMeta.minPriceTick')}元
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-slate-100  dark:bg-gray-600">
                  <div className="flex justify-center items-center gap-x-1">
                    <span>交易使用保证金</span>
                    <FieldTip field="usedMargin" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {form.getValues('basis.usedMargin')}元
                </TableCell>
                <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                  <div className="flex justify-center items-center gap-x-1">
                    <span>期货每跳波动价格</span>
                    <FieldTip field="tickValue" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {form.getValues('basis.tickValue')}元
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-slate-100  dark:bg-gray-600">
                  <div className="flex justify-center items-center gap-x-1">
                    <span>资金风控</span>
                    <FieldTip field="riskControl" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {form.getValues('basis.riskControl')}元
                </TableCell>
                <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                  实际交易每跳波动
                </TableCell>
                <TableCell className="text-center">
                  {form.getValues('basis.actualTickValue')}元
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-end gap-x-2 mt-3">
            <Button type="button" variant="outline">
              取消
            </Button>
            <Button
              type="button"
              onClick={() => handlePreSubmit('short')}
              disabled={form.formState.isSubmitting}
            >
              进入做空单
            </Button>
            <Button
              type="button"
              onClick={() => handlePreSubmit('long')}
              disabled={form.formState.isSubmitting}
            >
              进入做多单
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default BasisForm
