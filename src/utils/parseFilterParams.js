const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';

  if (!isString) return;

  const isContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (isContactType(contactType)) return contactType;
};

const parseIsFavourite = (favourite) => {
  if (favourite === 'true' || favourite === 'false') {
    return favourite;
  }
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseContactType(type);

  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
