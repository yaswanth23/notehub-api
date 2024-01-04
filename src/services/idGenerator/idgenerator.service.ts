import { Injectable } from '@nestjs/common';

@Injectable()
export class IdGeneratorService {
  private readonly epoch = process.env.EPOCH;
  private sequence = parseInt(process.env.SEQUENCE);
  private lastTimestamp = -1;
  private readonly machineId = process.env.MACHINE_ID;

  generateId(): number {
    let timestamp = this.currentTimestamp();

    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & 0xfff; // Increment sequence and wrap if necessary

      if (this.sequence === 0) {
        // Sequence overflow, wait for next millisecond
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const idBigInt =
      ((BigInt(timestamp) - BigInt(this.epoch)) << 22n) |
      (BigInt(this.machineId) << 12n) |
      BigInt(this.sequence);

    return Number(idBigInt);
  }

  private currentTimestamp(): number {
    return new Date().getTime();
  }

  private waitNextMillis(lastTimestamp: number): number {
    let timestamp = this.currentTimestamp();
    while (timestamp <= lastTimestamp) {
      timestamp = this.currentTimestamp();
    }
    return timestamp;
  }
}
