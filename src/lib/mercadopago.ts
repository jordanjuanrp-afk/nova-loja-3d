import { CartItem } from '../types';

interface PreferenceItem {
  id: string;
  title: string;
  picture_url: string;
  description: string;
  category_id: string;
  quantity: number;
  unit_price: number;
}

interface CreatePreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export async function createMercadoPagoPreference(
  items: CartItem[],
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street_name?: string;
      street_number?: string;
      zip_code?: string;
    };
  }
): Promise<CreatePreferenceResponse> {
  const preferenceItems: PreferenceItem[] = items.map((item) => ({
    id: item.id,
    title: item.name,
    picture_url: item.image,
    description: item.description.substring(0, 100),
    category_id: item.category,
    quantity: item.quantity,
    unit_price: item.price,
  }));

  const body = {
    items: preferenceItems,
    payer: {
      name: customerInfo?.name || 'Cliente',
      email: customerInfo?.email || 'cliente@email.com',
      phone: customerInfo?.phone ? {
        area_code: '11',
        number: customerInfo.phone,
      } : undefined,
      address: customerInfo?.address ? {
        street_name: customerInfo.address.street_name || 'Rua',
        street_number: customerInfo.address.street_number || '0',
        zip_code: customerInfo.address.zip_code || '00000000',
      } : undefined,
    },
    payment_methods: {
      excluded_payment_methods: [],
      excluded_payment_types: [
        { id: 'ticket' },
      ],
      installments: 12,
    },
    shipments: {
      mode: 'not_specified',
    },
    back_urls: {
      success: `${window.location.origin}/checkout/success`,
      failure: `${window.location.origin}/checkout/failure`,
      pending: `${window.location.origin}/checkout/pending`,
    },
    auto_return: 'approved',
    external_reference: `order_${Date.now()}`,
    notification_url: undefined,
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao criar preferência de pagamento');
  }

  return response.json();
}

export async function getMercadoPagoPaymentStatus(paymentId: string) {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar status do pagamento');
  }

  return response.json();
}
