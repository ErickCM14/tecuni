import { mongoClient } from "../infrastructure/db/mongo/connection.js";
import { EstimateModel } from "../infrastructure/db/mongo/models/EstimateModel.js";
import { ConversationModel } from "../infrastructure/db/mongo/models/ConversationModel.js";
import { MongoEstimateRepository } from "../infrastructure/db/mongo/repositories/MongoEstimateRepository.js";
import { MongoConversationRepository } from "../infrastructure/db/mongo/repositories/MongoConversationRepository.js";

let repositories = null;
let currentDbEngine = null;

const DB_ENGINE = process.env.DB_ENGINE || "mongo"

export async function createRepository() {

  if (repositories && currentDbEngine === DB_ENGINE) {
    return repositories;
  }

  switch (DB_ENGINE) {
    case "mongo":
      if (!mongoClient.isConnected && !mongoClient.topology?.isConnected()) {
        await mongoClient.connect();
      }

      repositories = {
        estimateRepo: new MongoEstimateRepository(EstimateModel),
        conversationRepo: new MongoConversationRepository(ConversationModel),
      };
      currentDbEngine = DB_ENGINE;

      return repositories;

    // case "postgres":
    //   if (!postgresClient.isConnected()) await postgresClient.connect();
    //   repositories = { ... };
    //   currentDbEngine = DB_ENGINE;
    //   return repositories;

    default:
      throw new Error(`Database engine not supported: ${DB_ENGINE}`);
  }
}
