import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseMeta {
  @ApiProperty({
    example: '2026-05-08T14:38:15.919Z',
    description: 'ISO timestamp of the response',
  })
  timestamp: string;

  @ApiProperty({
    example: '/api/v1/resource',
    description: 'Request path',
  })
  path: string;

  @ApiProperty({
    example: 'GET',
    description: 'HTTP request method',
  })
  method: string;

  @ApiProperty({
    required: false,
    example: 'req_01JTQ0F8YJ6F7A3K8M2N4P5Q6R',
    description: 'Unique request identifier',
  })
  requestId?: string;

  @ApiProperty({
    required: false,
    example: 42,
    description: 'Request duration in milliseconds',
  })
  latencyMs?: number;

  @ApiProperty({
    required: false,
    example: '::1',
    description: 'Client IP address',
  })
  ip?: string;
}
