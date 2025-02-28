'use client';

import { addToReadList } from '@/services/read-list';
import { Card, Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useProgress } from 'react-transition-progress';

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
      console.error(err);
      setIsLoading(false);
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
