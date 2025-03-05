import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'
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
import { useCreateFuturesTransaction } from '@/services/futures-transaction/create'
import { toast } from 'sonner'
import { profitCalculateDerivedValues } from '@/lib/futures-transaction'

const ProfitForm = () => {
  const { createFuturesTransaction, loading } = useCreateFuturesTransaction()
  const { setProfitFormData, formData, reset, setTab } =
    useFuturesTransactionStore()
  const form = useForm<ProfitFormValues>({
    resolver: zodResolver(profitFormSchema),
    defaultValues: DEFAULT_PROFIT_FORM_VALUES,
  })
  const { watch, getValues, reset: profitFormReset } = form

  const watchedFormValues = watch()

  useEffect(() => {
    const calculatedFormValues = profitCalculateDerivedValues({
      profitFormValues: watchedFormValues,
      basisFormValues: {
        basis: formData.basis,
        futuresId: formData.futuresId,
        futuresMeta: formData.futuresMeta,
      },
    })
    profitFormReset({
      ...calculatedFormValues,
    })
  }, [JSON.stringify(watchedFormValues), formData])

  const onSubmit = async (values: ProfitFormValues) => {
    try {
      setProfitFormData(values)
      const data = {
        ...formData,
        profit: values,
      }
      await createFuturesTransaction(data)
      reset()
    } catch (e) {
      console.log(e)
      toast.error('保存失败')
    }
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span>元</span>
              </TableCell>
              <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                手续费
              </TableCell>
              <TableCell className="text-center">
                {formData.futuresMeta.commission}元
              </TableCell>
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
                      <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FieldTip field="exitLotSize" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                {getValues('exitLotSize')}手
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                <div className="flex justify-center items-center gap-x-1">
                  <span>盈利点位</span>
                  <FieldTip field="takeProfitPrice" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                {getValues('takeProfitPrice')}元
              </TableCell>
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
                      <FormMessage />
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
                {getValues('unrealizedProfit')}元
              </TableCell>
              <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                <div className="flex justify-center items-center gap-x-1">
                  <span>盈亏平衡价格（不含手续费）</span>
                  <FieldTip field="breakevenPrice" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                {getValues('breakevenPrice')}元
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="bg-slate-100 text-center dark:bg-gray-600">
                <div className="flex justify-center items-center gap-x-1">
                  <span>浮盈比例</span>
                  <FieldTip field="unrealizedProfitRatio" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                {isNaN(getValues('unrealizedProfitRatio'))
                  ? 0
                  : getValues('unrealizedProfitRatio')}
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
                      <FormMessage />
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
                {getValues('breakeven20EMADelta')}元
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex justify-end mt-4 gap-x-2">
          <Button type="button" onClick={() => setTab('entry')}>
            回到上一步
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            保存数据
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProfitForm
