import { BookGridEntry } from '@/components/book-grid-entry';
import { getUserRecentReadList } from '@/services/dashboard';
import { getRoute } from '@/types/routes';
import { auth } from '@/utils/auth';
import { Card } from '@heroui/react';
import { IconCircleChevronRightFilled } from '@tabler/icons-react';
import { assign, fill } from 'lodash-es';
import { DateTime } from 'luxon';
import { redirect } from 'next/navigation';
import { Link } from 'react-transition-progress/next';

export default async function Dashboard() {
  const session = await auth();
  if (!session) return redirect('/');

  const readList = await getUserRecentReadList();

  return (
    <section className="px-6 space-y-6">
      <section>
        <h1 className="font-semibold text-2xl">
          Welcome back, {session.user.nick ?? session.user.name}
        </h1>
        <p>
          {DateTime.now().toFormat('EEEE, d MMMM yyyy', {
            locale: 'en-GB',
          })}
        </p>
      </section>

      {readList.length > 0 && (
        <Card className="p-4 mx-4 space-y-4">
          <section className="flex justify-between items-center gap-8">
            <h2 className="text-base font-semibold">
              Continue where you left off
            </h2>

            <Link href={getRoute('READLING_LIST')}>
              <IconCircleChevronRightFilled className="text-rose" />
            </Link>
          </section>

          <section className="grid grid-cols-5 gap-4">
            {assign(
              fill(
                new Array(5),
                <div className="bg-zinc-100 rounded-xl grid place-items-center text-zinc-500 shadow-inner"></div>
              ),
              readList.map((list) => <BookGridEntry {...list} />)
            )}
          </section>
        </Card>
      )}
    </section>
  );
}
