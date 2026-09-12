import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import SkipToContent from "@/components/layout/SkipToContent"

export default function MarketingLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent targetId="main-content" />
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
