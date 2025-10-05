# Wallet Test Project

This project is a personal finance management application.

## Getting Started

Follow these steps to get your development environment up and running.

### 1. Clone the repository

First, clone the project repository to your local machine:

````bash
git clone [YOUR_REPOSITORY_URL]
cd wallet-test
Replace `[YOUR_REPOSITORY_URL]` with the actual URL of your Git repository.
Replace `[YOUR_REPOSITORY_URL]` with the actual URL of your Git repository.

### 2. Install Dependencies

This project uses `pnpm` as its package manager. If you don't have `pnpm` installed, you can install it globally:

```bash
npm install -g pnpm
# or
yarn global add pnpm
````

Once `pnpm` is installed, navigate to the project root and install the dependencies:

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root of the project by copying the `.env.example` file (if one exists). You will need to configure your database connection and authentication details in this file.

```bash
cp .env.example .env # If .env.example exists
```

**Example `.env` configuration (you may need to adjust this based on your actual setup):**

```env
# Database Configuration (for Drizzle ORM)
DATABASE_URL="postgresql://user:password@host:port/database"

BETTER_AUTH_SECRET="YOUR_AUTH_SECRET"

NEXT_PUBLIC_AUTH_BASE_URL="http://localhost:3000"
```

**Important:** Replace placeholder values (e.g., `YOUR_DATABASE_URL`, `YOUR_AUTH_SECRET`, etc.) with your actual credentials and settings. The `AUTH_SECRET` should be a long, random string.

### 4. Run Database Migrations

This project uses Drizzle ORM for database management. After configuring your `.env` file, run the migrations to set up your database schema:

```bash
npx drizzle-kit generate

npx drizzle-kit migrate
```

_Note: The exact command might vary if your `drizzle.config.ts` uses a different script or command. Please refer to your `package.json` for specific Drizzle commands if `drizzle-kit push:pg` doesn't work._

### 5. Start the Development Server

Once the dependencies are installed and the database is configured and migrated, you can start the development server:

```bash
pnpm dev
```

The application should now be running at `http://localhost:3000` (or the port specified in your `.env` or `next.config.js`).
