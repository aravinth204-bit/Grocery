import express from 'express';
const router = express.Router();
import { 
  sendMessage, 
  getMessages, 
  updateMessageStatus, 
  deleteMessage 
} from '../controllers/messageController.js';

router.route('/')
  .post(sendMessage)
  .get(getMessages);

router.route('/:id')
  .put(updateMessageStatus)
  .delete(deleteMessage);

export default router;
