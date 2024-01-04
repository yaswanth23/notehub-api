// big-int-serializer.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class BigIntSerializerPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object') {
      return value;
    }

    try {
      const serialized = JSON.stringify(value, (key, val) =>
        typeof val === 'bigint' ? val.toString() : val,
      );
      return JSON.parse(serialized);
    } catch (err) {
      throw new BadRequestException('Error serializing object with BigInt');
    }
  }
}
