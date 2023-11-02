import { PartialType } from '@nestjs/swagger';
import { BoardInsertDto } from './board-insert.dto';

export class BoardModifyDto extends PartialType(BoardInsertDto) {}
