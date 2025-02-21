import { useAllFutures } from '@/services/futures/futures'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FormMessage } from '@/components/ui/form'

interface FuturesSelectorProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

const FuturesSelector = ({
  value,
  onChange,
  disabled,
}: FuturesSelectorProps) => {
  const { loading, data: list, error } = useAllFutures()

  if (loading) {
    return <Skeleton className="h-10 w-full" />
  }

  if (error) {
    return <FormMessage>Failed to load futures data</FormMessage>
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="请选择一个期货数据" />
      </SelectTrigger>
      <SelectContent>
        {list?.map((future) => (
          <SelectItem key={future.id} value={future.id}>
            {future.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default FuturesSelector
