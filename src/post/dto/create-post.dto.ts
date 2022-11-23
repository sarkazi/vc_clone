import { Min, Length, isString, isArray, IsOptional } from 'class-validator';

export type BlockToolData<T extends object = any> = T;

export interface OutputBlockData<
  Type extends string = string,
  Data extends object = any,
> {
  id?: string;
  type: Type;
  data: BlockToolData<Data>;
}

export class CreatePostDto {
  title: string;
  body: OutputBlockData[];
  @IsOptional()
  tags?: string;
  imageUrl?: string;
}
