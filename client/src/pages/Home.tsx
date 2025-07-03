import { useState } from "react";
import Navigation from "@/components/Navigation";
import RegistrationForm from "@/components/RegistrationForm";
import BinMonitor from "@/components/BinMonitor";
import SettingsPanel from "@/components/SettingsPanel";
import ApiDocumentation from "@/components/ApiDocumentation";

type Section = 'registration' | 'monitor' | 'settings' | 'api';

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('registration');

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'registration' && <RegistrationForm />}
        {activeSection === 'monitor' && <BinMonitor />}
        {activeSection === 'settings' && <SettingsPanel />}
        {activeSection === 'api' && <ApiDocumentation />}
      </main>
    </div>
  );
}
