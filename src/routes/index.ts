import express, { IRouter } from 'express';
const router = express.Router();

import contactRoute from './contact.route';

/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/contact', new contactRoute().getRoutes());

  return router;
};

export default routes;
