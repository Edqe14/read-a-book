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

  return children;
}
