import express from 'express';
import morgan from 'morgan';
import mainRoute from './route/mainRoute'
import 'dotenv/config'
import { errorHandler } from './helpers/errorHandler'
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './helpers/customErrors.ts'
import { db } from '@/db/index'
const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(mainRoute);




// TODO implement catchAsync function

// catch unmatch Url
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route: ${req.originalUrl} noytfound`, 404))
})

//  handling global error
app.use(errorHandler)

const port = process.env.PORT ?? 4001
app.listen(port, () => {
  console.log(`server running at port no: ${port}`)
})
export default app

