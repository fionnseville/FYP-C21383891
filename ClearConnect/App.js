import React from 'react';
import Navigation from './navigation';
import { AuthProvider } from './AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
