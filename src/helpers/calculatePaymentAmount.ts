export function calculatePaymentAmount(order: { totalAmount: number; discount: number | null | undefined }) {
  const discount = order.discount ?? 0; // handle null since column allows it
  const finalAmount = order.totalAmount - discount;
  return Math.max(finalAmount, 0); // guard against negative if discount > totalAmount
}