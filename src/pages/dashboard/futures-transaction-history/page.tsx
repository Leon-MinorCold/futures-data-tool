import { useState } from 'react'
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
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
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import PageContainer from '@/layout/page-container'
import { usePaginatedFuturesTransactions } from '@/services/futures-transaction/transaction'
import { FuturesTransaction } from '@/types/futures-transaction/futures-transaction'
import { futuresTransactionCalculation } from './utils'
import { DeleteAlertDialog } from './DeleteAlertDialog'
import { formatDateTime } from '@/lib/date'
import { EditDialog } from './EditDialog'
import DetailsDrawer from '@/pages/dashboard/futures-transaction-history/DetailsDrawer'

const FuturesTransactionHistoryPage = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { loading, data } = usePaginatedFuturesTransactions({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  })

  const list = data?.list || []
  const total = data?.pagination.total || 0

  const [editingTransaction, setEditingTransaction] =
    useState<FuturesTransaction | null>(null)
  const [detailsData, setDetailsData] = useState<FuturesTransaction | null>(
    null
  )

  const columns: ColumnDef<FuturesTransaction>[] = [
    {
      accessorKey: 'id',
      header: () => '序号',
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination
        return <span> {pageIndex * pageSize + row.index + 1}</span>
      },
    },
    {
      accessorKey: 'futuresMeta',
      header: '品种',
      cell: ({ row }) => {
        const futuresMeta = row.original.futuresMeta
        return <span>{futuresMeta.name}</span>
      },
    },
    {
      accessorKey: 'type',
      header: '方向',
      cell: ({ row }) => {
        const isShort = row.original.entry.entryType === 'short'
        return <span>{isShort ? '做空' : '做多'}</span>
      },
    },
    {
      accessorKey: 'size',
      header: '手数',
      cell: ({ row }) => {
        const origin = row.original
        return `${futuresTransactionCalculation(origin).size}手`
      },
    },
    {
      accessorKey: 'funding',
      header: '资金',
      cell: ({ row }) => {
        const origin = row.original
        return `${futuresTransactionCalculation(origin).funding}元`
      },
    },
    {
      accessorKey: 'price',
      header: '开仓价格',
      cell: ({ row }) => {
        const origin = row.original
        return `${futuresTransactionCalculation(origin).entryPrice}元`
      },
    },
    {
      accessorKey: 'profit',
      header: '浮盈',
      cell: ({ row }) => {
        const origin = row.original
        return `${futuresTransactionCalculation(origin).profit}元`
      },
    },
    {
      accessorKey: 'description',
      header: '备注',
    },
    {
      accessorKey: 'createdAt',
      header: '创建时间',
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
    {
      accessorKey: 'updatedAt',
      header: '更新时间',
      cell: ({ row }) => formatDateTime(row.getValue('updatedAt')),
    },
    {
      accessorKey: 'tools',
      header: '操作',
      cell: ({ row }) => {
        const origin = row.original
        return (
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDetailsData(origin)}
            >
              详情
            </Button>
            <DeleteAlertDialog futuresId={origin.id} />
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: list,
    columns: columns as ColumnDef<FuturesTransaction[], any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(total / pagination.pageSize),
  })

  return (
    <PageContainer>
      <div className="rounded-md border mb-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
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
                    <TableCell key={cell.id} className="text-center">
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

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">每页</span>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            显示第 {pagination.pageIndex * pagination.pageSize + 1} -{' '}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)}
            条， 共 {total} 条
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </Button>
        </div>
      </div>

      {editingTransaction && (
        <EditDialog
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          transaction={editingTransaction}
        />
      )}

      <DetailsDrawer
        detailsData={detailsData}
        open={!!detailsData}
        onOpenChange={(open) => !open && setDetailsData(null)}
      />
    </PageContainer>
  )
}

export default FuturesTransactionHistoryPage
