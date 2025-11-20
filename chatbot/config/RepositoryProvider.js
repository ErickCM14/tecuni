import { createRepository } from './dbFactory.js';

let repositoryInstance = null;

export async function getRepositories() {
    if (!repositoryInstance) {
        repositoryInstance = await createRepository();
    }
    return repositoryInstance;
}
