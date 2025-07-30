"use server"

import { updateSettings as updateSettingsHelper } from "@/lib/demo-helpers"
import { auditLogger } from "@/lib/audit-logger"
import { getCurrentSession } from "./auth"

// Define types for settings (simplified for demo)
interface SystemSettings {
  systemName: string
  contactEmail: string
  supportPhone: string
  privacyPolicyUrl: string
  termsOfServiceUrl: string
  welcomeMessage: string
}

export async function updateSettings(
  newSettingsData: SystemSettings,
): Promise<{ success: boolean; settings?: SystemSettings; error?: string }> {
  const session = await getCurrentSession()
  if (!session || !session.user.permissions.includes("settings:write")) {
    return { success: false, error: "Unauthorized" }
  }

  const result = updateSettingsHelper(newSettingsData) // Use demo helper
  if (result.success) {
    auditLogger.log(session.user.id, session.user.name, "System Settings Updated", {
      updatedFields: Object.keys(newSettingsData),
    })
    return { success: true, settings: result.settings as SystemSettings }
  }
  return { success: false, error: result.error }
}
