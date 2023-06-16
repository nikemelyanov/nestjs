import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class WatchlistDTO {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  assetId: string
}