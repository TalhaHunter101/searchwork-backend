import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Point } from 'geojson';

@Entity()
export class Location extends BaseEntity {
  @ApiProperty({ example: 'New York' })
  @IsNotEmpty()
  @IsString()
  @Column()
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsNotEmpty()
  @IsString()
  @Column()
  state: string;

  @ApiProperty({ example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  @Column()
  address: string;

  // @Index({ spatial: true })
  // @Column({
  //   type: 'geometry',
  //   spatialFeatureType: 'Point',
  //   srid: 4326,
  //   nullable: true,
  // })
  // point: Point;

  @ApiProperty({ example: '12345' })
  @IsString()
  @Column({ nullable: true })
  zipCode: string;
}
