import Navbar from "../components/Navbar";
import Footer from "../components/Footer";  
import Testimonials from "../components/Testimonials";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import HowItWorks from "../components/HowItWorks";


function Home() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
}
export default Home;