import { About } from './components/About'
import { AboutMe } from './components/AboutMe'
import { ContactCTA } from './components/ContactCTA'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MotionObserver } from './components/MotionObserver'
import { Process } from './components/Process'
import { ProjectArchive } from './components/ProjectArchive'
import { ScrollRail } from './components/ScrollRail'
import { SelectedWork } from './components/SelectedWork'
import { Stats } from './components/Stats'
import { useParallax } from './components/useParallax'
import './styles.css'

export default function App() {
  useParallax()

  return (
    <>
      <MotionObserver />
      <ScrollRail />
      <Header />
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <ProjectArchive />
        <Process />
        <AboutMe />
        <Stats />
        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
