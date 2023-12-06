import { Router } from 'express';
import { User, Sector } from '../../app/controllers';
const router = Router();
const controller = new User();
const controllerSector = new Sector();

router
  .route('/users?')
  .post(controller.create)
  .get(controller.readAll)
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

router.route('/login').post(controller.login);
router.route('/auth?').post(controller.checkToken).get(controller.checkToken);

router
  .route('/sector?')
  .post(controllerSector.create)
  .get(controllerSector.readAll);

export default router;
