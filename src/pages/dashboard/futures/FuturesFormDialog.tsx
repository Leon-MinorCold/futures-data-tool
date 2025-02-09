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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Futures, futuresSchema } from '@/types/futures/futures'
import { DialogDescription } from '@radix-ui/react-dialog'

type FormValues = z.infer<typeof futuresSchema>

interface FuturesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Futures | null
  onSubmit: (values: Omit<Futures, 'id'> & { id?: string }) => void
}

export function FuturesFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: FuturesFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(futuresSchema),
    defaultValues: {
      contractName: '',
      contractCode: '',
      minPriceTick: 0,
      tickValue: 0,
      tradeFee: 0,
      exchange: '',
      contractUnitValue: 0,
      contractUnitType: '',
    },
  })

  // 修复：添加 open 到依赖项
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          ...initialData,
          minPriceTick: Number(initialData.minPriceTick),
          tickValue: Number(initialData.tickValue),
          tradeFee: Number(initialData.tradeFee),
          contractUnitValue: Number(initialData.contractUnitValue),
        })
      } else {
        form.reset() // 显式重置为默认值
      }
    }
  }, [open, initialData, form]) // 添加 open 依赖

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      id: initialData?.id,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '编辑期货合约' : '新增期货合约'}
          </DialogTitle>

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
                name="contractName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>品种名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入品种名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>合约代码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入合约代码" {...field} />
                    </FormControl>
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
                name="minPriceTick"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最小价格波动</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tradeFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手续费</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractUnitValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>合约单位值</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractUnitType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>合约单位类型</FormLabel>
                    <FormControl>
                      <Input placeholder="如：吨、手" {...field} />
                    </FormControl>
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
              <Button type="submit">
                {initialData ? '保存修改' : '创建新合约'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
