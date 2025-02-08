import { TBookshelfFilter, THistory, TReading } from '@/@types';
import { EditionsService, HistoriesService, ReadingsService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';

type TBookDetails = {
  favorites: TReading[];
  totalReadPages: number;
  totalReviews: number;
};

type TProfileInfos = {
  allReadings: TReading[];
  filteredReadings: TReading[];
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
      const id = parseInt(req.params.id);
      const { category, status, type, rating } = req.query;

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const parseQueryParam = (param: unknown): number | undefined => {
        const parsed = parseInt(param as string);

        return !isNaN(parsed) ? parsed : undefined;
      };

      const filters: TBookshelfFilter = {
        category: parseQueryParam(category),
        status: parseQueryParam(status),
        type: parseQueryParam(type),
        rating: parseQueryParam(rating)
      };

      const allReadings = await ReadingsService.getByUser(id);
      const filteredReadings = await ReadingsService.getByUserFiltered(id, filters);

      const { favorites, totalReadPages, totalReviews } = await ProfileController.getBookDetails(allReadings);

      if (filteredReadings.length) {
        await ProfileController.getBookDetails(filteredReadings);
      }

      const lastHistory = await HistoriesService.getLastByUser(id);

      if (lastHistory) {
        const lastHistoryReading = await ReadingsService.getById(lastHistory.id_reading);

        if (lastHistoryReading) {
          const lastHistoryEdition = await EditionsService.getById(lastHistoryReading.id_edition);

          if (lastHistoryEdition) {
            lastHistoryEdition.cover = `https://covers.openlibrary.org/b/isbn/${lastHistoryEdition.isbn_13}-M.jpg?default=false`;
            lastHistoryReading.edition = lastHistoryEdition;
            lastHistory.reading = lastHistoryReading;
          }
        }
      }

      const infos: TProfileInfos = {
        allReadings,
        filteredReadings,
        totalReadPages,
        totalReviews,
        totalItems: allReadings.length,
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
        const edition = await EditionsService.getById(reading.id_edition);

        if (edition && edition.id) {
          edition.cover = `https://covers.openlibrary.org/b/isbn/${edition.isbn_13}-M.jpg?default=false`;

          reading.edition = edition;
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
