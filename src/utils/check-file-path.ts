import fs from 'fs'
import path from 'path'

export function checkFilePath(filePath: string): boolean {
  if (filePath.includes('\n')) {
    console.log('File path includes newline character')
    return false
  }

  function isFile(resolvedPath: string): boolean {
    try {
      const stats = fs.statSync(resolvedPath)

      return stats.isFile()
    } catch (error) {
      console.error('Error checking file at path:', resolvedPath, error)
      return false
    }
  }

  // Resolve the path relative to __dirname
  let resolvedPath = path.resolve(__dirname, filePath)
  if (isFile(resolvedPath)) {
    return true
  }

  // Resolve the path relative to the current working directory
  resolvedPath = path.resolve(process.cwd(), filePath)
  if (isFile(resolvedPath)) {
    return true
  }

  // If neither worked, log the issue and return false
  return false
}
