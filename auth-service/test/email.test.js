const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const EmailSender = require('../src/services/notifications/email');

// Mock de fs
jest.mock('fs', () => ({
    readFileSync: jest.fn()
}));

const fs = require('fs');

describe('EmailSender - OneSignal', () => {
    let mockAxios;
    let emailSender;

    beforeAll(() => {
        mockAxios = new MockAdapter(axios);

        emailSender = new EmailSender({
            oneSignalAppId: 'test-app-id',
            oneSignalApiKey: 'test-api-key',
        });
    });

    afterEach(() => {
        mockAxios.reset();
        jest.clearAllMocks();
    });

    it('debería enviar email correctamente', async () => {
        // Preparamos el contenido de la plantilla
        fs.readFileSync.mockReturnValue('<p>Hola {{NOMBRE}}, tu código es {{CODE}}</p>');

        // Simula respuesta exitosa de OneSignal
        mockAxios.onPost('https://onesignal.com/api/v1/notifications').reply(200, {
            id: 'mock-id-123',
            recipients: 1,
        });

        const result = await emailSender.sendEmail({
            toEmail: 'test@correo.com',
            subject: 'Verificación',
            template: 'email_verification.html',
            variables: {
                NOMBRE: 'Carlos',
                CODE: '654321',
            },
        });

        expect(result).toEqual({
            id: 'mock-id-123',
            recipients: 1,
        });

        // Validamos que se usaron las variables
        const lastRequest = mockAxios.history.post[0];
        const payload = JSON.parse(lastRequest.data);

        expect(payload.app_id).toBe('test-app-id');
        expect(payload.include_email_tokens).toContain('test@correo.com');
        expect(payload.email_subject).toBe('Verificación');
        expect(payload.email_body).toContain('Hola Carlos');
        expect(payload.email_body).toContain('654321');
    });

    it('debería lanzar error si OneSignal falla', async () => {
        fs.readFileSync.mockReturnValue('<p>Código: {{CODE}}</p>');

        mockAxios.onPost('https://onesignal.com/api/v1/notifications').reply(500);

        await expect(emailSender.sendEmail({
            toEmail: 'fail@correo.com',
            subject: 'Error Test',
            template: 'email_verification.html',
            variables: { CODE: '000000' },
        })).rejects.toThrow();
    });
});
