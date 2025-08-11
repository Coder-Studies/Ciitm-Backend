import { jest } from '@jest/globals';

// Mock dependencies before imports
jest.unstable_mockModule('../Auth.model.mjs', () => {
  const mockInstance = {
    hashPassword: jest.fn().mockResolvedValue('hashed-password'),
    hashEmail: jest.fn().mockResolvedValue('hashed-email'),
    comparePassword: jest.fn(), // will be used in login
  };
  return {
    default: jest.fn(() => mockInstance), // class instance
  };
});

// Mock constants
jest.unstable_mockModule('../Auth.constant.mjs', () => ({
  default: {
    HASH_FAILED: 'HASH_FAILED',
    USER_NOT_CREATED: 'USER_NOT_CREATED',
    USER_LOGIN_FAILED: 'USER_LOGIN_FAILED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
  },
}));

// Dynamically import modules after mocking
const AuthService = (await import('../Auth.service.mjs')).default;
const AuthenticationSchema = (await import('../Auth.model.mjs')).default;
const AuthConstant = (await import('../Auth.constant.mjs')).default;

// Test suite
describe('AuthService', () => {
  let mockInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Retrieve the mock instance from the constructor call
    mockInstance = new AuthenticationSchema();
  });

  // CREATE USER TESTS
  it('should create a user successfully', async () => {
    AuthenticationSchema.create = jest.fn().mockResolvedValue({ id: 1 });

    const result = await AuthService.CreateUser({
      name: 'John',
      email: 'john@example.com',
      password: '123456',
      role: 'user',
    });

    expect(mockInstance.hashPassword).toHaveBeenCalledWith('123456');
    expect(mockInstance.hashEmail).toHaveBeenCalledWith('john@example.com');
    expect(AuthenticationSchema.create).toHaveBeenCalledWith({
      provider_Name: 'John',
      name: 'John',
      email: 'john@example.com',
      email_verified: true,
      password: 'hashed-password',
      role: 'user',
    });
    expect(result).toEqual({
      CreatedUser: { id: 1 },
      HashEmail: 'hashed-email',
    });
  });

  it('should throw HASH_FAILED error when hashing fails', async () => {
    mockInstance.hashPassword.mockResolvedValue(null);
    mockInstance.hashEmail.mockResolvedValue(null);

    await expect(
      AuthService.CreateUser({
        name: 'John',
        email: 'john@example.com',
        password: '123456',
        role: 'user',
      })
    ).rejects.toThrow(AuthConstant.HASH_FAILED);
  });

  it('should throw USER_NOT_CREATED error when DB create fails', async () => {
    // Mock hash functions to succeed
    mockInstance.hashPassword.mockResolvedValue('hashed-password');
    mockInstance.hashEmail.mockResolvedValue('hashed-email');

    // Mock DB create to fail
    AuthenticationSchema.create.mockResolvedValue(null);

    await expect(
      AuthService.CreateUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      })
    ).rejects.toThrow(AuthConstant.USER_NOT_CREATED);
  });

  // LOGIN TESTS (PLACEHOLDERS)
  describe('Login User', () => {
    it('should login successfully with valid credentials', async () => {
      // - Mock AuthenticationSchema.findOne to return a user
      // - Mock comparePassword to return true
      // - Expect a token or success response
    });

    it('should throw USER_NOT_FOUND when no matching user exists', async () => {
      // - Expect AuthService.login(...) to throw USER_NOT_FOUND
    });

    it('should throw USER_LOGIN_FAILED when password is incorrect', async () => {
      // - Mock comparePassword to return false
      // - Expect AuthService.login(...) to throw USER_LOGIN_FAILED
    });
  });
});
