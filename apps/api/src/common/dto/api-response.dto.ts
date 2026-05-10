import { ApiProperty } from '@nestjs/swagger';

import { ApiResponseMeta } from './api-response-meta.dto';

export class ApiResponse<T> {
  @ApiProperty({
    example: true,
    description: 'Indicates whether the request succeeded',
  })
  success: boolean;

  @ApiProperty({
    example: 'success',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    description: 'Response payload',
  })
  data: T;

  @ApiProperty({
    required: false,
    nullable: true,
    example: null,
    description: 'Error details when request fails',
  })
  error?: unknown;

  @ApiProperty({
    type: ApiResponseMeta,
    description: 'Additional response metadata',
  })
  meta: ApiResponseMeta;
}
