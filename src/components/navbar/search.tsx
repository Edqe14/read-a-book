'use client';

import { searchBooks } from '@/services/book';
import { queryClient } from '@/utils/query';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Spinner,
} from '@heroui/react';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebounce } from 'react-use';

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { isFetching, data } = useQuery({
    queryKey: ['search-books'],
    queryFn: () => (!query ? null : searchBooks(query, 5)),
  });

  useDebounce(
    () => {
      queryClient.invalidateQueries({ queryKey: ['search-books'] });
      setOpen(!!query);
    },
    750,
    [query]
  );

  return (
    <Dropdown
      suppressHydrationWarning
      isOpen={open}
      onOpenChange={setOpen}
      offset={16}
    >
      <div className="relative">
        <DropdownTrigger>
          <span className="absolute inset-0 !z-0 pointer-events-none" />
        </DropdownTrigger>

        <Input
          size="sm"
          value={query}
          placeholder="Search a book"
          className="z-10 pointer-events-auto"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setQuery('');
            }

            if (e.key === 'Enter') {
              setOpen(true);
            }
          }}
          startContent={<IconSearch className="text-oxford" size={16} />}
        />
      </div>

      <DropdownMenu
        color="secondary"
        className="max-w-96 w-full relative"
        emptyContent={
          isFetching ? (
            <div className="h-48 grid place-items-center">
              <Spinner color="primary" className="" />
            </div>
          ) : (
            'No results found'
          )
        }
        topContent={
          <p className="mb-1.5 px-2">
            Showing{' '}
            <span className="font-semibold">{data?.items?.length || 0}</span>{' '}
            results
          </p>
        }
        bottomContent={
          <p className="text-xs mt-1.5 px-2 opacity-80 text-center">
            Results from{' '}
            <a
              className="text-blue-500 font-medium"
              href="https://developers.google.com/books/docs/overview"
              rel="noreferrer"
              target="_blank"
            >
              Google Book API
            </a>
          </p>
        }
        onAction={() => {
          setOpen(false);
          setQuery('');
        }}
      >
        {!isFetching && data
          ? [
              ...(data?.items?.map((item) => {
                const isbn = item?.volumeInfo?.industryIdentifiers?.find(
                  (v) => v.type === 'ISBN_13'
                )?.identifier;

                return (
                  <DropdownItem
                    href={`/book/${item.id}`}
                    key={item.id}
                    classNames={{ title: 'flex gap-3' }}
                  >
                    {item.volumeInfo?.imageLinks?.thumbnail && (
                      <div className="flex-shrink-0">
                        <Image
                          src={item.volumeInfo.imageLinks.thumbnail}
                          alt={`Cover for ${item.volumeInfo.title}`}
                          className="w-full"
                          height={100}
                          radius="sm"
                        />
                      </div>
                    )}

                    <div className="py-0.5">
                      <h3 className="font-semibold">{item.volumeInfo.title}</h3>
                      <p>
                        {item?.volumeInfo?.publishedDate &&
                          new Date(
                            item?.volumeInfo?.publishedDate
                          ).getFullYear()}{' '}
                        &mdash; {item?.volumeInfo?.authors?.join(', ')}
                      </p>
                      {isbn && <p>ISBN: {isbn}</p>}
                    </div>
                  </DropdownItem>
                );
              }) ?? []),
              // <DropdownItem
              //   color="primary"
              //   key="more"
              //   href={`/search?q=${query}`}
              // >
              //   See more
              // </DropdownItem>,
            ]
          : []}
      </DropdownMenu>
    </Dropdown>
  );
};
