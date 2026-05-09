import { envValidationSchema } from './env.validation';

describe('envValidationSchema', () => {
  const baseEnv = {
    NODE_ENV: 'development',
    PORT: 3000,
    DATABASE_URL: 'mongodb://localhost:27017/test',
    JWT_ACCESS_SECRET: 'secret',
  };

  it('should validate correct env', () => {
    const { error } = envValidationSchema.validate(baseEnv);

    expect(error).toBeUndefined();
  });

  it('should fail if DATABASE_URL is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { DATABASE_URL, ...env } = baseEnv;

    const { error } = envValidationSchema.validate(env);

    expect(error).toBeDefined();
  });

  it('should fail if JWT_ACCESS_SECRET is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { JWT_ACCESS_SECRET, ...env } = baseEnv;

    const { error } = envValidationSchema.validate(env);

    expect(error).toBeDefined();
  });

  it('should accept valid NODE_ENV values', () => {
    const environments = ['development', 'test', 'production'];

    environments.forEach((env) => {
      const result = envValidationSchema.validate({
        ...baseEnv,
        NODE_ENV: env,
      });

      expect(result.error).toBeUndefined();
    });
  });

  it('should apply default NODE_ENV if not provided', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { NODE_ENV, ...env } = baseEnv;

    const result = envValidationSchema.validate(env);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(result.value.NODE_ENV).toBe('development');
  });
});
