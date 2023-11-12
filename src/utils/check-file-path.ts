import fs from 'fs'
import path from 'path'

export function checkFilePath(filePath: string): boolean {
  try {
    const resolvedPath = path.resolve(__dirname, filePath)

    const stats = fs.statSync(resolvedPath)

    if (!stats.isFile()) {
      return false
    }

    return true
  } catch (error) {
    console.log('Error checking file path: ', error)
    throw error
  }
}
