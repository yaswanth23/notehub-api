import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { IdGeneratorService } from '../../services/idGenerator/idgenerator.service';
import { SignUpDto, LoginDto } from '../../models/dto/auth/auth.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, IdGeneratorService, PrismaService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should create a user', async () => {
    const result = {
      statusCode: 201,
      message: 'User created successfully.',
      data: { userId: 1 },
    };

    const signUpDto: SignUpDto = {
      userName: 'test',
      emailId: 'test@mail.com',
      password: 'test',
    };

    jest
      .spyOn(authService, 'signUp')
      .mockImplementation(() => Promise.resolve(result));

    expect(await authController.signUp(signUpDto)).toBe(result);
  });

  it('should throw an exception if user already exists', async () => {
    const signUpDto: SignUpDto = {
      userName: 'test',
      emailId: 'test@mail.com',
      password: 'test',
    };

    jest.spyOn(authService, 'signUp').mockImplementation(() => {
      throw new HttpException(
        'Email Id already exists.',
        HttpStatus.BAD_REQUEST,
      );
    });

    await expect(authController.signUp(signUpDto)).rejects.toThrow(
      'Email Id already exists.',
    );
  });

  it('should log in a user', async () => {
    const result = {
      statusCode: 200,
      message: 'User logged in successfully.',
      data: {
        userId: BigInt(1),
        userName: 'test',
        accessToken: 'access-token',
      },
    };

    const loginDto: LoginDto = {
      emailId: 'test@mail.com',
      password: 'test',
    };

    jest
      .spyOn(authService, 'login')
      .mockImplementation(() => Promise.resolve(result));

    expect(await authController.login(loginDto)).toBe(result);
  });

  it('should throw an exception if login credentials are invalid', async () => {
    const loginDto: LoginDto = {
      emailId: 'test@mail.com',
      password: 'wrong-password',
    };

    jest.spyOn(authService, 'login').mockImplementation(() => {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    });

    await expect(authController.login(loginDto)).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
