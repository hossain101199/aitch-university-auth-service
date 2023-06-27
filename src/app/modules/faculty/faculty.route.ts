import express from 'express';

const router = express.Router();

router.get('/:id');

router.patch('/:id');

router.delete('/:id');

router.get('/');

export const studentRoutes = router;
