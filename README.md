# Quant-Dash

This directory contains the Next.js frontend for the Trading Bot dashboard. It provides a user interface to visualize trading performance, view trade history, and monitor real-time signals from the API.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- `pnpm` package manager. If you don't have it, install it globally:
  ```bash
  npm install -g pnpm
  ```

### Installation

1.  **Navigate to the dashboard directory:**
    ```bash
    cd /path/to/your/Trading_Bot/Quant-Dash
    ```

2.  **Install the dependencies using `pnpm`:**
    ```bash
    pnpm install
    ```

### Running the Development Server

1.  Make sure the [Trading Bot API](../api/README.md) is running.

2.  From the `Quant-Dash` directory, start the development server:
    ```bash
    pnpm dev
    ```

3.  Open your browser and navigate to `http://localhost:3000` to see the dashboard.

## Available Scripts

-   `pnpm dev`: Starts the development server.
-   `pnpm build`: Creates a production-ready build of the application.
-   `pnpm start`: Starts the application in production mode (requires a build first).
-   `pnpm lint`: Lints the codebase for potential errors.