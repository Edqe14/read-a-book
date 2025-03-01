'use client';

import * as Sentry from '@sentry/nextjs';
import { addToReadList } from '@/services/read-list';
import { Card, Button, addToast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useProgress } from 'react-transition-progress';
import { IconCircleXFilled } from '@tabler/icons-react';

export const AddToListCard = ({ bookId }: { bookId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const startProgress = useProgress();

  const addToList = async () => {
    setIsLoading(true);

    try {
      await addToReadList(bookId);

      startTransition(() => {
        startProgress();
        router.refresh();
        setIsLoading(false);
      });
    } catch (err) {
      Sentry.captureException(err);
      setIsLoading(false);
      addToast({
        title: 'Oops, something went wrong',
        icon: <IconCircleXFilled />,
        color: 'danger',
      });
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <h2 className="font-semibold text-base">Are you reading this book?</h2>
      <div>
        <Button isLoading={isLoading} onPress={addToList} color="primary">
          Add to your reading list
        </Button>
      </div>
    </Card>
  );
};
