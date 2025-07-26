# Developer Tools

A collection of useful utilities for developers built with React. All tools run entirely in your browser - no data is sent to any server.

## Features

- **JSON ⇄ EDN Converter** - Convert between JSON and EDN (Extensible Data Notation) formats ✅
- **JWT Decoder** - Decode and inspect JSON Web Tokens ✅
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings ✅
- **UUID Generator** - Generate UUIDs in various formats ✅
- **HTTP Converter** - Convert between curl, fetch, and HTTPie formats (Coming Soon)
- **Regex Tester** - Test regular expressions with live matching (Coming Soon)
- **Cron Parser** - Parse and explain cron expressions (Coming Soon)
- **Timestamp Converter** - Convert between timestamps and readable dates (Coming Soon)
- **JSON/YAML Formatter** - Format and validate JSON and YAML (Coming Soon)

## Tech Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and development server
- **CSS Custom Properties** - Styling with dark theme
- **Modern fonts** - Inter for UI, Fira Code for code blocks

## Development

### Prerequisites

- Node.js 18+ 
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Building

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured to deploy on Cloudflare Pages:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Deploy!

The `_redirects` file ensures proper routing for the single-page application.

## Architecture

- **Client-side only** - No backend required
- **Responsive design** - Works on desktop and mobile
- **Dark theme** - Developer-friendly interface
- **Modular components** - Easy to add new tools
- **Clean code structure** - Organized for maintainability

## Adding New Tools

1. Create a new component in `src/components/`
2. Add conversion utilities in `src/utils/` if needed
3. Update the `tools` array in `src/App.jsx`
4. Add a new route in the Router

## License

MIT License - feel free to use this code for your own projects!
