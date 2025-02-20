import { Navbar } from '@/components/navbar';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AuthedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  return (
      <main className="max-w-screen-md w-full mx-auto border-x-1 border-beige-600 flex-grow flex flex-col">
        <Navbar session={session!} />

        {children}
      </main>
  );
}
