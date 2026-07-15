# CarShop Backend Analysis

Base URL: `/api`. All successful responses use `{ success: true, data?: ... , message?: string }`; handled failures use `{ success: false, message }`.

## Authentication and authorization

JWTs are returned by login/register and must be sent as `Authorization: Bearer <token>`. `authMiddleware` returns 401 for a missing or invalid token. `adminMiddleware` returns 403 unless `req.user.role === "ADMIN"`. `/catalog` accepts a token optionally: invalid supplied tokens return 401, while no token is allowed. Registration assigns the ADMIN role only when its email exactly matches `ADMIN_EMAIL` (case-insensitive).

| Method | Endpoint | Auth / role | Inputs | Success response / behavior | Errors |
|---|---|---|---|---|---|
| POST | `/auth/register` | Public | `{name,email,password}` | 201, `{data:{user,token}}`; email must be unique | 400 duplicate/validation/database message |
| POST | `/auth/login` | Public | `{email,password}` | `{data:{user:{id,name,email,role},token}}` | 401 invalid credentials |
| GET | `/auth/me` | Any user | — | `{data:{id,name,email,role,created_at}}` | 401 token; 500 lookup failure |
| GET | `/brands` | Public | — | all brands (`id,name`) | 500 |
| GET | `/brands/:id` | Public | `id` | one brand | 404 |
| POST/PUT/DELETE | `/brands`, `/brands/:id` | ADMIN | POST/PUT `{name}` | created 201 / updated brand / delete message | 400 create/update; 404 delete |
| GET | `/models` | Public | — | all models including `brand_name` | 500 |
| GET | `/models/brand/:brandId` | Public | `brandId` | models for brand | 500 |
| GET | `/models/:id` | Public | `id` | one model | 404 |
| POST/PUT/DELETE | `/models`, `/models/:id` | ADMIN | POST/PUT `{name,brandId}` | created/updated model / delete message | 400 create/update; 404 delete |
| GET | `/variants` | Public | — | variants including model and brand fields | 500 |
| GET | `/variants/model/:modelId` | Public | `modelId` | variants for model | 500 |
| GET | `/variants/:id` | Public | `id` | one variant | 404 |
| POST/PUT/DELETE | `/variants`, `/variants/:id` | ADMIN | POST/PUT `{name,modelId}` | created/updated variant / delete message | 400 create/update; 404 delete |
| GET | `/catalog` | Optional JWT | query: `page`, `limit`, `search`, `categoryId`, `minPrice`, `maxPrice`, `sort` (`price` only), `order`, `savedCarId` comma-separated | `{data:{products,pagination:{page,limit,total,totalPages}}}`. Products include category and ordered `images` | 400 invalid saved car/filter |
| GET | `/catalog/:id` | Public | `id` | product with category and images | 404 |
| GET | `/products` | ADMIN | same filtering as catalog plus `brandId`, `modelId`, `variantId` | `{data:products,pagination:{page,limit,total,totalPages,hasNext,hasPrevious}}` | 500 |
| GET | `/products/:id` | ADMIN | `id` | product with `images` and `compatibleCars` | 404 |
| POST | `/products` | ADMIN | `{name,description,price}` | 201 created product | 400 duplicate/error |
| PUT | `/products/:id` | ADMIN | `{name,description,price,isActive}` | updated product | 400. `imageUrl` is accepted by controller but ignored by repository |
| DELETE | `/products/:id` | ADMIN | `id` | delete message | 404 |
| POST | `/products/:id/images` | ADMIN | multipart field `images`, max 10, each image <=5MB | 201 uploaded Cloudinary image rows | 400 invalid product/upload. No delete, reorder, or primary-image API exists |
| GET | `/products/:productId/compatibility` | Public | `productId` | compatible variants with vehicle names | 404 |
| POST | `/products/:productId/compatibility` | ADMIN | `{variantIds:[id,...]}` | add non-duplicate fitments | 400 product/variant error |
| DELETE | `/products/:productId/compatibility/:variantId` | ADMIN | IDs | removal message | controller incorrectly uses HTTP **400** for failures (not 404) |
| GET | `/my-cars` | CUSTOMER or ADMIN | — | caller’s saved cars with brand/model/variant fields | 500 |
| POST | `/my-cars` | Any user | `{variantId,nickname?}` | 201 saved-car row | 400 missing variant/duplicate |
| PUT | `/my-cars/:id` | Owner | `{variantId,nickname}` | updated saved-car row | 400 including unauthorized/not found |
| DELETE | `/my-cars/:id` | Owner | `id` | deletion message | 400 including unauthorized/not found |
| GET | `/campaigns` | ADMIN | — | campaigns ordered newest first | no controller error wrapper |
| POST | `/campaigns` | ADMIN | `{title,subject,content,productIds}` | 201 campaign | 400 (campaign is created before an invalid product is discovered; no transaction) |
| GET | `/campaigns/:id` | ADMIN | `id` | campaign plus `products:[{id,name,price}]` | 404 |
| DELETE | `/campaigns/:id` | ADMIN | `id` | deletion message | 404 |
| GET | `/campaigns/:id/users` | ADMIN | `id` | distinct users who saved a vehicle compatible with a campaign product | 404 |
| POST | `/campaigns/:id/send` | ADMIN | `id` | queues one email job per eligible user and returns count in message | 400 |

## Entity relationships and business rules

`car_brands → car_models → car_variants`; each variant can be saved by users and assigned to products through `product_compatibility`. Products have optional categories, many images, and many compatibility variants. Saved cars are unique per `(user, variant)` and can be used as the `savedCarId` catalog filter only by their owner. Campaigns have many products through `campaign_products`; eligibility is inferred from compatibility and saved cars. Product listing exposes only price sorting. Catalog does not filter `is_active`, so inactive products remain visible.

## Backend gaps / implementation notes

- There is a `categories` table but no category controller, service, repository, or route. Category CRUD and a category picker cannot be implemented without inventing APIs.
- Product create/update do not accept or persist `categoryId`, despite list responses exposing categories.
- The `/api/users` route is not mounted: `userRoutes.js` registers handlers on a separate Express app rather than its exported router. It is unreachable.
- Campaign `created_by` is never populated; campaigns have no author attribution.
- Product images support upload only: primary selection, deletion, and ordering are not implemented by the backend.
- Product detail is deliberately served by public `/catalog/:id`; admin `/products/:id` additionally includes compatibility data.
