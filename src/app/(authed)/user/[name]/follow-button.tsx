'use client';

import * as Sentry from '@sentry/nextjs';
import { followUser, unfollowUser, UserWithProfile } from '@/services/user';
import { Tooltip, Button, addToast } from '@heroui/react';
import {
  IconUserCheck,
  IconPlus,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useProgress } from 'react-transition-progress';

export const FollowButton = ({
  user,
  followed,
}: {
  user: UserWithProfile;
  followed: boolean;
}) => {
  const router = useRouter();
  const startProgress = useProgress();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      if (!followed) {
        await followUser(user.id);
      } else {
        await unfollowUser(user.id);
      }

      startTransition(() => {
        startProgress();
        router.refresh();
        setIsLoading(false);
        addToast({
          title: !followed
            ? `You followed ${user.nick ?? user.name}!`
            : `You unfollowed ${user.nick ?? user.name}`,
          icon: <IconCircleCheckFilled />,
          color: 'success',
        });
      });
    } catch (err: any) {
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
    <Tooltip
      placement="bottom"
      content={`Follow ${user.nick ?? user.name}`}
      color="danger"
    >
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onPress={handleClick}
        color={followed ? 'success' : 'warning'}
        isIconOnly
        variant="flat"
      >
        {followed ? <IconUserCheck /> : <IconPlus />}
      </Button>
    </Tooltip>
  );
};
