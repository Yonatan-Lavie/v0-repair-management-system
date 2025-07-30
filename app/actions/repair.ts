"use server"

import { demoData, createRepair as createRepairHelper, updateRepair as updateRepairHelper } from "@/lib/demo-helpers"
import { auditLogger } from "@/lib/audit-logger"
import { getCurrentSession } from "./auth"

// Define types for repair (simplified for demo)
interface Repair {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  itemType: string
  itemBrand?: string
  itemModel?: string
  serialNumber?: string
  issueDescription: string
  estimatedCost: number
  status: string
  assignedTo?: string
  shopId: string
  createdAt: string
  updatedAt: string
  history: Array<{ status: string; timestamp: string; by: string; notes?: string }>
}

export async function createRepair(
  newRepairData: Omit<Repair, "id" | "createdAt" | "updatedAt" | "history">,
): Promise<{ success: boolean; repair?: Repair; error?: string }> {
  const session = await getCurrentSession()
  if (!session || !(session.user.role === "seller" || session.user.role === "shop-manager")) {
    return { success: false, error: "Unauthorized" }
  }

  const newRepair: Repair = {
    id: `REP${Date.now()}`, // Simple ID generation for demo
    ...newRepairData,
    estimatedCost: Number.parseFloat(newRepairData.estimatedCost as any), // Ensure number type
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [{ status: newRepairData.status, timestamp: new Date().toISOString(), by: session.user.name }],
  }

  const result = createRepairHelper(newRepair) // Use demo helper
  if (result.success) {
    auditLogger.log(session.user.id, session.user.name, "Repair Created", {
      repairId: newRepair.id,
      customer: newRepair.customerName,
    })
    return { success: true, repair: result.repair as Repair }
  }
  return { success: false, error: result.error }
}

export async function updateRepairStatus(
  updatedRepairData: Repair,
): Promise<{ success: boolean; repair?: Repair; error?: string }> {
  const session = await getCurrentSession()
  if (
    !session ||
    !(session.user.role === "technician" || session.user.role === "shop-manager" || session.user.role === "admin")
  ) {
    return { success: false, error: "Unauthorized" }
  }

  // In a real app, you'd fetch the existing repair from DB, then update
  const existingRepair = demoData.repairs.find((r) => r.id === updatedRepairData.id)
  if (!existingRepair) {
    return { success: false, error: "Repair not found" }
  }

  // Basic authorization check: user can only update repairs in their shop (unless admin)
  if (session.user.role !== "admin" && existingRepair.shopId !== session.user.shopId) {
    return { success: false, error: "Unauthorized to update this repair" }
  }

  const result = updateRepairHelper(updatedRepairData) // Use demo helper
  if (result.success) {
    auditLogger.log(session.user.id, session.user.name, "Repair Status Updated", {
      repairId: updatedRepairData.id,
      newStatus: updatedRepairData.status,
    })
    return { success: true, repair: result.repair as Repair }
  }
  return { success: false, error: result.error }
}
