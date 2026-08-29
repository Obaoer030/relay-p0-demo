import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { DEMO_TOKEN } from './domain/seed'
import { useRelay } from './store/RelayContext'
import { DemoPage } from './screens/DemoPage'
import { LinRanExperience } from './screens/HandoffFlow'
import { HelperView, InvalidShareView } from './screens/HelperView'

function HomeRoute() {
  const { state } = useRelay()
  return (
    <main className="standalone-page standalone-page--owner">
      <div className="standalone-phone">
        <LinRanExperience key={`${state.demoStage}-${state.lastEventAt}`} state={state} />
      </div>
    </main>
  )
}

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
      <Route path="/" element={<HomeRoute />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/r/:token" element={<ShareRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
