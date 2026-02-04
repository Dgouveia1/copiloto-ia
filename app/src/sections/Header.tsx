import { useState, useEffect } from 'react';
import { Palette, Menu, X } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

interface HeaderProps {
  onOpenCustomization: () => void;
}

export default function Header({ onOpenCustomization }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { customization } = useCustomization();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
        isScrolled
          ? 'bg-[#040812]/95 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
      style={{
        height: isScrolled ? '64px' : '80px',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="headerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={customization.primaryColor} />
                  <stop offset="50%" stopColor="#f4d03f" />
                  <stop offset="100%" stopColor={customization.primaryColor} />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#headerGold)" strokeWidth="3" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="url(#headerGold)" strokeWidth="1.5" opacity="0.6" />
              <path
                d="M50 25 L75 65 L50 52 L25 65 Z"
                fill="url(#headerGold)"
              />
              <path
                d="M50 52 L50 75 L57 60 Z"
                fill="#b8941f"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gold-gradient leading-tight">Copiloto</span>
            <span className="text-xs text-[#a0aec0] leading-tight truncate max-w-[150px]">
              {customization.companyName}
            </span>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Dashboard', id: 'dashboard' },
            { label: 'Métricas', id: 'kpis' },
            { label: 'Funil', id: 'funil' },
            { label: 'Ações', id: 'timeline' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="relative text-[#a0aec0] hover:text-[#d4af37] transition-colors duration-300 text-sm font-medium group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCustomization}
            className="p-2.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/20 hover:rotate-45 transition-all duration-300"
            title="Personalizar"
          >
            <Palette size={20} />
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#a0aec0] hover:text-[#d4af37] transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#040812]/98 backdrop-blur-xl border-t border-[#d4af37]/20 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col p-4 gap-2">
          {[
            { label: 'Dashboard', id: 'dashboard' },
            { label: 'Métricas', id: 'kpis' },
            { label: 'Funil', id: 'funil' },
            { label: 'Ações', id: 'timeline' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-left text-[#a0aec0] hover:text-[#d4af37] py-3 px-4 rounded-lg hover:bg-[#d4af37]/10 transition-all duration-300"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
