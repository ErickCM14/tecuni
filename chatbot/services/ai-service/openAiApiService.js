import OpenAI from "openai";
import { getRepositories } from "../../config/RepositoryProvider.js";
import { PROMPT_DESARROLLO_SOFTWARE, PROMPT_ESTIMACION_JSON } from "./prompts/prompt_gpt.js";
import { BASE_URL_OPENROUTER, OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENAI_API_KEY, OPENAI_MODEL } from "../../config/constants.js";

export class OpenAiApi {
    constructor() {
        this.base_url_openrouter = BASE_URL_OPENROUTER;
        // this.apiKey = OPENROUTER_API_KEY;
        this.apiKey = OPENAI_API_KEY;
        // this.model_name = OPENROUTER_MODEL;
        this.model_name = OPENAI_MODEL;
        this.openai = new OpenAI({
            // baseURL: this.base_url_openrouter,
            // apiKey: this.apiKey
            apiKey: this.apiKey
        });
    }

    query = async (message, phone, prompt = PROMPT_DESARROLLO_SOFTWARE, additionalData = null) => {
        if (!message) {
            throw new Error('Message is required');
        }
        let updateStatus = false;
        const { conversationRepo } = await getRepositories();
        this.conversationRepository = conversationRepo;

        // Obtener historial del usuario
        const record = await this.conversationRepository.getConversationByPhone(phone);
        let chat_log;
        if (!record || record.length === 0) {
            chat_log = [
                { role: "system", content: prompt },
                { role: "user", content: message }
            ];
        } else {
            chat_log = [{ role: "system", content: prompt }, ...record, { role: "user", content: message }];
        }

        try {
            const completion = await this.openai.chat.completions.create({
                model: this.model_name,
                messages: chat_log,
                temperature: 0.1,
            });

            if (
                !completion.choices ||
                !completion.choices[0] ||
                !completion.choices[0].message
            ) {
                throw new Error("Invalid response API OPENROUTER");
            }

            const response = completion.choices[0].message.content;

            // await guardarMensaje(phone, "user", message);
            await this.conversationRepository.saveMessage(phone, "user", message);
            // await guardarMensaje(phone, "assistant", response);
            await this.conversationRepository.saveMessage(phone, "assistant", response);
            if (response.includes("contacto@kodit.com.mx")) {
                await this.conversationRepository.updatePendingStatus(phone, 0);
                updateStatus = true;
                const record = await this.conversationRepository.getAntepenultimateMessageAssistant(phone);
                if (additionalData) {
                    const data = {
                        name: additionalData.name,
                        email: additionalData.email,
                        contactPhone: additionalData.contactPhone,
                        company: additionalData.company,
                        projectType: additionalData.projectType,
                        resume: record ? record : null
                    }
                    await this.generateEstimateByNumber(phone, data);
                } else {
                    await this.generateEstimateByNumber(phone);
                }
                await this.conversationRepository.cleanMessages(phone);
            }

            const res = { data: response, updateStatus };
            return res;
        } catch (error) {
            console.error("Query error IA:", error);
            throw error;
        }
    }

    // generarEstimacionPorNumero = async (phone) => {
    generateEstimateByNumber = async (phone, additionalData = null) => {
        const { estimateRepo, conversationRepo } = await getRepositories();
        this.conversationRepository = conversationRepo;

        const record = await this.conversationRepository.getConversationByPhone(phone);
        if (!record || record.length === 0) {
            throw new Error("Records not found");
        }

        const messages = record.map(msg => ({
            role: msg.rol || msg.role,
            content: msg.mensaje || msg.content
        }));

        const chat_log = [
            ...messages,
            { role: "system", content: PROMPT_ESTIMACION_JSON }
        ];

        try {
            const completion = await this.openai.chat.completions.create({
                model: this.model_name,
                messages: chat_log,
                temperature: 0.1,
            });
            if (
                !completion.choices ||
                !completion.choices[0] ||
                !completion.choices[0].message
            ) {
                console.error("Invalid response from IA API (estimate by phone):");
                console.error("completion:", JSON.stringify(completion, null, 2));
                throw new Error("Invalid response from IA API");
            }
            const response = completion.choices[0].message.content;
            try {
                this.estimateRepository = estimateRepo;

                const estimationJSON = await this.cleanResponseEstimation(response);
                // console.log("Estimation JSON:", estimationJSON);

                // await guardarEstimacion(phone, estimationJSON);
                await this.estimateRepository.saveEstimate(phone, estimationJSON, additionalData ? additionalData : {});
                // await actualizarEstadoPendiente(phone, 2);
                await this.conversationRepository.updatePendingStatus(phone, 2);
                // console.log(`Estimate saved in the database for the number: ${phone}`);

                return estimationJSON;
            } catch (parseError) {
                console.error("Error parsing JSON response:", parseError);
                throw new Error("Estimate saved in the database for the number");
            }
        } catch (error) {
            console.error("Error generating JSON estimate by number:", error);
            throw error;
        }
    }

    cleanResponseEstimation = async (response) => {
        let jsonResponse;
        try {
            let cleanedResponse = response;

            if (typeof response === "string") {
                cleanedResponse = response.replace(/^```json\n?/, "");
                cleanedResponse = cleanedResponse.replace(/\n?```$/, "");
                cleanedResponse = cleanedResponse.replace(/^"|"$/g, "");
            }

            try {
                jsonResponse =
                    typeof cleanedResponse === "string"
                        ? JSON.parse(cleanedResponse)
                        : cleanedResponse;
            } catch (error) {
                // Si hay error
                jsonResponse = { error: "The response is not in JSON format." };
            }
            return jsonResponse;
        } catch (error) {
            console.error("Error converting the response", error);
            jsonResponse = { error: "Error converting the response" };
            return jsonResponse;
        }
    }
}