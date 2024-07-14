import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class ContactValidator {
  public newUser = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string().optional().allow(null, ""),
      phoneNumber: Joi.string().optional().allow(null, ""),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
}

export default ContactValidator;
