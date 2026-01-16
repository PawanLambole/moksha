import { User, Product, Bid, UserRole, UserStatus } from '../types';

// Initial Mock Data
const INITIAL_USERS: User[] = [
  {
    id: 'admin1',
    fullName: 'Temple Admin',
    username: 'admin',
    password: 'password',
    mobile: '9999999999',
    role: UserRole.ADMIN,
    status: UserStatus.APPROVED,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'buyer1',
    fullName: 'Rohan Sharma',
    username: 'rohan',
    password: 'password',
    mobile: '8888888888',
    role: UserRole.BUYER,
    status: UserStatus.APPROVED,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Antique Brass Diya',
    description: 'A 19th-century handcrafted brass oil lamp with intricate carvings of peacocks.',
    basePrice: 5000,
    currentBid: 5500,
    imageUrl: 'https://picsum.photos/400/300',
    endTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'ACTIVE',
  },
  {
    id: 'p2',
    title: 'Sandalwood Mala',
    description: 'Authentic Mysore sandalwood beads, hand-knotted with silver caps.',
    basePrice: 12000,
    currentBid: 12000,
    imageUrl: 'https://picsum.photos/400/301',
    endTime: new Date(Date.now() + 172800000).toISOString(),
    status: 'ACTIVE',
  },
  {
    id: 'p3',
    title: 'Silk Pattachitra Painting',
    description: 'Traditional Odisha Pattachitra painting depicting the Dashavatar on pure silk cloth.',
    basePrice: 25000,
    currentBid: 28000,
    imageUrl: 'https://picsum.photos/400/302',
    endTime: new Date(Date.now() + 43200000).toISOString(),
    status: 'ACTIVE',
  },
];

const INITIAL_BIDS: Bid[] = [
  {
    id: 'b1',
    productId: 'p1',
    userId: 'buyer1',
    username: 'rohan',
    amount: 5500,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'b2',
    productId: 'p3',
    userId: 'buyer1',
    username: 'rohan',
    amount: 26000,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'b3',
    productId: 'p3',
    userId: 'buyer2_mock',
    username: 'priya_art',
    amount: 28000,
    timestamp: new Date(Date.now() - 1000000).toISOString(),
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockStore {
  constructor() {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem('bids')) {
      localStorage.setItem('bids', JSON.stringify(INITIAL_BIDS));
    }
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  private saveUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  private getProducts(): Product[] {
    return JSON.parse(localStorage.getItem('products') || '[]');
  }

  private saveProducts(products: Product[]) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  private getBids(): Bid[] {
    return JSON.parse(localStorage.getItem('bids') || '[]');
  }

  private saveBids(bids: Bid[]) {
    localStorage.setItem('bids', JSON.stringify(bids));
  }

  // User Methods
  async login(username: string, role: UserRole): Promise<User | null> {
    await delay(500);
    const users = this.getUsers();
    // Simplified login for demo (password check skipped in store, handled by UI roughly)
    const user = users.find(u => u.username === username && u.role === role);
    return user || null;
  }

  async register(user: Omit<User, 'id' | 'status' | 'createdAt'>): Promise<User> {
    await delay(800);
    const users = this.getUsers();
    if (users.find(u => u.username === user.username)) {
      throw new Error('Username already exists');
    }
    
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      status: UserStatus.PENDING, // Default pending
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  async getPendingUsers(): Promise<User[]> {
    await delay(300);
    return this.getUsers().filter(u => u.status === UserStatus.PENDING && u.role === UserRole.BUYER);
  }

  async approveUser(userId: string): Promise<void> {
    await delay(300);
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].status = UserStatus.APPROVED;
      this.saveUsers(users);
    }
  }

  async rejectUser(userId: string): Promise<void> {
    await delay(300);
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].status = UserStatus.REJECTED;
      this.saveUsers(users);
    }
  }

  // Product Methods
  async getAllProducts(): Promise<Product[]> {
    await delay(300);
    return this.getProducts();
  }

  async getProductById(id: string): Promise<Product | undefined> {
    await delay(200);
    return this.getProducts().find(p => p.id === id);
  }

  async addProduct(product: Omit<Product, 'id' | 'currentBid' | 'status'>): Promise<Product> {
    await delay(500);
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      currentBid: product.basePrice,
      status: 'ACTIVE',
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  // Bidding Methods
  async getBidsForProduct(productId: string): Promise<Bid[]> {
    await delay(200);
    return this.getBids().filter(b => b.productId === productId).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  async placeBid(userId: string, username: string, productId: string, amount: number): Promise<Bid> {
    await delay(400);
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) throw new Error('Product not found');
    if (amount <= products[productIndex].currentBid) throw new Error('Bid must be higher than current bid');

    // Update Product
    products[productIndex].currentBid = amount;
    this.saveProducts(products);

    // Create Bid
    const newBid: Bid = {
      id: Date.now().toString(),
      productId,
      userId,
      username,
      amount,
      timestamp: new Date().toISOString(),
    };

    const bids = this.getBids();
    bids.push(newBid);
    this.saveBids(bids);

    return newBid;
  }
}

export const mockStore = new MockStore();