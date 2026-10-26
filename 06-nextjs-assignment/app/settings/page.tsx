import React from 'react';
import SettingsClient from '@/components/SettingsClient';

export const metadata = {
  title: 'Settings | Project Explorer',
  description: 'Application settings and preferences.',
};

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6" id="settings-page">
      <div className="space-y-1 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Settings
        </h1>
        <p className="text-xs text-zinc-400">
          Manage local preferences and client storage.
        </p>
      </div>

      <SettingsClient />
    </div>
  );
}
