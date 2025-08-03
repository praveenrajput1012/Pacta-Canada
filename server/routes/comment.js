const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/commentController');

router.post('/:projectId', auth, commentCtrl.addComment);
router.get('/:projectId', commentCtrl.getCommentsByProject);
router.put('/edit/:id', auth, commentCtrl.updateComment);
router.delete('/delete/:id', auth, commentCtrl.deleteComment);

module.exports = router;