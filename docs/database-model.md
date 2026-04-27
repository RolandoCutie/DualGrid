# Modelado de Base de Datos — CubaWay

> Archivo editable. Actualiza los campos, relaciones o notas según evolucione el proyecto.

---

## Índice

- [Diagrama de Relaciones](#diagrama-de-relaciones)
- [Colecciones](#colecciones)
  - [Car (Vehículo)](#1-car--vehículo)
  - [CarModel (Modelo de Auto)](#2-carmodel--modelo-de-auto)
  - [Category (Categoría)](#3-category--categoría)
  - [Reserve (Reserva)](#4-reserve--reserva)
  - [Season (Temporada)](#5-season--temporada)
- [Relaciones entre colecciones](#relaciones-entre-colecciones)
- [Enums y valores fijos](#enums-y-valores-fijos)
- [Notas de diseño](#notas-de-diseño)

---

## Diagrama de Relaciones

```
┌─────────────┐        ┌──────────────┐
│   Category  │──────→ │   CarModel   │
│  (categoría)│ cars[] │ (modelo auto)│
└─────────────┘        └──────────────┘
       ▲ (por clave)
       │
┌──────┴──────┐        ┌──────────────┐
│     Car     │        │   Season     │
│ (vehículo)  │        │ (temporada)  │
└─────────────┘        └──────────────┘
       ▲ (por clave)
       │
┌──────┴──────┐
│   Reserve   │
│  (reserva)  │
└─────────────┘
```

> **Tipo de referencia:**
>
> - `Category.cars` → referencia real por `ObjectId` a `CarModel`
> - `Car.category` / `Reserve.carCategory` → clave string del enum `CarCategory` (referencia lógica a `Category`)
> - `Reserve.carModel` → string con el nombre del modelo (referencia lógica a `CarModel`)
> - `Season` → colección independiente, usada en `lib/season.ts` para calcular precios

---

## Colecciones

---

### 1. `Car` — Vehículo

> Archivo: `database/car.model.ts`
> Colección MongoDB: `cars`

| Campo                    | Tipo     | Req. | Default                                            | Restricciones               | Notas                                 |
| ------------------------ | -------- | ---- | -------------------------------------------------- | --------------------------- | ------------------------------------- |
| `_id`                    | ObjectId | Auto | —                                                  | —                           | ID interno de MongoDB                 |
| `brand`                  | String   | ✅   | —                                                  | trim                        | Marca del vehículo (ej. Toyota)       |
| `carModel`               | String   | ✅   | —                                                  | trim                        | Modelo del vehículo (ej. Corolla)     |
| `slug`                   | String   | Auto | `brand-carModel` generado                          | unique, lowercase, trim     | URL pública. Auto-generado al guardar |
| `category`               | String   | ✅   | `'ECONOMICO_MECANICO'`                             | enum `CarCategory`          | Clave de categoría (ver Enums)        |
| `transmission`           | String   | ✅   | —                                                  | `'automatic'` \| `'manual'` | Tipo de transmisión                   |
| `fuelType`               | String   | ✅   | —                                                  | trim                        | Tipo de combustible                   |
| `seats`                  | Number   | ✅   | —                                                  | min 1, max 20               | Número de asientos                    |
| `priceHighSeason`        | Number   | ✅   | —                                                  | min 0                       | Precio por día en temporada alta      |
| `priceExtremeHighSeason` | Number   | ❌   | `0`                                                | min 0                       | Precio en temporada extrema alta      |
| `fuelServicePrice`       | Number   | ❌   | `0`                                                | min 0                       | Precio del servicio de combustible    |
| `description`            | String   | ❌   | —                                                  | max 1000 chars, trim        | Descripción del vehículo              |
| `images`                 | String[] | ❌   | `[]`                                               | —                           | URLs de imágenes (Cloudinary)         |
| `pickupLocations`        | String[] | ❌   | `['Airport', 'Downtown Office', 'Hotel Delivery']` | —                           | Puntos de recogida disponibles        |
| `featured`               | Boolean  | ❌   | `false`                                            | —                           | Aparece destacado en la home          |
| `available`              | Boolean  | ❌   | `true`                                             | —                           | Visible/disponible para reservas      |
| `createdAt`              | Date     | Auto | —                                                  | —                           | Timestamps automáticos                |
| `updatedAt`              | Date     | Auto | —                                                  | —                           | Timestamps automáticos                |

---

### 2. `CarModel` — Modelo de Auto

> Archivo: `database/car-model.model.ts`
> Colección MongoDB: `carmodels`

| Campo                  | Tipo     | Req. | Default | Restricciones               | Notas                                    |
| ---------------------- | -------- | ---- | ------- | --------------------------- | ---------------------------------------- |
| `_id`                  | ObjectId | Auto | —       | —                           | ID interno de MongoDB                    |
| `name`                 | String   | ✅   | —       | trim                        | Nombre del modelo (ej. Corolla 2020)     |
| `slug`                 | String   | Auto | Auto    | unique, lowercase, trim     | Auto-generado desde `name` + transmisión |
| `brand`                | String   | ✅   | —       | trim                        | Marca del auto                           |
| `category`             | String   | ✅   | —       | trim                        | Categoría (texto libre, no enum aquí)    |
| `photo`                | String   | ❌   | `''`    | —                           | URL de la foto (Cloudinary)              |
| `fuelTankLiters`       | Number   | ✅   | —       | min 0                       | Capacidad del tanque en litros           |
| `passengerCapacity`    | Number   | ✅   | —       | min 1, max 20               | Capacidad de pasajeros                   |
| `largeLuggageCapacity` | Number   | ✅   | —       | min 0                       | Maletas grandes que caben                |
| `smallLuggageCapacity` | Number   | ✅   | —       | min 0                       | Maletas pequeñas que caben               |
| `kmPerLiter`           | Number   | ✅   | —       | min 0                       | Rendimiento de combustible (km/L)        |
| `transmission`         | String   | ✅   | —       | `'automatic'` \| `'manual'` | Tipo de transmisión                      |
| `createdAt`            | Date     | Auto | —       | —                           | Timestamps automáticos                   |
| `updatedAt`            | Date     | Auto | —       | —                           | Timestamps automáticos                   |

---

### 3. `Category` — Categoría

> Archivo: `database/category.model.ts`
> Colección MongoDB: `categories`

| Campo                    | Tipo       | Req. | Default                                            | Restricciones           | Notas                                       |
| ------------------------ | ---------- | ---- | -------------------------------------------------- | ----------------------- | ------------------------------------------- |
| `_id`                    | ObjectId   | Auto | —                                                  | —                       | ID interno de MongoDB                       |
| `commercialName`         | String     | ✅   | —                                                  | trim                    | Nombre comercial (ej. "Económico Mecánico") |
| `displayName`            | String     | ✅   | —                                                  | trim                    | Nombre visible al usuario en la UI          |
| `slug`                   | String     | Auto | Auto                                               | unique, lowercase, trim | Generado desde `commercialName`             |
| `categoryColor`          | String     | ❌   | `'#2563eb'`                                        | trim                    | Color hex para UI (badges, tarjetas)        |
| `included`               | String     | ❌   | `''`                                               | trim                    | Qué incluye la categoría — **ES**           |
| `includeden`             | String     | ❌   | `''`                                               | trim                    | Qué incluye la categoría — **EN**           |
| `additionalPayments`     | String     | ❌   | `''`                                               | trim                    | Pagos adicionales — **ES**                  |
| `additionalPaymentsen`   | String     | ❌   | `''`                                               | trim                    | Pagos adicionales — **EN**                  |
| `generalInformation`     | String     | ❌   | `''`                                               | trim                    | Información general — **ES**                |
| `generalInformationen`   | String     | ❌   | `''`                                               | trim                    | Información general — **EN**                |
| `cars`                   | ObjectId[] | ❌   | `[]`                                               | ref → `CarModel`        | Lista de modelos de auto en esta categoría  |
| `fuelType`               | String     | ✅   | —                                                  | trim                    | Tipo de combustible de esta categoría       |
| `airConditioning`        | Boolean    | ❌   | `true`                                             | —                       | ¿Incluye A/C?                               |
| `priceHighSeason`        | Number     | ✅   | —                                                  | min 0                   | Precio por día en temporada alta            |
| `priceExtremeHighSeason` | Number     | ❌   | `0`                                                | min 0                   | Precio en temporada extrema alta            |
| `fuelServicePrice`       | Number     | ❌   | `0`                                                | min 0                   | Precio del servicio de combustible          |
| `description`            | String     | ❌   | —                                                  | max 2000 chars, trim    | Descripción de la categoría — **ES**        |
| `descriptionen`          | String     | ❌   | `''`                                               | max 2000 chars, trim    | Descripción de la categoría — **EN**        |
| `images`                 | String[]   | ❌   | `[]`                                               | —                       | URLs de imágenes (Cloudinary)               |
| `pickupLocations`        | String[]   | ❌   | `['Airport', 'Downtown Office', 'Hotel Delivery']` | —                       | Puntos de recogida                          |
| `featured`               | Boolean    | ❌   | `false`                                            | —                       | Aparece destacada en la home                |
| `available`              | Boolean    | ❌   | `true`                                             | —                       | Visible/disponible al público               |
| `createdAt`              | Date       | Auto | —                                                  | —                       | Timestamps automáticos                      |
| `updatedAt`              | Date       | Auto | —                                                  | —                       | Timestamps automáticos                      |

---

### 4. `Reserve` — Reserva

> Archivo: `database/reserves.model.ts`
> Colección MongoDB: `reserves`

| Campo                 | Tipo     | Req. | Default      | Restricciones        | Notas                                             |
| --------------------- | -------- | ---- | ------------ | -------------------- | ------------------------------------------------- |
| `_id`                 | ObjectId | Auto | —            | —                    | ID interno de MongoDB                             |
| `reserveVoucher`      | String   | ❌   | —            | trim                 | Código de voucher de la reserva                   |
| `reserveType`         | String   | ✅   | `'car'`      | `'car'` \| `'hotel'` | Tipo de reserva                                   |
| `carModel`            | String   | ✅   | —            | trim                 | Nombre del modelo (string, no ObjectId ref)       |
| `carCategory`         | String   | ✅   | primer enum  | enum `CarCategory`   | Clave de categoría (referencia lógica a Category) |
| `totalPrice`          | Number   | ✅   | —            | min 0                | Precio total de la reserva                        |
| `fuelPrice`           | Number   | ❌   | `0`          | min 0                | Precio del combustible incluido                   |
| `pickupDate`          | Date     | ✅   | —            | —                    | Fecha de recogida del vehículo                    |
| `returnDate`          | Date     | ✅   | —            | —                    | Fecha de devolución                               |
| `reservationDate`     | Date     | ❌   | `new Date()` | —                    | Cuándo se creó la reserva                         |
| `confirmationDate`    | Date     | ❌   | —            | —                    | Cuándo fue confirmada por el admin                |
| `confirmed`           | Boolean  | ❌   | `false`      | —                    | Si la reserva está confirmada                     |
| `customerName`        | String   | ❌   | —            | trim                 | Nombre del cliente                                |
| `customerPhoneNumber` | String   | ❌   | —            | trim                 | Teléfono del cliente (WhatsApp)                   |
| `whatsappMessage`     | String   | ❌   | —            | trim                 | Mensaje enviado por WhatsApp al hacer la reserva  |
| `createdAt`           | Date     | Auto | —            | —                    | Timestamps automáticos                            |
| `updatedAt`           | Date     | Auto | —            | —                    | Timestamps automáticos                            |

---

### 5. `Season` — Temporada

> Archivo: `database/season.model.ts`
> Colección MongoDB: `seasons`

| Campo        | Tipo     | Req. | Default | Restricciones                | Notas                                              |
| ------------ | -------- | ---- | ------- | ---------------------------- | -------------------------------------------------- |
| `_id`        | ObjectId | Auto | —       | —                            | ID interno de MongoDB                              |
| `name`       | String   | ✅   | —       | trim                         | Nombre de la temporada (ej. "Navidad 2025")        |
| `type`       | String   | ✅   | —       | `'HIGH'` \| `'EXTREME_HIGH'` | Tipo de temporada; afecta qué precio se usa        |
| `startMonth` | Number   | ✅   | —       | 1–12                         | Mes de inicio                                      |
| `startDay`   | Number   | ✅   | —       | 1–31                         | Día de inicio                                      |
| `endMonth`   | Number   | ✅   | —       | 1–12                         | Mes de fin                                         |
| `endDay`     | Number   | ✅   | —       | 1–31                         | Día de fin                                         |
| `active`     | Boolean  | ❌   | `true`  | —                            | Si la temporada está activa para cálculo de precio |
| `createdAt`  | Date     | Auto | —       | —                            | Timestamps automáticos                             |
| `updatedAt`  | Date     | Auto | —       | —                            | Timestamps automáticos                             |

---

## Relaciones entre colecciones

| Desde      | Campo         | Tipo relación             | Hacia      | Mecanismo                                                              |
| ---------- | ------------- | ------------------------- | ---------- | ---------------------------------------------------------------------- |
| `Category` | `cars[]`      | 1 categoría → N CarModels | `CarModel` | `ObjectId` real con `ref: 'CarModel'`                                  |
| `Car`      | `category`    | N Cars → 1 Category       | `Category` | String enum `CarCategory` (referencia lógica, no ObjectId)             |
| `Reserve`  | `carCategory` | N Reservas → 1 Category   | `Category` | String enum `CarCategory` (referencia lógica)                          |
| `Reserve`  | `carModel`    | N Reservas → 1 CarModel   | `CarModel` | String con el nombre (referencia lógica, no ObjectId)                  |
| `Season`   | —             | Independiente             | Todas      | Leída en `lib/season.ts` para calcular si aplica precio alto o extremo |

> **⚠️ Nota importante:** Las referencias de `Car→Category`, `Reserve→Category` y `Reserve→CarModel` son **lógicas** (por string/enum), no por `ObjectId`. No se puede usar `.populate()` directamente en ellas. Si se necesita relacionar, hay que hacer una segunda query.

---

## Enums y valores fijos

### `CarCategory` (enum compartido entre `Car` y `Reserve`)

Definido en `app/constanst/constanst.ts`:

```
ECONOMICO_MECANICO
ECONOMICO_AUTOMATICO
MEDIO_MECANICO
MEDIO_AUTOMATICO
STANDARD
ALTO_STANDARD
PREMIUM_PLUS
LUJO
JEEP
JEEP_ALTO_STANDARD
MINIVAN
```

### `transmission`

Compartido entre `Car` y `CarModel`:

```
automatic
manual
```

### `ReserveType`

Definido en `reserves.model.ts`:

```
car
hotel
```

### `SeasonType`

Definido en `season.model.ts`:

```
HIGH           → usa priceHighSeason
EXTREME_HIGH   → usa priceExtremeHighSeason
```

---

## Notas de diseño

| Decisión                                                               | Motivo                                                                        |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `Car` y `Category` tienen campos de precio duplicados                  | Permite sobreescribir precio por vehículo individual sin cambiar la categoría |
| Los campos bilingües en `Category` usan sufijo `en` (ej. `includeden`) | Patrón manual de i18n para ES/EN sin librerías adicionales                    |
| `Reserve.carModel` es un String, no ObjectId                           | Facilita guardar reservas incluso si el modelo se elimina después             |
| `CarModel` y `Car` son colecciones separadas                           | `CarModel` = ficha técnica reutilizable; `Car` = unidad de flota disponible   |
| `Season` no referencia carros ni categorías                            | La temporada es global; el cálculo de precio se hace en `lib/season.ts`       |

---

<!-- AÑADIR NUEVAS TABLAS O CAMPOS AQUÍ -->
