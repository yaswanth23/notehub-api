import { Module } from '@nestjs/common';
import { AuthController } from '../../controllers/auth/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IdGeneratorService } from '../../services/idGenerator/idgenerator.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, IdGeneratorService],
  imports: [PrismaModule],
})
export class AuthModule {}
