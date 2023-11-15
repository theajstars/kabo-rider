export interface Rider {
  address: string;
  bank_details: {
    account_no: string;
    bank_name: string;
    bank_code: string;
  };
  email: string;
  gender: string;
  lastname: string;
  othernames: string;
  phone: string;
  photo: string;
  role: {
    superAdmin: "No";
    admin: "No" | "Yes";
    rider: "No" | "Yes";
  };
  username: string;
}
export interface RiderStats {
  rider_id: string;
  available: "Yes" | "No";
  info: null;
  location: {
    address: string;
    longitude: string;
    latitude: string;
  };
  orders: {
    overall_successful: number;
    day_successful: number;
    overall_failed: number;
    today_failed: number;
    overall_request: number;
    today_request: number;
    overall_pending: number;
    today_pending: number;
  };
}

export interface Category {
  category_id: string;
  category_name: string;
  img: string;
}
export interface SubCategory {
  category_id: string;
  category_name: string;
  sub_category_id: string;
  sub_category_name: string;
}
export interface Product {
  id: string;
  name: string;
  amount: string;
  constant_amount: string;
  details: string;
  active: "Yes" | "No";
  category_id: string;
  category_name: string;
  sub_category_id: string;
  sub_category_name: string;
  quantity: string;
  weight: string;
  main_photo: string;
  location: string;
  photo_a: string;
  photo_b: string;
  photo_c: string;
  photo_d: string;
  store_id: string;
  store_name: string;
}
export interface Store {
  address: string;
  city: string;
  bankDetails: {
    account_no: string;
    bank_code: string;
    bank_name: string;
  };
  description: string;
  email: string;
  photo: string;
  metrics: {
    total_active_products: number;
    total_inactive_products: number;
    successful_orders: number;
    pending_orders: number;
    failed_orders: number;
  };
  name: string;
  phone: string;
  store_id: string;
}

export type OrderStatus =
  | "Pending"
  | "Successful"
  | "Failed"
  | "Delivery"
  | "Refund"
  | "Delivered"
  | "";

export type PaymentStatus = "Successful" | "Pending" | "Failed" | "";
export interface SimpleProduct {
  poid: string;
  id: string;
  name: string;
  quantity: string;
  amount: string;
  main_photo: string;
  vat: string;
  details: string;
}
export interface SimpleStore {
  store_id: string;
  name: string;
  address: string;
}
export interface SimpleSingleStore {
  store_id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  photo: string;
}
export interface Order {
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_timestamp: string;
  order_timestamp: string;
  reference_code: string;
  store: [
    {
      name: string;
      email: string;
      phone: string;
      address: string;
    }
  ];
  product: SimpleProduct[];
  customer: [
    {
      lastname: string;
      othernames: string;
      email: string;
      phone: string;
    }
  ];
  rider: {
    fullname: string;
    email: string;
    phone: string;
  };
  shipping: [
    {
      address: string;
      longitude: number;
      latitude: number;
      details: string;
      deliveryTracking: null | string;
    }
  ];
  amount: null | number;
}

export interface TeamMember {
  team_id: string;
  store_id: string;
  fullname: string;
  email: string;
  role: "admin" | "rider" | "owner";
  priviledge: "Yes" | "No";
  username: string;
  lastname: string;
  othernames: string;
  phone: string;
  active: "Yes" | "No";
  photo: string;
  address: string;
  dob: string;
  gender: string;
  nin: string;
  bvn: string;
  valid_license: string;
  bank_details: {
    account_no: string;
    bank_name: string;
    account_name: string;
  };
  next_of_kin: {
    nok_lastname: string;
    nok_othernames: string;
    nok_address: string;
    nok_phone: string;
    nok_valid_license: string;
  };
}
export interface Cart {
  product: null | SimpleProduct[];
  shipping: null | string;
  amount: {
    total: number;
    product: number;
    processor: number;
    shipping: number;
    vat: number;
    coupon: number;
  };
  quantity: number;
  store: null | SimpleStore[];
}

export interface SavedItem {
  favourite_id: string;
  id: string;
  name: string;
  amount: string;
  constant_amount: string;
  details: string;
  active: "Yes" | "No";
  category_id: string;
  category_name: string;
  sub_category_id: string;
  sub_category_name: string;
  quantity: string;
  weight: string;
  main_photo: string;
  location: string;
  photo_a: null;
  photo_b: null;
  photo_c: null;
  photo_d: null;
  store_id: string;
  store_name: string;
}
export interface Wallet {
  wallet_id: string;
  account: "panel" | "customer" | "rider";
  available_balance: string;
  ledger_balance: string;
  virtual_account: {
    virtual_account_bank_name: string;
    virtual_account_name: string;
    virtual_bank_code: string;
    virtual_account_no: string;
  };
}
export interface Bank {
  bank_code: string;
  bank_name: string;
}

export interface NotificationResponse {
  orders: Notification[];
  count: number;
  notice: string;
}
export interface Notification {
  reference_code: string;
  address: string;
  details: string;
}
export interface PaystackConfigProps {
  reference: string;
  amount: number;
  publicKey: string;
  email: string;
  text: string;
  onSuccess: any;
  onClose: any;
}

export interface Kyc {
  account: "customer" | "rider";
  type: "BVN" | "Phone Number Confirmation" | "Facial Biometrics Verification";
  kyc_id: string;
  code: "bvn" | "phone_number" | "face_comparison";
  status: "Successful" | "Pending" | "Failed";
}
