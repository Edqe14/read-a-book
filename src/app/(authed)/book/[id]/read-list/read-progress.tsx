'use client';

import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';
import { ReadListStatus } from '@/types/read-lists';
import { ReadList, updateReadList } from '@/services/read-list';
import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/services/book';
import { Ratings } from '@/types/books';

export const ReadingProgress = ({
  readList,
  book,
}: {
  readList: ReadList;
  book: Book;
}) => {
  const router = useRouter();
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const submitReadList = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsFormSubmitting(true);
    const form = new FormData(event.currentTarget);

    await updateReadList(readList.id, {
      currentPage: Number(form.get('page')),
      rating: Number(form.get('rating')),
      feedback: form.get('feedback') as string,
    });

    startTransition(() => {
      router.refresh();
      setIsFormSubmitting(false);
    });
  };

  return (
    <Card className="p-4 space-y-3">
      <h2 className="font-semibold text-base">
        {
          {
            [ReadListStatus.PENDING]: 'Are you reading this book?',
            [ReadListStatus.READING]: 'How far have you gotten in this book?',
            [ReadListStatus.FINISHED]: 'Did you enjoy this book?',
            [ReadListStatus.DROPPED]: 'Why did you drop this book?',
            [ReadListStatus.ON_HOLD]: 'Why did you put this book on hold?',
          }[readList.status]
        }
      </h2>
      <Select
        aria-label="Reading status"
        isLoading={isStatusUpdating}
        isDisabled={isStatusUpdating}
        defaultSelectedKeys={[readList.status]}
        onSelectionChange={async (keys) => {
          setIsStatusUpdating(true);
          await updateReadList(readList.id, {
            status: (keys as Set<string>).values().next().value,
          });

          startTransition(() => {
            router.refresh();
            setIsStatusUpdating(false);
          });
        }}
      >
        {Object.values(ReadListStatus).map((key: string) => (
          <SelectItem color="primary" key={key}>
            {
              {
                [ReadListStatus.PENDING]: "I'm planning to.",
                [ReadListStatus.READING]: "I'm reading it.",
                [ReadListStatus.FINISHED]: 'I finished it.',
                [ReadListStatus.DROPPED]: 'I dropped it.',
                [ReadListStatus.ON_HOLD]: "I'm putting it on hold.",
              }[key]
            }
          </SelectItem>
        ))}
      </Select>
      {readList.status !== ReadListStatus.PENDING && (
        <form onSubmit={submitReadList} className="space-y-3">
          <h4 className="text-sm font-medium">How do you like it so far?</h4>

          <div className="grid grid-cols-3 gap-3">
            <Input
              type="number"
              isDisabled={isFormSubmitting}
              label="Page"
              name="page"
              defaultValue={(readList.currentPage ?? 0).toString()}
              min={0}
              max={book.pageCount ?? 0}
              classNames={{
                input: 'no-spinners',
              }}
              endContent={
                <span className="text-sm flex-shrink-0 whitespace-nowrap">
                  / {book.pageCount}
                </span>
              }
            />

            <Select
              label="Rating"
              isDisabled={isFormSubmitting}
              defaultSelectedKeys={
                readList.rating ? [readList.rating.toString()] : []
              }
              className="col-span-2"
              name="rating"
            >
              {Ratings.map(({ value, label }) => (
                <SelectItem color="primary" key={value}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Textarea
            name="feedback"
            isDisabled={isFormSubmitting}
            label="Notes"
            className="col-span-2"
            defaultValue={readList.feedback ?? ''}
            maxLength={255}
          />
          <Button
            isLoading={isFormSubmitting}
            type="submit"
            color="primary"
            className="w-full"
          >
            Save
          </Button>
        </form>
      )}
    </Card>
  );
};
