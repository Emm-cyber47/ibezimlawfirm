import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import RequireAuth from './routes/RequireAuth.tsx'
import AdminGate from './routes/AdminGate.tsx'

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

import AdminLayout from './components/AdminLayout.tsx'
import AdminDashboard from './pages/admin/Dashboard.tsx'
import AdminContacts from './pages/admin/Contacts.tsx'
import AdminComments from './pages/admin/Comments.tsx'
import AdminDocuments from './pages/admin/AdminDocuments.tsx'
import AdminUsers from './pages/admin/Users.tsx'
import AdminBlog from './pages/admin/Blog.tsx'
import BlogEditor from './pages/admin/BlogEditor.tsx'

import AdminTestimonials from './pages/admin/Testimonials.tsx'
import TestimonialEditor from './pages/admin/TestimonialEditor.tsx'

import CreateBlogPost from './pages/admin/CreateBlogPost'
import EditWebsite from './pages/admin/EditWebsite'
import EditHome from './pages/admin/EditHome'
import EditAbout from './pages/admin/EditAbout'
import EditAttorney from './pages/admin/EditAttorney'
import EditPracticeAreas from './pages/admin/EditPracticeAreas'
import EditOtherInfo from './pages/admin/EditOtherInfo'

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

      {/* Admin area (separate from the public Layout) */}
      <Route
        path="admin"
        element={
          <AdminGate>
            <AdminLayout />
          </AdminGate>
        }

      >
        <Route index element={<AdminDashboard />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="comments" element={<AdminComments />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="blog/:slug" element={<BlogEditor />} />
        <Route path="blog/create" element={<CreateBlogPost />} />

        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="testimonials/:id" element={<TestimonialEditor />} />

        <Route path="edit-website" element={<EditWebsite />} />
        <Route path="edit-website/home" element={<EditHome />} />
        <Route path="edit-website/about" element={<EditAbout />} />
        <Route path="edit-website/attorney" element={<EditAttorney />} />
        <Route path="edit-website/practice-areas" element={<EditPracticeAreas />} />
        <Route path="edit-website/other-info" element={<EditOtherInfo />} />
      </Route>


      {/* Normalize trailing slash */}
      <Route
        path="admin/"
        element={<AdminDashboard />}
      />
    </Routes>
  )
}

export default App

