import { applyDecorators, HttpStatus, SetMetadata } from '@nestjs/common';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { IDocOptions, IDocResponseOptions } from './doc.interface';
import { AppResponseSerialization } from './response.serialization';

export const RESPONSE_DOCS_METADATA = 'RESPONSE_DOCS_METADATA';

function applyCommonDecorators<T>(options?: IDocOptions<T>): MethodDecorator[] {
  const decorators: MethodDecorator[] = [];
  decorators.push(ApiConsumes(getContentType(options?.request?.bodyType)));
  decorators.push(ApiProduces('application/json'));
  decorators.push(DocDefault(options?.response || {}));

  return decorators;
}

function applyParamDecorators<T>(options?: IDocOptions<T>): MethodDecorator[] {
  const decorators: MethodDecorator[] = [];

  if (options?.request?.getWorkspaceId) {
    decorators.push(
      ApiHeader({
        name: 'X-Workspace-Id',
        description: 'Workspace ID',
        required: true,
      }),
    );
  }

  if (options?.request?.params?.length) {
    decorators.push(...options.request.params.map(ApiParam));
  }

  if (options?.request?.queries?.length) {
    decorators.push(...options.request.queries.map(ApiQuery));
  }

  return decorators;
}

function applyOperationDecorators<T>(
  options?: IDocOptions<T>,
): MethodDecorator[] {
  const decorators: MethodDecorator[] = [];

  if (options?.description || options?.summary) {
    decorators.push(
      ApiOperation({
        description: options.description,
        summary: options.summary,
      }),
    );
  }

  return decorators;
}

export function Doc<T>(options?: IDocOptions<T>): MethodDecorator {
  const decorators: MethodDecorator[] = [];

  decorators.push(...applyCommonDecorators(options));
  decorators.push(...applyParamDecorators(options));
  decorators.push(...applyOperationDecorators(options));
  decorators.push(SetMetadata(RESPONSE_DOCS_METADATA, true));

  return applyDecorators(...decorators);
}

function getContentType(bodyType?: 'FORM_DATA' | 'JSON'): string {
  return bodyType === 'FORM_DATA' ? 'multipart/form-data' : 'application/json';
}

function DocDefault<T>({
  dataSchema,
  description,
  extraModels = [],
  isArray = false,
  httpStatus = HttpStatus.OK,
  serialization,
}: Omit<IDocResponseOptions<T>, 'messageExample'>): MethodDecorator {
  const decorators: MethodDecorator[] = [];

  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(AppResponseSerialization<T>) }],
  };

  if (dataSchema) {
    Object.assign(schema, dataSchema);
  } else if (serialization) {
    decorators.push(ApiExtraModels(serialization));
    if (isArray) {
      Object.assign(schema, {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(serialization) },
          },
        },
      });
    } else {
      Object.assign(schema, {
        $ref: getSchemaPath(serialization),
      });
    }
  }

  decorators.push(ApiExtraModels(AppResponseSerialization<T>));
  extraModels.forEach((model) => {
    if (model) {
      decorators.push(ApiExtraModels(model));
    }
  });

  decorators.push(
    ApiResponse({
      description,
      status: httpStatus,
      schema,
    }),
  );

  return applyDecorators(...decorators);
}
