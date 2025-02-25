import { Ratings } from '@/types/books';
import {
  ReadListLabels,
  ReadListSortCategories,
  ReadListSortCategoryLabels,
} from '@/types/read-lists';
import { Routes } from '@/types/routes';
import { createQueryString } from '@/utils/query-params';
import {
  Button,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
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

  return (
    <Popover isOpen={filterOpened} onOpenChange={setFilterOpened}>
      <div className="relative">
        <PopoverTrigger>
          <Button
            color={!hasFilterApplied ? 'primary' : 'danger'}
            isIconOnly
            className="z-[1]"
          >
            <IconAdjustments size={20} />
          </Button>
        </PopoverTrigger>

        {hasFilterApplied && (
          <span className="bg-rose absolute inset-2 rounded-md block animate-ping" />
        )}
      </div>

      <PopoverContent className="w-72 p-4">
        {() => (
          <section>
            <Select
              label="Status"
              className="mb-4"
              size="sm"
              {...form.register('status')}
            >
              <>
                {Object.entries(ReadListLabels).map(([key, options]) => (
                  <SelectItem color="primary" key={key}>
                    {options.label}
                  </SelectItem>
                ))}
              </>
            </Select>
            <Select
              label="Rating"
              className="mb-4"
              size="sm"
              {...form.register('rating')}
            >
              <>
                {Ratings.map((options) => (
                  <SelectItem color="primary" key={options.value}>
                    {options.label}
                  </SelectItem>
                ))}
              </>
            </Select>

            <Select
              label="Sort by"
              disallowEmptySelection
              className="mb-4"
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

            <Button
              onPress={() => handleSubmit()}
              isLoading={isSubmitting}
              className="w-full"
              color="danger"
            >
              Apply
            </Button>
          </section>
        )}
      </PopoverContent>
    </Popover>
  );
};
