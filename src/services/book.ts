'use server';

import { db } from '@/db';
import { books } from '@/db/schema';
import { BookItem, BooksResponse } from '@/types/books';

export const searchBooks = async (
  query: string,
  limit = 10,
  startIndex = 0
) => {
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&maxResults=${limit}&startIndex=${startIndex}&key=${
      process.env.GOOGLE_API_KEY
    }`
  ).then((res) => res.json() as Promise<BooksResponse>);
};

export const fetchBook = async (id: string) => {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.GOOGLE_API_KEY}`
  )
    .then(
      (res) => res.json() as Promise<BookItem | { error: { code: number } }>
    )
    .catch(() => null);

  if (!res) return null;
  if ('error' in res) {
    return null;
  }

  return res;
};

export const getBook = async (id: string) => {
  const book = await db.query.books.findFirst({
    where: (book, { eq }) => eq(book.id, id),
  });

  if (book) {
    return book;
  }

  const bookData = await fetchBook(id);
  if (!bookData) return null;

  const [newBook] = await db
    .insert(books)
    .values({
      id: bookData.id,
      title: bookData.volumeInfo.title,
      authors: bookData.volumeInfo.authors || null,
      description: bookData.volumeInfo.description,
      publisher: bookData.volumeInfo.publisher,
      publishedDate: bookData.volumeInfo.publishedDate,
      isbn10: bookData.volumeInfo.industryIdentifiers?.find(
        (id) => id.type === 'ISBN_10'
      )?.identifier,
      isbn13: bookData.volumeInfo.industryIdentifiers?.find(
        (id) => id.type === 'ISBN_13'
      )?.identifier,
      pageCount: bookData.volumeInfo.pageCount,
      language: bookData.volumeInfo.language,
      thumbnail: bookData.volumeInfo.imageLinks?.thumbnail,
      maturityRating: bookData.volumeInfo.maturityRating,
      categories: bookData.volumeInfo.categories,
    })
    .returning();

  return newBook;
};

export type Book = Awaited<ReturnType<typeof getBook>>;
