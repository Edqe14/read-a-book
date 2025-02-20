'use client';

import { Card, Select, SelectItem } from '@heroui/react';
import { ReadListStatus } from '@/types/read-lists';
import { ReadList } from '@/services/read-list';

// TODO: update progress
// TODO: show progress form
// TODO: show feedback form

export const ReadingProgress = ({
  readList,
}: {
  readList: ReadList;
  userId: string;
}) => {
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
      <div>
        <Select defaultSelectedKeys={[readList.status]}>
          {Object.values(ReadListStatus).map((key: string) => (
            <SelectItem key={key}>
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
      </div>
    </Card>
  );
};
