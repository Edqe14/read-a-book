import { getUserByName } from '@/services/user';
import { auth } from '@/utils/auth';
import { Button, Image, Tooltip } from '@heroui/react';
import {
  IconBallpenFilled,
  IconMapPinFilled,
  IconWorld,
} from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { Session } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditProfileModal } from './edit-profile/modal';

type ProfilePageProps = {
  params: Promise<{
    name: string;
  }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [session, { name }] = await Promise.all([
    auth() as Promise<Session>,
    params,
  ]);
  const user = await getUserByName(name);

  if (!user) {
    return notFound();
  }

  return (
    <section className="px-6">
      <section className="flex gap-8">
        <Image
          src={`${user.profile?.picture!}?size=256`}
          alt={`${user.name} Picture`}
          width={200}
          className="flex-shrink-0"
        />

        <section className="py-4 flex flex-col gap-6 flex-grow">
          <section className="flex justify-between">
            <div>
              <h1 className="text-4xl font-semibold">{user.nick}</h1>
              <div className="flex gap-2 items-center">
                <h3>@{user.name}</h3>
                &#x2022;
                <p className="text-sm flex gap-1">
                  Joined
                  <Tooltip
                    placement="bottom"
                    color="danger"
                    content={DateTime.fromJSDate(
                      user.createdAt!
                    ).toLocaleString(DateTime.DATE_MED, { locale: 'EN-uk' })}
                  >
                    {DateTime.fromJSDate(user.createdAt!).toRelative()}
                  </Tooltip>
                </p>
              </div>
            </div>

            <div className="flex gap-1 h-min">
              {user.profile?.website && (
                <Link
                  href={user.profile.website}
                  rel="noopenner noreferrer"
                  target="_blank"
                >
                  <Button isIconOnly color="danger" variant="flat">
                    <IconWorld />
                  </Button>
                </Link>
              )}
              {user.profile?.location && (
                <Tooltip
                  placement="bottom"
                  content={user.profile.location}
                  color="danger"
                >
                  <Button color="danger" variant="flat" isIconOnly>
                    <IconMapPinFilled />
                  </Button>
                </Tooltip>
              )}

              {user.id.toString() === session.user.id && (
                <EditProfileModal user={user} />
              )}
            </div>
          </section>

          <p>{user.profile?.bio}</p>
        </section>
      </section>
    </section>
  );
}
