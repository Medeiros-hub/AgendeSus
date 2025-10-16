import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../../../src/modules/user/application/use-cases/create-user.use-case';
import { IUserRepository } from '../../../src/modules/user/domain/repositories/user-repository.interface';
import {
  User,
  UserType,
} from '../../../src/modules/user/domain/entities/user.entity';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCpf: jest.fn(),
      existsByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    mockUserRepository = module.get('IUserRepository');
  });

  it('should create a user successfully', async () => {
    // Arrange
    const createUserRequest = {
      cpf: '12345678901',
      fullName: 'João da Silva',
      birthDate: '1990-01-01',
      phone: '11999999999',
      email: 'joao@test.com',
      password: 'senha123',
      type: UserType.CITIZEN,
    };

    const expectedUser = new User({
      id: 'some-uuid',
      cpf: '12345678901',
      fullName: 'João da Silva',
      birthDate: new Date('1990-01-01'),
      phone: '11999999999',
      email: 'joao@test.com',
      type: UserType.CITIZEN,
      createdAt: new Date(),
    });

    mockUserRepository.existsByCpf.mockResolvedValue(false);
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    mockUserRepository.create.mockResolvedValue(expectedUser);

    // Act
    const result = await useCase.execute(createUserRequest);

    // Assert
    expect(result.user).toBeDefined();
    expect(result.user.cpf).toBe('12345678901');
    expect(result.user.fullName).toBe('João da Silva');
    expect(mockUserRepository.existsByCpf).toHaveBeenCalledWith('12345678901');
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(
      'joao@test.com',
    );
    expect(mockUserRepository.create).toHaveBeenCalled();
  });

  it('should throw error if CPF already exists', async () => {
    // Arrange
    const createUserRequest = {
      cpf: '12345678901',
      fullName: 'João da Silva',
      birthDate: '1990-01-01',
      phone: '11999999999',
      email: 'joao@test.com',
      password: 'senha123',
    };

    mockUserRepository.existsByCpf.mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.execute(createUserRequest)).rejects.toThrow(
      'CPF já está em uso',
    );
  });

  it('should throw error if email already exists', async () => {
    // Arrange
    const createUserRequest = {
      cpf: '12345678901',
      fullName: 'João da Silva',
      birthDate: '1990-01-01',
      phone: '11999999999',
      email: 'joao@test.com',
      password: 'senha123',
    };

    mockUserRepository.existsByCpf.mockResolvedValue(false);
    mockUserRepository.existsByEmail.mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.execute(createUserRequest)).rejects.toThrow(
      'Email já está em uso',
    );
  });
});
