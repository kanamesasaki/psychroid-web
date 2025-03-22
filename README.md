# Psychrometric Chart Calculator

Interactive psychrometric chart calculator for HVAC engineers. Calculate and visualize air properties, process flows, and energy requirements.

🔗 **[Website: https://psychroid.thermocraft.space/](https://psychroid.thermocraft.space/)**

<img alt="Psychrometric Chart Screenshot" src="https://psychroid.thermocraft.space/og-image.png">

## Features

- Interactive psychrometric chart visualization
- Calculate moist air properties (dry-bulb temperature, humidity ratio, wet-bulb, etc.)
- Calculate and visualize air processes (heating, cooling, humidification, etc.)
- Mobile-friendly responsive design

## Technology Stack
- React 19.0.0
- TypeScript
- Vite
- Tailwind CSS
- WebAssembly (WASM)
- D3.js

## Deployment
This project is configured for deployment on Cloudflare Pages:
1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
  - Build command: npm install && npm run build
  - Build output directory: /dist
  - NODE_VERSION: 22.14.0

## WebAssembly Integration
The psychrometric calculations are powered by a custom WebAssembly module. 
The application automatically initializes the WASM module on startup.

## Project Structure
```
psychroid-web/
├── public/           # Static assets and files
├── src/
│   ├── components/   # React components
│   ├── lib/          # Utility functions and WASM files
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Entry point
└── index.html        # HTML template
```