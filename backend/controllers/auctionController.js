const Auction = require('../models/Auction');

// Get all auctions
exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .sort({ createdAt: -1 })
      .populate('image');
    
    res.json(auctions);
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ error: 'Failed to retrieve auctions' });
  }
};

// Get auction by ID
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('image');
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json(auction);
  } catch (error) {
    console.error('Get auction error:', error);
    res.status(500).json({ error: 'Failed to retrieve auction' });
  }
};

// Create new auction
exports.createAuction = async (req, res) => {
  try {
    const { title, description, imageId, startingPrice, endDate } = req.body;

    const auction = new Auction({
      title,
      description,
      image: imageId,
      startingPrice,
      currentPrice: startingPrice,
      endDate: new Date(endDate),
      status: 'active'
    });

    await auction.save();

    res.status(201).json({
      message: 'Auction created successfully',
      auction
    });
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({ error: 'Failed to create auction' });
  }
};

// Update auction
exports.updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json({
      message: 'Auction updated successfully',
      auction
    });
  } catch (error) {
    console.error('Update auction error:', error);
    res.status(500).json({ error: 'Failed to update auction' });
  }
};

// Delete auction
exports.deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    console.error('Delete auction error:', error);
    res.status(500).json({ error: 'Failed to delete auction' });
  }
};

// Place a bid
exports.placeBid = async (req, res) => {
  try {
    const { amount, bidderName } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({ error: 'Auction is not active' });
    }

    if (new Date() > auction.endDate) {
      return res.status(400).json({ error: 'Auction has ended' });
    }

    if (amount <= auction.currentPrice) {
      return res.status(400).json({ error: 'Bid must be higher than current price' });
    }

    auction.bids.push({
      amount,
      bidderName,
      timestamp: new Date()
    });
    auction.currentPrice = amount;

    await auction.save();

    res.json({
      message: 'Bid placed successfully',
      currentPrice: auction.currentPrice
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
};
