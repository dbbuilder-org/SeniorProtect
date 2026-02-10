import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../config/database.js';

const router = Router();

// GET /api/v1/user/checks?limit=5 — recent threat checks for authenticated user
router.get('/checks', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 5, 1), 50);

    const result = await query(
      `SELECT id, content_type, threat_level, summary, created_at
       FROM threat_checks
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [req.userId, limit]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/user/statistics — aggregated check counts
router.get('/statistics', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE threat_level = 'safe')::int AS safe,
         COUNT(*) FILTER (WHERE threat_level = 'caution')::int AS caution,
         COUNT(*) FILTER (WHERE threat_level = 'danger')::int AS danger
       FROM threat_checks
       WHERE user_id = $1`,
      [req.userId]
    );

    const row = result.rows[0];
    res.json({
      total: row.total,
      safe: row.safe,
      caution: row.caution,
      danger: row.danger,
      threatsCaught: row.caution + row.danger,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
