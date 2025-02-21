import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageContainer from '@/layout/page-container'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BasisForm from '@/pages/dashboard/futures-transaction-tool/BasisForm'

const FuturesTransactionToolPage = () => {
  return (
    <PageContainer>
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              期货交易系统
              <Badge variant="outline" className="ml-2">
                2024年03月21日 14:30
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="basis" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basis">基本风险控制</TabsTrigger>
                <TabsTrigger value="position">开仓控制工具</TabsTrigger>
                <TabsTrigger value="float">浮盈管理工具</TabsTrigger>
              </TabsList>
              <TabsContent value="basis">
                <BasisForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default FuturesTransactionToolPage
