import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const urlParts = req.url.split('?');
        const urlPath = urlParts[0];
        const queryString = urlParts[1] || '';

        // Parse query params
        const queryParams: Record<string, string> = {};
        if (queryString) {
          const searchParams = new URLSearchParams(queryString);
          searchParams.forEach((val, key) => {
            queryParams[key] = val;
          });
        }
        (req as any).query = queryParams;

        let filePath = '';

        if (urlPath === '/api/admin/registrations' || urlPath.startsWith('/api/admin/registrations/')) {
          filePath = path.join(__dirname, 'api', 'admin', 'registrations.ts');
          if (urlPath.startsWith('/api/admin/registrations/')) {
            const id = urlPath.split('/').pop();
            (req as any).query.id = id;
          }
        } else {
          const relPath = urlPath.replace('/api/', '');
          filePath = path.join(__dirname, 'api', `${relPath}.ts`);
        }

        if (!fs.existsSync(filePath)) {
          return next();
        }

        try {
          // Read server/.env if process.env values are missing locally
          const serverEnvPath = path.join(__dirname, 'server', '.env');
          if (fs.existsSync(serverEnvPath)) {
            const envContent = fs.readFileSync(serverEnvPath, 'utf-8');
            envContent.split('\n').forEach(line => {
              const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
              if (match) {
                const key = match[1];
                let value = match[2] || '';
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                if (!process.env[key]) {
                  process.env[key] = value.trim();
                }
              }
            });
          }

          // Parse JSON request body if POST/PUT/DELETE with application/json
          const contentType = (req.headers['content-type'] || '').toString();
          if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && contentType.includes('application/json')) {
            const buffers: Buffer[] = [];
            for await (const chunk of req) {
              buffers.push(Buffer.from(chunk));
            }
            const bodyText = Buffer.concat(buffers).toString('utf-8');
            try {
              (req as any).body = bodyText ? JSON.parse(bodyText) : {};
            } catch {
              (req as any).body = {};
            }
          }

          // Add Vercel response compatibility helpers (res.status, res.json)
          const resExt: any = res;
          resExt.status = (statusCode: number) => {
            res.statusCode = statusCode;
            return resExt;
          };
          resExt.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return resExt;
          };

          const module = await server.ssrLoadModule(filePath);
          const handler = module.default;
          if (typeof handler === 'function') {
            await handler(req, resExt);
            return;
          }
        } catch (err: any) {
          console.error(`Dev API Error [${req.url}]:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Internal Dev API Error' }));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApiPlugin()],
});
