require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const productsData = [
  {
    name: "Running Shoes",
    category: "Footwear",
    price: 129.99,
    rating: 4.8,
    numReviews: 24,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Experience maximum comfort and durability with our signature mesh upper, padded sole running shoes.",
    countInStock: 10
  },
  {
    name: "Chrono Watch",
    category: "Accessories",
    price: 199.50,
    rating: 4.6,
    numReviews: 12,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=80"
    ],
    description: "A premium smartwatch packed with health trackers, physical sensors, and modern waterproof stainless casings.",
    countInStock: 8
  },
  {
    name: "Backpack",
    category: "Bags",
    price: 89.00,
    rating: 4.5,
    numReviews: 32,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577903013444-24546419fbfb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Handcrafted full-grain leather laptop bag designed for daily urban travelers and students.",
    countInStock: 15
  },
  {
    name: "Headphones",
    category: "Electronics",
    price: 249.99,
    rating: 4.9,
    numReviews: 45,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Premium sound engineering featuring hybrid active noise cancellation, ambient passthroughs, and 40H charge.",
    countInStock: 20
  },
  {
    name: "Water Bottle",
    category: "Accessories",
    price: 34.00,
    rating: 4.2,
    numReviews: 8,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618335829737-2228915674e0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574158622643-69d34d72650a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1627998794066-68fb8c571732?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Eco-friendly, double-wall insulated container keeping your beverages chilled up to 24 hours.",
    countInStock: 30
  },
  {
    name: "Keyboard",
    category: "Electronics",
    price: 119.00,
    rating: 4.8,
    numReviews: 14,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626958011269-b366e4a2f866?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Compact 75% hot-swappable keyboard featuring custom linear mechanical switches, premium PBT keycaps, and custom RGB configurations.",
    countInStock: 12
  },
  {
    name: "Duffel Bag",
    category: "Bags",
    price: 75.00,
    rating: 4.6,
    numReviews: 22,
    image: "https://images.unsplash.com/photo-1512201066735-b5a6b810d936?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1512201066735-b5a6b810d936?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Waterproof sports duffel bag featuring dedicated shoe slots, custom compartments, and dual padded shoulder straps.",
    countInStock: 18
  },
  {
    name: "Mouse",
    category: "Electronics",
    price: 59.99,
    rating: 4.5,
    numReviews: 11,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527813713060-7ae2bc01c4d9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1625485426763-89689445104a?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Ergonomic wireless travel mouse featuring custom high-DPI optical sensors and silent switch clicks.",
    countInStock: 25
  },
  {
    name: "Desk Lamp",
    category: "Electronics",
    price: 49.00,
    rating: 4.4,
    numReviews: 9,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Minimalist aluminum bedside lamp featuring dynamic RGB light presets, touch slider dimming, and quick wireless charging pads.",
    countInStock: 15
  },
  {
    name: "Desk Pad",
    category: "Accessories",
    price: 29.00,
    rating: 4.3,
    numReviews: 6,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486788371-62d930495c44?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Premium wool felt desk protector mat, perfect for smooth mouse operations and protecting tables from daily friction.",
    countInStock: 40
  },
  {
    name: "Powerbank",
    category: "Electronics",
    price: 45.00,
    rating: 4.7,
    numReviews: 18,
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1609592553882-f47f167be950?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338111112-7ac6ae9734e5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=600&auto=format&fit=crop&q=80"
    ],
    description: "20,000mAh portable battery pack equipped with dual USB-C Power Delivery ports, quick charge profiles, and LED displays.",
    countInStock: 35
  },
  {
    name: "Denim Jacket",
    category: "Men's Wear",
    price: 69.99,
    rating: 4.6,
    numReviews: 15,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Classic rugged denim jacket with dual button chest pockets, durable cotton stitching, and adjustable button cuffs.",
    countInStock: 12
  },
  {
    name: "Wool Sweater",
    category: "Men's Wear",
    price: 89.00,
    rating: 4.8,
    numReviews: 21,
    image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608060434411-0c3fa90ca537?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Ultra-soft merino wool knit crewneck sweater designed for active temperature control and premium insulation.",
    countInStock: 14
  },
  {
    name: "Trench Coat",
    category: "Women's Wear",
    price: 110.00,
    rating: 4.7,
    numReviews: 17,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Lightweight, highly breathable linen trench coat complete with a matching waist tie belt and deep side utility pockets.",
    countInStock: 9
  },
  {
    name: "Pleated Skirt",
    category: "Women's Wear",
    price: 45.00,
    rating: 4.5,
    numReviews: 13,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508427987373-30d52a63ef25?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Aesthetic knit pleated midi skirt featuring elastic waist bands and premium wool blend weaves.",
    countInStock: 22
  },
  {
    name: "Platform Sneakers",
    category: "Footwear",
    price: 85.00,
    rating: 4.6,
    numReviews: 14,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Stand out with our colorful pastel platform sneakers, featuring high-traction rubber outsoles and canvas uppers.",
    countInStock: 16
  },
  {
    name: "Hiking Boots",
    category: "Footwear",
    price: 145.00,
    rating: 4.7,
    numReviews: 19,
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Heavy-duty waterproof leather boots designed for all-terrain trekking and severe weather stability.",
    countInStock: 10
  },
  {
    name: "Loafers",
    category: "Footwear",
    price: 110.00,
    rating: 4.5,
    numReviews: 11,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Sleek slip-on business casual shoes handcrafted from Italian premium grade calfskin leather.",
    countInStock: 14
  },
  {
    name: "Sandals",
    category: "Footwear",
    price: 40.00,
    rating: 4.4,
    numReviews: 8,
    image: "https://images.unsplash.com/photo-1603487215275-665e7be5fc1f?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603487215275-665e7be5fc1f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Relaxing recovery slide sandals, boasting memory-foam bases and high water resistance.",
    countInStock: 25
  },
  {
    name: "Glasses",
    category: "Accessories",
    price: 49.00,
    rating: 4.6,
    numReviews: 10,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Protect your eyes from digital strain. Specially crafted lenses reduce eye tiredness during computer work.",
    countInStock: 20
  },
  {
    name: "Sunglasses",
    category: "Accessories",
    price: 79.00,
    rating: 4.8,
    numReviews: 15,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Premium glare protection with UV400 filters. Engineered with light carbon fiber frames.",
    countInStock: 15
  },
  {
    name: "Dry Bag",
    category: "Bags",
    price: 45.00,
    rating: 4.7,
    numReviews: 13,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512201066735-b5a6b810d936?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Roll-top dry bag crafted from durable PVC tarpaulin. Keeps your electronics and clothes perfectly dry during water sports.",
    countInStock: 25
  },
  {
    name: "Messenger Bag",
    category: "Bags",
    price: 55.00,
    rating: 4.5,
    numReviews: 18,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512201066735-b5a6b810d936?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Compact sling messenger bag designed for urban commuters, featuring dual quick-access front zippers.",
    countInStock: 20
  },
  {
    name: "Tote Bag",
    category: "Bags",
    price: 65.00,
    rating: 4.6,
    numReviews: 14,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512201066735-b5a6b810d936?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Spacious heavy-duty canvas tote, styled with leather handles and custom internal tablet sleeves.",
    countInStock: 15
  },
  {
    name: "Active T-Shirt",
    category: "Men's Wear",
    price: 29.99,
    rating: 4.6,
    numReviews: 12,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Lightweight moisture-wicking fabric helps keep you cool and dry during intense workouts.",
    countInStock: 25
  },
  {
    name: "Chino Pants",
    category: "Men's Wear",
    price: 49.99,
    rating: 4.7,
    numReviews: 16,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Stretch cotton blend pants featuring a modern tapered look, ideal for business-casual settings.",
    countInStock: 18
  },
  {
    name: "Windbreaker",
    category: "Men's Wear",
    price: 89.99,
    rating: 4.8,
    numReviews: 22,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Weather-resistant protective shell containing custom adjustable hoods and elastic storm cuffs.",
    countInStock: 10
  },
  {
    name: "Cardigan",
    category: "Women's Wear",
    price: 59.99,
    rating: 4.7,
    numReviews: 20,
    image: "https://images.unsplash.com/photo-1508427987373-30d52a63ef25?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1508427987373-30d52a63ef25?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Oversized open-front knit cardigan crafted with premium chunky yarn for thermal retention and softness.",
    countInStock: 15
  },
  {
    name: "Yoga Leggings",
    category: "Women's Wear",
    price: 49.99,
    rating: 4.8,
    numReviews: 28,
    image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508427987373-30d52a63ef25?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Ultra-stretch opaque squat-proof leggings featuring high waistband compressions and side phone pockets.",
    countInStock: 30
  },
  {
    name: "Silk Blouse",
    category: "Women's Wear",
    price: 79.99,
    rating: 4.6,
    numReviews: 14,
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Pure mulberry silk long-sleeve blouse with hidden button plackets and single-button rounded cuffs.",
    countInStock: 12
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/simple-ecommerce-store');
    console.log('MongoDB connected successfully for seeding...');

    // 1. Delete existing products
    await Product.deleteMany({});
    console.log('Cleared existing products...');

    // 2. Find or create a admin/seller user to associate the products to
    let seller = await User.findOne({ isAdmin: true });
    if (!seller) {
      seller = await User.create({
        name: 'System Admin',
        email: 'admin@example.com',
        password: 'AdminPassword@123',
        isAdmin: true
      });
      console.log('Created System Admin user for seeding:', seller._id);
    }

    // 3. Populate products data with user reference
    const finalProducts = productsData.map(p => ({
      ...p,
      user: seller._id
    }));

    // 4. Bulk insert
    const createdProducts = await Product.insertMany(finalProducts);
    console.log(`Seeded ${createdProducts.length} products successfully!`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
