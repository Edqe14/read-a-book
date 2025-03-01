'use client';

import * as Sentry from '@sentry/nextjs';
import {
  FollowUser,
  getFollowers,
  getFollowing,
  UserWithProfile,
} from '@/services/user';
import {
  addToast,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import { useState } from 'react';
import { Link } from 'react-transition-progress/next';
import { getRoute } from '@/types/routes';

export const FollowerInformation = ({
  user,
  followerCount,
  followingCount,
}: {
  user: UserWithProfile;
  followerCount: number;
  followingCount: number;
}) => {
  const [title, setTitle] = useState('');
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchFollowers = async () => {
    setIsLoading(true);
    setTitle(`${user.nick ?? user.name} followers (${followerCount})`);
    onOpen();

    try {
      setUsers(await getFollowers(user.id));
      setIsLoading(false);
    } catch (err) {
      Sentry.captureException(err);
      setIsLoading(false);
      addToast({
        title: 'Oops, something went wrong',
        color: 'danger',
      });
    }
  };

  const fetchFollowings = async () => {
    setIsLoading(true);
    setTitle(`${user.nick ?? user.name} followings (${followingCount})`);
    onOpen();

    try {
      setUsers(await getFollowing(user.id));
      setIsLoading(false);
    } catch (err) {
      Sentry.captureException(err);
      setIsLoading(false);
      addToast({
        title: 'Oops, something went wrong',
        color: 'danger',
      });
    }
  };

  return (
    <>
      <section className="flex gap-2">
        <Button size="sm" color="danger" onPress={fetchFollowers}>
          <strong>{followerCount}</strong> followers
        </Button>

        <Button size="sm" color="danger" onPress={fetchFollowings}>
          <strong>{followingCount}</strong> following
        </Button>
      </section>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="pb-6 relative">
                {isLoading && <Spinner color="danger" />}
                {!isLoading && !users.length && (
                  <p className="text-center text-sm">Nothing to see here...</p>
                )}
                {!isLoading &&
                  users.map((entry) => (
                    <Link
                      href={`${getRoute('USER_SHORT')}${entry.name}`}
                      key={entry.id}
                      className="flex gap-4 items-center"
                      draggable={false}
                    >
                      <Image src={entry.picture!} alt={entry.name} width={40} />
                      <p className="font-semibold">
                        {entry.nick ?? entry.name}
                      </p>
                    </Link>
                  ))}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
