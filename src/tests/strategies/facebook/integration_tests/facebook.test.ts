import request from 'supertest';
import app from '../../../../app';


describe('Facebook Routes', () => {

    it('should redirect to Google OAuth', async () => {
        const response = await request(app).get('/auth/google');
        expect(response.status).toBe(302);
        expect(response.headers.location).toContain('accounts.google.com');
    });

    it('should redirect to Facebook OAuth', async () => {
        const response = await request(app).get('/auth/facebook');
        expect(response.status).toBe(302);
        expect(response.headers.location).toContain('facebook.com');
    });

});


