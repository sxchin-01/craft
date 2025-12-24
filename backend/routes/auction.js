const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

// Get all auctions
router.get('/', auctionController.getAllAuctions);

// Get single auction by ID
router.get('/:id', auctionController.getAuctionById);

// Create new auction
router.post('/', auctionController.createAuction);

// Update auction
router.put('/:id', auctionController.updateAuction);

// Delete auction
router.delete('/:id', auctionController.deleteAuction);

// Place a bid
router.post('/:id/bid', auctionController.placeBid);

module.exports = router;
