import { DBTransaction } from "@/db/types";
import { supplierSlips } from '@/db/schema/index';
import { BadRequestError } from '@/helpers/customErrors';
import { supplierSlipController } from '../index'
type Data = {
  supplierSlipId: string | undefined,
  supplierId: string | undefined,
  amount: number
}
type Allocation = {
  supplierSlipId: string,
  allocatedAmount: number,
  due: number,
  supplierId?: string
}
export const allocateSlipAmount = async (tx: DBTransaction, data: Data) => {
  if (!data.supplierId && !data.supplierSlipId) {
    throw new BadRequestError("Either supplierId or supplierSlipId is required ")
  }
  let allocation: Allocation[] = []
  if (data.supplierSlipId) {
    const slip = await supplierSlipController.findSupplierSlip({ tx, supplierSlipId: data.supplierSlipId });
    if (!slip) throw new Error("Slip not found")
    if (slip?.status == "paid") throw new BadRequestError("slip already paid");
    console.log(slip);
    allocation.push({ supplierSlipId: slip.supplierSlipId, allocatedAmount: data.amount, due: slip.due ?? 0, supplierId: slip.supplierId })
    return allocation
  }

  let remaining = data.amount
  const slips = await supplierSlipController.getSupplierSlips(tx, data.supplierId)
  for (let slip of slips!) {

    if (remaining <= 0) break
    const due = slip.due ?? 0
    const allocatedAmount = Math.min(remaining, due)
    allocation.push({
      allocatedAmount,
      supplierSlipId: slip.supplierSlipId,
      due
    })

    remaining -= allocatedAmount
  }
  return allocation
}