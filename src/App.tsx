import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AppShell } from './app/AppShell'
import { DEMO_TOKEN } from './domain/seed'
import { DemoPage } from './screens/DemoPage'
import { HelperView, InvalidShareView } from './screens/HelperView'
import { WorkspaceAbout } from './screens/WorkspaceAbout'
import { WorkspaceActivity } from './screens/WorkspaceActivity'
import { WorkspaceHandoffs } from './screens/WorkspaceHandoffs'
import { WorkspaceMatterDetail } from './screens/WorkspaceMatterDetail'
import { WorkspaceMatterEditor } from './screens/WorkspaceMatterEditor'
import { WorkspaceMatters } from './screens/WorkspaceMatters'
import { WorkspaceOverview } from './screens/WorkspaceOverview'
import { WorkspacePeople } from './screens/WorkspacePeople'
import { WorkspaceSettings } from './screens/WorkspaceSettings'
import { useRelay } from './store/RelayContext'

function ShareRoute() {
  const { token } = useParams()
  const { state } = useRelay()
  return (
    <main className="standalone-page standalone-page--helper">
      <div className="standalone-phone">
        {token === DEMO_TOKEN ? <HelperView state={state} /> : <InvalidShareView />}
      </div>
    </main>
  )
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<WorkspaceOverview />} />
        <Route path="matters" element={<WorkspaceMatters />} />
        <Route path="matters/new" element={<WorkspaceMatterEditor />} />
        <Route path="matters/:id" element={<WorkspaceMatterDetail />} />
        <Route path="matters/:id/edit" element={<WorkspaceMatterEditor />} />
        <Route path="handoffs" element={<WorkspaceHandoffs />} />
        <Route path="people" element={<WorkspacePeople />} />
        <Route path="activity" element={<WorkspaceActivity />} />
        <Route path="about" element={<WorkspaceAbout />} />
        <Route path="settings" element={<WorkspaceSettings />} />
      </Route>
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/r/:token" element={<ShareRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
