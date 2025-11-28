import { Database, Zap, Brain, Activity } from 'lucide-react';

export function TechShowcase() {
  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-sm animate-pulse-slow" />
        <div className="absolute top-0 left-1/2 w-2 h-full bg-gradient-to-b from-pink-500/20 via-cyan-500/20 to-purple-500/20 blur-sm animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-sm animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary animate-slide-up">
            Behind the Magic
          </h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto animate-fade-in">
            Real-time AI recommendations powered by industry-leading streaming
            architecture
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="card p-6 text-center group hover:scale-105 glow-hover">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                User Action
              </h3>
              <p className="text-sm text-secondary mb-4">
                Browse, click, purchase
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary border border-primary text-xs font-semibold text-primary">
                Event Stream
              </div>
            </div>

            <div className="card p-6 text-center group hover:scale-105 glow-hover">
              <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Kafka</h3>
              <p className="text-sm text-secondary mb-4">
                Real-time data pipeline
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary border border-primary text-xs font-semibold text-primary">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Streaming
              </div>
            </div>

            <div className="card p-6 text-center group hover:scale-105 glow-hover">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Flink</h3>
              <p className="text-sm text-secondary mb-4">
                Stream processing engine
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary border border-primary text-xs font-semibold text-primary">
                Processing
              </div>
            </div>

            <div className="card p-6 text-center group hover:scale-105 glow-hover">
              <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                TensorFlow
              </h3>
              <p className="text-sm text-secondary mb-4">
                ML model inference
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary border border-primary text-xs font-semibold text-primary">
                AI Powered
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 -z-10">
            <div className="flex items-center justify-between px-20">
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--accent-from))] to-transparent" />
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--accent-secondary-from))] to-transparent" />
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--accent-from))] to-transparent" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              &lt;100ms
            </div>
            <p className="text-sm text-secondary">Average latency</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold gradient-secondary bg-clip-text text-transparent mb-2">
              10M+
            </div>
            <p className="text-sm text-secondary">Events processed/day</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              95%
            </div>
            <p className="text-sm text-secondary">Recommendation accuracy</p>
          </div>
        </div>
      </div>
    </section>
  );
}
