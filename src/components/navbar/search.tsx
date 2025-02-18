'use client';

import { searchBooks } from '@/services/book';
import { cn } from '@/utils/cn';
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
  const { isFetching, data, refetch } = useQuery({
    queryKey: ['search-books'],
    queryFn: () => (!query ? null : searchBooks(query, 5)),
  });

  useDebounce(
    () => {
      refetch();
      setOpen(!!query);
    },
    1000,
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
        className="max-w-96 relative"
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
            Showing <span className="font-semibold">{data?.items?.length}</span>{' '}
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
      >
        {!isFetching && data
          ? [
              ...data?.items.map((item) => (
                <DropdownItem
                  href={`/book/${item.id}`}
                  key={item.id}
                  classNames={{ title: 'flex gap-3' }}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={item.volumeInfo?.imageLinks?.thumbnail}
                      isZoomed
                      className="w-full"
                      height={100}
                      radius="sm"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">{item.volumeInfo.title}</h3>
                    {item?.volumeInfo?.industryIdentifiers?.map((id) => (
                      <p key={id.type}>
                        {id.type}: {id.identifier}
                      </p>
                    ))}
                  </div>
                </DropdownItem>
              )),
              <DropdownItem
                color="primary"
                key="more"
                href={`/search?q=${query}`}
              >
                See more
              </DropdownItem>,
            ]
          : []}
      </DropdownMenu>
    </Dropdown>
  );
};
