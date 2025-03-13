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
import {
  TransactionStoreValues,
  useFuturesTransactionStore,
} from '@/store/futuresTransaction'
import { useEffect } from 'react'
import FieldTip from '@/pages/dashboard/futures-transaction-tool/FieldTip'
import { SaveDataAlertDialog } from '@/pages/dashboard/futures-transaction-tool/SaveDataAlertDialog'
import { FuturesTransactionProfitType } from '@/types/futures-transaction/futures-transaction'
import { entryCalculateDerivedValues } from '@/lib/futures-transaction'

const EntryForm = () => {
  const {
    setEntryFormData,
    setTab,
    formData,
    reset: resetStore,
  } = useFuturesTransactionStore()
  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: DEFAULT_ENTRY_VALUES,
  })

  const { watch, setValue, reset, getValues } = form

  const watchedFormValues = watch()

  useEffect(() => {
    const calculatedFormValues = entryCalculateDerivedValues({
      entryFormValues: watchedFormValues,
      basisFormValues: {
        basis: formData.basis,
        futuresId: formData.futuresId,
        futuresMeta: formData.futuresMeta,
      },
    })
    reset({
      ...calculatedFormValues,
    })
  }, [JSON.stringify(watchedFormValues), formData])

  useEffect(() => {
    const entryType = formData.entry.entryType
    setValue('entryType', entryType)
  }, [formData.entry.entryType, setValue])

  const onSubmit = (data: EntryFormValues) => {
    const _data: EntryFormValues = {
      ...data,
      profitType: 'sum',
    }
    setEntryFormData(_data)
    setTab('profit')
  }

  const onSaveData = (
    profitType: FuturesTransactionProfitType
  ): TransactionStoreValues => {
    const values = form.getValues()
    const _data: EntryFormValues = {
      ...values,
      profitType,
    }

    setEntryFormData(_data)
    const _formData: TransactionStoreValues = {
      ...formData,
      entry: _data,
    }
    return _formData
  }

  const onSaveDataSuccess = () => {
    resetStore()
  }

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
                {getValues('m1.entryPrice')}元
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
                {getValues('m1.position')}手
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
                {getValues('m1.stopLossPrice')}元
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
                {getValues('m1.breakevenPrice')}元
              </TableCell>
              <TableCell className="border text-center">
                RiskAmount--待计算
              </TableCell>
              <TableCell className="border">
                <SaveDataAlertDialog
                  onSaveData={() => onSaveData('m1')}
                  onSuccess={onSaveDataSuccess}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="border text-center">
                {form.getValues('m2.entrySwing')}元
              </TableCell>
              <TableCell className="border">
                <FormField
                  control={form.control}
                  name="entryPrice"
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
                {getValues('m2.position')}手
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
                {getValues('m2.stopLossPrice')}元
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
                {getValues('m2.breakevenPrice')}元
              </TableCell>
              <TableCell className="border text-center">
                RiskAmount--待计算
              </TableCell>
              <TableCell className="border">
                <SaveDataAlertDialog
                  onSaveData={() => onSaveData('m2')}
                  onSuccess={onSaveDataSuccess}
                />
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
                {getValues('m3.entryPrice')}元
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
                {getValues('m3.position')}手
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
                {getValues('m3.stopLossPrice')}元
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
                {getValues('m3.breakevenPrice')}元
              </TableCell>
              <TableCell className="text-center">RiskAmount--待计算</TableCell>
              <TableCell className="border">
                <SaveDataAlertDialog
                  onSaveData={() => onSaveData('m3')}
                  onSuccess={onSaveDataSuccess}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4 gap-x-2">
          <Button type="button" onClick={() => setTab('basis')}>
            上一步
          </Button>
          <Button type="submit">进入浮盈管理</Button>
        </div>
      </form>
    </Form>
  )
}

export default EntryForm
