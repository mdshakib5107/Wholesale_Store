import { Request, Response, NextFunction } from 'express';
import { stakeholderController } from '@/controller/stakeholder/index';

//import { BadRequestError } from '@/helpers/customErrors'
export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {

    //await stakeholderController.createUser()
    res.status(200).json({
      success: true,

    })
  } catch (e) {
    next(e)
  }
}