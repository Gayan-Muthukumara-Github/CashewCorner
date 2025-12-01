# Cashew Corner Frontend - Project Structure & Routing

## 📁 Project Structure

```
src/app/
├── app.component.ts           # Root component with router-outlet
├── app.config.ts              # Application configuration (providers, routing)
├── app.routes.ts              # Main routing configuration (lazy-loaded modules)
│
├── core/                      # Core module (singleton services)
│   ├── core.module.ts
│   └── guards/                # Route guards
│       ├── auth.guard.ts      # Protects admin routes (requires login)
│       └── login.guard.ts     # Prevents access to login if already logged in
│
├── features/                  # Feature modules (lazy-loaded)
│   ├── admin/                 # Admin feature module
│   │   ├── admin.module.ts
│   │   ├── admin-routing.module.ts
│   │   └── pages/
│   │       ├── admin-layout.component.ts
│   │       ├── admin-dashboard.component.ts
│   │       └── admin-login.component.ts
│   │
│   └── customer/              # Customer feature module
│       ├── customer.module.ts
│       ├── customer-routing.module.ts
│       └── pages/
│           ├── customer-layout.component.ts
│           ├── about.component.ts
│           ├── contact.component.ts
│           └── track-order.component.ts
│
└── shared/                    # Shared components/modules
    ├── shared.module.ts
    └── components/
        └── placeholder.component.ts
```

## 🛣️ Routing Structure

### Main App Routes (`app.routes.ts`)

```
/ (root)
├── redirects to: /customer
│
├── /admin
│   └── lazy loads: AdminModule
│
├── /customer
│   └── lazy loads: CustomerModule
│
└── ** (wildcard)
    └── redirects to: /customer
```

### Admin Module Routes (`admin-routing.module.ts`)

```
/admin
├── /admin/login
│   └── AdminLoginComponent (LoginGuard - redirects if already logged in)
│
└── AdminLayoutComponent (AuthGuard - requires authentication)
    ├── /admin (empty path)
    │   └── AdminDashboardComponent
    │
    ├── /admin/transactions
    │   └── PlaceholderComponent
    │
    ├── /admin/customers
    │   └── PlaceholderComponent
    │
    ├── /admin/reports
    │   └── PlaceholderComponent
    │
    └── /admin/settings
        └── PlaceholderComponent
```

### Customer Module Routes (`customer-routing.module.ts`)

```
/customer
└── CustomerLayoutComponent
    ├── /customer (empty path)
    │   └── redirects to: /customer/about
    │
    ├── /customer/about
    │   └── AboutComponent
    │
    ├── /customer/contact
    │   └── ContactComponent
    │
    └── /customer/track-order
        └── TrackOrderComponent
```

## 🏗️ Architecture Patterns

### 1. **Feature-Based Module Organization**
- Each feature (admin, customer) is a separate module
- Features are lazy-loaded for better performance
- Each feature has its own routing module

### 2. **Standalone Components**
- All components are standalone (Angular 17+ style)
- Components import their own dependencies
- No need for NgModule declarations

### 3. **Layout Components**
- Each feature has a layout component that wraps child routes
- `AdminLayoutComponent`: Contains sidebar navigation
- `CustomerLayoutComponent`: Contains header, footer, and navigation

### 4. **Lazy Loading**
- Feature modules are lazy-loaded using `loadChildren`
- Reduces initial bundle size
- Improves application startup time

### 5. **Shared Components**
- Reusable components in `shared/` directory
- `PlaceholderComponent`: Used for "coming soon" pages
- Exported through `SharedModule` (though components are standalone)

## 📋 Route Details

### Admin Routes
| Path | Component | Guard | Description |
|------|-----------|-------|-------------|
| `/admin/login` | AdminLoginComponent | LoginGuard | Admin login page (redirects to dashboard if already logged in) |
| `/admin` | AdminDashboardComponent | AuthGuard | Admin dashboard (requires authentication) |
| `/admin/transactions` | PlaceholderComponent | AuthGuard | Transactions page (placeholder, requires authentication) |
| `/admin/customers` | PlaceholderComponent | AuthGuard | Customers page (placeholder, requires authentication) |
| `/admin/reports` | PlaceholderComponent | AuthGuard | Reports page (placeholder, requires authentication) |
| `/admin/settings` | PlaceholderComponent | AuthGuard | Settings page (placeholder, requires authentication) |

**Authentication:**
- Default credentials: `admin` / `admin123`
- Token stored in localStorage as `adminToken`
- Username stored in localStorage as `adminUser`
- All admin routes (except login) are protected by `AuthGuard`
- Login page is protected by `LoginGuard` (prevents access if already logged in)

### Customer Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/customer` | Redirects to `/customer/about` | Default route |
| `/customer/about` | AboutComponent | About page |
| `/customer/contact` | ContactComponent | Contact page |
| `/customer/track-order` | TrackOrderComponent | Track order page |

## 🔧 Key Configuration Files

### `app.config.ts`
- Configures Angular application providers
- Sets up router with routes
- Configures server-side rendering (SSR) with hydration

### `app.routes.ts`
- Defines top-level routes
- Lazy loads feature modules
- Sets default route to `/customer`
- Wildcard route redirects to `/customer`

## 🎨 Component Architecture

### Layout Components
- **AdminLayoutComponent**: 
  - Sidebar navigation
  - Responsive design (collapsible sidebar)
  - Router outlet for child routes

- **CustomerLayoutComponent**:
  - Header with navigation
  - Footer with links and information
  - Router outlet for child routes
  - Shopping cart button

### Feature Components
- All feature-specific components are in `pages/` directory
- Components are standalone
- Use RouterLink and RouterLinkActive for navigation

## 📦 Module Structure

### AdminModule
```typescript
- Imports: CommonModule, AdminRoutingModule
- Components: AdminLayoutComponent, AdminDashboardComponent
- Uses: RouterModule (via routing module)
```

### CustomerModule
```typescript
- Imports: CommonModule, ReactiveFormsModule, RouterModule
- Components: CustomerLayoutComponent, AboutComponent, ContactComponent, TrackOrderComponent
- Uses: RouterModule (via routing module)
```

### SharedModule
```typescript
- Imports: CommonModule
- Exports: PlaceholderComponent
- Purpose: Shared reusable components
```

## 🚀 Navigation Flow

1. **Root Route (`/`)**: Redirects to `/customer`
2. **Customer Routes**: Accessible via `/customer/*`
3. **Admin Routes**: Accessible via `/admin/*`
4. **Default Route**: `/customer` redirects to `/customer/about`

## 🔄 Lazy Loading Strategy

- **Admin Module**: Loaded when user navigates to `/admin`
- **Customer Module**: Loaded when user navigates to `/customer` (or root)
- Reduces initial bundle size
- Improves application performance

## 🔐 Authentication

### Admin Authentication
- **Login Page**: `/admin/login`
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin123`
- **Authentication Guards**:
  - `AuthGuard`: Protects admin routes, redirects to login if not authenticated
  - `LoginGuard`: Prevents access to login page if already authenticated
- **Token Storage**: Uses localStorage (`adminToken`, `adminUser`)
- **Logout**: Available via user menu in admin layout header

### Authentication Flow
1. User navigates to `/admin` → `AuthGuard` checks for token
2. If no token → Redirect to `/admin/login?returnUrl=/admin`
3. User logs in → Token stored in localStorage
4. Redirect to returnUrl or `/admin` dashboard
5. User can logout via user menu → Clears token and redirects to login

## 📝 Notes

- All components are standalone (Angular 17+ pattern)
- Routing uses Angular Router with lazy loading
- Layout components provide consistent UI structure
- Placeholder components used for future features
- SSR (Server-Side Rendering) is configured
- Responsive design implemented in layout components
- Admin routes are protected with authentication guards
- Login functionality includes form validation and error handling
- User menu in admin layout provides logout functionality

