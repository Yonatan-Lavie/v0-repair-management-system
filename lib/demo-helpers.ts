// This file contains helper functions for managing demo data.
// In a real application, these operations would interact with a backend database.

import { demoData } from "./demo-data"

// Simulate fetching all repairs
export function getAllRepairs() {
  return demoData.repairs
}

// Simulate fetching a single repair by ID
export function getRepairById(id: string) {
  return demoData.repairs.find((repair) => repair.id === id)
}

// Simulate creating a new repair
export function createRepair(newRepair: any) {
  demoData.repairs.push(newRepair)
  return { success: true, repair: newRepair }
}

// Simulate updating an existing repair
export function updateRepair(updatedRepair: any) {
  const index = demoData.repairs.findIndex((r) => r.id === updatedRepair.id)
  if (index !== -1) {
    demoData.repairs[index] = updatedRepair
    return { success: true, repair: updatedRepair }
  }
  return { success: false, error: "Repair not found" }
}

// Simulate fetching all users
export function getAllUsers() {
  return demoData.users
}

// Simulate fetching a single user by ID
export function getUserById(id: string) {
  return demoData.users.find((user) => user.id === id)
}

// Simulate creating a new user
export function createUser(newUser: any) {
  demoData.users.push(newUser)
  return { success: true, user: newUser }
}

// Simulate updating an existing user
export function updateUser(updatedUser: any) {
  const index = demoData.users.findIndex((u) => u.id === updatedUser.id)
  if (index !== -1) {
    demoData.users[index] = updatedUser
    return { success: true, user: updatedUser }
  }
  return { success: false, error: "User not found" }
}

// Simulate deleting a user
export function deleteUser(userId: string) {
  const initialLength = demoData.users.length
  demoData.users = demoData.users.filter((user) => user.id !== userId)
  if (demoData.users.length < initialLength) {
    return { success: true }
  }
  return { success: false, error: "User not found" }
}

// Simulate fetching all shops
export function getAllShops() {
  return demoData.shops
}

// Simulate fetching a single shop by ID
export function getShopById(id: string) {
  return demoData.shops.find((shop) => shop.id === id)
}

// Simulate updating system settings
export function updateSettings(newSettings: any) {
  demoData.settings = { ...demoData.settings, ...newSettings }
  return { success: true, settings: demoData.settings }
}
