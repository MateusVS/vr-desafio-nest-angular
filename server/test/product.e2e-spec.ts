import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../src/modules/products/entity/product.entity';
import { Store } from '../src/modules/stores/entity/store.entity';
import { ProductStore } from '../src/modules/products/entity/product-store.entity';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let productRepository: Repository<Product>;
  let storeRepository: Repository<Store>;
  let productStoreRepository: Repository<ProductStore>;
  let store: Store;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    productRepository = moduleFixture.get(getRepositoryToken(Product));
    storeRepository = moduleFixture.get(getRepositoryToken(Store));
    productStoreRepository = moduleFixture.get(
      getRepositoryToken(ProductStore),
    );

    store = await storeRepository.save({
      description: 'Test Store',
    });
  });

  afterAll(async () => {
    await productStoreRepository.delete({});
    await productRepository.delete({});
    await storeRepository.delete({});
    await app.close();
  });

  describe('/products', () => {
    const createProductDTO = {
      description: 'Test Product',
      cost: 10.5,
      productsStores: [
        {
          storeId: null,
          salePrice: 15.5,
        },
      ],
    };

    let createdProduct: any;

    beforeEach(() => {
      createProductDTO.productsStores[0].storeId = store.id;
    });

    it('POST / should create a new product', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDTO)
        .expect(201);

      createdProduct = response.body;

      expect(createdProduct).toBeDefined();
      expect(createdProduct.description).toBe(createProductDTO.description);
      expect(createdProduct.cost).toBe(createProductDTO.cost);
      expect(createdProduct.productStores).toHaveLength(1);
      expect(createdProduct.productStores[0].salePrice).toBe(
        createProductDTO.productsStores[0].salePrice,
      );
    });

    it('GET / should return paginated products', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body.items).toBeDefined();
      expect(response.body.meta).toBeDefined();
      expect(Array.isArray(response.body.items)).toBeTruthy();
    });

    it('GET / should filter products', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ description: 'Test' })
        .expect(200);

      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(response.body.items[0].description).toContain('Test');
    });

    it('GET /:id should return a specific product', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${createdProduct.id}`)
        .expect(200);

      expect(response.body.id).toBe(createdProduct.id);
      expect(response.body.description).toBe(createdProduct.description);
    });

    it('PUT /:id should update a product', async () => {
      const updateData = {
        description: 'Updated Test Product',
        cost: 11.5,
        productStores: [
          {
            storeId: store.id,
            salePrice: 16.5,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .put(`/products/${createdProduct.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.description).toBe(updateData.description);
      expect(response.body.cost).toBe(updateData.cost);
      expect(response.body.productStores[0].salePrice).toBe(
        updateData.productStores[0].salePrice,
      );
    });

    it('DELETE /:id should remove a product', async () => {
      await request(app.getHttpServer())
        .delete(`/products/${createdProduct.id}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/products/${createdProduct.id}`)
        .expect(404);
    });
  });

  describe('Validation tests', () => {
    it('should fail to create product without description', async () => {
      const invalidProduct = {
        cost: 10.5,
        productsStores: [
          {
            storeId: store.id,
            salePrice: 15.5,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(invalidProduct)
        .expect(400);

      expect(response.body.message).toContain('description');
    });

    it('should fail to create product without productsStores', async () => {
      const invalidProduct = {
        description: 'Test Product',
        cost: 10.5,
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(invalidProduct)
        .expect(400);

      expect(response.body.message).toContain('productsStores');
    });

    it('should fail to update product with empty productStores array', async () => {
      const product = await productRepository.save({
        description: 'Test Product for Update',
        cost: 10.5,
      });

      await productStoreRepository.save({
        product,
        store,
        salePrice: 15.5,
      });

      const updateData = {
        description: 'Updated Test Product',
        productStores: [],
      };

      const response = await request(app.getHttpServer())
        .put(`/products/${product.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toContain('todos os preços das lojas');
    });
  });

  describe('Edge cases', () => {
    it('should handle non-existent product ID gracefully', async () => {
      const nonExistentId = 99999;
      await request(app.getHttpServer())
        .get(`/products/${nonExistentId}`)
        .expect(404);
    });

    it('should handle invalid product ID format', async () => {
      await request(app.getHttpServer())
        .get('/products/invalid-id')
        .expect(400);
    });

    it('should handle duplicate store in productStores', async () => {
      const duplicateStoreProduct = {
        description: 'Test Product with Duplicate Store',
        productsStores: [
          {
            storeId: store.id,
            salePrice: 15.5,
          },
          {
            storeId: store.id,
            salePrice: 20.0,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(duplicateStoreProduct)
        .expect(409);

      expect(response.body.message).toContain('mesma loja');
    });
  });
});
