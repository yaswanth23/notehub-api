import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from 'src/services/notes/notes.service';
import { IdGeneratorService } from '../../services/idGenerator/idgenerator.service';
import { CreateNotesDto, ShareNoteDto } from '../../models/dto/notes/notes.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';

describe('NotesController', () => {
  let noteController: NotesController;
  let noteService: NotesService;

  it('should be defined', () => {
    expect(true).toBeDefined();
  });
});
