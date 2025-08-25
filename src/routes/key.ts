import express from 'express';
import KeyController from '../controllers/key.controller';

const router = express.Router();
const controller = new KeyController();

router.post('/', controller.createKey.bind(controller));
router.get('/', controller.getAllKeys.bind(controller));
router.get('/:id_key', controller.getKeyById.bind(controller));
router.put('/:id_key', controller.updateKey.bind(controller));
router.delete('/:id_key', controller.deleteKey.bind(controller));

export default router;