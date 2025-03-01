import { getUserRecentActivities, RecentActivity } from '@/services/activity';
import { UserWithProfile } from '@/services/user';
import { UserActivity, UserActivityMessages } from '@/types/activity';
import { getRoute } from '@/types/routes';
import { Card, Image, Tooltip } from '@heroui/react';
import { DateTime } from 'luxon';
import { Link } from 'react-transition-progress/next';

const getSubject = (entry: RecentActivity) => {
  switch (entry.user_activity.activityType) {
    case UserActivity.BOOK.toString(): {
      return (
        <Link href={getRoute('BOOK', entry.books!.id)} draggable={false}>
          <section className="flex gap-4 p-4">
            <Image
              radius="sm"
              src={entry.books!.thumbnail!}
              alt={entry.books!.title!}
              width={64}
              draggable={false}
              shadow="sm"
            />

            <div className="pt-1">
              <h4 className="font-semibold text-base">{entry.books!.title}</h4>
              <p className="text-sm mb-4">{entry.books?.authors?.join(', ')}</p>

              <p className="text-sm text-zinc-500">{entry.books!.publisher}</p>
            </div>
          </section>
        </Link>
      );
    }

    case UserActivity.USER.toString(): {
      return (
        <Link href={`${getRoute('USER_SHORT')}${entry.user!.name}`}>
          <div className="flex p-4 items-center gap-4">
            <Image
              src={entry.user!.picture!}
              alt={entry.user!.name}
              width={64}
              draggable={false}
              shadow="sm"
            />
            <div>
              <h4 className="text-xl font-semibold">{entry.user!.nick}</h4>
              <p className="text-sm">@{entry.user!.name}</p>
            </div>
          </div>
        </Link>
      );
    }

    default:
      return null;
  }
};

export const UserActivities = async ({ user }: { user: UserWithProfile }) => {
  const activities = await getUserRecentActivities(user.id);

  return (
    <section className="space-y-4">
      {activities.map((entry) => {
        const message =
          UserActivityMessages[entry.user_activity.activityType][
            entry.user_activity
              .activitySubType as keyof (typeof UserActivityMessages)[typeof entry.user_activity.activityType]
          ];

        const subject = getSubject(entry);

        return (
          <Card
            shadow="sm"
            key={entry.user_activity.id}
            className="p-4 space-y-4 mx-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="flex gap-2 items-center">
                <strong className="flex items-center gap-2">
                  <Image
                    src={user.profile!.picture!}
                    alt={user.name}
                    width={24}
                  />
                  {user.nick}
                </strong>
                {message}
              </h3>

              <Tooltip
                color="danger"
                content={DateTime.fromJSDate(
                  entry.user_activity.createdAt!
                ).toLocaleString(DateTime.DATETIME_MED, {
                  locale: 'en-GB',
                })}
              >
                <p className="text-sm text-zinc-500">
                  {DateTime.fromJSDate(
                    entry.user_activity.createdAt!
                  ).toRelative()}
                </p>
              </Tooltip>
            </div>

            <Card className="border" shadow="none">
              {subject}
            </Card>
          </Card>
        );
      })}
    </section>
  );
};
