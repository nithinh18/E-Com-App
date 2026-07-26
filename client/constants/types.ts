export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    phone?: string;
    createdAt: string;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    images: string[];
    sizes?: string[];
    category:
        | {
              _id: string;
              name: string;
          }
        | string;
    stock: number;
    ratings: {
        average: number;
        count: number;
    };
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
}

export interface CartItem {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    size: string;
    price: number;
}

export interface Address {
    _id: string;
    type: "Home" | "Work" | "Other";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
}

export interface OrderItem {
    product: Product | string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    size?: string;
}

export interface Order {
    _id: string;
    user: User | string;
    orderNumber: string;
    items: OrderItem[];
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    orderStatus: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
    subtotal: number;
    shippingCost: number;
    tax: number;
    totalAmount: number;
    notes?: string;
    deliveredAt?: string;
    createdAt: string;
}

export interface AdminStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
}
