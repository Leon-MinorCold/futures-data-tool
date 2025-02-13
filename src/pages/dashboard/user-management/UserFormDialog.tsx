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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { DialogDescription } from '@radix-ui/react-dialog'
import {
  createUserSchema,
  updateUserSchema,
  User,
  userSchema,
} from '@/types/user/user'
import { useCreateUser } from '@/services/user/create'
import { useUpdateUser } from '@/services/user/update'
import { ROLE_LIST } from '@/constants/user'
import { Icons } from '@/components/ui/icons'

type FormValues = z.infer<typeof userSchema>

const getSchema = (isUpdate: boolean) =>
  isUpdate ? updateUserSchema : createUserSchema

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: User | null
  onSuccess?: () => void
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: Props) {
  const isUpdate = !!initialData
  const { createUser } = useCreateUser()
  const { updateUser } = useUpdateUser()

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema(isUpdate)),
    defaultValues: {
      id: undefined,
      email: '',
      username: '',
      role: 'user',
    },
  })

  // 修复：添加 open 到依赖项
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          ...initialData,
          id: initialData.id,
        })
      } else {
        form.reset()
      }
    }
  }, [open, initialData, form])

  const handleSubmit = async (values: User) => {
    try {
      if (isUpdate) {
        await updateUser(values)
      } else {
        await createUser(values)
      }
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? (
              '编辑用户'
            ) : (
              <span className="flex items-center gap-x-2">
                新建用户
                <HoverCard>
                  <HoverCardTrigger>
                    <Icons.info size={20} />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    创建用户时密码默认为 123456
                  </HoverCardContent>
                </HoverCard>
              </span>
            )}
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="123@qq.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_LIST.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
