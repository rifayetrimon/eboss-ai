# Eboss Pro Max 🚀

EBOSS Pro Max is more than just a software platform. It is a unified solution that empowers organizations to operate with greater efficiency, transparency, and control. This project is built by **Awfatch**.

---

## Getting Started 🛠️

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js**: Make sure you have a recent version installed (e.g., v18.x or newer).
- **Yarn**: This project uses Yarn for package management.

### Installation

1.  Clone the repository:

    ```bash
    git clone [https://github.com/rifayetrimon/eboss-pro-max.git](https://github.com/rifayetrimon/eboss-pro-max.git)
    ```

2.  Navigate to the project directory:

    ```bash
    cd eboss-pro-max
    ```

3.  Install the dependencies:
    ```bash
    yarn
    ```
    This command is a shortcut for `yarn install`.

<!-- ### Environment Variables

You need to create a `.env` file to configure your application. This file holds sensitive information like API keys or database credentials and is not committed to version control.

1.  A template file named `.env.example` is provided. Copy this file to create your new `.env` file.

    ```bash
    cp .env.example .env
    ```

2.  Open the newly created `.env` file and fill in the values for your specific environment.

--- -->

## Available Scripts 📜

In the project directory, you can run the following scripts:

- **`yarn dev`**: Starts the application in development mode. The app will be available at `http://localhost:3000`. Hot-reloading is enabled, so your changes will be automatically reflected.
- **`yarn build`**: Creates a production-ready build of the application in the `.next` folder. This is a static build that's optimized for deployment.
- **`yarn start`**: Starts the application in production mode. You must run `yarn build` first.
- **`yarn lint`**: Runs ESLint to check for code quality and style issues.

---

## Folder Structure 📂

This section provides an overview of the project's directory structure and the purpose of each key folder.

.
├── app/ # Next.js App Router root
│ ├── (auth)/ # Route group for authentication-related routes (e.g., login, register)
│ │ ├── forgot-password/
│ │ │ └── page.tsx # Forgot password page UI
│ │ ├── login/
│ │ │ └── page.tsx # Login page UI
│ │ ├── otp/
│ │ │ └── page.tsx # OTP verification page UI
│ │ ├── set-password/
│ │ │ └── page.tsx # Set new password page UI
│ │ ├── sign-up/
│ │ │ └── page.tsx # Sign-up page UI
│ │ └── layout.tsx # Shared layout for authentication routes
│ ├── calendar/
│ │ └── page.tsx # Calendar page UI
│ ├── chat/
│ │ └── page.tsx # Chat page UI
│ ├── profile/
│ │ └── page.tsx # User profile page UI
│ ├── layout.tsx # Global layout for the entire application
│ ├── page.tsx # Root page UI (e.g., dashboard or homepage)
│ └── globals.css # Global styles for the application (often imports Tailwind base)
├── components/ # Reusable UI components
│ ├── auth/ # Components specific to authentication forms/UI
│ │ ├── component-appcode.tsx
│ │ ├── component-otp-form.tsx
│ │ └── component-reset-password-form.tsx
│ ├── app-calendar.tsx # Calendar specific component
│ ├── component-otp-timer.tsx
│ ├── AppcodeGurad.tsx # Likely an authentication guard component
│ ├── icon/ # Directory for icon components or assets
│ │ └── ...
│ ├── layouts/ # Reusable layout fragments (e.g., header, footer, sidebar)
│ │ ├── auth_layout.tsx
│ │ ├── footer.tsx
│ │ ├── header.tsx
│ │ ├── loading.tsx # Loading state component
│ │ ├── main-container.tsx
│ │ ├── provider-component.tsx
│ │ └── setting.tsx
│ └── ui/ # General-purpose UI components (e.g., buttons, inputs, modals)
│ ├── alert.tsx
│ ├── components-widgets.tsx
│ ├── highlight.tsx
│ ├── login-type-dropdown.tsx
│ ├── main-login-highlight.tsx
│ └── portals.tsx
├── hooks/ # Custom React hooks for reusable logic
│ ├── auth/
│ │ ├── useAppCode.ts
│ │ └── useLogin.ts
│ └── useProfile.ts
├── lib/ # Utility functions, API clients, and helper libraries
│ ├── basePath.ts # Base path configuration
│ └── queryClient.ts # Client for data fetching (e.g., React Query client)
├── public/ # Static assets (images, fonts, favicons)
│ ├── locales/
│ │ └── ...
│ ├── favicon.png
│ └── vercel.svg
├── styles/ # Project-specific stylesheets (if not using pure Tailwind)
│ ├── editorignore
│ └── styles.css
├── .editorconfig
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .next/ # Build output directory (automatically generated)
├── .prettierignore
├── .prettierrc
├── i18n.ts # Internationalization configuration
├── next-env.d.ts
├── next.config.js # Next.js configuration file
├── nexi18n.config.js
├── package.json # Project dependencies and scripts
├── postcss.config.js # PostCSS configuration (used by Tailwind)
├── README.md
├── tailwind.config.js # Tailwind CSS configuration file
├── tsconfig.json # TypeScript configuration
└── yarn.lock # Yarn package lock file

## Core Application Files

app/: This is the heart of your Next.js application, utilizing the App Router. Each subfolder within app/ defines a route segment, structuring your application's navigation.

(auth)/: A special Route Group that allows you to group related routes (like login and sign-up) under a common layout without affecting the URL path.

page.tsx: Defines the user interface (UI) for a specific route segment. This is the main page component for a given URL.

layout.tsx: Defines shared UI for a route and its children. For instance, app/layout.tsx is the global layout for the entire application, while a layout file inside a route group like app/(auth)/layout.tsx provides a unique layout for all pages within that group.

globals.css: Your primary stylesheet, typically where you import base styles from frameworks like Tailwind CSS.

## Component and Logic Folders

components/: This directory houses all your reusable UI components. Organizing your UI here promotes modularity, consistency, and maintainability.

auth/: Components specifically designed for authentication forms and related UI elements.

layouts/: Reusable components that define general page structures, such as headers, footers, and sidebars.

ui/: A collection of general-purpose, highly reusable UI elements like buttons, alerts, and modals that can be used across the entire application.

hooks/: Contains custom React hooks that encapsulate and share reusable logic. This prevents code duplication and keeps your components clean.

lib/: A general-purpose directory for utility functions, API clients, and helper libraries.

queryClient.ts: This is where you likely configure your data-fetching client (e.g., React Query), managing caching and state for your API calls.

## Static Assets and Configuration

public/: Stores static assets such as images, fonts, and favicons. Files in this folder are served directly from the root of your domain.

styles/: Used for any project-specific stylesheets that are not part of your main CSS framework or global styles.

## Configuration Files:

Files in the root directory like next.config.js, tailwind.config.js, and tsconfig.json are essential for configuring your Next.js application, styling framework, and TypeScript settings.
