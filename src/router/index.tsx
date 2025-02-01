import LoginPage from '@/pages/auth/login/page'
import Layout from '@/layout/layout'
import UserManagementPage from '@/pages/dashboard/user-management/page'
import HomeLayout from '@/pages/home/layout'
import HomePage from '@/pages/home/page'
import { Providers } from '@/providers'
import { AuthGuard } from '@/router/guards/Auth'
import { GuestGuard } from '@/router/guards/Guest'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router'
import OverviewPage from '@/pages/dashboard/overview/page'
import ErrorPage from '@/components/error-page'

export const routes = createRoutesFromElements(
  <Route element={<Providers />} errorElement={<ErrorPage />}>
    <Route element={<HomeLayout />}>
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
    </Route>

    <Route path="auth">
      <Route element={<GuestGuard />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      <Route index element={<Navigate replace to="/auth/login" />} />
    </Route>

    <Route path="/dashboard">
      <Route element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route path="overview" element={<OverviewPage />} />
          <Route path="user-management" element={<UserManagementPage />} />

          <Route
            index
            element={<Navigate replace to="/dashboard/overview" />}
          />
        </Route>
      </Route>
    </Route>
  </Route>
)

export const router = createBrowserRouter(routes)
