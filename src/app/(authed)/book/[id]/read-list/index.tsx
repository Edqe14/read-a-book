import { Book } from '@/services/book';
import { getBookReadList } from '@/services/read-list';
import { auth } from '@/utils/auth';
import { AddToListCard } from './add-to-list';
import { ReadingProgress } from './read-progress';

export const ReadList = async ({ book }: { book: Book }) => {
  const session = (await auth())!;
  const readList = await getBookReadList(session.user.id, book.id);

  if (!readList) {
    return <AddToListCard userId={session.user.id} bookId={book.id} />;
  }

  return (
    <ReadingProgress book={book} readList={readList} userId={session.user.id} />
  );
};
