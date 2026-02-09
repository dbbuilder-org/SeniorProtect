import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      'SELECT id, name, domain, category, description, verified FROM trusted_sites ORDER BY category, name'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, category } = req.query;
    let sql = 'SELECT id, name, domain, category, description, verified FROM trusted_sites WHERE 1=1';
    const params: any[] = [];

    if (q && typeof q === 'string') {
      params.push(`%${q}%`);
      sql += ` AND (name ILIKE $${params.length} OR domain ILIKE $${params.length})`;
    }
    if (category && typeof category === 'string') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ' ORDER BY name';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;
