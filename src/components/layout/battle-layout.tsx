'use client';

import { ReactNode } from 'react';
import { QueryProvider } from '@/lib/providers/query-provider';

interface BattleLayoutProps {
  children: ReactNode;
}

export function BattleLayout({ children }: BattleLayoutProps) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-battle-primary text-white">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </QueryProvider>
  );
}