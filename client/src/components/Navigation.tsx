import { Trash2 } from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: 'registration' | 'monitor' | 'settings' | 'api') => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-neutral">ATO Smart Waste Management</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onSectionChange('registration')}
              className={`transition-colors ${
                activeSection === 'registration'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => onSectionChange('monitor')}
              className={`transition-colors ${
                activeSection === 'monitor'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Monitor
            </button>
            <button
              onClick={() => onSectionChange('settings')}
              className={`transition-colors ${
                activeSection === 'settings'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => onSectionChange('api')}
              className={`transition-colors ${
                activeSection === 'api'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              API Docs
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
