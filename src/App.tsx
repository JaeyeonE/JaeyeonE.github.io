import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { Awards } from './components/Awards'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Hero />} />
          <Route
            path="/about"
            element={
              <>
                <About />
                <Skills />
              </>
            }
          />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Hero />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
