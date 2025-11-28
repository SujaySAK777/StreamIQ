import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-secondary/80 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-primary">
                StreamIQ
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-secondary hover:text-primary transition-colors font-medium">
                New Arrivals
              </a>
              <a href="#" className="text-secondary hover:text-primary transition-colors font-medium">
                Trending
              </a>
              <a href="#" className="text-secondary hover:text-primary transition-colors font-medium">
                Categories
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-tertiary rounded-full px-4 py-2 border border-primary">
              <Search className="w-4 h-4 text-tertiary" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm text-primary placeholder:text-tertiary w-48 lg:w-64"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-tertiary border border-primary flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
            </button>

            <button className="relative w-10 h-10 rounded-full bg-tertiary border border-primary flex items-center justify-center hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5 text-primary" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-white text-xs flex items-center justify-center font-bold animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-tertiary border border-primary flex items-center justify-center"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-slide-up">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-tertiary rounded-full px-4 py-2 border border-primary">
                <Search className="w-4 h-4 text-tertiary" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none text-sm text-primary placeholder:text-tertiary w-full"
                />
              </div>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-secondary hover:text-primary transition-colors font-medium py-2">
                  New Arrivals
                </a>
                <a href="#" className="text-secondary hover:text-primary transition-colors font-medium py-2">
                  Trending
                </a>
                <a href="#" className="text-secondary hover:text-primary transition-colors font-medium py-2">
                  Categories
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
