import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotesDto, ShareNoteDto } from 'src/models/dto/notes/notes.dto';
import { STATUS_CODES } from '../../constants';

@Injectable()
export class NotesService {
  constructor(private prismaService: PrismaService) {}

  async getAllNotesForUser(userId: string) {
    const data = await this.prismaService.note.findMany({
      where: {
        user_id: BigInt(userId),
      },
    });

    return {
      statusCode: STATUS_CODES.STATUS_CODE_200,
      message: 'success',
      data,
    };
  }

  async getNoteByIdForUser(id: string, userId: string) {
    const data = await this.prismaService.note.findUnique({
      where: {
        note_id: BigInt(id),
        user_id: BigInt(userId),
      },
    });

    return {
      statusCode: STATUS_CODES.STATUS_CODE_200,
      message: 'success',
      data,
    };
  }

  async createNoteForUser(noteData: CreateNotesDto, userId: string) {
    const data = await this.prismaService.note.create({
      data: {
        title: noteData.title,
        content: noteData.content,
        user_id: BigInt(userId),
        created_on: new Date().toISOString(),
        created_by: BigInt(userId),
      },
    });

    return {
      statusCode: STATUS_CODES.STATUS_CODE_200,
      message: 'success',
      data: {
        noteId: data.note_id,
      },
    };
  }

  async updateNoteForUser(
    noteId: string,
    noteData: CreateNotesDto,
    userId: string,
  ) {
    try {
      const data = await this.prismaService.note.update({
        where: {
          note_id: BigInt(noteId),
          user_id: BigInt(userId),
        },
        data: {
          title: noteData.title,
          content: noteData.content,
          updated_on: new Date().toISOString(),
          updated_by: BigInt(userId),
        },
      });

      return {
        statusCode: STATUS_CODES.STATUS_CODE_200,
        message: 'success',
        data: {
          noteId: data.note_id,
        },
      };
    } catch (error) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
  }

  async deleteNoteForUser(noteId: string, userId: string) {
    try {
      const data = await this.prismaService.note.delete({
        where: {
          note_id: BigInt(noteId),
          user_id: BigInt(userId),
        },
      });

      return {
        statusCode: STATUS_CODES.STATUS_CODE_200,
        message: 'Note deleted successfully',
        deletedNoteId: noteId,
      };
    } catch (error) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
  }

  async shareNoteWithUser(
    noteId: string,
    shareData: ShareNoteDto,
    userId: string,
  ) {
    const note = await this.prismaService.note.findUnique({
      where: {
        note_id: BigInt(noteId),
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        user_id: BigInt(shareData.sharedWithUserId),
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${shareData.sharedWithUserId} not found`,
      );
    }

    const existingShare = await this.prismaService.noteShare.findUnique({
      where: {
        note_id_user_id: {
          note_id: BigInt(noteId),
          user_id: BigInt(shareData.sharedWithUserId),
        },
      },
    });

    if (existingShare) {
      return {
        statusCode: STATUS_CODES.STATUS_CODE_409,
        message: 'Note has already been shared with this user',
      };
    }

    const data = await this.prismaService.noteShare.create({
      data: {
        note_id: BigInt(noteId),
        user_id: BigInt(shareData.sharedWithUserId),
      },
    });

    return {
      statusCode: STATUS_CODES.STATUS_CODE_200,
      message: 'success',
      data: {
        noteId: noteId,
      },
    };
  }

  async searchNotesForUser(query: string, userId: string) {
    const data = await this.prismaService.note.findMany({
      where: {
        user_id: BigInt(userId),
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
        ],
      },
    });

    return {
      statusCode: STATUS_CODES.STATUS_CODE_200,
      message: 'success',
      data,
    };
  }
}
