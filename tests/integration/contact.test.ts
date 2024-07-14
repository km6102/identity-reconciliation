import { expect } from 'chai';
import request from 'supertest';

import app from '../../src/index';

describe('Contact APIs Test', () => {
  describe('POST /contact/identify', () => {
    it('should return object', (done) => {
      request(app)
        .post('/api/v1/contact/identify')
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.contact).to.be.an('object');

          done();
        });
    });
  });
});
