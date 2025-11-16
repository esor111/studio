'use client';

import { BattleLayout } from '@/components/layout/battle-layout';

export default function DashboardPage() {
  return (
    <BattleLayout>
      <div className="text-center">
        <h1 className="text-battle-xl text-battle-gold mb-8">
          Battle System Dashboard
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Welcome to the Battle System! The foundation has been set up successfully.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-battle-card p-6 rounded-lg border border-gray-700">
            <h3 className="text-battle-md text-battle-gold mb-4">Project Setup</h3>
            <ul className="text-left space-y-2 text-gray-300">
              <li>✅ Next.js 14 with TypeScript</li>
              <li>✅ Tailwind CSS with custom design system</li>
              <li>✅ Framer Motion for animations</li>
              <li>✅ Zustand for state management</li>
              <li>✅ React Query for server state</li>
              <li>✅ Axios for API calls</li>
              <li>✅ Howler.js for sound effects</li>
            </ul>
          </div>
          
          <div className="bg-battle-card p-6 rounded-lg border border-gray-700">
            <h3 className="text-battle-md text-battle-electric-blue mb-4">Project Structure</h3>
            <ul className="text-left space-y-2 text-gray-300">
              <li>✅ Components organized by feature</li>
              <li>✅ Services for API integration</li>
              <li>✅ Stores for state management</li>
              <li>✅ Types for TypeScript definitions</li>
              <li>✅ Hooks for reusable logic</li>
              <li>✅ Utils for helper functions</li>
            </ul>
          </div>
          
          <div className="bg-battle-card p-6 rounded-lg border border-gray-700">
            <h3 className="text-battle-md text-battle-crimson mb-4">Design System</h3>
            <ul className="text-left space-y-2 text-gray-300">
              <li>✅ Dark theme with battle colors</li>
              <li>✅ Custom typography scales</li>
              <li>✅ Animation utilities</li>
              <li>✅ Responsive breakpoints</li>
              <li>✅ Glow effects and gradients</li>
              <li>✅ Premium interaction styles</li>
            </ul>
          </div>
        </div>
      </div>
    </BattleLayout>
  );
}