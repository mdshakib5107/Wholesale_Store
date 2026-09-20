import { createCustomer } from './createCustomer';
import { createSupplier } from './createSupplier'
import { updateCustomerTotalAmount } from './updateCustomerTotalAmount'
import { updateCustomerDueAmount } from './updateCustomerDueAmount'
import { findCustomer } from './findCustomer'
export const stakeholderController = {
  createCustomer,
  createSupplier,
  updateCustomerTotalAmount,
  updateCustomerDueAmount,
  findCustomer
}