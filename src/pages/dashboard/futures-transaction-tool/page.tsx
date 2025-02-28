import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageContainer from '@/layout/page-container'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BasisForm from '@/pages/dashboard/futures-transaction-tool/BasisForm'
import { useFuturesTransactionStore, Tab } from '@/store/futuresTransaction'
import EntryForm from '@/pages/dashboard/futures-transaction-tool/EntryForm'
import ProfitForm from '@/pages/dashboard/futures-transaction-tool/ProfitForm'

const FuturesTransactionToolPage = () => {
  const { tab, setTab, tabDisabledStatus } = useFuturesTransactionStore()

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
            <Tabs
              value={tab}
              onValueChange={(t) => setTab(t as Tab)}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basis" disabled={tabDisabledStatus.basis}>
                  基本风险控制
                </TabsTrigger>
                <TabsTrigger value="entry" disabled={tabDisabledStatus.entry}>
                  开仓控制工具
                </TabsTrigger>
                <TabsTrigger value="profit" disabled={tabDisabledStatus.profit}>
                  浮盈管理工具
                </TabsTrigger>
              </TabsList>
              <TabsContent
                forceMount
                className="data-[state=inactive]:hidden"
                value="basis"
              >
                <BasisForm />
              </TabsContent>
              <TabsContent
                forceMount
                className="data-[state=inactive]:hidden"
                value="entry"
              >
                <EntryForm />
              </TabsContent>
              <TabsContent
                forceMount
                className="data-[state=inactive]:hidden"
                value="profit"
              >
                <ProfitForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default FuturesTransactionToolPage
