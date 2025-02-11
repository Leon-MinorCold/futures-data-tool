import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

export function SplitDetailView() {
  const [data, setData] = useState({
    indicator: '2BEMA',
    value: 0,
    k: 0,
    priceGrid: 'K(0)',
    position: 'Z+30%',
    stopLoss: 'K+5',
    takeProfit: 'K-2',
  })

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-4 p-4">
      {/* 左侧主要信息面板 */}
      <Card className="w-1/2">
        <CardContent className="p-6">
          <div className="space-y-6">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 右侧详细信息面板 */}
      <Card className="w-1/2">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <CardContent className="p-6">
            <div className="space-y-6">
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

              {/* 可以添加更多信息区块 */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">其他信息</h3>
                {/* 添加更多字段 */}
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">图表分析</h3>
                {/* 添加图表或其他可视化内容 */}
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
}
