export const createQueryString = (
  queryObject: { [key: string]: string | string[] | number | null } = {}
): string => {
  const queryString = Object.keys(queryObject)
    .filter(
      (key) =>
        queryObject[key] &&
        !(Array.isArray(queryObject[key]) && !queryObject[key].length)
    )
    .map((key) => {
      const value = queryObject[key];
      return Array.isArray(value)
        ? value
            .map(
              (item) =>
                `${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`
            )
            .join('&')
        : `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`;
    })
    .join('&');

  return queryString ? `?${queryString}` : '';
};
