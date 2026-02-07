import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { PrismaService } from './prisma.service';
import { Inventory, Prisma } from '../../generated/prisma/client';

type Result<T, E = Error> = 
								| { ok: true; data: T }
								| { ok: false; error: E }

type AvailableRes = {
								sku: string;
								reserved: number;
								available: number;
								total: number;
}

@Injectable()
export class InventoryService {
								constructor(
																private prisma: PrismaService, 
																@Inject(CACHE_MANAGER) private cacheManager: Cache){}

								async setSKUCounters(sku: string, total: number, reserved: number) {
																const key = `inventory:${sku}:total`;
																const key2 = `inventory:${sku}:reserved`;

																const res = Promise.all([ 
																								this.cacheManager.set(key, total), 
																								this.cacheManager.set(key2, reserved) 
																]);

																const data = await res; 

																await res;	
								}


								async skuAvailability(sku: string): Promise<Result<AvailableRes, string>>{

																const key = `inventory:${sku}:total`;
																const key2 = `inventory:${sku}:reserved`;

																const res = Promise.all([ 
																								this.cacheManager.get(key), 
																								this.cacheManager.get(key2)
																]);

																const data = await res;

																if(!data.includes(undefined)) {
																								const [ total, reserved ] = data;

																								const available = Number(total) - Number(reserved);

																								console.log('From Redis with love')

																								return { ok: true, data: { 
																																sku, 
																																total: Number(total), 
																																reserved: Number(reserved), 
																																available 
																								}
																   }
																}
								

																const stock = await this.prisma.inventory.findUnique({
																																																where: {
																																																								sku: sku,
																																																},
																																								});
																if (!stock) {
																								return {ok: false, error: 'NOT FOUND' }
																}

																const { quantity:total, reserved } = stock;

																await this.setSKUCounters(sku, Number(total), Number(reserved));

																const available = Number(total) - Number(reserved);

																console.log('From Postgress with love')
																return { ok: true, data: { 
																								sku, 
																								total: Number(total), 
																								reserved: Number(reserved), 
																								available 
																}
																}
								}





}
