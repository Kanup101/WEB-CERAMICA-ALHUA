export type CheckoutProvider = "mercadopago" | "stripe";

export type CheckoutItem = {
  id: string;
  name: string;
  quantity: number;
  unitPriceARS: number;
};

export type CheckoutRequest = {
  provider: CheckoutProvider;
  items: CheckoutItem[];
  successUrl: string;
  cancelUrl: string;
};
