import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SpinnerProps {
  children: ReactNode
  loading: boolean
  loadingText?: string
}

export const Spinner = ({
  children,
  loading,
  loadingText = '加载中...',
}: SpinnerProps) => {
  return (
    <div
      className={cn(
        'relative transition-opacity duration-300',
        loading ? 'min-h-[200px]' : 'min-h-0'
      )}
    >
      <div
        className={cn(
          'transition-opacity duration-300',
          loading ? 'opacity-30' : 'opacity-100'
        )}
      >
        {children}
      </div>

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Icons.spinner className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>
      )}
    </div>
  )
}
