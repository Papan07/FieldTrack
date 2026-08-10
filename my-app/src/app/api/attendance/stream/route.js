import { sseClients } from "../route";

/**
 * Server-Sent Events stream endpoint.
 * The admin dashboard connects here to receive real-time attendance updates.
 * Each new check-in POSTed to /api/attendance is pushed to all connected clients.
 */
export async function GET() {
  let controller;

  const stream = new ReadableStream({
    start(c) {
      controller = c;
      sseClients.add(controller);

      // Send a heartbeat comment every 25s to keep the connection alive
      // through proxies / load balancers that close idle connections.
    },
    cancel() {
      sseClients.delete(controller);
    },
  });

  // Keep-alive heartbeat
  const heartbeat = setInterval(() => {
    try {
      controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));
    } catch {
      clearInterval(heartbeat);
    }
  }, 25000);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
