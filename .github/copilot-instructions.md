# MonoDex - Copilot Instructions

## Project Overview
MonoDex is a Next.js web application for searching Pokemon cards by Pokemon name. Users can search for a Pokemon and retrieve all cards featuring that Pokemon from a database/API.

## Development Guidelines

### Tech Stack
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint

### Project Structure
```
src/
  app/          # Next.js App Router (pages, layouts)
  components/   # Reusable React components
  lib/          # Utilities and helpers
  types/        # TypeScript type definitions
public/         # Static assets
```

### Running the Project
- **Development**: `npm run dev` - starts dev server at http://localhost:3000
- **Build**: `npm run build`
- **Production**: `npm start`
- **Lint**: `npm run lint`

### Code Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Keep components modular and reusable

### Next Steps
- Implement Pokemon search functionality
- Integrate with Pokemon API/database
- Create card display components
