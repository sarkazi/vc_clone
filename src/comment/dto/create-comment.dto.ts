import { isNotEmpty } from 'class-validator';

export class CreateCommentDto {
  text: string;
  postId: number;
}
