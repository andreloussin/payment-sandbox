import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponse } from '../dto/api-response.dto';

export const ApiOkResponseData = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponse, model),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ApiResponse),
          },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
