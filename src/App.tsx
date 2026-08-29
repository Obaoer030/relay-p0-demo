import { Navigate, Route, Routes } from 'react-router-dom'

function Placeholder({ title }: { title: string }) {
  return (
    <main className="placeholder-shell">
      <p className="eyebrow">Relay · 接棒</p>
      <h1>{title}</h1>
      <p>让生活里的下一步，由说好的人继续推进。</p>
    </main>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="有些累，是一直记着。" />} />
      <Route path="/demo" element={<Placeholder title="路演舞台正在就位" />} />
      <Route path="/r/:token" element={<Placeholder title="一件事，清楚地交给你" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
