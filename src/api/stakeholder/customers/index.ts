import { getOrdersByCustomerId } from './getOrderByCustomerId';
import { getAllCustomers } from './getAllCustomers';
import { findCustomer } from './findCustomer';
export const customersApi = {
  getOrdersByCustomerId,
  getAllCustomers,
  findCustomer
};