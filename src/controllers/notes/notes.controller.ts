import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Request,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotesService } from '../../services/notes/notes.service';
import { Request as ExpressRequest } from 'express';
import { CreateNotesDto, ShareNoteDto } from 'src/models/dto/notes/notes.dto';

interface Request extends ExpressRequest {
  user: any;
}

@ApiTags('Notes APIs')
@Controller('api/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAllNotes(@Req() req: Request) {
    const userId = req.user.userId;
    return await this.notesService.getAllNotesForUser(userId);
  }

  @Get('search')
  async searchNotes(@Req() req: Request, @Query('q') query: string) {
    const userId = req.user.userId;
    return await this.notesService.searchNotesForUser(query, userId);
  }

  @Get(':id')
  async getNoteById(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.userId;
    return await this.notesService.getNoteByIdForUser(id, userId);
  }

  @Post()
  async createNote(@Req() req: Request, @Body() noteData: CreateNotesDto) {
    const userId = req.user.userId;
    return await this.notesService.createNoteForUser(noteData, userId);
  }

  @Put(':id')
  async updateNote(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() noteData: CreateNotesDto,
  ) {
    const userId = req.user.userId;
    return await this.notesService.updateNoteForUser(id, noteData, userId);
  }

  @Delete(':id')
  async deleteNote(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.userId;
    return await this.notesService.deleteNoteForUser(id, userId);
  }

  @Post(':id/share')
  async shareNote(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() shareData: ShareNoteDto,
  ) {
    const userId = req.user.userId;
    return await this.notesService.shareNoteWithUser(id, shareData, userId);
  }
}
