import { PackageCheck, User, X } from 'lucide-react';
import { OrderRecord } from '../types/market';
import { formatPeso } from '../utils/marketLogic';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  onShopNow: () => void;
}

export function AccountModal({
  isOpen,
  onClose,
  orders,
  onShopNow,
}: AccountModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1E11]/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div className="bg-white rounded-2xl border border-[#DCE3D5] w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-xl">
        <div className="px-6 py-4 border-b border-[#EEF2EA] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-[#ECFDF5] text-[#166534] flex items-center justify-center">
              <User className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="account-modal-title" className="font-display text-lg font-bold text-[#1A241B]">
                Customer Account
              </h2>
              <p className="text-xs text-[#5A6B5D]">Market Member · Recent Orders</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer account dialog"
            className="w-9 h-9 rounded-lg hover:bg-[#F5F7F2] text-[#4A584C] flex items-center justify-center"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {orders.length === 0 ? (
            <div className="text-center py-6 space-y-3">
              <PackageCheck className="w-10 h-10 text-[#166534]/70 mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#1A241B]">No completed orders yet</p>
              <p className="text-xs text-[#5A6B5D] max-w-xs mx-auto">
                Once you place an order for vegetables, meats, or seafood, your receipts and tracking details will appear here.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onShopNow();
                }}
                className="px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white text-xs font-semibold"
              >
                Browse Market Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="rounded-xl border border-[#E2E8DC] bg-[#F9FAF7] p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#1A241B] tabular-nums">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-sm font-bold text-[#166534] tabular-nums">
                      {formatPeso(order.total)}
                    </span>
                  </div>
                  <p className="text-xs text-[#166534] font-medium">{order.status}</p>
                  <p className="text-xs text-[#5A6B5D]">{order.fulfillmentLabel}</p>
                  <p className="text-xs text-[#6B7A6D]">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {order.createdAt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
