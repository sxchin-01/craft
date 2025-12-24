const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  bidderName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  startingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'ended', 'cancelled'],
    default: 'pending'
  },
  bids: [bidSchema],
  winner: {
    name: String,
    amount: Number
  }
}, {
  timestamps: true
});

// Virtual to check if auction is active
auctionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && new Date() < this.endDate;
});

// Method to determine winner when auction ends
auctionSchema.methods.determineWinner = function() {
  if (this.bids.length > 0) {
    const highestBid = this.bids.reduce((max, bid) => 
      bid.amount > max.amount ? bid : max
    );
    this.winner = {
      name: highestBid.bidderName,
      amount: highestBid.amount
    };
  }
  this.status = 'ended';
  return this.save();
};

module.exports = mongoose.model('Auction', auctionSchema);
