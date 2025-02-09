import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import PageContainer from '@/layout/page-container'
import { useFutures } from '@/services/futures/futures'
import { Futures } from '@/types/futures/futures'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Icons } from '@/components/ui/icons'
import { useState } from 'react'
import { FuturesFormDialog } from '@/pages/dashboard/futures/FuturesFormDialog'
import { useCreateFutures } from '@/services/futures/create'
import { useUpdateFutures } from '@/services/futures/update'

const FuturesPage = () => {
  const { loading: futuresLoading, error, futures = [], refetch } = useFutures()
  const { loading: createLoading, createFutures } = useCreateFutures()
  const { loading: updateLoading, updateFutures } = useUpdateFutures()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFutures, setEditingFutures] = useState<Futures | null>(null)

  const columns: ColumnDef<Futures>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },

    {
      accessorKey: 'contractName',
      header: '品种名称',
      cell: ({ row }) => {
        const futures = row.original
        return (
          <div className="capitalize">
            {row.getValue('contractName')}-{futures.contractCode}
          </div>
        )
      },
    },
    {
      accessorKey: 'minPriceTick',
      header: '最小价格波动',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('minPriceTick')}元/吨</div>
      ),
    },
    {
      accessorKey: 'tickValue',
      header: '每跳波动价格',
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue('tickValue')}元</div>
      },
    },
    {
      accessorKey: 'tradeFee',
      header: '手续费',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('tradeFee')}元</div>
      ),
    },

    {
      accessorKey: 'exchange',
      header: '交易所',
    },
    {
      accessorKey: 'contractUnitValue',
      header: '合约单位',
      cell: ({ row }) => {
        const futures = row.original
        return (
          <div className="capitalize">
            {futures.contractUnitValue}
            {futures.contractUnitType}
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const futures = row.original
        return (
          <div className="flex gap-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingFutures(futures)
                setDialogOpen(true)
              }}
            >
              编辑
            </Button>
            <Button size="sm" variant="destructive">
              删除
            </Button>
          </div>
          // <DropdownMenu>
          //   <DropdownMenuTrigger asChild>
          //     <Button variant="ghost" className="h-8 w-8 p-0">
          //       <span className="sr-only">Open menu</span>
          //       <MoreHorizontal className="h-4 w-4" />
          //     </Button>
          //   </DropdownMenuTrigger>
          //   <DropdownMenuContent align="end">
          //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
          //     <DropdownMenuItem
          //       onClick={() => navigator.clipboard.writeText(futures.id)}
          //     >
          //       Copy payment ID
          //     </DropdownMenuItem>
          //     <DropdownMenuSeparator />
          //     <DropdownMenuItem>View customer</DropdownMenuItem>
          //     <DropdownMenuItem>View payment details</DropdownMenuItem>
          //   </DropdownMenuContent>
          // </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: futures,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // 处理表单提交
  const handleSubmit = async (
    values: Omit<Futures, 'id'> & { id?: string }
  ) => {
    try {
      if (values.id) {
        await updateFutures(values as Futures)
      } else {
        await createFutures(values)
      }
      refetch()
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-row-reverse mb-4">
        <Button
          size="sm"
          onClick={() => {
            setEditingFutures(null)
            setDialogOpen(true)
          }}
        >
          <Icons.add />
          新增
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <FuturesFormDialog
        key={editingFutures?.id || 'create'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingFutures}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  )
}

export default FuturesPage
