import { getBook } from '@/services/book';
import { BookContent } from './content';
import { ReadList } from './read-list';
import { Suspense } from 'react';
import { Skeleton } from '@heroui/react';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    return notFound();
  }

  return {
    title: book.title,
    description:
      book.description ||
      `Read ${book.title} by ${book.authors?.join(', ') ?? book.publisher}`,
    openGraph: {
      title: book.title,
      description: book.description,
      images: book.thumbnail ? [{ url: book.thumbnail }] : [],
    },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    return notFound();
  }

  return (
    <section className="px-6">
      <BookContent book={book} />

      <section className="px-4 pb-16">
        <Suspense
          fallback={
            <Skeleton
              className="h-72 rounded-xl bg-beige-600/25"
              classNames={{
                content: 'bg-beige-600',
              }}
            />
          }
        >
          <ReadList book={book} />
        </Suspense>
      </section>
    </section>
  );
}
