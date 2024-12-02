import { THistory, TReading } from '@/@types';
import { BooksService, HistoriesService, ReadingsService, RefBookGendersService } from '@/database/services';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';

type TBookDetails = {
  favorites: TReading[];
  totalReadPages: number;
  totalReviews: number;
};

type TProfileInfos = {
  readings: TReading[];
  totalReadPages: number;
  totalReviews: number;
  totalItems: number;
  favorites: TReading[];
  lastHistory: THistory;
};

export class ProfileController {
  // GET: /profile/1
  public static async findInfosByUser(req: Request, res: Response): Promise<Response<TProfileInfos>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const readings = await ReadingsService.getByUser(parseInt(id));

      const { favorites, totalReadPages, totalReviews } = await ProfileController.getBookDetails(readings);

      const lastHistory = await HistoriesService.getLastByUser(parseInt(id));
      const lastHistoryReading = await ReadingsService.getById(lastHistory.id_reading);

      if (lastHistoryReading) {
        const lastHistoryBook = await BooksService.getById(lastHistoryReading.id_book);

        if (lastHistoryBook) {
          lastHistoryBook.cover = `https://covers.openlibrary.org/b/isbn/${lastHistoryBook.isbn_13}-M.jpg?default=false`;

          lastHistoryReading.book = lastHistoryBook;
          lastHistory.reading = lastHistoryReading;
        }
      }

      const infos: TProfileInfos = {
        readings,
        totalReadPages,
        totalReviews,
        totalItems: readings.length,
        favorites,
        lastHistory
      };

      return res.status(HttpStatus.OK).json(infos);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  private static async getBookDetails(readings: TReading[]): Promise<TBookDetails> {
    let favorites: TReading[] = [];
    let totalReadPages = 0;
    let totalReviews = 0;

    if (readings) {
      for (const reading of readings) {
        const book = await BooksService.getById(reading.id_book);

        if (book && book.id) {
          book.genders = await RefBookGendersService.getByBook(book.id);
          book.cover = `https://covers.openlibrary.org/b/isbn/${book.isbn_13}-M.jpg?default=false`;

          reading.book = book;
        }

        if (reading.favorite) {
          favorites.push(reading);
        }

        if (reading.read_pages) {
          totalReadPages += reading.read_pages;
        }

        if (reading.review) {
          totalReviews++;
        }
      }
    }

    return { favorites, totalReadPages, totalReviews };
  }
}
