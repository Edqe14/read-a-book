'use client';

import { addToReadList } from '@/services/read-list';
import { Card, Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

export const AddToListCard = ({
  userId,
  bookId,
}: {
  userId: string;
  bookId: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const addToList = async () => {
    setIsLoading(true);

    try {
      await addToReadList(userId, bookId);

      startTransition(() => {
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
