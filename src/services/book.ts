'use server';

import { BookResponse } from '@/types/books';

export const searchBooks = async (
  query: string,
  limit = 10,
  startIndex = 0
) => {
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&maxResults=${limit}&startIndex=${startIndex}`
  ).then((res) => res.json() as Promise<BookResponse>);
};
