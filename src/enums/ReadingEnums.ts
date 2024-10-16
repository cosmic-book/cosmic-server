enum ReadingStatus {
  TO_READ,
  READING,
  FINISHED,
  REREADING,
  ABBANDONED
}

enum ItemType {
  BOOK,
  COMIC,
  MANGA
}

enum OwnershipStatus {
  WANTED,
  OWNED,
  EXCHANGE
}

export { ReadingStatus, ItemType, OwnershipStatus };
