import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCustomization } from '../context/CustomizationContext';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const { customization } = useCustomization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação da linha
      gsap.fromTo('.footer-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );

      // Animação do logo
      gsap.fromTo('.footer-logo',
        { opacity: 0, rotateY: 180 },
        {
          opacity: 1,
          rotateY: 0,
          duration: 0.5,
          delay: 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );

      // Animação do texto
      gsap.fromTo('.footer-text',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          delay: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );

      // Animação do copyright
      gsap.fromTo('.footer-copyright',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          delay: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="py-12 px-4 md:px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Decorative Line */}
        <div 
          className="footer-line w-full h-px mb-8 origin-center"
          style={{ 
            background: `linear-gradient(to right, transparent, ${customization.primaryColor}, transparent)`,
          }}
        />

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="footer-logo mb-4" style={{ opacity: 0 }}>
            <div className="relative w-12 h-12 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="footerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={customization.primaryColor} />
                    <stop offset="100%" stopColor={customization.primaryColor} />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#footerGold)" strokeWidth="3" />
                <path d="M50 25 L75 65 L50 52 L25 65 Z" fill="url(#footerGold)" />
                <path d="M50 52 L50 75 L57 60 Z" fill={customization.secondaryColor} />
              </svg>
            </div>
          </div>

          {/* Brand Text */}
          <div className="footer-text mb-2" style={{ opacity: 0 }}>
            <span className="text-xl font-bold text-gold-gradient">Copiloto IA</span>
          </div>

          <p className="footer-text text-[#a0aec0] mb-6" style={{ opacity: 0 }}>
            Inteligência Artificial para Imobiliárias
          </p>

          {/* Company Name */}
          <div 
            className="footer-text px-4 py-2 rounded-full text-sm mb-6"
            style={{ 
              backgroundColor: `${customization.primaryColor}15`,
              border: `1px solid ${customization.primaryColor}30`,
              color: customization.primaryColor,
              opacity: 0,
            }}
          >
            {customization.companyName}
          </div>

          {/* Copyright */}
          <p className="footer-copyright text-[#64748b] text-sm" style={{ opacity: 0 }}>
            © 2026 Copiloto IA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
