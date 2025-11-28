import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrendingSection } from './components/TrendingSection';
import { RecommendationsSection } from './components/RecommendationsSection';
import { LiveActivity } from './components/LiveActivity';
import { TechShowcase } from './components/TechShowcase';
import { AllProducts } from './components/AllProducts';
import { LiveDashboard } from './components/LiveDashboard';
import { AgenticPromotions } from './components/AgenticPromotions';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-primary">
          <Header />
          <main>
            <Hero />
            <LiveDashboard /> {/* Added real-time dashboard */}
            <TrendingSection />
            <LiveActivity />
            <RecommendationsSection />
            <TechShowcase />
            <AllProducts />
            <AgenticPromotions /> {/* Moved after All Products section */}
          </main>
          <footer className="bg-secondary py-12 border-t border-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4">
                <p className="text-secondary">
                  Built with real-time AI recommendations powered by Kafka, Flink, and TensorFlow
                </p>
                <p className="text-tertiary text-sm">
                  © 2025 StreamIQ. Real-Time Intelligent E-Commerce Analytics.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
