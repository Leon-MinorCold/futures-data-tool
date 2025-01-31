import { zodResolver } from '@hookform/resolvers/zod'
import LoginLayout from '@/pages/auth/login/layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Helmet } from 'react-helmet-async'
import { useLogin } from '@/services/auth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { loginSchema } from '@/types/auth/login'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Link } from 'react-router'

type FormValues = z.infer<typeof loginSchema>

const LoginPage = () => {
  const { login, loading } = useLogin()
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '123@qq.com',
      password: '123456',
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data)
    } catch {
      form.reset()
    }
  }

  return (
    <LoginLayout>
      <Helmet>
        <title>Sign in to your account</title>
      </Helmet>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">登录</CardTitle>
            <CardDescription>输入用户名或者邮箱地址</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
              >
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="email"
                          className="lowercase"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>可输入用户名</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="password"
                          className="lowercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-4 flex flex-col items-center gap-y-4">
                  <Button type="submit" disabled={loading} className="w-full">
                    Sign in
                  </Button>

                  <div>
                    Don&apos;t have an account?{' '}
                    <Link
                      to="/auth/register"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </LoginLayout>
  )
}

export default LoginPage
