# Authentication System

This application uses Supabase for user authentication and data management. The authentication system handles both existing users and new user creation.

## Features

### User Authentication
- **Login**: Users can sign in with email and password
- **Registration**: New users can create accounts with name, email, and password
- **Auto-creation**: If a user logs in but doesn't exist in the interns table, a new profile is automatically created
- **Protected Routes**: Dashboard and Leaderboard require authentication

### User Data Management
- **Intern Profiles**: Each user gets an intern profile with fundraising data
- **Referral Codes**: Auto-generated unique referral codes for each user
- **Progress Tracking**: Track total raised, donation count, and join date

## How It Works

### Login Flow
1. User enters email and password
2. Supabase Auth validates credentials
3. If authentication succeeds:
   - Check if user exists in `interns` table
   - If not found, create new intern profile
   - Return user data to dashboard
4. If authentication fails, show error message

### Registration Flow
1. User enters name, email, and password
2. Create user account in Supabase Auth
3. Create intern profile in `interns` table
4. Redirect to dashboard

### Protected Routes
- Dashboard and Leaderboard are wrapped with `ProtectedRoute`
- Unauthenticated users are redirected to login
- Loading state shows while checking authentication

## Database Schema

### Interns Table
```sql
- id: string (primary key, matches auth.users.id)
- name: string
- email: string
- referral_code: string (auto-generated)
- total_raised: number
- donation_count: number
- join_date: string
- avatar: string | null
- created_at: string
- updated_at: string
```

### Rewards Table
```sql
- id: string (primary key)
- title: string
- description: string
- target_amount: number
- reward_text: string
- category: 'milestone' | 'achievement' | 'bonus'
- created_at: string
```

## API Functions

### AuthService
- `login(credentials)`: Authenticate user and get/create profile
- `register(userData)`: Create new user account and profile
- `getCurrentUser()`: Get authenticated user's data
- `signOut()`: Sign out user
- `isAuthenticated()`: Check if user is logged in

### SupabaseDataService
- `getAllInterns()`: Get all interns for leaderboard
- `getRewards()`: Get all rewards
- `updateInternRaised()`: Update user's total raised
- `addDonation()`: Add donation to user's profile

## Usage Examples

### Login
```typescript
const result = await authService.login({ 
  email: "user@example.com", 
  password: "password123" 
});

if (result.success) {
  // User logged in successfully
  console.log(result.user);
} else {
  // Handle error
  console.error(result.error);
}
```

### Registration
```typescript
const result = await authService.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});

if (result.success) {
  // User registered successfully
  console.log(result.user);
} else {
  // Handle error
  console.error(result.error);
}
```

### Get Current User
```typescript
const user = await authService.getCurrentUser();
if (user) {
  console.log("User is authenticated:", user.name);
} else {
  console.log("No authenticated user");
}
```

## Error Handling

The system handles various error scenarios:
- Invalid credentials
- User not found
- Network errors
- Database errors
- Authentication failures

All errors are displayed to users with appropriate messages and toast notifications.

## Security Features

- Password validation (minimum 6 characters)
- Email validation
- Protected routes
- Session management
- Secure password handling through Supabase Auth 