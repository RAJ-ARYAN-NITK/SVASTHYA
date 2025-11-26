import { Router } from 'express';
import { chatWithAgent, analyzeReport } from '../controllers/agent.controller';

const router = Router();

router.post('/chat', chatWithAgent);
router.post('/analyze-report', analyzeReport);

export default router;
