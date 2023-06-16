import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Watchlist } from './models/watchlist.model';
import { CreateAssetResponse } from './response';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist)
    private readonly watchlistRepository: typeof Watchlist,
  ) {}

  async createAsset(user, dto): Promise<CreateAssetResponse> {
    try {
      const watchlist = {
        user: user.id,
        name: dto.name,
        assetId: dto.assetId,
      };
      await this.watchlistRepository.create(watchlist);
      return watchlist;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteAsset(assetId: string, userId: number): Promise<boolean> {
    try {
      await this.watchlistRepository.destroy({
        where: { id: assetId, user: userId },
      });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}
