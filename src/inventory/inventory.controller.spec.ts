import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';
import  request  from 'supertest';
import { InventoryModule  } from './inventory.module';
import { INestApplication } from '@nestjs/common';
import { InventoryService } from './i'
describe('InventoryService', () => {

								let app: INestApplication;
								const SKU = 'SKU-80335072';

								beforeAll(async () => {
																const moduleFixture = await Test.createTestingModule({
																								imports: [InventoryModule]
																}).compile();


																app = moduleFixture.createNestApplication();
																await app.init();
								})

								afterAll(async () => {
																await app.close();
								})

								it('/GET fetchAll', async () => {
																const res  = await request(app.getHttpServer())
																																								.get('/inventory')
																																								.expect(200);
																																								
																expect(res.text).toBe('Paginated products')
								})

								it.skip('availability', async () => {
																const res = await request(app.getHttpServer())
																								.get('/inventory/availability?sku=SKU-80335072')
																								.expect(200)

																expect(res.body.total).toBe(355)

								})
								
})

