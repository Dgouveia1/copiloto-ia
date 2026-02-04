import React, { createContext, useContext, useState, useEffect } from 'react';

interface CustomizationState {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

interface CustomizationContextType {
  customization: CustomizationState;
  updateCustomization: (updates: Partial<CustomizationState>) => void;
  resetCustomization: () => void;
}

const defaultCustomization: CustomizationState = {
  companyName: 'Kiko Bim Imóveis',
  primaryColor: '#d4af37',
  secondaryColor: '#c0c0c0',
  backgroundColor: '#040812',
  textColor: '#ffffff',
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [customization, setCustomization] = useState<CustomizationState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('copiloto_customization');
      return saved ? JSON.parse(saved) : defaultCustomization;
    }
    return defaultCustomization;
  });

  useEffect(() => {
    localStorage.setItem('copiloto_customization', JSON.stringify(customization));
    
    // Atualiza as variáveis CSS
    const root = document.documentElement;
    root.style.setProperty('--primary-accent', customization.primaryColor);
    root.style.setProperty('--secondary-accent', customization.secondaryColor);
    root.style.setProperty('--primary-bg', customization.backgroundColor);
    root.style.setProperty('--text-primary', customization.textColor);
  }, [customization]);

  const updateCustomization = (updates: Partial<CustomizationState>) => {
    setCustomization(prev => ({ ...prev, ...updates }));
  };

  const resetCustomization = () => {
    setCustomization(defaultCustomization);
  };

  return (
    <CustomizationContext.Provider value={{ customization, updateCustomization, resetCustomization }}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
}
