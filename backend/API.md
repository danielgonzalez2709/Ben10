# API Ben 10 Omnitrix

## Autenticación

- El login devuelve un token JWT. Debes enviarlo en el header `Authorization` para acceder a rutas protegidas.
- Solo el usuario Ben10 (super usuario) puede marcar favoritos y activar aliens.

**Header de autenticación:**

```http
Authorization: Bearer <token>
```

---

## Usuarios

### Registro

- **POST** `/api/users/register`
- **Body:**

```json
{
  "username": "ben10",
  "password": "omnitrix"
}
```

- **Response:**

```json
{ "message": "Usuario registrado correctamente" }
```

### Login

- **POST** `/api/users/login`
- **Body:**

```json
{
  "username": "ben10",
  "password": "omnitrix"
}
```

- **Response:**

```json
{
  "message": "Login exitoso",
  "user": { "id": "...", "username": "ben10", "isSuperUser": true },
  "token": "<jwt>"
}
```

---

## Aliens

### Listar aliens

- **GET** `/api/aliens`
- **Query params opcionales:** `name`, `sort`, `order`
- **Response:**

```json
[
  { "id": "1", "name": "XLR8", ... }
]
```

### Obtener alien por ID

- **GET** `/api/aliens/:id`

### Crear alien

- **POST** `/api/aliens`
- **Body:**

```json
{
  "name": "Nuevo Alien",
  "image": "url",
  "stats": { "strength": 8, "speed": 7, "abilities": ["Fuerza", "Vuelo"] }
}
```

### Editar alien

- **PUT** `/api/aliens/:id`
- **Body:** (campos a modificar)

### Eliminar alien

- **DELETE** `/api/aliens/:id`

### Marcar como favorito (solo Ben10)

- **PUT** `/api/aliens/:id/favorite`
- **Headers:**

```http
Authorization: Bearer <token>
```

- **Response:**

```json
{ "id": "1", "name": "XLR8", "favorite": true }
```

### Activar alien (solo Ben10)

- **PUT** `/api/aliens/:id/activate`
- **Headers:**

```http
Authorization: Bearer <token>
```

- **Response:**

```json
{ "message": "Alien 1 activado por Ben10" }
```

---

## Comentarios

### Listar comentarios

- **GET** `/api/comments?alienId=...&sort=likes|date&order=asc|desc`

### Crear comentario

- **POST** `/api/comments`
- **Body:**

```json
{
  "alienId": "1",
  "userId": "...",
  "text": "¡Gran alien!"
}
```

### Editar comentario

- **PUT** `/api/comments/:id`
- **Body:** (campos a modificar)

### Eliminar comentario

- **DELETE** `/api/comments/:id`

### Marcar comentario como favorito (solo Ben10)

- **PUT** `/api/comments/:id/favorite`
- **Headers:**

```http
Authorization: Bearer <token>
```

- **Response:**

```json
{ "id": "c1", "favorite": true }
```

---

## Notas

- Todos los endpoints que modifican datos requieren autenticación.
- Solo Ben10 puede marcar favoritos y activar aliens.
- El token JWT se obtiene al hacer login y debe enviarse en cada request protegida.
