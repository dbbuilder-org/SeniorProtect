import { Router, Request, Response, NextFunction } from 'express';
import { checkEmailSchema, checkTextSchema, checkUrlSchema, ContentType } from '@senior-protect/shared';
import { requireAuth } from '../middleware/auth.js';
import { analyzeContent } from '../services/analysis/engine.js';
import { query } from '../config/database.js';

const router = Router();

router.post('/email', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = checkEmailSchema.parse(req.body);
    const result = await analyzeContent(ContentType.Email, input.content, input.metadata);
    await storeCheck(req.userId!, result);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/text', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = checkTextSchema.parse(req.body);
    const result = await analyzeContent(ContentType.Text, input.content, input.metadata);
    await storeCheck(req.userId!, result);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/url', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = checkUrlSchema.parse(req.body);
    const result = await analyzeContent(ContentType.Url, input.content, input.metadata);
    await storeCheck(req.userId!, result);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

async function storeCheck(userId: string, result: any) {
  await query(
    `INSERT INTO threat_checks (user_id, content_type, content_hash, threat_level, score, confidence, signals, three_questions, summary)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      userId,
      result.contentType,
      result.id, // content hash used as ID
      result.threatLevel,
      result.score,
      result.confidence,
      JSON.stringify(result.signals),
      JSON.stringify(result.threeQuestions),
      result.summary,
    ]
  );
}

export default router;
