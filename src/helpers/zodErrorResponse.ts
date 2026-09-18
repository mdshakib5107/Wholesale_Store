
import { Response } from 'express'
export const zodErrorResponse = async (parsedData: any, res: Response) => {
  if (!parsedData.success) {

    return res.status(400).json({
      success: false,
      errors: parsedData.error.issues.map((e: any) => ({ expected: e.expected, path: e.path, message: e.message }))
    })
  }
}
