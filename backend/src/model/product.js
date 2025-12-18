const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    gemProductId: {
        type: String,
        required: [true, 'Please enter GeM Product ID'],
        unique: true
    },
    gemPrice: {
        type: Number,
        required: [true, 'Please enter GeM price'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Appliances', 'Automotive', 'Baby', 'Clothing', 'Electronics',
            'Furniture', 'Grocery', 'Health & Beauty', 'Home', 'Jewellery',
            'Office', 'Sports', 'Toys', 'Office Supplies', 'IT Peripherals', 'Other'
        ]
    },
    comparisonType: {
        type: String,
        enum: ['Direct Match', 'Similar Specs', 'Equivalent'],
        default: 'Direct Match'
    },
    brand: {
        type: String,
        required: [true, 'Please enter product brand']
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    specs: {
        type: Map,
        of: String
    },
    marketplacePrices: [{
        marketplace: {
            type: String,
            required: true,
            enum: ['Amazon', 'Flipkart', 'Meesho', 'Other']
        },
        productUrl: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate savings percentage vs GeM
productSchema.methods.calculateSavings = function () {
    let minMarketplacePrice = Infinity;
    this.marketplacePrices.forEach(mp => {
        if (mp.isAvailable && mp.price < minMarketplacePrice) {
            minMarketplacePrice = mp.price;
        }
    });

    if (minMarketplacePrice === Infinity) return 0;

    // If GeM is cheaper, negative savings? Or we highlight GeM advantage.
    // Usually we want to show how much CHEAPER something is compared to others, or how much CHEAPER GeM is.
    // Let's return the diff.
    return minMarketplacePrice - this.gemPrice;
};

// Virtual for best marketplace price
productSchema.virtual('lowestMarketplacePrice').get(function () {
    let minPrice = Infinity;
    if (this.marketplacePrices && this.marketplacePrices.length > 0) {
        this.marketplacePrices.forEach(mp => {
            if (mp.isAvailable && mp.price < minPrice) {
                minPrice = mp.price;
            }
        });
    }
    return minPrice === Infinity ? 0 : minPrice;
});

// Configure to include virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
