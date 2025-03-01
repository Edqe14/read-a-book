import { getRoute } from '@/types/routes';
import { auth, signIn } from '@/utils/auth';
import { Button } from '@heroui/react';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (session) {
    return redirect(getRoute('DASHBOARD'));
  }

  return (
    <main className="flex flex-col items-center justify-center flex-grow gap-4">
      <h1 className="tracking-tighter italic text-2xl">read-a-book</h1>

      <Button
        color="primary"
        onPress={async () => {
          'use server';
          await signIn('discord');
        }}
      >
        Sign in with Discord
      </Button>
    </main>
  );
}
