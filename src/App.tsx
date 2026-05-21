import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import RequireAuth from './routes/RequireAuth.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Attorney from './pages/Attorney.tsx'
import Services from './pages/Services.tsx'
import Contact from './pages/Contact.tsx'
import Resources from './pages/Resources.tsx'
import ResourcePost from './pages/ResourcePost.tsx'
import Testimonials from './pages/Testimonials.tsx'
import Profile from './pages/Profile.tsx'
import Documents from './pages/Documents.tsx'
import AuthConfirmed from './pages/AuthConfirmed.tsx'
import ResetPassword from './pages/ResetPassword.tsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="attorney" element={<Attorney />} />
        <Route path="services" element={<Services />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/:slug" element={<ResourcePost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="auth/confirmed" element={<AuthConfirmed />} />
        <Route path="auth/reset-password" element={<ResetPassword />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="documents"
          element={
            <RequireAuth>
              <Documents />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
