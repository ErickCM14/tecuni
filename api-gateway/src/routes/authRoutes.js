const express = require('express');
const axios = require('axios');
const services_v1 = require('../config/versions/v1/services');

const router = express.Router();

router.use('/', async (req, res, next) => {
    try {

        const service = 'auth';
        const version = req.baseUrl.split('/')[2];


        if (!service || !version) {
            return res.status(400).json({ error: 'Missing version or service' });
        }

        let baseUrl;
        switch (version) {
            case 'v1':
                baseUrl = services_v1[service];
                break;
            default:
                baseUrl = services_v1[service];
                break;
        }
        if (!baseUrl) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const fullPrefix = `/api/${version}/${service}`;
        const relativePath = req.originalUrl.slice(fullPrefix.length);

        // const targetUrl = `${baseUrl}/${version}/${service}${relativePath}`;
        const targetUrl = `${baseUrl}/${service}${relativePath}`;

        console.log(`➡️ Enviando a: ${targetUrl}`);

        const { method, headers, body } = req;

        const filteredHeaders = { ...headers };
        delete filteredHeaders['host'];
        delete filteredHeaders['content-length'];
        delete filteredHeaders['connection'];
        delete filteredHeaders['accept-encoding'];

        const response = await axios({
            method,
            url: targetUrl,
            data: body,
            timeout: 5000,
            headers: filteredHeaders,
        });

        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('❌ Error al reenviar:', err.message);
        if (err.code === 'ECONNABORTED') {
            return res.status(504).json({ success: false, message: 'Timeout al contactar microservicio' });
        }
        const error = err.response?.data ? err.response.data : { success: false, message: 'Error desconocido en el gateway' }
        if (typeof error == 'object') {
            res.status(err.response?.status || 500).json({ ...error });
        } else {
            res.status(err.response?.status || 500).send(error);
        }
    }
});

module.exports = router;
