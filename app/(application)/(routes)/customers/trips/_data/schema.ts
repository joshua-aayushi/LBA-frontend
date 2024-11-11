import z from "zod";
import { incomeSchema } from "../../incomes/[customerId]/view/[tripId]/_data/schema";
import { expenseSchema } from "../../expenses/[customerId]/view/[tripId]/_data/schema";

const statuses = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;
const salutations = ["mr", "mrs", "ms"] as const;

export const primaryDetailsTripSchema = z.object({
  title: z.string(),
  vehicleNumber: z.string(),
  from: z.string(),
  to: z.string(),
  status: z.enum(statuses),
  date: z.string(),
  lrNumber: z.string().optional(),
})

export const financeDetailsTripSchema = z.object({
  units: z.number(),
  rate: z.number(),
  subTotalAmount: z.number().min(0),
  isGST: z.boolean(),
  gstPercentage: z.number().min(0).optional(),
  gstAmount: z.number().min(0),
  totalAmount: z.number().min(0),
  advanceAmount: z.number().min(0),
  commissionAmount: z.number().min(0),  
  tsdShortageAmount: z.number().min(0),
  dueAmount: z.number().min(0),
  courier: z.string()
})

export const driverDetailsTripSchema = z.object({
  salutation: z.enum(salutations).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
})

export const tripSchema = z.object({
  _id: z.string().optional(),
  primaryDetails: primaryDetailsTripSchema,
  financeDetails: financeDetailsTripSchema,
  driverDetails: driverDetailsTripSchema.optional(),
  incomeDetails: incomeSchema.optional(),
  expenseDetails: expenseSchema.optional(),
})

export type PrimaryDetailsTrip = z.infer<typeof primaryDetailsTripSchema>;
export type FinanceDetailsTrip = z.infer<typeof financeDetailsTripSchema>;
export type DriverDetailsTrip = z.infer<typeof driverDetailsTripSchema>;
export type Trip = z.infer<typeof tripSchema>;