import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface DetailData {
  // 基础信息
  indicator: string
  value: number
  k?: number
  priceGrid: string
  position: string
  stopLoss: string
  takeProfit: string
  // ... 其他字段
}

export function TabDetailView() {
  const [data, setData] = useState<DetailData>({
    indicator: '2BEMA',
    value: 0,
    k: 0,
    priceGrid: 'K(0)',
    position: 'Z+30%',
    stopLoss: 'K+5',
    takeProfit: 'K-2',
  })

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">基础信息</TabsTrigger>
          <TabsTrigger value="trading">交易参数</TabsTrigger>
          <TabsTrigger value="analysis">分析数据</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardContent className="pt-6 grid grid-cols-2 gap-4">
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
                  onChange={(e) => {
                    const newK = Number(e.target.value)
                    setData((prev) => ({
                      ...prev,
                      k: newK,
                      priceGrid: `K(${newK})`,
                    }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>价格</Label>
                <div className="font-medium">{data.priceGrid}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading">
          <Card>
            <CardContent className="pt-6 grid grid-cols-2 gap-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardContent className="pt-6">
              {/* 这里可以放置图表或其他分析数据 */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
