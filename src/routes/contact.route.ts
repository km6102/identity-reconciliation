import express, { IRouter } from 'express';
import contactController from '../controllers/contact.controller';
import contactValidator from '../validators/contact.validator';
import { userAuth } from '../middlewares/auth.middleware';

class ContactRoutes {
  private ContactController = new contactController();
  private router = express.Router();
  private ContactValidator = new contactValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {

    //route to identify and return contacts linked to same person
    this.router.post(
      '/identify',
      this.ContactValidator.newUser,
      this.ContactController.linkContact
    );
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default ContactRoutes;
