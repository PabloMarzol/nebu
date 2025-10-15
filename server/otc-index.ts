import express, { type Request, Response, NextFunction } from "express";
import { registerOTCRoutes } from "./otc-routes";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

(async () => {
  const server = await registerOTCRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(process.cwd(), "dist-otc/public")));
    
    app.get("*", (_req, res) => {
      res.sendFile(path.join(process.cwd(), "dist-otc/public/otc-index.html"));
    });
  } else {
    // Development mode - serve Vite dev server files
    app.use(express.static(path.join(process.cwd(), "client")));
    
    app.get("*", (_req, res) => {
      res.sendFile(path.join(process.cwd(), "client/otc-index.html"));
    });
  }

  server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[otc-express] OTC Desk Pro serving on port ${PORT}`);
  });
})();