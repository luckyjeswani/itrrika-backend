import { Router, type IRouter } from "express";
import { db, insertOrderSchema, ordersTable } from "../../lib/db/src/index.js";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

const ADMIN_KEY = process.env.ADMIN_KEY ?? "itrrika-admin-2024";

router.post("/orders", async (req, res) => {
  const parsed = insertOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order data" });
    return;
  }
  try {
    const [order] = await db.insert(ordersTable).values(parsed.data).returning();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/orders", async (req, res) => {
  if (req.query.adminKey !== ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  if (req.query.adminKey !== ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }
  const { status } = req.body as { status?: string };
  const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered"];
  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  try {
    const [updated] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
