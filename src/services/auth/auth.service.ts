import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, LoginDto } from '../../models/dto/auth/auth.dto';
import { IdGeneratorService } from '../idGenerator/idgenerator.service';
import { STATUS_CODES } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private idGeneratorService: IdGeneratorService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { userName, emailId, password } = signUpDto;

    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: emailId,
      },
    });

    if (userExists) {
      throw new HttpException(
        'Email Id already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = this.idGeneratorService.generateId();

    const saltRounds = 10;
    const saltKey = genSaltSync(saltRounds);
    const hashedKey = hashSync(password, saltKey);

    await this.prismaService.user.create({
      data: {
        user_id: userId,
        email: emailId,
        username: userName,
        created_on: new Date().toISOString(),
        created_by: userId,
      },
    });

    await this.prismaService.user_auth_passdetails.create({
      data: {
        user_id: userId,
        hashed_key: hashedKey,
        salt_key: saltKey,
        created_at: new Date().toISOString(),
      },
    });

    return {
      statusCode: STATUS_CODES.STATUS_CODE_201,
      message: 'User created successfully.',
      data: { userId: userId },
    };
  }

  async login(loginDto: LoginDto) {
    const { emailId, password } = loginDto;

    const userData = await this.prismaService.user.findFirst({
      where: {
        email: emailId,
      },
      include: {
        auth_details: true,
      },
    });

    if (!userData) {
      throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
    }

    const hashedPassword = hashSync(password, userData.auth_details.salt_key);

    if (hashedPassword !== userData.auth_details.hashed_key) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = jwt.sign(
      { userId: userData.user_id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    return {
      statusCode: STATUS_CODES.STATUS_CODE_200,
      message: 'User logged in successfully.',
      data: {
        userId: userData.user_id,
        userName: userData.username,
        accessToken: accessToken,
      },
    };
  }
}
