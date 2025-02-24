import { Routes } from '@/types/routes';
import { Button } from '@heroui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="pt-32 flex flex-col items-center flex-grow gap-4">
      <h1 className="text-2xl font-semibold">Nothing to see here...</h1>
      <Link href={Routes.DASHBOARD}>
        <Button color="danger">Back to home</Button>
      </Link>
    </section>
  );
}
