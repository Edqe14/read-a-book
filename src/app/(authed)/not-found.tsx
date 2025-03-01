import { getRoute } from '@/types/routes';
import { Button } from '@heroui/react';
import { Link } from 'react-transition-progress/next';

export default function NotFound() {
  return (
    <section className="pt-32 flex flex-col items-center flex-grow gap-4">
      <h1 className="text-2xl font-semibold">Nothing to see here...</h1>
      <Link href={getRoute('DASHBOARD')}>
        <Button color="danger">Back to home</Button>
      </Link>
    </section>
  );
}
