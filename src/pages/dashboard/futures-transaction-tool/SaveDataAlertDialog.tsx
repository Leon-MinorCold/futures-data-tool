import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCreateFuturesTransaction } from '@/services/futures-transaction/create'
import { TransactionStoreValues } from '@/store/futuresTransaction'

interface Props {
  onSaveData: () => TransactionStoreValues
  onSuccess?: () => void
}

export function SaveDataAlertDialog({ onSaveData, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const { createFuturesTransaction, loading } = useCreateFuturesTransaction()

  const save = async () => {
    try {
      const formData = onSaveData()
      onSuccess?.()
      await createFuturesTransaction(formData)
    } catch (error) {
      toast.error('保存失败')
    } finally {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          保存数据
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认保存数据?</AlertDialogTitle>
          <AlertDialogDescription>
            保存数据后无法进入浮盈管理工具
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={save} disabled={loading}>
            {loading ? '保存中...' : '确认保存数据'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
