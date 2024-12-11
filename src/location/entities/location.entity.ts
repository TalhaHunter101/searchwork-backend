import { Entity, Column, Point } from 'typeorm';
import { BaseEntity } from '../../common/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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

  @ApiProperty({ example: 'POINT(123.456 78.901)' })
  @IsNotEmpty()
  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  point: Point;

  @ApiProperty({ example: '12345' })
  @IsString()
  @Column({ nullable: true })
  zipCode: string;
}
