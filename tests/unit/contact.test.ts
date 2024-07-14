import { expect } from 'chai';
import contactService from '../../src/services/contact.service';

describe('Contact', () => {
  describe('Post Identify', () => {
    it('should return object', async () => {
      const ContactService = new contactService();
      const result = await ContactService.linkContact({});
      expect(result).to.be.an('object');
    });
  });
});
