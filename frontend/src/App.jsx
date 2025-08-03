import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'

const Home = React.lazy(() => import('./pages/Home'))
const Rules = React.lazy(() => import('./pages/Rules'))
const RuleDetail = React.lazy(() => import('./pages/RuleDetail'))
const Changelog = React.lazy(() => import('./pages/Changelog'))
const ChangelogDetail = React.lazy(() => import('./pages/ChangelogDetail'))
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'))
const AdminRules = React.lazy(() => import('./pages/AdminRules'))
const AdminChangelog = React.lazy(() => import('./pages/AdminChangelog'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<PageLoader />}>
            <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="rules" element={<Rules />} />
            <Route path="rules/:id" element={<RuleDetail />} />
            <Route path="changelog" element={<Changelog />} />
            <Route path="changelog/:id" element={<ChangelogDetail />} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout isAdmin={true} />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="rules" element={<AdminRules />} />
            <Route path="changelog" element={<AdminChangelog />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
