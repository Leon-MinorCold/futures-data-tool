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
import {
  EntryFormValues,
  entryFormSchema,
  DEFAULT_ENTRY_VALUES,
} from './schemas'
import { useFuturesTransactionStore } from '@/store/futuresTransaction'
import { useEffect } from 'react'
import FieldTip from '@/pages/dashboard/futures-transaction-tool/FieldTip'

const EntryForm = () => {
  const { setEntryFormData, setTab, formData, setTabDisabledStatus } =
    useFuturesTransactionStore()
  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: DEFAULT_ENTRY_VALUES,
  })

  const { maxTradableLots, tickValue } = formData.basis

  const { watch, setValue } = form
  const entryPrice = watch('m2.entryPrice')
  const entryType = watch('entryType')
  const m1 = watch('m1')
  const m2 = watch('m2')
  const m3 = watch('m3')

  // 计算 m1, m2, m3 的相关值
  const calculateValues = () => {
    const m2EntryPrice = entryPrice

    // 计算 m1 和 m3 的开仓价格
    // 开仓价格 = 开仓价格 + 开仓波动价格 * 每跳波动价格
    const m1EntryPrice = entryPrice + m1.entrySwing * tickValue
    const m3EntryPrice = entryPrice + m3.entrySwing * tickValue

    // 计算 m1, m2, m3 的 position
    // 仓位 = 可交易总手数 * (仓位百分比/100)
    const m1Position = maxTradableLots * (m1.positionRatio / 100)
    const m2Position = maxTradableLots * (m2.positionRatio / 100)
    const m3Position = maxTradableLots * (m3.positionRatio / 100)

    // 计算止损单价格和保本单价格
    const m1StopLossPrice =
      entryType === 'short'
        ? m1EntryPrice - tickValue * m1.stopLossSwing
        : m1EntryPrice + tickValue * m1.stopLossSwing

    const m1BreakevenPrice =
      entryType === 'short'
        ? m1EntryPrice + tickValue * m1.breakevenSwing
        : m1EntryPrice - tickValue * m1.breakevenSwing

    const m2StopLossPrice =
      entryType === 'short'
        ? m2EntryPrice - tickValue * m2.stopLossSwing
        : m2EntryPrice + tickValue * m2.stopLossSwing

    const m2BreakevenPrice =
      entryType === 'short'
        ? m2EntryPrice + tickValue * m2.breakevenSwing
        : m2EntryPrice - tickValue * m2.breakevenSwing

    const m3StopLossPrice =
      entryType === 'short'
        ? m3EntryPrice - tickValue * m3.stopLossSwing
        : m3EntryPrice + tickValue * m3.stopLossSwing

    const m3BreakevenPrice =
      entryType === 'short'
        ? m3EntryPrice + tickValue * m3.breakevenSwing
        : m3EntryPrice - tickValue * m3.breakevenSwing

    return {
      m1EntryPrice,
      m2EntryPrice,
      m3EntryPrice,
      m1Position,
      m2Position,
      m3Position,
      m1StopLossPrice,
      m1BreakevenPrice,
      m2StopLossPrice,
      m2BreakevenPrice,
      m3StopLossPrice,
      m3BreakevenPrice,
    }
  }

  useEffect(() => {
    const entryType = formData.entry.entryType
    setValue('entryType', entryType)
  }, [formData.entry.entryType, setValue])

  const {
    m1EntryPrice,
    m2EntryPrice,
    m3EntryPrice,
    m1Position,
    m2Position,
    m3Position,
    m1StopLossPrice,
    m1BreakevenPrice,
    m2StopLossPrice,
    m2BreakevenPrice,
    m3StopLossPrice,
    m3BreakevenPrice,
  } = calculateValues()

  useEffect(() => {
    setValue('m1.entryPrice', m1EntryPrice)
    setValue('m1.position', m1Position)
    setValue('m1.stopLossPrice', m1StopLossPrice)
    setValue('m1.breakevenPrice', m1BreakevenPrice)

    setValue('m2.entryPrice', m2EntryPrice)
    setValue('m2.position', m2Position)
    setValue('m2.stopLossPrice', m2StopLossPrice)
    setValue('m2.breakevenPrice', m2BreakevenPrice)

    setValue('m3.entryPrice', m3EntryPrice)
    setValue('m3.position', m3Position)
    setValue('m3.stopLossPrice', m3StopLossPrice)
    setValue('m3.breakevenPrice', m3BreakevenPrice)
  }, [
    m1EntryPrice,
    m1Position,
    m1StopLossPrice,
    m1BreakevenPrice,
    m2EntryPrice,
    m2Position,
    m2StopLossPrice,
    m2BreakevenPrice,
    m3EntryPrice,
    m3Position,
    m3StopLossPrice,
    m3BreakevenPrice,
    setValue,
  ])

  // const errors = form.formState.errors

  const onSubmit = (data: EntryFormValues) => {
    const _data: EntryFormValues = {
      ...data,
      profitType: 'sum',
    }
    setEntryFormData(_data)
    setTab('profit')
    setTabDisabledStatus('profit', false)
  }

  // Todo: 保存数据操作
  // 1. 保存数据前需要提示，保存后则不进入浮盈管理工具，直接保存到历史操作
  const onSaveData = () => {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Table className="border">
          <TableHeader>
            <TableRow className="text-white">
              <TableHead colSpan={1} className="text-center">
                {formData.entry.entryType === 'long' ? '做多单' : '做空单'}
              </TableHead>
              <TableHead colSpan={2} className="border">
                <div className="flex justify-center items-center gap-x-1">
                  <span>开仓价格</span>
                  <FieldTip field="entryPrice" />
                </div>
              </TableHead>
              <TableHead colSpan={2} className="border">
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
              <TableHead>
                <div className="flex justify-center items-center gap-x-1">
                  <span>操作</span>
                  <FieldTip field="save" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell rowSpan={3} className="border">
                20EMA指标
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m1.entrySwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>元</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="text-center">
                {m1EntryPrice.toFixed(2)}元
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m1.positionRatio"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border text-center">
                {m1Position.toFixed(2)}手
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m1.stopLossSwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>元</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="text-center">
                {m1StopLossPrice.toFixed(2)}元
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m1.breakevenSwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>元</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="text-center">
                {m1BreakevenPrice.toFixed(2)}元
              </TableCell>
              <TableCell className="border text-center">
                RiskAmount--待计算
              </TableCell>
              <TableCell className="border">
                <Button size="sm" type="button" variant="ghost">
                  保存数据
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="border text-center">
                {form.getValues('m2.entrySwing')}元
                {/* <FormField
                  control={form.control}
                  name="m2.entrySwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
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
                /> */}
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m2.entryPrice"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>元</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m2.positionRatio"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border text-center">
                {m2Position.toFixed(2)}手
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m2.stopLossSwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>元</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border text-center">
                {m2StopLossPrice.toFixed(2)}元
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m2.breakevenSwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>元</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border text-center">
                {m2BreakevenPrice.toFixed(2)}元
              </TableCell>
              <TableCell className="border text-center">
                RiskAmount--待计算
              </TableCell>
              <TableCell className="border">
                <Button size="sm" type="button" variant="ghost">
                  保存数据
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m3.entrySwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>元</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border text-center">
                {m3EntryPrice.toFixed(2)}元
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m3.positionRatio"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border text-center">
                {m3Position.toFixed(2)}手
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m3.stopLossSwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
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
                        <span>元</span>
                      </div>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border text-center">
                {m3StopLossPrice.toFixed(2)}元
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="m3.breakevenSwing"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <div className="flex justify-center items-center gap-x-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <span>元</span>
                      </div>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border text-center">
                {m3BreakevenPrice.toFixed(2)}元
              </TableCell>
              <TableCell className="text-center">RiskAmount--待计算</TableCell>
              <TableCell className="border">
                <Button size="sm" type="button" variant="ghost">
                  保存数据
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button type="submit">进入浮盈管理</Button>
        </div>
      </form>
    </Form>
  )
}

export default EntryForm
