import Joi from 'joi';

export const envValidationSchema: Joi.ObjectSchema<Record<string, unknown>> =
  Joi.object({
    // NODE_ENV: Joi.string()
    //   .valid('development', 'test', 'production')
    //   .default('development'),
    //
    // PORT: Joi.number().default(3001),
    //
    // DATABASE_URL: Joi.string().required(),
    //
    // JWT_ACCESS_SECRET: Joi.string().required(),
    // JWT_REFRESH_SECRET: Joi.string().required(),
    //
    // REDIS_URL: Joi.string().required(),
    //
    // WEBHOOK_SECRET: Joi.string().required(),
  });
