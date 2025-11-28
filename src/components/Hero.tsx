import { Sparkles, TrendingUp, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary border border-primary animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary animate-pulse-slow" />
            <span className="text-sm font-semibold text-primary">
              Powered by Real-Time AI
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary animate-slide-up">
            Real-Time Intelligent
            <span className="block mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              E-Commerce Analytics
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Experience the future of e-commerce with real-time personalization
            powered by Kafka, Flink, and TensorFlow
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button className="btn-primary px-8 py-4 text-lg">
              Start Shopping
            </button>
            <button className="btn-secondary px-8 py-4 text-lg">
              Learn How It Works
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="card p-6 group hover:scale-105 glow-hover cursor-pointer">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                Real-Time Updates
              </h3>
              <p className="text-secondary text-sm">
                Recommendations update instantly based on your behavior
              </p>
            </div>

            <div className="card p-6 group hover:scale-105 glow-hover cursor-pointer">
              <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                Smart Curation
              </h3>
              <p className="text-secondary text-sm">
                AI learns your preferences to show perfect matches
              </p>
            </div>

            <div className="card p-6 group hover:scale-105 glow-hover cursor-pointer">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                Personalized Experience
              </h3>
              <p className="text-secondary text-sm">
                Every visit is uniquely tailored just for you
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgb(var(--bg-primary))] to-transparent" />
    </section>
  );
}
