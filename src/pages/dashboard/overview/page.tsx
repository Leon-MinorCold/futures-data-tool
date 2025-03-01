import PageContainer from '@/layout/page-container'
import { TabDetailView } from '@/pages/dashboard/overview/PositionControlTable'
import { TradingSystem } from '@/pages/dashboard/overview/TradingSystem'
import { TwoColumnSingleTable } from '@/pages/dashboard/overview/TwoColumnTable'

const OverviewPage = () => {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold mb-5">进场控制工具</h1>

          <TradingSystem />

          <TwoColumnSingleTable />

          <TabDetailView />
        </div>
      </div>
    </PageContainer>
  )
}

export default OverviewPage
