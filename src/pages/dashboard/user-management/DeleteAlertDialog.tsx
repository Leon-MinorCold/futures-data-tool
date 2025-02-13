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
import { useDeleteUser } from '@/services/user/delete'

interface DeleteAlertDialogProps {
  userId: string
  onSuccess?: () => void
}

export function DeleteAlertDialog({
  userId,
  onSuccess,
}: DeleteAlertDialogProps) {
  const [open, setOpen] = useState(false)
  const { loading, deleteUser } = useDeleteUser()

  const handleDelete = async () => {
    try {
      await deleteUser(userId)
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
        <Button variant="destructive" size="sm">
          删除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            确认删除？
          </AlertDialogTitle>
          <AlertDialogDescription>
            此操作将永久删除该用户，删除后数据无法恢复。
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
