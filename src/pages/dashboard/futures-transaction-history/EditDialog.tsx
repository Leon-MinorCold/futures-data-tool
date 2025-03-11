import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { useUpdateFuturesTransaction } from '@/services/futures-transaction/update'
import { FuturesTransaction } from '@/types/futures-transaction/futures-transaction'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// 定义表单验证规则
const formSchema = z.object({
  description: z.string().max(200, '备注不能超过200个字符'),
})
type FormValues = z.infer<typeof formSchema>

// 修改接口定义
interface EditDialogProps {
  transaction: FuturesTransaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditDialog = ({
  transaction,
  open,
  onOpenChange,
}: EditDialogProps) => {
  const { updateFuturesTransaction, loading } = useUpdateFuturesTransaction()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction.description || '',
    },
    values: {
      description: transaction.description || '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await updateFuturesTransaction({
        id: transaction.id,
        description: values.description,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('更新失败:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) form.reset() // 关闭时重置表单
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>备注</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="请输入备注信息"
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
