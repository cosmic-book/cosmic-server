enum ReadingStatus {
  TO_READ,
  READING,
  FINISHED,
  REREADING,
  ABANDONED
}

enum ReadingCategory {
  BOOK,
  COMIC,
  MAGAZINE
}

enum ReadingType {
  PRINTED,
  DIGITAL,
  AUDIO
}

export { ReadingCategory, ReadingStatus, ReadingType };
