import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { zodResolver } from '@hookform/resolvers/zod'

import { useFuturesTransactionStore } from '@/store/futuresTransaction'
import { useEffect } from 'react'
import {
  DEFAULT_PROFIT_FORM_VALUES,
  profitFormSchema,
  ProfitFormValues,
} from '@/pages/dashboard/futures-transaction-tool/schemas'
import FieldTip from '@/pages/dashboard/futures-transaction-tool/FieldTip'

const ProfitForm = () => {
  const { setProfitFormData, formData } = useFuturesTransactionStore()
  const form = useForm<ProfitFormValues>({
    resolver: zodResolver(profitFormSchema),
    defaultValues: DEFAULT_PROFIT_FORM_VALUES,
  })
  const { watch, setValue } = form

  const { tickValue, actualTickValue, maxTradableLots, margin } = formData.basis
  const { commission } = formData.futuresMeta

  const avgPrice = watch('avgPrice')
  const marketPrice = watch('marketPrice')
  const exitLotRatio = watch('exitLotRatio')
  const current20EMA = watch('current20EMA')

  const calculateValues = () => {
    const takeProfitPrice = avgPrice - marketPrice
    const unrealizedProfit = takeProfitPrice * tickValue
    const unrealizedProfitRatio =
      (takeProfitPrice * actualTickValue) / (margin * maxTradableLots)
    const exitLotSize = maxTradableLots * (exitLotRatio / 100)
    const breakevenPrice = 2 * avgPrice - marketPrice
    const breakeven20EMADelta = breakevenPrice - current20EMA
    return {
      takeProfitPrice,
      unrealizedProfit,
      unrealizedProfitRatio,
      exitLotSize,
      breakevenPrice,
      breakeven20EMADelta,
    }
  }

  const {
    takeProfitPrice,
    unrealizedProfit,
    unrealizedProfitRatio,
    exitLotSize,
    breakevenPrice,
    breakeven20EMADelta,
  } = calculateValues()

  useEffect(() => {
    setValue('takeProfitPrice', takeProfitPrice)
    setValue('unrealizedProfit', unrealizedProfit)
    setValue('unrealizedProfitRatio', unrealizedProfitRatio)
    setValue('exitLotSize', exitLotSize)
    setValue('breakevenPrice', breakevenPrice)
    setValue('breakeven20EMADelta', breakeven20EMADelta)
  }, [
    takeProfitPrice,
    unrealizedProfit,
    unrealizedProfitRatio,
    exitLotSize,
    breakevenPrice,
    breakeven20EMADelta,
    setValue,
    formData,
  ])

  const errors = form.formState.errors
  // console.log({ errors })

  const onSubmit = async (values: ProfitFormValues) => {
    console.log(values)
    setProfitFormData(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Table className="border">
          <TableBody>
            <TableRow>
              <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                平均价格
              </TableCell>
              <TableCell className="flex justify-center items-center gap-x-2">
                <FormField
                  control={form.control}
                  name="avgPrice"
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
                <FormField
                  control={form.control}
                  name="marketPrice"
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
              </TableCell>

              <TableCell className="bg-slate-100 text-center  dark:bg-gray-600">
                <div className="flex justify-center items-center gap-x-1">
                  <span className="mr-2">出仓手数(%)</span>
                  <FormField
                    control={form.control}
                    name="exitLotRatio"
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
                  <FieldTip field="exitLotSize" />
                </div>
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
                <FormField
                  control={form.control}
                  name="exitLotPrice"
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
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                <div className="flex justify-center items-center gap-x-1">
                  <span>浮盈金额</span>
                  <FieldTip field="unrealizedProfit" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                {unrealizedProfit}元
              </TableCell>
              <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                <div className="flex justify-center items-center gap-x-1">
                  <span> 盈亏平衡价格（不含手续费）</span>
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
                <FormField
                  control={form.control}
                  name="current20EMA"
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

        <div className="flex justify-end mt-4">
          <Button type="submit">保存数据</Button>
        </div>
      </form>
    </Form>
  )
}

export default ProfitForm
