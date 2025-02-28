import { getFullUserByName } from '@/services/user';
import { auth } from '@/utils/auth';
import { Button, Card, Image, Tooltip } from '@heroui/react';
import {
  IconMapPinFilled,
  IconSquareAsteriskFilled,
  IconWorld,
} from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { Session } from 'next-auth';
import { notFound } from 'next/navigation';
import { EditProfileModal } from './edit-profile/modal';
import { getRoute } from '@/types/routes';
import { assign, fill } from 'lodash-es';
import { Link } from 'react-transition-progress/next';

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
  const user = await getFullUserByName(name);

  if (!user) {
    return notFound();
  }

  const favBooks = user.readLists.map((list) => (
    <Link
      href={getRoute('BOOK', list.bookId)}
      key={list.bookId}
      className="relative group w-full h-full"
    >
      <Image
        src={list.book.thumbnail!}
        fallbackSrc="/images/no_cover.webp"
        shadow="sm"
        width="100%"
        classNames={{ img: 'object-contain' }}
        draggable={false}
      />

      <div className="absolute inset-0 z-10 p-4 flex opacity-0 flex-col justify-between group-hover:bg-rose group-hover:opacity-100 rounded-xl transition">
        <h3 className="text-base font-semibold blur-md group-hover:blur-0 transition duration-300">
          {list.book.title}
        </h3>
        <p className="flex gap-1 items-center font-medium blur-md group-hover:blur-0 transition duration-300">
          {list.rating}
          <IconSquareAsteriskFilled className="inline" size={20} />
        </p>
      </div>
    </Link>
  ));

  return (
    <section className="px-6 space-y-8">
      <section className="flex gap-8">
        <Image
          src={`${user.profile?.picture!}?size=256`}
          alt={`${user.name} Picture`}
          width={200}
          className="flex-shrink-0 border-8 border-primary"
          draggable={false}
        />

        <section className="py-4 flex flex-col gap-6 flex-grow">
          <section className="flex justify-between">
            <div>
              <h1 className="text-3xl font-semibold">{user.nick}</h1>
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
                    ).toLocaleString(DateTime.DATE_MED, { locale: 'EN-uk' })}
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
            </div>
          </section>

          <p>{user.profile?.bio}</p>
        </section>
      </section>

      <Card className="p-4 mx-4 space-y-4">
        <h2 className="text-base font-semibold">
          Some of {user.nick}'s favourites...
        </h2>

        <section className="grid grid-cols-5 gap-4">
          {assign(
            fill(
              new Array(5),
              <div className="bg-zinc-100 rounded-xl grid place-items-center text-zinc-500 shadow-inner"></div>
            ),
            favBooks
          )}
        </section>
      </Card>

      <h2 className="text-xl font-semibold">Recent activities</h2>
    </section>
  );
}
