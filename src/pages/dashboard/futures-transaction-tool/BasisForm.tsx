import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  futuresTransactionBasisSchema,
  DEFAULT_FUTURES_TRANSACTION_BASIS,
  FuturesTransactionMetaSchema,
  DEFAULT_FUTURES_TRANSACTION_META,
} from '@/types/futures-transaction/futures-transaction'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FuturesSelector from '@/components/futures-selector'
import { useAllFutures } from '@/services/futures/futures'
import { useEffect } from 'react'
import { useFuturesTransactionStore } from '@/store/futuresTransaction'

export const BasisFormSchema = z.object({}).extend({
  basis: futuresTransactionBasisSchema.extend({
    // 以下5个字段只有前端用，纯用来展示
    maxTradableLots: z.number(), // 可交易总手数
    usedMargin: z.number(), // 交易使用保证金
    riskControl: z.number(), // 资金风控
    actualTickValue: z.number(), //实际交易每跳波动价格
    tickValue: z.number(), // 期货的每跳波动价格
  }),
  futuresId: z.string(),
  futuresMeta: FuturesTransactionMetaSchema,
})

export type BasisFormValues = z.infer<typeof BasisFormSchema>

// 创建计算函数集合
const calculateDerivedValues = (
  totalCapital: number,
  capitalRatio: number,
  margin: number,
  tickValue: number,
  maxTradableLots: number
) => ({
  usedMargin: margin * maxTradableLots,
  riskControl:
    (margin * maxTradableLots) / ((totalCapital * capitalRatio) / 100),
  actualTickValue: tickValue * maxTradableLots,
})

const BasisForm = () => {
  const { data: futuresList } = useAllFutures()
  const { setBasisFormData } = useFuturesTransactionStore()
  const form = useForm<BasisFormValues>({
    resolver: zodResolver(BasisFormSchema),
    defaultValues: {
      futuresId: '',
      futuresMeta: DEFAULT_FUTURES_TRANSACTION_META,
      basis: {
        ...DEFAULT_FUTURES_TRANSACTION_BASIS,
        maxTradableLots: 0,
        usedMargin: 0,
        riskControl: 0,
        actualTickValue: 0,
        tickValue: 0,
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
      const newMaxTradableLots = totalCapital / (capitalRatio * margin)
      const shouldUpdateMaxLots =
        Math.abs(form.getValues('basis.maxTradableLots') - newMaxTradableLots) >
        0.01

      if (shouldUpdateMaxLots) {
        form.setValue('basis.maxTradableLots', newMaxTradableLots)

        // 计算衍生值
        const { usedMargin, riskControl, actualTickValue } =
          calculateDerivedValues(
            totalCapital,
            capitalRatio,
            margin,
            tickValue,
            newMaxTradableLots
          )

        form.setValue('basis.usedMargin', usedMargin)
        form.setValue('basis.riskControl', riskControl)
        form.setValue('basis.actualTickValue', actualTickValue)
      }
    }
  }, [watchedValues, futuresList, form])

  const handlePreSubmit = async (action: 'short' | 'long') => {
    // Todo: 这里需要执行一步设置全局store short or long的设置
    console.log('action:', action)

    // 然后执行提交
    await form.handleSubmit(async (values) => {
      // 根据按钮的不同执行不同的逻辑
      setBasisFormData(values)
    })()
  }

  const handleSubmit = async (values: BasisFormValues) => {
    try {
      console.log('values', values)
      setBasisFormData(values)
    } catch (error) {
      console.log(error)
    }
  }

  // const errors = form.formState.errors
  // console.log({ errors })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basis.totalCapital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>总资金</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="请输入交易总资金"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="futuresId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>交易品种</FormLabel>
                <FormControl>
                  <FuturesSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  交易品种决定最小变动单位和每跳波动价格
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basis.capitalRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>交易使用资金比例%</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="请输入交易使用资金比例"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  交易使用资金 = 总资金 * 交易使用资金百分比。当前交易使用资金为
                  {form.getValues('basis.totalCapital') *
                    (form.getValues('basis.capitalRatio') / 100)}
                  元
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basis.margin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>保证金</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="请输入保证金金额"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basis.maxTradableLots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>可交易总手数</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled
                    placeholder="请输入总资金、交易使用资金比例以及保证金"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  可交易总手数 = (总资金 * 交易使用资金比例%)/ 保证金
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="futuresMeta.minPriceTick"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最小变动单位</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled
                    placeholder="请选择交易品种"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  最小变动单位由选择的交易品种决定。例如，玻璃的最小变动单位为
                  20元/吨
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basis.usedMargin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>交易使用保证金</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled
                    placeholder="请先输入保证金以及交易使用资金比例"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  交易使用保证金 = 保证金 * 可交易总手数
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basis.tickValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>每跳波动价格</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled
                    placeholder="请选择交易品种"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  每跳波动价格由选择的期货决定。每跳波动价格 = 期货最小变动单位
                  * 期货交易单位值。例如: 玻璃的每跳波动价格为
                  20元/吨，玻璃期货交易单位值为 20吨/手， 所以最小变动单位为 20
                  * 20 = 400元/手
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basis.riskControl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>资金风控</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled
                    placeholder="请选择交易品种"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  资金风控 = 交易使用保证金 / 交易使用资金
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basis.actualTickValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>实际交易每跳波动价格</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled
                    placeholder="请选择交易品种"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  实际交易每跳波动价格 = 每跳波动价格 * 可交易总手数
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            // onClick={() => onOpenChange(false)}
          >
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
  )
}

export default BasisForm
