import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import MissingConfig from './components/common/MissingConfig';
import { isConfigured } from './config/env';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { queryClient } from './lib/queryClient';

const root = createRoot(document.getElementById('root'));

if (!isConfigured) {
  root.render(<MissingConfig />);
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary fullScreen>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
