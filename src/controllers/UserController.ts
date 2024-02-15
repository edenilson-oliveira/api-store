import { Request,Response } from 'express'

class UserController{
  public getUsers(req: Request,res: Response){
    res.json({
      message: 'Hello World'
    })
  }
}

const userController = new UserController()

export default userController