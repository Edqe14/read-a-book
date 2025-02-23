'use client';

import { ReadLists } from '@/services/read-list';
import { ReadListLabels, ReadListStatusValue } from '@/types/read-lists';
import { cn } from '@/utils/cn';
import { useScrollDirection } from '@/utils/scroll-direction';
import { Card, Chip, Image } from '@heroui/react';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { ReadListFilterMenu } from './filter-menu';
import { Ratings } from '@/types/books';

export const ReadingListContent = ({ readLists }: { readLists: ReadLists }) => {
  const scrollDirection = useScrollDirection();

  return (
    <>
      <section
        className={cn(
          `flex justify-between items-center sticky transition-all bg-beige px-6 z-40 pt-1 pb-4 mb-2`,
          scrollDirection === -1 ? 'top-20' : 'top-0'
        )}
      >
        <div>
          <h1 className="font-semibold text-xl">Your reading list</h1>
          <p>
            <span className="font-medium">{readLists.length}</span> books
          </p>
        </div>

        <ReadListFilterMenu />
      </section>

      <section className="px-6 pb-16 space-y-4">
        {!readLists.length && (
          <p className="text-center py-4">Nothing here...</p>
        )}
        {readLists.map((readList) => {
          const readStatus =
            ReadListLabels[readList.status as ReadListStatusValue];

          return (
            <Link
              className="block"
              key={readList.id}
              href={`/book/${readList.book.id}`}
            >
              <Card className="p-4 flex-row gap-4" shadow="sm">
                {readList.book.thumbnail && (
                  <div className="flex-shrink-0">
                    <Image
                      src={readList.book.thumbnail}
                      height={150}
                      radius="sm"
                    />
                  </div>
                )}

                <div className="pb-2 w-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold text-base pt-1">
                        {readList.book.title}
                      </h2>
                      <Chip
                        className="italic"
                        size="sm"
                        color={readStatus.color}
                      >
                        {readStatus.label}
                      </Chip>
                    </div>
                    <p className="text-sm">
                      {new Date(readList.book.publishedDate!).getFullYear()}{' '}
                      &mdash; {readList.book.authors?.join(', ')}
                    </p>
                    {readList.book.isbn13 && (
                      <p className="text-sm">ISBN {readList.book.isbn13}</p>
                    )}
                  </div>

                  <div className="flex gap-6">
                    <div>
                      <h5 className="font-semibold text-sm">
                        Reading Progress
                      </h5>
                      <p>
                        {readList.currentPage ?? 0} /{' '}
                        {readList.book.pageCount ?? 0}{' '}
                        <span className="text-sm opacity-80">
                          (
                          {(
                            ((readList.currentPage ?? 0) /
                              (readList.book.pageCount ?? 1)) *
                            100
                          ).toFixed(0)}
                          %)
                        </span>
                      </p>
                    </div>

                    {readList.startedAt && (
                      <div>
                        <h5 className="font-semibold text-sm">Started at</h5>
                        <p>
                          {DateTime.fromJSDate(
                            readList.startedAt
                          ).toLocaleString(DateTime.DATE_MED, {
                            locale: 'ID-id',
                          })}
                        </p>
                      </div>
                    )}

                    {readList.finishedAt && (
                      <div>
                        <h5 className="font-semibold text-sm">Finished at</h5>
                        <p>
                          {DateTime.fromJSDate(
                            readList.finishedAt!
                          ).toLocaleString(DateTime.DATE_MED, {
                            locale: 'ID-id',
                          })}
                        </p>
                      </div>
                    )}

                    <div>
                      <h5 className="font-semibold text-sm">Rating</h5>
                      <p>
                        {
                          Ratings.find((v) => v.value === readList.rating)
                            ?.label
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </section>
    </>
  );
};
