// Vercel Serverless Function
// Available at /api/hello
export default function handler(req, res) {
  const { name = "World" } = req.query;
  res.status(200).json({
    message: `Hello, ${name}!`,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}
