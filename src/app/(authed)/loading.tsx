import { Spinner } from '@heroui/react';

export default function Loading() {
  return (
    <section className="grid place-items-center flex-grow">
      <Spinner />
    </section>
  );
}
