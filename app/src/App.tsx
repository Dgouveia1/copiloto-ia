import { useState, useEffect } from 'react';
import { CustomizationProvider } from './context/CustomizationContext';
import LoadingScreen from './sections/LoadingScreen';
import Header from './sections/Header';
import CustomizationModal from './sections/CustomizationModal';
import HeroDashboard from './sections/HeroDashboard';
import KPISection from './sections/KPISection';
import TemperatureAnalysis from './sections/TemperatureAnalysis';
import ConversionFunnel from './sections/ConversionFunnel';
import PropertyTypes from './sections/PropertyTypes';
import ValuesAndPendencies from './sections/ValuesAndPendencies';
import TimelineAndActions from './sections/TimelineAndActions';
import Footer from './sections/Footer';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  useEffect(() => {
    // Previne scroll durante o loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#040812]">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main Content */}
      {!isLoading && (
        <>
          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
              }}
            />
            
            {/* Floating particles */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#d4af37] rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
              />
            ))}

            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
          </div>

          {/* Header */}
          <Header onOpenCustomization={() => setIsCustomizationOpen(true)} />

          {/* Main Content */}
          <main className="relative z-10">
            <HeroDashboard />
            <KPISection />
            <TemperatureAnalysis />
            <ConversionFunnel />
            <PropertyTypes />
            <ValuesAndPendencies />
            <TimelineAndActions />
          </main>

          {/* Footer */}
          <Footer />

          {/* Customization Modal */}
          <CustomizationModal 
            isOpen={isCustomizationOpen} 
            onClose={() => setIsCustomizationOpen(false)} 
          />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <CustomizationProvider>
      <AppContent />
    </CustomizationProvider>
  );
}

export default App;
