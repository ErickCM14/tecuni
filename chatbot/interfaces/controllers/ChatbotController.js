import { Controller } from './Controller.js';
import { getRepositories } from '../../config/RepositoryProvider.js';
import { Whatsapp } from '../../services/meta/Whatsapp.js';
import { OpenAiApi } from '../../services/ai-service/openAiApiService.js';
import { SaveProject } from '../../application/SaveProject.js';
import { VERIFY_TOKEN, OPTIONS_ENUM } from '../../config/constants.js';
import { PROMPT_DESARROLLO_SOFTWARE, PROMPT_CIBERSEGURIDAD, PROMPT_FABRICA_SOFTWARE, PROMPT_INTELIGENCIA_ARTIFICIAL, PROMPT_CONSULTORIA_TI } from '../../services/ai-service/prompts/prompt_gpt.js';
import ExcelJS from 'exceljs';
import { Estimation } from '../../domain/entities/Estimation.js';
// import fs from 'fs';

export class ChatbotController extends Controller {

    constructor() {
        super();
        this.whatsapp = new Whatsapp();
        this.openAiApi = new OpenAiApi();
        this.conversations = {};
        this.verifyToken = VERIFY_TOKEN;
        this.optionsEnum = OPTIONS_ENUM;
        this.prompts = {
            [this.optionsEnum['1']]: PROMPT_DESARROLLO_SOFTWARE,
            [this.optionsEnum['2']]: PROMPT_FABRICA_SOFTWARE,
            [this.optionsEnum['3']]: PROMPT_CIBERSEGURIDAD,
            [this.optionsEnum['4']]: PROMPT_INTELIGENCIA_ARTIFICIAL,
            [this.optionsEnum['5']]: PROMPT_CONSULTORIA_TI
        };
    }

    index = async (req, res) => {
        try {
            const { conversationRepo } = await getRepositories();
            this.conversationRepository = conversationRepo;
            this.saveProject = new SaveProject(this.conversationRepository, this.whatsapp, this.conversations, this.openAiApi, this.optionsEnum, this.prompts);

            const entry = req.body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const message = value?.messages?.[0];

            if (message) {
                if (message.timestamp) {
                    const messageTime = parseInt(message.timestamp, 10) * 1000;
                    const ageMinutes = (Date.now() - messageTime) / 1000 / 60;

                    if (ageMinutes > 3) {
                        return res.status(200).send('Successfully');
                    }
                }
                res.status(200).send('Successfully');
                await this.saveProject.execute(message);
                return;
            }
            res.status(200).send('Successfully');
            // res.status(200).send('Successfully');
        } catch (error) {
            console.error(error.message);
            // this.sendResponse(res, error.message);
            return res.status(200).send(error.message);
            // this.sendError(res, error.message);
        }
    }

    verify = async (req, res) => {
        try {
            const mode = req.query['hub.mode'];
            const token = req.query['hub.verify_token'];
            const challenge = req.query['hub.challenge'];

            // fs.appendFileSync('hook_test.txt', `Wessbhook llamado: GET\n`);

            if (mode === 'subscribe' && token === this.verifyToken) {
                console.log('✅ Webhook verificado correctamente.');
                return res.status(200).send(challenge);
            } else {
                console.log('❌ Verificación fallida.');
                return res.sendStatus(403);
            }
        } catch (error) {
            return res.sendStatus(403);
        }
    }

    saveEstimation = async (req, res) => {
        try {
            const { phone } = req.body;
            if (!phone) {
                return this.sendResponse(res, 'Phone is required', null, false, 400);
            }

            const estimation = await this.openAiApi.generateEstimateByNumber(phone);
            this.sendResponse(res, 'Successfully', estimation);
        } catch (error) {
            this.sendError(res, error.message);
        }
    }

    estimation = async (req, res) => {
        try {
            const phone = req.params.phone;
            if (!phone) {
                return this.sendResponse(res, 'Phone is required', null, false, 400);
            }

            const { estimateRepo } = await getRepositories();
            this.estimateRepository = estimateRepo;
            const estimation = await this.estimateRepository.getEstimateByNumber(phone);

            if (!estimation) {
                return this.sendResponse(res, 'No estimate found for this number', null, false, 404);
            }
            this.sendResponse(res, 'Successfully', estimation);
        } catch (error) {
            this.sendError(res, error.message);
        }
    }

    estimations = async (req, res) => {
        try {
            const { estimateRepo } = await getRepositories();
            this.estimateRepository = estimateRepo;
            const result = await this.estimateRepository.getAllWithPagination(req.query);

            const items = result.data.map(doc => new Estimation(doc));
            this.sendResponse(res, "Successfully retrived", {
                items,
                pagination: result.pagination
            });
        } catch (error) {
            this.sendError(res, error.message);
        }
    }

    downloadEstimation = async (req, res) => {
        const { phone } = req.params;
        if (!phone) {
            return res.status(400).json({ error: 'Phone is required' });
        }
        try {
            const { estimateRepo } = await getRepositories();
            this.estimateRepository = estimateRepo;
            let estimation = await this.estimateRepository.getEstimateByNumber(phone);
            if (!estimation) {
                return res.status(404).json({ error: 'Estimation not found' });
            }

            estimation = new Estimation(estimation);

            // Crear datos para el Excel
            const datosExcel = [];

            // Agregar información básica
            datosExcel.push(['Número', phone]);
            datosExcel.push(['Nombre', estimation.name]);
            datosExcel.push(['Correo', estimation.email]);
            datosExcel.push(['Descripción', estimation.descripcion]);
            datosExcel.push(['Número de contacto', estimation.contactPhone]);
            datosExcel.push(['Compañia', estimation.company]);
            datosExcel.push(['Fecha de Creación', estimation.createdAt ? new Date(estimation.createdAt).toLocaleString() : 'N/A']);
            datosExcel.push([]); // Línea en blanco
            datosExcel.push(['Tipo de Proyecto', estimation.projectType]);
            datosExcel.push(['Total Costo', estimation.total_costo]);
            datosExcel.push(['Total Horas', estimation.total_horas]);
            datosExcel.push([]); // Línea en blanco

            // Procesar campos de la estimación
            Object.keys(estimation).forEach(key => {
                if (key !== 'phone' && key !== 'name' && key !== 'email' && key !== 'description' && key !== 'contactPhone' && key !== 'descripcion' && key !== 'company' && key !== 'projectType' && key !== 'total_costo' && key !== 'total_horas' && key !== 'createdAt' && key !== 'timestamp' && key !== '_id') {
                    const valor = estimation[key];

                    // Si es un array de módulos, procesarlos individualmente
                    if (Array.isArray(valor) && key.toLowerCase().includes('modulo')) {
                        datosExcel.push([key, '']); // Título de la sección
                        datosExcel.push(['Nombre del Módulo', 'Descripción', 'Horas']); // Encabezados

                        valor.forEach(modulo => {
                            if (typeof modulo === 'object' && modulo !== null) {
                                const nombre = modulo.nombre || modulo.name || modulo.titulo || 'Sin nombre';
                                const descripcion = modulo.descripcion || modulo.description || modulo.desc || 'Sin descripción';
                                const horas = modulo.horas || modulo.hours || modulo.tiempo || 'Sin especificar';
                                datosExcel.push([nombre, descripcion, horas]);
                            } else {
                                datosExcel.push([modulo, '', '']);
                            }
                        });
                        datosExcel.push([]); // Línea en blanco después de módulos
                    } else if (typeof valor === 'object' && valor !== null) {
                        datosExcel.push([key, JSON.stringify(valor, null, 2)]);
                    } else {
                        datosExcel.push([key, valor]);
                    }
                }
            });

            // Crear el workbook y worksheet con ExcelJS
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Estimación');

            // Agregar datos al worksheet
            datosExcel.forEach(row => {
                worksheet.addRow(row);
            });

            // Ajustar el ancho de las columnas
            worksheet.getColumn(1).width = 30;
            worksheet.getColumn(2).width = 50;
            worksheet.getColumn(3).width = 15; // Para la columna de horas

            // Generar el buffer del archivo Excel
            const excelBuffer = await workbook.xlsx.writeBuffer();

            // Configurar headers para descarga
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=estimation_${phone}.xlsx`);
            res.setHeader('Content-Length', excelBuffer.length);

            // Enviar el archivo
            res.send(excelBuffer);

        } catch (error) {
            console.error('Error al obtener estimación para el número:', phone, error);
            return this.sendError(res, error.message);
            if (error.message.includes('No se encontró estimación')) {
                return res.status(404).json({ error: 'Estimación no encontrada', detail: error.message });
            }
            return res.status(500).json({ error: 'Error al obtener la estimación', detail: error.message });
        }
    }

    pendingConversations = async (req, res) => {
        try {
            const { conversationRepo } = await getRepositories();
            this.conversationRepository = conversationRepo;
            const response = await this.conversationRepository.getPendingRecords();
            this.sendResponse(res, 'Successfully', response);
        } catch (error) {
            this.sendError(res, error.message);
        }
    }

    processingPendingConversations = async (req, res) => {
        try {
            const { conversationRepo } = await getRepositories();
            this.conversationRepository = conversationRepo;
            const pendingConversations = await this.conversationRepository.getPendingRecords();

            if (pendingConversations.length === 0) {
                return res.json({
                    mensaje: 'No hay conversaciones pendientes para procesar',
                    procesadas: 0,
                    conversaciones: []
                });
            }

            const resultados = [];
            let procesadas = 0;
            let errores = 0;

            for (const conversation of pendingConversations) {
                try {
                    console.log(`Procesando conversación para número: ${conversation.phone}`);

                    const estimacion = await this.openAiApi.generateEstimateByNumber(conversation.phone);
                    console.log(`Estimación generada y guardada para número: ${conversation.phone}`);

                    resultados.push({
                        numero: conversation.phone,
                        estado: 'procesada',
                        estimacion: estimacion,
                        mensaje: 'Estimación generada, guardada y estado actualizado correctamente'
                    });

                    procesadas++;
                    console.log(`Conversación procesada exitosamente para número: ${conversation.phone}`);

                } catch (error) {
                    console.error(`Error procesando conversación para número ${conversation.phone}:`, error);

                    resultados.push({
                        numero: conversation.phone,
                        estado: 'error',
                        error: error.message,
                        mensaje: 'Error al procesar la conversación'
                    });

                    errores++;
                }
            }

            return res.json({
                mensaje: `Procesamiento completado. ${procesadas} conversaciones es procesadas, ${errores} errores`,
                total_conversaciones: pendingConversations.length,
                procesadas: procesadas,
                errores: errores,
                resultados: resultados
            });

        } catch (error) {
            console.error('Error general al procesar conversaciones pendientes:', error);
            return this.sendError(res, error.message);
            return res.status(500).json({
                error: 'Error al procesar conversaciones pendientes',
                detail: error.message
            });
        }
    }
}