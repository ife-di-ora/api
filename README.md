# Item Management REST API

A simple Express.js REST API for managing items in an in-memory data store. Supports CRUD operations (Create, Read, Update, Delete) with input validation using Joi.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone or download this repository.
2. Navigate to the project directory:
   ```powershell
   cd "c:\Users\IG\Desktop\GOMYCODE\3MTT - SOFTWARE DEV\api"
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```

### Running the Server

Start the server with:

```powershell
node app.js
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

All item-related endpoints are prefixed with `/items`.

### 1. Get All Items

- **Endpoint:** `GET /items`
- **Response:**
  - `200 OK`: Returns all items.
  - `500`: No items exist.

### 2. Get One Item

- **Endpoint:** `GET /items/:id`
- **Params:**
  - `id` (integer): Item ID
- **Response:**
  - `200 OK`: Returns the item.
  - `400`: Item not found.

### 3. Add Item

- **Endpoint:** `POST /items`
- **Body:**
  ```json
  {
    "id": 1,
    "name": "Item Name",
    "description": "Item Description"
  }
  ```
- **Response:**
  - `200 OK`: Item added.
  - `400`: Validation error or duplicate ID.

### 4. Update Item

- **Endpoint:** `PUT /items/:id`
- **Params:**
  - `id` (integer): Item ID
- **Body:** Same as Add Item (ID must match URL param)
- **Response:**
  - `200 OK`: Item updated.
  - `400`: Validation error, item not found, or ID change attempt.

### 5. Delete Item

- **Endpoint:** `DELETE /items/:id`
- **Params:**
  - `id` (integer): Item ID
- **Response:**
  - `200 OK`: Item deleted.
  - `400`: Item not found.

## Error Handling

- All errors return a JSON response with a `message` field describing the error.
- Unknown routes return:
  ```json
  {
    "message": "Route not found",
    "path": "/your/requested/path"
  }
  ```

## Testing

- You can use [Postman](https://www.postman.com/) or VS Code's built-in REST Client (`tester.http`) to test the endpoints.
- A sample Postman collection is included: `REST API basics- CRUD, test & variable.postman_collection.json`

## Project Structure

```
app.js
package.json
controllers/
  itemController.js
routers/
  itemRouter.js
tester.http
REST API basics- CRUD, test & variable.postman_collection.json
```

## License

MIT
