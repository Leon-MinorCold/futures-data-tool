import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>发生错误</AlertTitle>
        <AlertDescription>
          {isRouteErrorResponse(error)
            ? `错误 ${error.status}: ${error.statusText}`
            : error instanceof Error
              ? error.message
              : '发生了未知错误，请稍后再试。'}
        </AlertDescription>
      </Alert>

      <div className="mt-4 flex gap-2">
        <Button onClick={() => window.location.reload()}>刷新页面</Button>
        <Button variant="outline" onClick={handleGoHome}>
          返回主页
        </Button>
      </div>
    </div>
  )
}
