<div align="center">
  <a href="https://web3economy.com">
    <h1>Web3 Economy</h1>
  </a>

  <p>
    <strong>Admin Dashboard for the Web3 Economy Platform</strong>
  </p>

  <p>
    A modern, full-featured admin panel for managing the Web3 Economy community platform.<br />
    Built for the mission of onboarding everyone onchain.
  </p>

  <p>
    <a href="#quick-start"><strong>Quick Start</strong></a> ·
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#documentation"><strong>Docs</strong></a> ·
    <a href="#contributing"><strong>Contributing</strong></a>
  </p>

  <br />

  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

<br />

## Overview

Web3 Economy is a crypto and blockchain community dedicated to onboarding everyone onchain. This admin dashboard serves as the central hub for managing all platform content, community resources, and user engagement.

### Why This Dashboard?

- **🚀 Fast & Modern** — Built with Vite for lightning-fast development and optimized production builds
- **🎨 Beautiful UI** — Crafted with shadcn/ui components and Tailwind CSS for a polished experience
- **🔒 Secure** — Role-based authentication with JWT tokens and protected routes
- **📊 Data-Driven** — Real-time analytics and insights with interactive charts
- **📱 Responsive** — Fully responsive design that works on all devices

<br />

## Features

<table>
  <tr>
    <td width="50%">
      <h3>📅 Events Management</h3>
      <p>Create and manage community events, hackathons, workshops, and meetups with full CRUD operations.</p>
    </td>
    <td width="50%">
      <h3>👥 Creator Directory</h3>
      <p>Showcase and manage featured builders, developers, and contributors in the ecosystem.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📚 Learning Resources</h3>
      <p>Curate educational materials, tutorials, guides, and documentation for the community.</p>
    </td>
    <td width="50%">
      <h3>📝 Blog & Content</h3>
      <p>Publish and manage blog posts, news updates, and educational content.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🏆 Project Showcase</h3>
      <p>Feature outstanding community projects with detailed profiles and statistics.</p>
    </td>
    <td width="50%">
      <h3>📧 Communications</h3>
      <p>Manage newsletter subscribers and handle community contact inquiries.</p>
    </td>
  </tr>
</table>

<br />

## Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.0 or later
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/cypherpulse/web3economy-Admin-Frontend.git
cd web3economy-Admin-Frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Development

```bash
# Start the development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The app will be available at `http://localhost:8080`

<br />

## Configuration

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001
```

<br />

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [React 18](https://react.dev) |
| **Build** | [Vite](https://vitejs.dev) |
| **Language** | [TypeScript](https://typescriptlang.org) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) |
| **Components** | [shadcn/ui](https://ui.shadcn.com) |
| **Charts** | [Recharts](https://recharts.org) |
| **Routing** | [React Router](https://reactrouter.com) |
| **Icons** | [Lucide](https://lucide.dev) |

<br />

## Project Structure

```
web3economy-Admin-Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── admin/         # Dashboard layout & components
│   │   └── ui/            # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities & API client
│   ├── pages/
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   └── Login.tsx      # Authentication
│   └── main.tsx           # Application entry
├── .env.example           # Environment template
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

<br />

## Documentation

### Authentication

The dashboard uses JWT-based authentication. Admin users must log in with their credentials to access the dashboard. Tokens are stored securely and automatically refreshed.

### API Integration

All admin operations connect to the Web3 Economy Backend API. Ensure the backend server is running and properly configured in your environment variables.

### Role-Based Access

The system supports multiple admin roles:
- **Super Admin** — Full access to all features
- **Admin** — Standard administrative access
- **Editor** — Content management only

<br />

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

<br />

## Community

Join the Web3 Economy community:

- 🌐 [Website](https://web3economy.com)
- 🐦 [Twitter](https://twitter.com/web3economy)
- 💬 [Discord](https://discord.gg/web3economy)

<br />

## License

Copyright © 2024 Web3 Economy. All rights reserved.

---

<div align="center">
  <sub>Built with ❤️ by the Web3 Economy Team</sub>
  <br />
  <sub>Onboarding everyone onchain, one builder at a time.</sub>
</div>
