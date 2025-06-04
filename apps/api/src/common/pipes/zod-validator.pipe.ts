import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from '@repo/schemas';

@Injectable()
export class ZodValidatorPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown): unknown {
        const result = this.schema.safeParse(value);

        if (!result.success) {
            throw new BadRequestException(result.error);
        }

        return result.data;
    }
}
