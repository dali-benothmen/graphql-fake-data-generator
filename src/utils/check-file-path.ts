import fs from 'fs'
import path from 'path'

export function checkFilePath(filePath: string): boolean {
  if (filePath.includes('\n')) {
    return false
  }

  try {
    const resolvedPath = path.resolve(__dirname, filePath)
    const stats = fs.statSync(resolvedPath)

    return stats.isFile()
  } catch (error) {
    return false
  }
}
