export const isTermLongEnough = (searchTerm: string, length = 3) =>
  searchTerm.length >= (searchTerm.startsWith('0x') ? length + 2 : length);
