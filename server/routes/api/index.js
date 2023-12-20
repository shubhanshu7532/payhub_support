const router = require('express').Router();

// const authRoutes = require('./auth');

const merchantRoutes = require('./merchant');
const issueRoutes = require('./issue')
const supportRoutes = require('./support')

// auth routes
// router.use('/auth', authRoutes);



// merchant routes
router.use('/merchant', merchantRoutes);

// Wishlist routes
router.use('/issue', issueRoutes);

//support routes
router.use('/support', supportRoutes)

module.exports = router;
