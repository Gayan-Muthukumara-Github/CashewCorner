# Postman Collection Guide - Cashew Corner API

## Import the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select the `postman-collection.json` file
4. The collection will be imported with all endpoints organized by category

## Collection Structure

The collection includes **6 main categories**:

### 1. **Authentication**
- Login (saves JWT token automatically)
- Logout

### 2. **User Management**
- Create User
- Get All Users
- Update User
- Deactivate User
- Activate User

### 3. **Customer Management**
- Create Customer
- Get All Customers
- Get Customer by ID
- Search Customers
- Update Customer
- Delete Customer
- Get Customer Orders
- Get Customer Order Status

### 4. **Sales Order Management**
- Create Sales Order
- Get All Sales Orders
- Get Sales Order by ID
- Search Sales Orders

### 5. **Supplier Management**
- Create Supplier
- Get All Suppliers
- Get Supplier by ID
- Search Suppliers
- Update Supplier
- Delete Supplier
- Get Supplier Orders
- Get Supplier Ranking

### 6. **Purchase Order Management**
- Create Purchase Order
- Get All Purchase Orders
- Get Purchase Order by ID
- Search Purchase Orders

## How to Use

### Step 1: Start the Application
```bash
./gradlew bootRun
```
The server will start on `http://localhost:8080`

### Step 2: Login to Get JWT Token

1. Open the **Authentication > Login** request
2. The default credentials are already set:
   ```json
   {
     "email": "admin@cashewcorner.com",
     "password": "admin123"
   }
   ```
3. Click **Send**
4. The JWT token will be **automatically saved** to the collection variable `access_token`
5. All subsequent requests will use this token automatically

### Step 3: Test Other Endpoints

All other endpoints are now authenticated automatically. Simply:
1. Select any request from the collection
2. Modify the request body/parameters as needed
3. Click **Send**

## Collection Variables

The collection uses these variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `base_url` | API base URL | `http://localhost:8080` |
| `access_token` | JWT access token | Auto-set on login |
| `refresh_token` | JWT refresh token | Auto-set on login |

### To Change Base URL:
1. Click on the collection name
2. Go to **Variables** tab
3. Update `base_url` value
4. Save

## Sample Test Workflow

### 1. Authentication Flow
```
1. Login → Get JWT token (auto-saved)
2. Test protected endpoints
3. Logout → Invalidate token
```

### 2. Customer & Sales Order Flow
```
1. Create Customer → Get customer ID
2. Create Sales Order for that customer
3. Get Customer Orders → View all orders
4. Get Customer Order Status → Check order status
5. Search Customers by name
```

### 3. Supplier & Purchase Order Flow
```
1. Create Supplier → Get supplier ID
2. Create Purchase Order for that supplier
3. Get Supplier Orders → View all purchase orders
4. Get Supplier Ranking → View supplier performance
5. Search Suppliers by name
```

### 4. User Management Flow (Admin Only)
```
1. Login as admin
2. Create User → Add new user
3. Get All Users → View all users
4. Update User → Modify user details
5. Deactivate/Activate User → Manage user status
```

## Request Examples

### Create Customer
```json
POST /api/customers
{
  "name": "ABC Traders",
  "phone": "0777654321",
  "email": "abc@traders.lk",
  "address": "123 Main Street, Colombo",
  "type": "wholesale"
}
```

### Create Sales Order
```json
POST /api/sales-orders
{
  "customerId": 1,
  "orderDate": "2025-01-11",
  "deliveryDate": "2025-01-18",
  "items": [
    {
      "productId": 1,
      "quantity": 50,
      "unitPrice": 800.00
    }
  ]
}
```

### Create Supplier
```json
POST /api/suppliers
{
  "name": "Sunshine Cashews",
  "phone": "0771234567",
  "email": "info@sunshine.lk",
  "address": "789 Supplier Road, Galle",
  "contactPerson": "John Supplier",
  "paymentTerms": "Net 30"
}
```

### Create Purchase Order
```json
POST /api/purchase-orders
{
  "supplierId": 1,
  "orderDate": "2025-01-11",
  "expectedDate": "2025-01-25",
  "items": [
    {
      "productId": 1,
      "quantity": 100,
      "unitPrice": 450.00
    }
  ]
}
```

## Authentication & Authorization

### Role-Based Access Control

| Endpoint | ADMIN | MANAGER | USER |
|----------|-------|---------|------|
| Login/Logout | ✅ | ✅ | ✅ |
| Create User | ✅ | ❌ | ❌ |
| Update User | ✅ | ❌ | ❌ |
| Get Users | ✅ | ✅ | ❌ |
| Create Customer | ✅ | ✅ | ❌ |
| Update Customer | ✅ | ✅ | ❌ |
| Delete Customer | ✅ | ❌ | ❌ |
| View Customers | ✅ | ✅ | ✅ |
| Create Orders | ✅ | ✅ | ❌ |
| View Orders | ✅ | ✅ | ✅ |

### Test Users

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@cashewcorner.com | admin123 | ADMIN |
| techadmin | techadmin@cashewcorner.com | cashew@123 | ADMIN |
| manager | manager@cashewcorner.com | manager123 | MANAGER |
| user | user@cashewcorner.com | user123 | USER |

## Troubleshooting

### 401 Unauthorized Error
- **Cause**: Token expired or not set
- **Solution**: Run the Login request again to get a new token

### 403 Forbidden Error
- **Cause**: Insufficient permissions for the endpoint
- **Solution**: Login with a user that has the required role (e.g., ADMIN)

### 404 Not Found Error
- **Cause**: Resource doesn't exist or wrong ID
- **Solution**: Check if the ID exists by listing all resources first

### 409 Conflict Error
- **Cause**: Duplicate resource (email, phone, etc.)
- **Solution**: Use different values or update the existing resource

## Tips

1. **Auto-Save Tokens**: The Login request automatically saves tokens to collection variables
2. **Organized Structure**: Requests are organized by feature for easy navigation
3. **Pre-filled Examples**: All requests have example data pre-filled
4. **Search Functionality**: Use Postman's search to quickly find endpoints
5. **Environment Support**: You can create different environments (dev, staging, prod) by duplicating variables

## Quick Commands Reference

### cURL Equivalents

If you prefer cURL, here are some examples:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cashewcorner.com","password":"admin123"}'

# Create Customer (replace <JWT_TOKEN>)
curl -X POST http://localhost:8080/api/customers \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"ABC Traders","phone":"0777654321"}'

# Search Customers
curl -X GET "http://localhost:8080/api/customers/search?name=ABC" \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Create Sales Order
curl -X POST http://localhost:8080/api/sales-orders \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"orderDate":"2025-01-11","items":[{"productId":1,"quantity":50,"unitPrice":800.00}]}'
```

## Support

For issues or questions:
1. Check the application logs
2. Verify the database schema matches the entities
3. Ensure the server is running on port 8080
4. Check that JWT token is valid and not expired

---

**Happy Testing! 🚀**
