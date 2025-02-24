import { Ratings } from '@/types/books';
import {
  ReadListLabels,
  ReadListSortCategories,
  ReadListSortCategoryLabels,
} from '@/types/read-lists';
import { Routes } from '@/types/routes';
import { createQueryString } from '@/utils/query-params';
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
} from '@heroui/react';
import { IconAdjustments } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ReadListFilter } from './_validator';
import { z } from 'zod';
import { useOnClickOutside } from 'usehooks-ts';

export const ReadListFilterMenu = () => {
  const router = useRouter();
  const params = useSearchParams();

  const menuRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterOpened, setFilterOpened] = useState(false);
  const form = useForm({
    defaultValues: {
      status: null,
      rating: null,
      sortBy: ReadListSortCategories.RECENT as string,
    },
  });

  const hasFilterApplied = useMemo(() => {
    return !!params.get('status') || !!params.get('rating');
  }, [params]);

  const handleSubmit = form.handleSubmit((data) => {
    setIsSubmitting(true);

    const qs = createQueryString(data);

    startTransition(() => {
      router.push(`${Routes.READLING_LIST}${qs}`);
      setIsSubmitting(false);
      setFilterOpened(false);
    });
  });

  useEffect(() => {
    const param = ReadListFilter.safeParse(
      Object.fromEntries(params.entries())
    );

    Object.entries(param.data ?? {}).forEach(([key, value]) => {
      form.setValue(key as keyof z.infer<typeof ReadListFilter>, value);
    });
  }, [params]);

  useOnClickOutside(menuRef, () => setFilterOpened(false));

  return (
    <Dropdown
      isOpen={filterOpened}
      onKeyDown={(e) => e.key === 'Escape' && setFilterOpened(false)}
    >
      <div className="relative">
        <DropdownTrigger>
          <span className="absolute inset-0 pointer-events-none"></span>
        </DropdownTrigger>

        <Button
          color={!hasFilterApplied ? 'primary' : 'danger'}
          onPress={() => setFilterOpened(!filterOpened)}
          isIconOnly
          className="z-[1]"
        >
          <IconAdjustments size={20} />
        </Button>

        {hasFilterApplied && (
          <span className="bg-rose absolute inset-2 rounded-md block animate-ping" />
        )}
      </div>

      <DropdownMenu ref={menuRef} className="w-72 p-4">
        <DropdownItem className="p-0 mb-4" key="status">
          <Select label="Status" size="sm" {...form.register('status')}>
            <>
              {Object.entries(ReadListLabels).map(([key, options]) => (
                <SelectItem color="primary" key={key}>
                  {options.label}
                </SelectItem>
              ))}
            </>
          </Select>
        </DropdownItem>

        <DropdownItem className="p-0 mb-4" key="rating">
          <Select label="Rating" size="sm" {...form.register('rating')}>
            <>
              {Ratings.map((options) => (
                <SelectItem color="primary" key={options.value}>
                  {options.label}
                </SelectItem>
              ))}
            </>
          </Select>
        </DropdownItem>

        <DropdownItem className="p-0 mb-4" key="sort_by">
          <Select
            label="Sort by"
            disallowEmptySelection
            size="sm"
            {...form.register('sortBy')}
          >
            <>
              {Object.entries(ReadListSortCategoryLabels).map(
                ([key, options]) => (
                  <SelectItem color="primary" key={key}>
                    {options.label}
                  </SelectItem>
                )
              )}
            </>
          </Select>
        </DropdownItem>

        <DropdownItem className="p-0" key="apply">
          <Button
            onPress={() => handleSubmit()}
            isLoading={isSubmitting}
            className="w-full"
            color="danger"
          >
            Apply
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
