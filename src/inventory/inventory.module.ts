import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import Keyv  from 'keyv';
import { CacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { createKeyv } from '@keyv/redis';
import { PrismaService } from './prisma.service';

@Module({
								imports: [CacheModule.registerAsync({
																useFactory: () => ({
																																ttl: 86400,
																																stores: [createKeyv('redis://redis:6379')],
																								}),
																}),
								],
								controllers: [InventoryController],
								providers: [InventoryService, PrismaService],
})

export class InventoryModule {}
