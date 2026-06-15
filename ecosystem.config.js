/**
 * PM2 Ecosystem Config — The Startup School
 *
 * Manages two processes:
 *   1. tss-backend  — Express API server (compiled TypeScript → node dist/index.js)
 *   2. tss-frontend — Next.js production server (next start)
 *
 * BEFORE STARTING IN PRODUCTION:
 *   1. Build the backend:  cd backend && npm run build
 *   2. Build the frontend: cd web && npm run build
 *   3. Start both:         pm2 start ecosystem.config.js --env production
 *   4. Save process list:  pm2 save
 *   5. Startup on reboot:  pm2 startup  (follow the generated command)
 *
 * USEFUL COMMANDS:
 *   pm2 status          — check all processes
 *   pm2 logs            — tail logs for all processes
 *   pm2 logs tss-backend — tail backend only
 *   pm2 restart all     — restart after code update
 *   pm2 reload all      — zero-downtime reload (for Next.js — restarts workers gracefully)
 *   pm2 stop all        — stop all processes
 */

module.exports = {
    apps: [
        // ─── 1. Express Backend ───────────────────────────────────────────────
        {
            name: 'tss-backend',
            script: 'dist/index.js',
            cwd: './backend',

            // Process management
            instances: 1,           // Single instance — Prisma connection pool handles concurrency
            exec_mode: 'fork',      // 'cluster' would need stateless session handling; JWT is stateless so cluster is also fine
            autorestart: true,
            watch: false,           // Do NOT watch in production — use pm2 reload after deployments
            max_memory_restart: '400M',

            // Environment
            env: {
                NODE_ENV: 'development',
                PORT: 5000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000,
                // DATABASE_URL, JWT_SECRET, AWS_* etc. are loaded from backend/.env
                // Do NOT put secrets in this file — use .env or PM2 secrets
            },

            // Logging
            error_file: './logs/backend-error.log',
            out_file: './logs/backend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,

            // Restart policy
            min_uptime: '5s',
            max_restarts: 10,
            restart_delay: 3000,    // Wait 3s between restart attempts

            // Graceful shutdown
            kill_timeout: 5000,     // 5s for in-flight requests to complete
        },

        // ─── 2. Next.js Frontend ─────────────────────────────────────────────
        {
            name: 'tss-frontend',
            script: 'node_modules/.bin/next',
            args: 'start',
            cwd: './web',

            // Process management
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',

            // Environment
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
                // NEXT_PUBLIC_API_URL is baked into the build at `npm run build` time.
                // If you need to change it post-build, set it here AND rebuild.
                // NEXT_PUBLIC_API_URL: 'https://thestartupschool.in',
            },

            // Logging
            error_file: './logs/frontend-error.log',
            out_file: './logs/frontend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,

            // Restart policy
            min_uptime: '5s',
            max_restarts: 10,
            restart_delay: 3000,

            // Graceful shutdown
            kill_timeout: 5000,
        },
    ],
};
