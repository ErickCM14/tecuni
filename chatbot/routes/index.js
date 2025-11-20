import express from 'express';
import axios from 'axios';
import fs from 'fs';
import { Router } from 'express';
import { ChatbotController } from '../interfaces/controllers/ChatbotController.js';
const chatbotController = new ChatbotController();

const router = Router();

router.get('/', chatbotController.verify);
router.post('/', chatbotController.index);
router.get('/estimations', chatbotController.estimations);
router.get('/estimation/:phone', chatbotController.estimation);
router.post('/estimation', chatbotController.saveEstimation);
router.get('/download-estimation/:phone', chatbotController.downloadEstimation);
router.get('/pending-conversations', chatbotController.pendingConversations);
router.get('/pending-processing-conversations', chatbotController.processingPendingConversations);

// const VERIFY_TOKEN = 'miverifytoken';
// const WHATSAPP_TOKEN = 'EAAKQbqrZAqy4BPLt4ZCmsXTvvF74slgyXHkUMOXUuDI6YeMdaEFPpnwFsTzZCLKhB7VEsDlSea6mGKjcXMZAABBXRe4czdTqryEXdohrWSmgo7gU0FGhsr53f4TpVq0znJ47XsA2QbxPcguOHfMpESxEqtXfbecPl5qpklGNtrR5YaoMviesD9RoRc4t9dBtEl95h3h5B1Th1MxoYs7d62ZBZASnjkZBt9PVLW7ZBuZCUZCschiFGvbfbweqDZADeY3IAZDZD';
// const PHONE_NUMBER_ID = '103168086004644';
// const conversations = {};

// async function sendWhatsAppMessage(to, message) {
//   try {
//     const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

//     const response = await axios.post(
//       url,
//       {
//         messaging_product: 'whatsapp',
//         to,
//         type: 'text',
//         text: { body: message }
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     console.log('✅ Mensaje enviado:', response.data);
//   } catch (error) {
//     console.error('❌ Error al enviar mensaje:', error.response?.data || error.message);
//   }
// }

// router.get('/', (req, res) => {
//   const mode = req.query['hub.mode'];
//   const token = req.query['hub.verify_token'];
//   const challenge = req.query['hub.challenge'];

//   fs.appendFileSync('hook_test.txt', `Webhook llamado: GET\n`);

//   if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//     console.log('✅ Webhook verificado correctamente.');
//     return res.status(200).send(challenge);
//   } else {
//     console.log('❌ Verificación fallida.');
//     return res.sendStatus(403);
//   }
// });

// router.post('/', express.json(), async (req, res) => {
//   const entry = req.body.entry?.[0];
//   const changes = entry?.changes?.[0];
//   const value = changes?.value;
//   const message = value?.messages?.[0];

//   if (message) {
//     const from = message.from;
//     const text = message.text?.body?.trim();

//     if (!conversations[from]) {
//       conversations[from] = {
//         step: 0,
//         data: {}
//       };
//       await sendWhatsAppMessage(from, '👋 ¡Hola! ¿Cuál es tu nombre?');
//       await sendWhatsAppMessage(from, text);
//     } else {
//       const user = conversations[from];

//       switch (user.step) {
//         case 0:
//           user.data.name = text;
//           user.step++;
//           await sendWhatsAppMessage(from, '📧 ¿Cuál es tu correo electrónico?');
//           break;
//         case 1:
//           user.data.email = text;
//           user.step++;
//           await sendWhatsAppMessage(from, '🏢 ¿Cuál es tu empresa?');
//           break;
//         case 2:
//           user.data.company = text;
//           user.step++;
//           await sendWhatsAppMessage(from, "🛠️ ¿Qué tipo de servicio requieres?\n1. Desarrollo de software\n2. Ciberseguridad");
//           break;
//         case 3:
//           user.data.projectType = text === '1' ? 'Desarrollo de software' : 'Ciberseguridad';
//           user.step++;
//           await sendWhatsAppMessage(from, '📝 Describe brevemente tu proyecto:');
//           break;
//         case 4:
//           user.data.description = text;
//           user.step++;
//           await sendWhatsAppMessage(from, '✅ ¡Gracias! Hemos recibido tu información. Estoy procesando toda tu información para darte una estimación y plan de seguimiento.');
//           console.log('👤 Conversación completa:', user.data);

//           // Opcional: guardar en archivo o base de datos
//           fs.appendFileSync('conversaciones.txt', JSON.stringify({ from, ...user.data }, null, 2) + '\n');

//           // Reiniciar conversación si deseas
//           delete conversations[from];
//           break;
//         default:
//           await sendWhatsAppMessage(from, '🤖 Estoy procesando tu información. Por favor, espera.');
//       }
//     }
//   }

//   return res.sendStatus(200);
// });

export default router;
