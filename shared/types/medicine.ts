export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  manufacturer: string;
  category: string;
  description: string;
  price: number;
  unit: string; // 'tablet', 'ml', 'mg', etc.
  packSize: number;
  requiresPrescription: boolean;
  inStock: boolean;
  stockQuantity: number;
  imageUrl?: string;
  sideEffects?: string[];
  contraindications?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicineOrder {
  id: string;
  patientId: string;
  pharmacyId?: string;
  items: OrderItem[];
  prescriptionId?: string;
  prescriptionImageUrl?: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: Address;
  deliveryFee: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
