import { Routes, Route } from 'react-router-dom'
import { AppShell } from './app/components/layout/AppShell'
import { Dashboard } from './app/routes/Dashboard'
import { Today } from './app/routes/Today'
import { List } from './app/routes/List'
import { Kanban } from './app/routes/Kanban'
import { Calendar } from './app/routes/Calendar'
import { Timeline } from './app/routes/Timeline'
import { Focus } from './app/routes/Focus'
import { Habits } from './app/routes/Habits'
import { Settings } from './app/routes/Settings'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/today" element={<Today />} />
        <Route path="/list" element={<List />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppShell>
  )
}

export default App
