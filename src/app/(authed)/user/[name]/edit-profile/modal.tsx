'use client';

import { updateUserProfileByAuth, UserWithProfile } from '@/services/user';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import {
  IconBallpenFilled,
  IconMapPinFilled,
  IconWorld,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export const EditProfileModal = ({ user }: { user: UserWithProfile }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      bio: user.profile?.bio,
      website: user.profile?.website,
      location: user.profile?.location,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    await updateUserProfileByAuth(data);

    startTransition(() => {
      router.refresh();
      setIsLoading(false);
      onOpenChange();
    });
  });

  return (
    <>
      <Button color="warning" variant="flat" onPress={onOpen} isIconOnly>
        <IconBallpenFilled />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Profile
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Textarea
                  isDisabled={isLoading}
                  label="Bio"
                  max={255}
                  {...form.register('bio')}
                />

                <label className="flex gap-4 items-center text-sm font-medium">
                  Socials <span className="h-[1px] flex-grow bg-secondary" />
                </label>

                <Input
                  size="sm"
                  isDisabled={isLoading}
                  endContent={<IconWorld className="text-rose" />}
                  label="Website"
                  type="url"
                  max={64}
                  {...form.register('website')}
                />
                <Input
                  size="sm"
                  isDisabled={isLoading}
                  endContent={<IconMapPinFilled className="text-rose" />}
                  label="Location"
                  {...form.register('location')}
                  maxLength={32}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  isDisabled={isLoading}
                  variant="light"
                  onPress={onClose}
                >
                  Nevermind
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={() => onSubmit()}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
