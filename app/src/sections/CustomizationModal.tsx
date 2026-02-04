import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Check, RotateCcw } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const presetColors = [
  '#d4af37', // Gold
  '#c0c0c0', // Silver
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
];

export default function CustomizationModal({ isOpen, onClose }: CustomizationModalProps) {
  const { customization, updateCustomization, resetCustomization } = useCustomization();
  const [localCompanyName, setLocalCompanyName] = useState(customization.companyName);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const ctx = gsap.context(() => {
        gsap.fromTo(overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(contentRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out', delay: 0.1 }
        );
      }, modalRef);

      return () => ctx.revert();
    }
  }, [isOpen]);

  const handleClose = () => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: 'expo.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        delay: 0.1,
        onComplete: onClose,
      });
    }, modalRef);

    return () => ctx.revert();
  };

  const handleSave = () => {
    updateCustomization({ companyName: localCompanyName });
    
    // Animação de sucesso
    const ctx = gsap.context(() => {
      gsap.to('.save-btn', {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }, modalRef);

    setTimeout(handleClose, 300);
    return () => ctx.revert();
  };

  const handleColorSelect = (color: string, type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      updateCustomization({ primaryColor: color });
    } else {
      updateCustomization({ secondaryColor: color });
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-lg bg-[#0d1321] border border-[#d4af37]/30 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#d4af37]/20">
          <h2 className="text-2xl font-bold text-gold-gradient">Personalizar Dashboard</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[#d4af37]/10 text-[#a0aec0] hover:text-[#d4af37] transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Logo Preview */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-sm text-[#a0aec0]">Pré-visualização do Logo</span>
            <div className="flex items-center gap-4 p-6 bg-[#040812] rounded-xl border border-[#d4af37]/20">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="previewGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={customization.primaryColor} />
                      <stop offset="100%" stopColor={customization.primaryColor} />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#previewGold)" strokeWidth="3" />
                  <path d="M50 25 L75 65 L50 52 L25 65 Z" fill="url(#previewGold)" />
                  <path d="M50 52 L50 75 L57 60 Z" fill={customization.secondaryColor} />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ color: customization.primaryColor }}>
                  Copiloto
                </span>
                <span className="text-sm text-[#a0aec0]">{customization.companyName}</span>
              </div>
            </div>
          </div>

          {/* Company Name Input */}
          <div className="space-y-2">
            <label className="text-sm text-[#a0aec0] block">Nome da Empresa</label>
            <input
              type="text"
              value={localCompanyName}
              onChange={(e) => setLocalCompanyName(e.target.value)}
              className="w-full px-4 py-3 bg-[#040812] border border-[#d4af37]/30 rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300"
              placeholder="Digite o nome da sua empresa"
            />
          </div>

          {/* Primary Color */}
          <div className="space-y-3">
            <label className="text-sm text-[#a0aec0] block">Cor Principal</label>
            <div className="grid grid-cols-5 gap-3">
              {presetColors.map((color) => (
                <button
                  key={`primary-${color}`}
                  onClick={() => handleColorSelect(color, 'primary')}
                  className={`relative w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110 ${
                    customization.primaryColor === color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1321]'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {customization.primaryColor === color && (
                    <Check size={16} className="absolute inset-0 m-auto text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Color */}
          <div className="space-y-3">
            <label className="text-sm text-[#a0aec0] block">Cor Secundária</label>
            <div className="grid grid-cols-5 gap-3">
              {presetColors.map((color) => (
                <button
                  key={`secondary-${color}`}
                  onClick={() => handleColorSelect(color, 'secondary')}
                  className={`relative w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110 ${
                    customization.secondaryColor === color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1321]'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {customization.secondaryColor === color && (
                    <Check size={16} className="absolute inset-0 m-auto text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#d4af37]/20">
          <button
            onClick={resetCustomization}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#a0aec0] hover:text-[#d4af37] transition-colors duration-300"
          >
            <RotateCcw size={16} />
            Restaurar padrão
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg border border-[#d4af37]/30 text-[#a0aec0] hover:bg-[#d4af37]/10 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="save-btn px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-[#040812] font-semibold hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all duration-300"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
