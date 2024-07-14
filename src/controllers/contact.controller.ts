/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import contactService from '../services/contact.service';

import { Request, Response, NextFunction } from 'express';

class ContactController {
  public ContactService = new contactService();

  /**
 * Controller to identify and return contacts linked to same person
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
public linkContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await this.ContactService.linkContact(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.OK,
      contact: data,
      message: 'Contact linked successfully'
    });
  } catch (error) {
    next(error);
  }
};
  
}

export default ContactController;
