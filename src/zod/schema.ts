import { z } from "zod";

export const OrderDTOSchema = z.object({
  customerInfo: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string()
  }),
  orderItems: z.array(
    z.object({
      size: z.number(),
      quantity: z.number(),
      price: z.number(),
      supplierName: z.string(),
      gariNo: z.number(),
    }
    )
  )
})

export const ProductDTOSchema = z.object({
  supplierName: z.string(),
  phone: z.string(),
  address: z.string(),
  productName: z.string(),
  gariNo: z.number(),
})
export type OrderDTO = z.infer<typeof OrderDTOSchema>
export type ProductDTO = z.infer<typeof ProductDTOSchema>


/*payment schema start*/
const BankDetailsDTOSchema = z.object({
  bankName: z.string({ error: "Bank name is required" }),
  branchName: z.string({ error: "Branch name is required" }),
  accountHolder: z.string({ error: "Account holder is required" }),
  direction: z.enum([ "in", "out" ], { error: "Direction is required" }),
  accountNo: z.string({ error: "Account number is required" }),
  amount: z.number(),
});

const DigitalDetailsDTOSchema = z.object({
  accountName: z.string({ error: "Account name is required" }),
  accountHolder: z.string({ error: "Account holder is required" }),
  direction: z.enum([ "in", "out" ], { error: "Direction is required" }),
  accountNo: z.string({ error: "Account number is required" }),
  amount: z.number(),
});

const BankPaymentSchema = z.object({
  method: z.literal("bank"),
  bankDetails: BankDetailsDTOSchema,
});

const DigitalPaymentSchema = z.object({
  method: z.literal("digital"),
  digitalDetails: DigitalDetailsDTOSchema,
});

const CashPaymentSchema = z.object({
  method: z.literal("cash"),
});

const PaymentMethodSchema = z.discriminatedUnion("method", [
  BankPaymentSchema,
  DigitalPaymentSchema,
  CashPaymentSchema,
]);

export const PaymentDTOSchema = z.object({
  orderId: z.uuid(),
  discount: z.number().optional(),
  status: z.enum([ "success", "refund" ]),
  amount: z.number({ error: "Amount is required" }), // total order amount
  payment: z.array(PaymentMethodSchema).min(1),
});
export type PaymentDTO = z.infer<typeof PaymentDTOSchema>
/*payment schema end*/

export const SupplierSlipDTOSchema = z.object({
  supplierInfo: z.object({
    supplierName: z.string(),
    gariNo: z.number(),
  }),
  expenses: z.object({
    trackRent: z.number().optional(),
    commission: z.number(),
    laborFare: z.number(),
    mosque: z.number().optional(),
    communityFare: z.number().optional(),
    scaleFare: z.number().optional()
  })
})
export type SupplierSlipDTO = z.infer<typeof SupplierSlipDTOSchema>

/* deposit dto */

export const DepositDTOSchema = z.object({
  orderId: z.uuid().optional(),
  customerId: z.uuid().optional(),
  discount: z.number().optional(),
  amount: z.number(),
  status: z.enum([ "success", "refund" ]),
  payment: z.array(PaymentMethodSchema).min(1),
}).refine((data) => (data.customerId?.trim() || data.orderId?.trim()), {
  message: "Either customerId or orderId is required",
})
export type DepositDTO = z.infer<typeof DepositDTOSchema>