import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Futures,
  futuresSchema,
  createFuturesSchema,
  updateFuturesSchema,
} from '@/types/futures/futures'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useCreateFutures } from '@/services/futures/create'
import { useUpdateFutures } from '@/services/futures/update'
import { toast } from 'sonner'

type FormValues = z.infer<typeof futuresSchema>

const getSchema = (isUpdate: boolean) =>
  isUpdate ? updateFuturesSchema : createFuturesSchema

interface FuturesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Futures | null
  onSuccess?: () => void
}

export function FuturesFormDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: FuturesFormDialogProps) {
  const { createFutures } = useCreateFutures()
  const { updateFutures } = useUpdateFutures()
  const isUpdate = !!initialData

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema(isUpdate)),
    defaultValues: {
      name: '玻璃',
      code: 'FG',
      minPriceTick: 1,
      fee: 6,
      exchange: '上海交易所',
      size: 20,
      unit: '吨',
      id: undefined,
    },
  })

  // 计算每跳波动价格
  const { size, minPriceTick } = form.getValues()
  const tickValue = size * minPriceTick

  // 修复：添加 open 到依赖项
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          ...initialData,
          minPriceTick: Number(initialData.minPriceTick),
          fee: Number(initialData.fee),
          size: Number(initialData.size),
          id: initialData.id,
        })
      } else {
        form.reset()
      }
    }
  }, [open, initialData, form])

  const handleSubmit = async (values: Futures) => {
    try {
      if (isUpdate) {
        await updateFutures(values)
      } else {
        await createFutures(values)
      }
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error(isUpdate ? '更新失败' : '创建失败')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? '编辑期货' : '新建期货'}</DialogTitle>

          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>期货名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入期货名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>期货代码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入期货代码" {...field} />
                    </FormControl>
                    <FormDescription>
                      例如：FG代表的是玻璃期货的代码
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minPriceTick"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最小价格波动</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>例如: 玻璃 1元/吨</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exchange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>交易所</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入交易所" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手续费</FormLabel>
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

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>期货交易单位值</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>例如：玻璃 20(吨/手)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>期货单位类型</FormLabel>
                    <FormControl>
                      <Input placeholder="如：吨" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tickValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>每跳波动价格</FormLabel>
                    <FormControl>
                      <Input type="number" value={tickValue} readOnly />
                    </FormControl>
                    <FormDescription>
                      每跳波动价格 = 期货交易单位值 * 最小价格波动
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
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? '提交中...'
                  : isUpdate
                    ? '保存'
                    : '创建'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
