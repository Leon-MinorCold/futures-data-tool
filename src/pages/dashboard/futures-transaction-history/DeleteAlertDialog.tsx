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
import { useDeleteFuturesTransaction } from '@/services/futures-transaction/delete'

interface DeleteAlertDialogProps {
  futuresId: string
  onSuccess?: () => void
}

export function DeleteAlertDialog({
  futuresId,
  onSuccess,
}: DeleteAlertDialogProps) {
  const [open, setOpen] = useState(false)
  const { loading, deleteFuturesTransaction } = useDeleteFuturesTransaction()

  const handleDelete = async () => {
    try {
      await deleteFuturesTransaction(futuresId)
      onSuccess?.()
    } catch (error) {
      toast.error('删除失败')
    } finally {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          删除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            确认删除？
          </AlertDialogTitle>
          <AlertDialogDescription>
            此操作将永久删除该交易记录，删除后数据无法恢复。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? '删除中...' : '确认删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
