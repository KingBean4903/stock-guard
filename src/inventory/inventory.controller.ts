import { Controller, Get,
								Body,
								NotFoundException,
								HttpException, HttpStatus,
								Patch, Put, Post, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {

								constructor(private service: InventoryService ) {}

								@Get('availability')
								async getSKUAvailability(@Query('sku') sku: string) { 

																const result = await this.service.skuAvailability(sku);

																if (!result.ok) {
																								throw new NotFoundException(result.error)
																}

																return result.data;
								}

								@Get()
								fetchAll(): string {
								
																return 'Paginated products'
								}

}
