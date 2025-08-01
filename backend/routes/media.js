const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { dbAsync } = require('../database/connection');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all media files
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { folder, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT m.*, u.first_name, u.last_name FROM media m LEFT JOIN users u ON m.uploaded_by = u.id';
    const params = [];
    const conditions = [];

    if (folder && folder !== 'all') {
      conditions.push('m.folder = ?');
      params.push(folder);
    }

    if (search) {
      conditions.push('(m.original_name LIKE ? OR m.filename LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY m.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const media = await dbAsync.all(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM media m';
    const countParams = [];
    
    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
      for (let i = 0; i < params.length - 2; i++) {
        countParams.push(params[i]);
      }
    }

    const { total } = await dbAsync.get(countSql, countParams);

    res.json({
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Upload media file
router.post('/upload', authenticateToken, requireRole(['admin', 'speaker']), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { folder = 'general' } = req.body;

    const result = await dbAsync.run(
      'INSERT INTO media (filename, original_name, mime_type, size, path, folder, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        req.file.path,
        folder,
        req.user.id
      ]
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      id: result.id,
      filename: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete media file
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Get file info
    const media = await dbAsync.get('SELECT * FROM media WHERE id = ?', [id]);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete from database
    await dbAsync.run('DELETE FROM media WHERE id = ?', [id]);

    // Delete physical file
    try {
      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }
    } catch (fileError) {
      console.error('Error deleting physical file:', fileError);
    }

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

module.exports = router;