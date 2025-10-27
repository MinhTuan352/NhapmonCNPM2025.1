// File: backend/routes/incidentRoutes.js
const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// US_017: Cư dân báo cáo sự cố
router.post('/', checkAuth, checkRole(['Cư dân']), incidentController.createIncident);

// US_017: Cư dân xem các sự cố đã báo cáo của mình
router.get('/my', checkAuth, checkRole(['Cư dân']), incidentController.getMyIncidents);

// US_017: Admin xem tất cả các sự cố đã được báo cáo
router.get('/', checkAuth, checkRole(['Admin']), incidentController.getAllIncidents);

module.exports = router;