'use client';

import { Book } from '@/services/book';
import { Image } from '@heroui/react';
import { useState, useMemo } from 'react';

const MAX_WORDS = 50;

export const BookContent = ({ book }: { book: Book }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const isDescriptionTooLong = useMemo(
    () => (book.description?.split(' ')?.length ?? 0) > MAX_WORDS,
    [book.description]
  );

  const metadatas = [
    { label: 'Authors', value: book.authors },
    { label: 'Publisher', value: book.publisher },
    { label: 'Published Date', value: book.publishedDate },
    { label: 'ISBN', value: book.isbn13 },
    { label: 'Categories', value: book.categories ?? '-' },
  ];

  return (
    <>
      <header className="flex gap-6 mb-6">
        <div className="flex-shrink-0">
          <Image
            src={book.thumbnail!}
            alt={book.title}
            radius="sm"
            className="w-36"
          />
        </div>

        <div className="space-y-2 py-2">
          <h1 className="font-semibold text-2xl">{book.title}</h1>
          {metadatas.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-2">
              <h3 className="font-semibold">{label}</h3>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="space-y-1 mb-8">
        <h3 className="font-semibold">Description</h3>
        <p className="leading-relaxed text-ellipsis">
          {(isDescriptionTooLong && !isDescriptionExpanded && (
            <>
              {book.description?.split(' ').slice(0, MAX_WORDS).join(' ') +
                '...'}
            </>
          )) ||
            book.description}{' '}
          {isDescriptionTooLong && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="inline text-blue-500"
            >
              {!isDescriptionExpanded ? 'Read more' : 'Hide'}
            </button>
          )}
        </p>
      </section>
    </>
  );
};
