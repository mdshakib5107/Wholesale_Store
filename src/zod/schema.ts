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
  amount: z.number()
});

const DigitalDetailsDTOSchema = z.object({
  accountName: z.string({ error: "Account name is required" }),
  accountHolder: z.string({ error: "Account holder is required" }),
  direction: z.enum([ "in", "out" ], { error: "Direction is required" }),
  accountNo: z.string({ error: "Account number is required" }),
  amount: z.number()
});

const BankPaymentSchema = z.object({
  method: z.literal("bank"),
  status: z.enum([ 'success', 'refund' ]),
  orderId: z.uuid(),
  discount: z.number().optional(),
  amount: z.number({ error: "Amount is required" }),
  bankDetails: BankDetailsDTOSchema,
});

const DigitalPaymentSchema = z.object({
  method: z.literal("digital"),
  orderId: z.uuid(),
  status: z.enum([ 'success', 'refund' ]),
  discount: z.number().optional(),
  amount: z.number({ error: "Amount is required" }),
  digitalDetails: DigitalDetailsDTOSchema,
});

const CashDTOSchema = z.object({
  method: z.literal("cash"),
  orderId: z.uuid(),
  discount: z.number().optional(),
  status: z.enum([ 'success', 'refund' ]),
  amount: z.number({ error: "Amount is required" }),
});

export const PaymentDTOSchema = z.discriminatedUnion("method", [
  BankPaymentSchema,
  DigitalPaymentSchema,
  CashDTOSchema,
]);
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