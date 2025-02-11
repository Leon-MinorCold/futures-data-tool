import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function TradingSystem() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            交易系统
            <Badge variant="outline" className="ml-2">
              2024年03月21日 14:30
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本风险控制</TabsTrigger>
              <TabsTrigger value="position">开仓控制工具</TabsTrigger>
              <TabsTrigger value="float">浮盈管理工具</TabsTrigger>
            </TabsList>

            {/* 基本风险控制 */}
            <TabsContent value="basic">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Table>
                      {/* <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">交易规则</TableHead>
                          <TableHead>数值</TableHead>
                        </TableRow>
                      </TableHeader> */}
                      <TableBody>
                        <TableRow>
                          <TableCell>交易保证金</TableCell>
                          <TableCell>2~10%</TableCell>
                          <TableCell>2~10%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>单笔最大亏损</TableCell>
                          <TableCell>2~(2+5)%/笔</TableCell>
                        </TableRow>
                        {/* 添加更多行 */}
                      </TableBody>
                    </Table>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">上市规则</TableHead>
                          <TableHead>数值</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>市值规则</TableCell>
                          <TableCell>大于100亿</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>换手规则</TableCell>
                          <TableCell>换手率大于3%</TableCell>
                        </TableRow>
                        {/* 添加更多行 */}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 开仓控制工具 */}
            <TabsContent value="position">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="font-medium text-lg">空单</div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>开仓价格</TableHead>
                          <TableHead>金位</TableHead>
                          <TableHead>止损价格</TableHead>
                          <TableHead>现价盈利值</TableHead>
                          <TableHead>风险金额</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>5日线上方回踩</TableCell>
                          <TableCell>2~10%</TableCell>
                          <TableCell>3~5日线最高价+2~5日最高价格</TableCell>
                          <TableCell>3~5日线最高价格+2~5日最高价格</TableCell>
                          <TableCell>止损-开仓</TableCell>
                        </TableRow>
                        {/* 添加更多行 */}
                      </TableBody>
                    </Table>

                    <div className="font-medium text-lg mt-6">多单</div>
                    {/* 重复空单的表格结构，填入多单数据 */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 浮盈管理工具 */}
            <TabsContent value="float">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>管理项目</TableHead>
                        <TableHead>止盈</TableHead>
                        <TableHead>出场条件</TableHead>
                        <TableHead>补仓条件</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>浮盈止损</TableCell>
                        <TableCell>本金盈亏</TableCell>
                        <TableCell>10%</TableCell>
                        <TableCell>1~5%</TableCell>
                      </TableRow>
                      {/* 添加更多行 */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
