import PageContainer from '@/layout/page-container'
import { Helmet } from 'react-helmet-async'
const OverviewPage = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>仪表盘</title>
      </Helmet>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
      </div>
    </PageContainer>
  )
}

export default OverviewPage
