import { z, ZodSchema, ZodTypeDef } from 'zod'

export interface ZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
> {
  new (): TOutput
  isZodDto: true
  schema: ZodSchema<TOutput, TDef, TInput>
  create(input: unknown): TOutput
}

export function createZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(schema: ZodSchema<TOutput, TDef, TInput>) {
  class AugmentedZodDto {
    public static isZodDto = true
    public static schema = schema

    public static create(input: unknown) {
      return this.schema.parse(input)
    }
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>
}

export function isZodDto(metatype: any): metatype is ZodDto<unknown> {
  return metatype?.isZodDto
}

export const dateSchema = z.object({
  createdAt: z.number({
    required_error: '更新时间不能为空',
    invalid_type_error: '无效的日期格式',
  }),
  updatedAt: z.number({
    required_error: '更新时间不能为空',
    invalid_type_error: '无效的日期格式',
  }),
})

export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  pageSize: z.number().positive().default(10),
})

export interface PaginatedResponse<T> {
  list: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}
