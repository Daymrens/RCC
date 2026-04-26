# Contributing to RoboDesk

Thank you for your interest in contributing to RoboDesk!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Setup database: `pnpm db:migrate && pnpm db:generate`
4. Run dev servers: `pnpm dev`

## Project Structure

- `apps/web` - Next.js frontend
- `apps/server` - Express backend
- `packages/shared` - Shared TypeScript types
- `prisma` - Database schema

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

## Making Changes

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

## Testing

- Test all device connection types (Serial, BLE)
- Verify function execution works
- Check flow builder functionality
- Test dashboard widgets
- Ensure real-time features work

## Pull Request Guidelines

- Describe what your PR does
- Reference any related issues
- Include screenshots for UI changes
- Ensure code builds without errors
- Update documentation if needed

## Questions?

Open an issue for discussion before starting major changes.
