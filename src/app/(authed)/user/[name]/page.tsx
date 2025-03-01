import { getFullUserByName, getUserFollowInfo } from '@/services/user';
import { auth } from '@/utils/auth';
import { Button, Card, Image, Skeleton, Tooltip } from '@heroui/react';
import { IconMapPinFilled, IconWorld } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { Session } from 'next-auth';
import { notFound } from 'next/navigation';
import { EditProfileModal } from './edit-profile/modal';
import { assign, fill } from 'lodash-es';
import { Link } from 'react-transition-progress/next';
import { Suspense } from 'react';
import { UserActivities } from './activities';
import { FollowButton } from './follow-button';
import { FollowerInformation } from './follower-information';
import { BookGridEntry } from '@/components/book-grid-entry';

type ProfilePageProps = {
  params: Promise<{
    name: string;
  }>;
};

export async function generateMetadata({ params }: ProfilePageProps) {
  const { name } = await params;
  const user = await getFullUserByName(name);

  if (!user) {
    return notFound();
  }

  return {
    title: `${user.nick ?? user.name} (@${user.name})`,
    description:
      user.profile?.bio ?? `Profile page for ${user.nick ?? user.name}`,
    openGraph: {
      images: [
        {
          url: user.profile?.picture,
          width: 200,
          height: 200,
        },
      ],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [session, { name }] = await Promise.all([
    auth() as Promise<Session>,
    params,
  ]);
  const user = await getFullUserByName(name);

  if (!user) {
    return notFound();
  }

  const { isFollowing, followerCount, followingCount } =
    await getUserFollowInfo(user.id);

  return (
    <section className="px-6 space-y-8 pb-16">
      <section className="flex gap-8">
        <Image
          src={`${user.profile!.picture}?size=256`}
          alt={`${user.name} Picture`}
          width={200}
          className="flex-shrink-0 border-8 border-primary"
          draggable={false}
        />

        <section className="py-3 flex flex-col gap-6 flex-grow">
          <section className="flex justify-between">
            <div>
              <h1 className="text-3xl font-semibold">
                {user.nick ?? user.name}
              </h1>
              <div className="flex gap-2 items-center">
                <h3>@{user.name}</h3>
                <span className="text-rose">&#x2022;</span>
                <div className="text-sm flex gap-1">
                  Joined
                  <Tooltip
                    placement="bottom"
                    color="danger"
                    content={DateTime.fromJSDate(
                      user.createdAt!
                    ).toLocaleString(DateTime.DATE_MED, { locale: 'en-GB' })}
                  >
                    {DateTime.fromJSDate(user.createdAt!).toRelative()}
                  </Tooltip>
                </div>
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

              {user.id.toString() !== session.user.id && (
                <FollowButton user={user} followed={isFollowing} />
              )}
            </div>
          </section>

          <p>{user.profile?.bio}</p>

          <FollowerInformation
            user={user}
            followerCount={followerCount}
            followingCount={followingCount}
          />
        </section>
      </section>

      {user.readLists.length > 0 && (
        <Card className="p-4 mx-4 space-y-4">
          <h2 className="text-base font-semibold">
            Some of {user.nick ?? user.name}&apos;s favourites...
          </h2>

          <section className="grid grid-cols-5 gap-4">
            {assign(
              fill(
                new Array(5),
                <div className="bg-zinc-100 rounded-xl grid place-items-center text-zinc-500 shadow-inner"></div>
              ),
              user.readLists.map((list) => (
                <BookGridEntry key={list.id} {...list} />
              ))
            )}
          </section>
        </Card>
      )}

      <h2 className="text-xl font-semibold">Recent activities</h2>

      <Suspense
        fallback={
          <Skeleton
            className="h-72 rounded-xl bg-beige-600/25"
            classNames={{
              content: 'bg-beige-600',
            }}
          />
        }
      >
        <UserActivities user={user} />
      </Suspense>
    </section>
  );
}
