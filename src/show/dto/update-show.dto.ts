import { PartialType } from '@nestjs/swagger';
import { CreateShowDto } from './create-show.dto';

export class UpdateShowDto extends PartialType(CreateShowDto) {}
