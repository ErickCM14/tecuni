// Config por plataforma (NO BD)
 const ANDROID_DEFAULTS = {
  priority: 'high',
  notification: {
    sound: 'default',
    color: '#2196F3',
    click_action: 'OPEN_ACTIVITY_NOTIFICATIONS'
  }
};

 const APNS_DEFAULTS = {
  payload: {
    aps: {
      sound: 'default',
      badge: 1
    }
  }
};

const WEBPUSH_DEFAULTS = {
  headers: { Urgency: 'high' },
  notification: { icon: 'https://miapp.com/icon.png' }
};

// 👇 Exporta las 3 constantes (CommonJS)
module.exports = {
  ANDROID_DEFAULTS,
  APNS_DEFAULTS,
  WEBPUSH_DEFAULTS
};