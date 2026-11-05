import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Clients from './pages/Clients'
import DashboardLayout from './components/layout/DashboardLayout'
import Employees from './pages/Employees'
import ResourceAllocation from './pages/ResourceAllocation'

function App() {
  return (
    <div className="min-h-dvh w-full">
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/employees" element={<Employees/>}/>
          <Route path="/resource-allocation" element={<ResourceAllocation/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App