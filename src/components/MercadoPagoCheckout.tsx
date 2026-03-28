import React, { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { X, CreditCard, Check, AlertCircle } from 'lucide-react';

initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);

interface MercadoPagoCheckoutProps {
  preferenceId: string | null;
  isLoading: boolean;
  onError: (error: string) => void;
}

export default function MercadoPagoCheckout({ preferenceId, isLoading, onError }: MercadoPagoCheckoutProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-medium">Carregando opções de pagamento...</p>
      </div>
    );
  }

  if (!preferenceId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle size={48} className="text-yellow-500" />
        <p className="text-gray-400 font-medium text-center">
          Não foi possível carregar o checkout.<br />
          Por favor, tente novamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <CreditCard size={24} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">Pagamento Seguro</h3>
          <p className="text-gray-500 text-sm">Processado pelo MercadoPago</p>
        </div>
      </div>
      
      <Wallet 
        initialization={{ preferenceId }}
        onError={(error: any) => {
          console.error('MercadoPago Error:', error);
          onError('Erro no pagamento. Por favor, tente novamente.');
        }}
      />
    </div>
  );
}
