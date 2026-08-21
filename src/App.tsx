import { About } from './components/About'
import { ContactCTA } from './components/ContactCTA'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MotionObserver } from './components/MotionObserver'
import { ProjectArchive } from './components/ProjectArchive'
import { SelectedWork } from './components/SelectedWork'
import './styles.css'

export default function App() {
  return (
    <>
      <MotionObserver />
      <Header />
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <ProjectArchive />
        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
