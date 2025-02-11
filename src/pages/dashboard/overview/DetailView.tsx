import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface DetailData {
  // 基础信息
  indicator: string
  value: number
  k?: number

  // 计算结果
  priceGrid: string
  position: string
  stopLoss: string
  takeProfit: string

  // 假设还有更多字段...
  additionalField1: string
  additionalField2: string
  additionalField3: string
  // ... 更多字段
}

export function DetailView() {
  const [data, setData] = useState<DetailData>({
    indicator: '2BEMA',
    value: 0,
    k: 0,
    priceGrid: 'K(0)',
    position: 'Z+30%',
    stopLoss: 'K+5',
    takeProfit: 'K-2',
    additionalField1: '示例数据1',
    additionalField2: '示例数据2',
    additionalField3: '示例数据3',
  })

  const handleKChange = (newK: number) => {
    setData((prev) => ({
      ...prev,
      k: newK,
      priceGrid: `K(${newK})`,
      stopLoss: `K+5`,
      takeProfit: `K-2`,
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* 主要信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>交易详情</CardTitle>
          <CardDescription>主要交易参数和计算结果</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* 核心信息网格布局 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>指标</Label>
              <div className="font-medium">{data.indicator}</div>
            </div>
            <div className="space-y-2">
              <Label>值</Label>
              <div className="font-medium">{data.value}</div>
            </div>
            <div className="space-y-2">
              <Label>K值</Label>
              <Input
                type="number"
                value={data.k}
                onChange={(e) => handleKChange(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>价格</Label>
              <div className="font-medium">{data.priceGrid}</div>
            </div>
          </div>

          {/* 使用手风琴组件展示更多信息 */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>交易参数</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>进场仓位</Label>
                    <div className="font-medium">{data.position}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>止损单</Label>
                    <div className="font-medium">{data.stopLoss}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>保本单</Label>
                    <div className="font-medium">{data.takeProfit}</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>附加信息</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>附加字段1</Label>
                    <div className="font-medium">{data.additionalField1}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>附加字段2</Label>
                    <div className="font-medium">{data.additionalField2}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>附加字段3</Label>
                    <div className="font-medium">{data.additionalField3}</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
