import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT id, name, domain, category, description, verified FROM trusted_sites';
    const params: any[] = [];

    if (category && typeof category === 'string') {
      params.push(category);
      sql += ` WHERE category = $${params.length}`;
    }

    sql += ' ORDER BY category, name';
    const result = await query(sql, params);
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

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, domain, category, description } = req.body;
    if (!name || !domain || !category) {
      res.status(400).json({ error: 'name, domain, and category are required' });
      return;
    }

    // Check if domain already exists
    const existing = await query('SELECT id FROM trusted_sites WHERE domain = $1', [domain]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'This site is already in the trusted sites list' });
      return;
    }

    const result = await query(
      'INSERT INTO trusted_sites (name, domain, category, description, verified) VALUES ($1, $2, $3, $4, FALSE) RETURNING id, name, domain, category, description, verified',
      [name, domain, category, description || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
