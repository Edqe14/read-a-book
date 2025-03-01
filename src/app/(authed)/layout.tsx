import { Navbar } from '@/components/navbar';
import { auth } from '@/utils/auth';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import Link from 'next/link';
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
    <>
      <main
        suppressHydrationWarning
        className="max-w-screen-md w-full mx-auto flex-grow flex flex-col"
      >
        <Navbar session={session!} />

        {children}
      </main>
      <footer className="py-2 border-t border-secondary-600 text-sm">
        <section className="max-w-screen-md w-full mx-auto flex justify-between items-center">
          <i>read-a-book &copy; {new Date().getFullYear()}</i>

          <div className="text-rose">
            <Link
              href="https://github.com/Edqe14/read-a-book"
              rel="noreferrer noopener"
              target="_blank"
            >
              <IconBrandGithubFilled />
            </Link>
          </div>
        </section>
      </footer>
    </>
  );
}
