// environment.ts
export const environment = {
  production: true,
  // apiBase: 'http://ec2-18-118-241-165.us-east-2.compute.amazonaws.com',
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
    conversations: 'conversations',
  },
  faqsUrl: 'http://localhost:3001/faqs'
};
