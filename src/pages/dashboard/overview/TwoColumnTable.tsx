import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Card } from '@/components/ui/card'

interface DetailData {
  indicator: string
  value: number
  k: number
  priceGrid: string
  position: string
  stopLoss: string
  takeProfit: string
  field1: string
  field2: string
  field3: string
  field4: string
  field5: string
}

export function TwoColumnSingleTable() {
  const [data, setData] = useState<DetailData>({
    indicator: '2BEMA',
    value: 0,
    k: 0,
    priceGrid: 'K(0)',
    position: 'Z+30%',
    stopLoss: 'K+5',
    takeProfit: 'K-2',
    field1: '示例数据1',
    field2: '示例数据2',
    field3: '示例数据3',
    field4: '示例数据4',
    field5: '示例数据5',
  })

  // 将字段配置为左右两列的形式
  const fields = [
    [
      { key: 'indicator', label: '指标' },
      { key: 'stopLoss', label: '止损单' },
    ],
    [
      { key: 'value', label: '值' },
      { key: 'takeProfit', label: '保本单' },
    ],
    [
      { key: 'k', label: 'K值', editable: true },
      { key: 'field3', label: '字段3' },
    ],
    [
      { key: 'priceGrid', label: '价格' },
      { key: 'field4', label: '字段4' },
    ],
    [
      { key: 'position', label: '进场仓位' },
      { key: 'field5', label: '字段5' },
    ],
    [
      { key: 'field1', label: '字段1' },
      { key: null, label: '' }, // 空字段，保持对齐
    ],
    [
      { key: 'field2', label: '字段2' },
      { key: null, label: '' }, // 空字段，保持对齐
    ],
  ]

  const handleKChange = (value: number) => {
    setData((prev) => ({
      ...prev,
      k: value,
      priceGrid: `K(${value})`,
      stopLoss: `K+5`,
      takeProfit: `K-2`,
    }))
  }

  const renderCell = (field: {
    key: keyof DetailData | null
    label: string
    editable?: boolean
  }) => {
    if (!field.key) return null
    if (field.editable) {
      return (
        <Input
          type="number"
          value={data[field.key]}
          onChange={(e) => {
            if (field.key === 'k') {
              handleKChange(Number(e.target.value))
            }
          }}
          className="w-24"
        />
      )
    }
    return data[field.key]
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">字段</TableHead>
              <TableHead>值</TableHead>
              <TableHead className="w-[200px]">字段</TableHead>
              <TableHead>值</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((row, index) => (
              <TableRow key={index}>
                {/* 左列字段 */}
                <TableCell className="font-medium">{row[0].label}</TableCell>
                <TableCell>{renderCell(row[0])}</TableCell>
                {/* 右列字段 */}
                <TableCell className="font-medium">{row[1].label}</TableCell>
                <TableCell>{renderCell(row[1])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
