import { utils } from '@/lib/ipc'

/**
 * Trigger database seeding from the frontend
 */
export async function seedDatabase(): Promise<boolean> {
  try {
    const result = await utils.seedDatabase()
    console.log('Database seeded successfully')
    return result
  } catch (error) {
    console.error('Failed to seed database:', error)
    return false
  }
}

/**
 * Check if database needs seeding
 */
export async function checkIfDatabaseEmpty(): Promise<boolean> {
  // This would typically check the database, but for now we'll assume
  // the Rust side handles this automatically
  return false
}
