'use client';

import { queryClient } from '@/utils/query';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { ProgressBar, ProgressBarProvider } from 'react-transition-progress';

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export const BaseProviders = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider
        navigate={router.push}
        className="min-h-screen flex flex-col w-full"
      >
        <ProgressBarProvider>
          <ProgressBar className="fixed h-1 z-50 shadow-lg shadow-rose-500/20 bg-rose-500 top-0" />
          <ToastProvider />

          {children}
        </ProgressBarProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
};
