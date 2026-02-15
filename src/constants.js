
export const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Elysian Essence Perfume',
    description: 'A sophisticated blend of jasmine, sandalwood, and citrus notes.',
    price: 120,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    featured: true
  },
  {
    id: '2',
    name: 'Nordic Minimalist Watch',
    description: 'Timeless design with a genuine leather strap and sapphire glass.',
    price: 250,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    featured: true
  },
  {
    id: '3',
    name: 'Silk Haven Nightgown',
    description: 'Pure mulberry silk for the ultimate sleep experience.',
    price: 180,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&q=80&w=800',
    stock: 15
  },


  {
    id: '6',
    name: 'Marble Wireless Charger',
    description: 'High-speed charging embedded in a genuine Carrara marble slab.',
    price: 95,
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1586810165616-94c631fc2f79?auto=format&fit=crop&q=80&w=800',
    stock: 20
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    date: '2023-11-20',
    customerName: 'Alex Johnson',
    total: 240,
    status: 'Delivered',
    items: []
  },
  {
    id: 'ORD-002',
    date: '2023-11-21',
    customerName: 'Sarah Smith',
    total: 120,
    status: 'Shipped',
    items: []
  },
  {
    id: 'ORD-003',
    date: '2023-11-22',
    customerName: 'Michael Brown',
    total: 590,
    status: 'Pending',
    items: []
  }
];

export const SALES_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];
