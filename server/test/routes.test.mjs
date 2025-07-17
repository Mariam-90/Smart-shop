import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import router from '../routes/user.js'; // ודא שהנתיב נכון וכולל סיומת

const app = express();
app.use(express.json());
app.use(router);

describe('Route Tests', function() {
  this.timeout(10000); // מגדיל את מגבלת הזמן לבדיקות

  const validObjectId = new mongoose.Types.ObjectId(); // יצירת ObjectId תקף

  describe('GET /email/:email', function() {
    it('should return user without password', function(done) {
      request(app)
        .get('/email/noor19455@gmail.com')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('email', 'noor19455@gmail.com');
          expect(res.body).to.not.have.property('password');
          done();
        });
    });
  });

  describe('PUT /id/:id', function() {
    it('should update user name', function(done) {
      const userData = { firstName: 'John', lastName: 'Doe' };
      request(app)
        .put(`/id/${validObjectId}`) // שימוש ב-ObjectId תקף
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.user.firstName).to.equal('John');
          expect(res.body.user.lastName).to.equal('Doe');
          done();
        });
    });
  });

  describe('POST /tzunai/toggle', function() {
    it('should toggle tzunai status', function(done) {
      request(app)
        .post('/tzunai/toggle')
        .send({ id: validObjectId.toString() }) // שימוש ב-ObjectId תקף
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.user).to.have.property('isTzunai').that.is.a('boolean');
          done();
        });
    });
  });
});
