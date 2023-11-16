import { Router } from "express";
import { User } from "../../app/controllers";
const router = Router()
const controller = new User()

router
    .route('/users?')
    .post(controller.create)
    .get(controller.readAll)
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)

export default router