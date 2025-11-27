// environment.ts
export const environment = {
  production: false,
  apiBase: 'http://localhost:3000',
  versions: {
    v1: '/api/v1',
    v2: '/api/v2'
  },
  endpoints: {
    auth: 'auth',
    users: 'users',
    faqs: 'questionnaire',
    notifications: 'push-notification',
    conversations: 'chatbot/conversations',
  },
  faqsUrl: 'http://localhost:3000/faqs'
};
