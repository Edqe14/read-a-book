'use client';

import { queryClient } from '@/utils/query';
import { HeroUIProvider } from '@heroui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

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
        {children}
      </HeroUIProvider>
    </QueryClientProvider>
  );
};
