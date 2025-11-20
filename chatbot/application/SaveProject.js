export class SaveProject {
    constructor(ConversationRepo, Whatsapp, Conversations, OpenAiApi, OptionsEnum, Prompts) {
        this.conversationRepo = ConversationRepo;
        this.whatsapp = Whatsapp;
        this.conversations = Conversations;
        this.openAiApi = OpenAiApi;
        this.enumProjects = OptionsEnum;
        this.prompts = Prompts;

        this.aiSectors = {
            '1': {
                name: 'Gobierno',
                options: {
                    '1': 'Trámites más rápidos y eficientes.',
                    '2': 'Asistentes virtuales para atención ciudadana 24/7.',
                    '3': 'Detección de fraudes y análisis de riesgo.'
                }
            },
            '2': {
                name: 'Salud',
                options: {
                    '1': 'Diagnóstico por imagen y voz asistido por IA.',
                    '2': 'Modelos de predicción de enfermedades.',
                    '3': 'Monitoreo remoto y seguimiento personalizado.'
                }
            },
            '3': {
                name: 'Finanzas',
                options: {
                    '1': 'Análisis de crédito automatizado.',
                    '2': 'Prevención de fraudes en tiempo real.',
                    '3': 'Recomendaciones financieras personalizadas.'
                }
            },
            '4': {
                name: 'Industria',
                options: {
                    '1': 'Mantenimiento predictivo de maquinaria.',
                    '2': 'Control de calidad automatizado por visión computacional.',
                    '3': 'Optimización de cadena de suministro con IA.'
                }
            },
            '5': {
                name: 'Educación',
                options: {
                    '1': 'Plataformas adaptativas según rendimiento del estudiante.',
                    '2': 'Asistentes de aprendizaje personalizados.',
                    '3': 'Análisis de deserciones o bajo desempeño.'
                }
            }
        };

        this.consultingProfiles = {
            '1': 'Desarrollador Full Stack Sr',
            '2': 'Desarrollador Full Stack Middle',
            '3': 'Desarrollador Full Stack Jr',
            '4': 'Desarrollador Frontend Sr',
            '5': 'Desarrollador Frontend Middle',
            '6': 'Desarrollador Frontend Jr',
            '7': 'Desarrollador Backend Sr',
            '8': 'Desarrollador Backend Middle',
            '9': 'Desarrollador Backend Jr',
            '10': 'Desarrollador Mobile Sr',
            '11': 'Desarrollador Mobile Middle',
            '12': 'Desarrollador Mobile Jr',
            '13': 'QA Analyst',
            '14': 'QA Automation Engineer',
            '15': 'Business Analyst',
            '16': 'Científico de Datos',
            '17': 'Ingeniero de Datos',
            '18': 'Ingeniero DevOps',
            '19': 'Arquitecto Cloud',
            '20': 'Especialista en Ciberseguridad',
            '21': 'Diseñador UI/UX',
            '22': 'Scrum Master',
            '23': 'Product Owner',
            '24': 'Project Manager',
            '25': 'Líder Técnico',
            '26': 'Arquitecto de Soluciones',
            '27': 'Administrador de Base de Datos',
            '28': 'Ingeniero de Soporte',
            '29': 'Analista de Sistemas'
        };
    }

    async execute(message) {
        const from = message.from;
        try {
            const projectTypeText = "🛠️ ¿Qué tipo de servicio requieres?\n1. Desarrollo de software o Aplicaciones Móviles\n2. Fábrica de software\n3. Ciberseguridad\n4. Inteligencia Artificial\n5. Consultoria TI";
            const text = message.text?.body?.trim();

            if (!this.conversations[from]) {

                const conversation = await this.conversationRepo.findOne({ phone: from });
                if (!conversation) {
                    this.conversations[from] = {
                        step: 0,
                        data: { phone: from }
                    };
                    await this.conversationRepo.save({ phone: from });
                    await this.whatsapp.sendMessage(from, "👋 ¡Hola! Gracias por contactarnos, para poder ayudarte con tu proyecto, necesito recopilar un poco de información.\n\n¿Cuál es tu nombre?");
                } else {
                    await this.whatsapp.sendMessage(from, "👋 ¡Hola, " + conversation.name + "! un gusto verte de nuevo por aquí, estos son tus datos anteriormente guardados:\n\nNombre: " + conversation.name + "\nCorreo: " + conversation.email + "\nTeléfono de contacto: " + conversation.contactPhone + "\nEmpresa: " + conversation.company + "\n\n¿Deseas modificarlos o quieres continuar?\n1. Continuar\n2. Modificar");
                    this.conversations[from] = {
                        step: 0,
                        data: {},
                        modify: 1
                    };
                    this.conversations[from].data.phone = from;
                    this.conversations[from].data.name = conversation.name;
                    this.conversations[from].data.email = conversation.email;
                    this.conversations[from].data.contactPhone = conversation.contactPhone;
                    this.conversations[from].data.company = conversation.company;
                    return true;
                }
            } else {
                const user = this.conversations[from];
                
                if (user.modify && user.modify == '1') {

                    if (text.toString() !== '1' && text.toString() !== '2' && text.toLowerCase() !== 'continuar' && text.toLowerCase() !== 'modificar') {
                        await this.whatsapp.sendMessage(from, "❗Por favor, elige una opción válida:\n1-2 o escribe el nombre de la acción.");
                        return true;
                    }

                    const option = text == '1' || text.toLowerCase() == 'continuar' ? '1' : '2';

                    switch (option) {
                        case '1':
                            user.step = 4;
                            await this.whatsapp.sendMessage(from, projectTypeText);
                            break;
                        case '2':
                            await this.whatsapp.sendMessage(from, "¿Cuál es tu nombre?");
                            break;

                        default:
                            await this.whatsapp.sendMessage(from, "❗Por favor, elige una opción válida:\n1-2 o escribe el nombre de la acción.");
                            break;
                    }
                    delete user.modify;
                    return true;
                }

                if (user.modify) {
                    return true;
                }

                switch (user.step) {
                    case 0:
                        if (!text || text.length < 2) {
                            await this.whatsapp.sendMessage(from, "❗Por favor, escribe un nombre válido.");
                            break;
                        }
                        user.data.name = text;
                        user.step++;
                        await this.whatsapp.sendMessage(from, '📧 ¿Cuál es tu correo electrónico?');
                        break;
                    case 1:
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
                            await this.whatsapp.sendMessage(from, "❗Ese correo no es válido. Por favor, escribe un correo electrónico válido.");
                            break;
                        }
                        user.data.email = text;
                        user.step++;
                        await this.whatsapp.sendMessage(from, '📲 ¿Cuál es tu teléfono de contacto?');
                        break;
                    case 2:
                        if (!/^\+?\d{10,15}$/.test(text)) {
                            await this.whatsapp.sendMessage(from, "❗El número ingresado no es válido. Por favor, ingresa un número de teléfono válido (con o sin +).");
                            break;
                        }
                        user.data.contactPhone = text;
                        user.step++;
                        await this.whatsapp.sendMessage(from, '🏢 ¿Cuál es tu empresa?');
                        break;
                    case 3:
                        if (!text || text.length < 2) {
                            await this.whatsapp.sendMessage(from, "❗Por favor, escribe un nombre de empresa válido.");
                            break;
                        }
                        user.data.company = text;
                        user.step++;
                        await this.whatsapp.sendMessage(from, projectTypeText);
                        break;
                    case 4:
                        const normalizedText = this.normalizeText(text.toString());
                        if (this.enumProjects[text.toString()]) {
                            user.data.projectType = this.enumProjects[text.toString()];
                        } else {
                            const matchedOption = Object.values(this.enumProjects).find(
                                option => this.normalizeText(option) === normalizedText
                            );

                            if (matchedOption) {
                                user.data.projectType = matchedOption;
                            } else {
                                await this.whatsapp.sendMessage(from, "❗Por favor, elige una opción válida:\n1-5 o escribe el nombre del servicio.");
                                break;
                            }
                        }

                        if (user.data.projectType === this.enumProjects['4']) {
                            user.step = 40;
                            await this.whatsapp.sendMessage(from, '🤖 ¿En qué sector deseas aplicar IA?\n1. Gobierno\n2. Salud\n3. Finanzas\n4. Industria\n5. Educación');
                            break;
                        }

                        if (user.data.projectType === this.enumProjects['5']) {
                            user.step = 50;
                            await this.whatsapp.sendMessage(from, '⏳ ¿Para cuántos meses requieres el recurso?');
                            break;
                        }

                        user.step++;
                        await this.whatsapp.sendMessage(from, '📝 Describe brevemente tu proyecto:');
                        break;
                    case 5:
                        if (!text || text.length < 10) {
                            await this.whatsapp.sendMessage(from, "❗Por favor, escribe una descripción un poco más detallada del proyecto.");
                            break;
                        }
                        user.data.description = text;
                        user.step++;

                        const response = await this.openAiApi.query(text, from, this.prompts[user.data.projectType]);
                        await this.whatsapp.sendMessage(from, response.data);

                        await this.conversationRepo.save(user.data);
                        break;
                    case 40:
                        if (!this.aiSectors[text]) {
                            await this.whatsapp.sendMessage(from, '❗Por favor, selecciona un sector válido: 1-5.');
                            break;
                        }
                        user.data.aiSector = this.aiSectors[text].name;
                        user.step = 41;
                        const sectorOptions = this.aiSectors[text].options;
                        const sectorText = Object.entries(sectorOptions).map(([key, value]) => `${key}. ${value}`).join('\n');
                        await this.whatsapp.sendMessage(from, `📌 ¿Qué solución necesitas?\n${sectorText}`);
                        break;
                    case 41:
                        const sector = Object.values(this.aiSectors).find(s => s.name === user.data.aiSector);
                        if (!sector.options[text]) {
                            await this.whatsapp.sendMessage(from, '❗Por favor, selecciona una opción válida.');
                            break;
                        }
                        const aiOption = sector.options[text];
                        user.data.description = `sector ${user.data.aiSector} ${aiOption}`;
                        const aiResponse = await this.openAiApi.query(user.data.description, from, this.prompts[user.data.projectType]);
                        await this.whatsapp.sendMessage(from, aiResponse.data);
                        user.step = 6;
                        await this.conversationRepo.save(user.data);
                        break;
                    case 50:
                        if (!/^\d+$/.test(text)) {
                            await this.whatsapp.sendMessage(from, '❗Por favor, ingresa un número válido de meses.');
                            break;
                        }
                        user.data.consultingMonths = text;
                        user.step = 51;
                        await this.whatsapp.sendMessage(from, '👥 ¿Cuántos recursos requieres?');
                        break;
                    case 51:
                        if (!/^\d+$/.test(text) || parseInt(text) <= 0) {
                            await this.whatsapp.sendMessage(from, '❗Por favor, ingresa un número válido de recursos.');
                            break;
                        }
                        user.data.consultingResources = parseInt(text);
                        user.data.remainingResources = parseInt(text);
                        user.data.selectedProfiles = [];
                        user.step = 52;
                        await this.whatsapp.sendMessage(from, `📋 Selecciona el perfil que necesitas:\n${this.getConsultingProfilesText()}`);
                        break;
                    case 52:
                        if (!this.consultingProfiles[text]) {
                            await this.whatsapp.sendMessage(from, '❗Por favor, selecciona un perfil válido.');
                            break;
                        }
                        user.selectedProfile = this.consultingProfiles[text];
                        user.step = 53;
                        await this.whatsapp.sendMessage(from, `¿Cuántos recursos de ${this.consultingProfiles[text]} requieres? (Restantes: ${user.data.remainingResources})`);
                        break;
                    case 53:
                        if (!/^\d+$/.test(text)) {
                            await this.whatsapp.sendMessage(from, '❗Por favor, ingresa una cantidad válida.');
                            break;
                        }
                        const quantity = parseInt(text);
                        if (quantity <= 0 || quantity > user.data.remainingResources) {
                            await this.whatsapp.sendMessage(from, `❗Por favor, ingresa una cantidad entre 1 y ${user.data.remainingResources}.`);
                            break;
                        }
                        user.data.selectedProfiles.push({ profile: user.selectedProfile, quantity });
                        user.data.remainingResources -= quantity;
                        delete user.selectedProfile;
                        if (user.data.remainingResources > 0) {
                            user.step = 52;
                            await this.whatsapp.sendMessage(from, `📋 Selecciona el siguiente perfil (${user.data.remainingResources} recursos restantes):\n${this.getConsultingProfilesText()}`);
                        } else {
                            user.data.description = `Consultoria TI: ${user.data.consultingMonths} meses, ${user.data.consultingResources} recursos, Perfiles: ${user.data.selectedProfiles.map(p => `${p.profile} (${p.quantity})`).join(', ')}`;
                            const consultingResponse = await this.openAiApi.query(user.data.description, from, this.prompts[user.data.projectType]);
                            await this.whatsapp.sendMessage(from, consultingResponse.data);
                            user.step = 6;
                            await this.conversationRepo.save(user.data);
                        }
                        break;
                    default:
                        const responses = await this.openAiApi.query(text, from, this.prompts[user.data.projectType], user.data);

                        await this.whatsapp.sendMessage(from, responses.data);
                        if (responses.updateStatus) {
                            delete this.conversations[from];
                        }

                        // fs.appendFileSync('conversaciones-chatgpt.txt', JSON.stringify({ responses }, null, 2) + '\n');
                        break;
                }
            }
            return true;
        } catch (error) {
            console.error(error);
            return true;
            // await this.whatsapp.sendMessage(from, error.message);
            throw new Error(error.message);
        }
    }

    normalizeText(text) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    }

    getConsultingProfilesText() {
        return Object.entries(this.consultingProfiles)
            .map(([key, value]) => `${key}. ${value}`).join('\n');
    }
}
