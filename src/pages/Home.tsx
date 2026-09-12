import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";

function Home() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 overflow-hidden">

            <Navbar />

            <main>

                {/* Hero */}
                <section
                    id="home"
                    className="scroll-mt-20"
                >
                    <Hero />
                </section>


                {/* Features */}
                <section
                    id="features"
                    className="scroll-mt-20"
                >
                    <Features />
                </section>


                {/* How It Works */}
                <section
                    id="how-it-works"
                    className="scroll-mt-20"
                >
                    <HowItWorks />
                </section>


                {/* Final CTA */}
                <section
                    id="get-started"
                    className="scroll-mt-20"
                >
                    <CTA />
                </section>

            </main>

        </div>
    );
}

export default Home;