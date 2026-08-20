import { About } from './components/About'
import { ContactCTA } from './components/ContactCTA'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProjectArchive } from './components/ProjectArchive'
import { SelectedWork } from './components/SelectedWork'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SelectedWork />
        <ProjectArchive />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
