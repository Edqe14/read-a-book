import { getRoute } from '@/types/routes';
import { Image } from '@heroui/react';
import { IconSquareAsteriskFilled } from '@tabler/icons-react';
import { Link } from 'react-transition-progress/next';

export const BookGridEntry = (list: {
  id: number;
  bookId: string;
  rating: number | null;
  book: {
    id: string;
    title: string;
    thumbnail: string | null;
  };
}) => {
  return (
    <Link
      href={getRoute('BOOK', list.bookId)}
      key={list.bookId}
      className="relative group w-full h-full"
      draggable={false}
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
        {list.rating && (
          <p className="flex gap-1 items-center font-medium blur-md group-hover:blur-0 transition duration-300">
            {list.rating}
            <IconSquareAsteriskFilled className="inline" size={20} />
          </p>
        )}
      </div>
    </Link>
  );
};
