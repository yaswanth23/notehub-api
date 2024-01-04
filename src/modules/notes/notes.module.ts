import { Module } from '@nestjs/common';
import { NotesController } from '../../controllers/notes/notes.controller';
import { NotesService } from '../../services/notes/notes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
  imports: [PrismaModule],
})
export class NotesModule {}
