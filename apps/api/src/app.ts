import express, { type Express, type Request, type Response } from "express";

type HealthResponse = {
  status: "ok";
};

export function createApp(): Express {
  const app = express();

  app.get("/health", (_request: Request, response: Response<HealthResponse>) => {
    response.json({ status: "ok" });
  });

  return app;
}
