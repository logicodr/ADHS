// service-worker.js - Komplette verbesserte Version für ADHS Jetzt-Planer
const SW_VERSION = '2.0.0';
const CACHE_NAME = 'adhs-jetzt-planer-cache-v2';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/uplifting-intro-music-for-youtube-and-podcasts-by-joshua-wales-292600.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// ============================================================================
// ALARM STORAGE - IndexedDB für persistente Speicherung
// ============================================================================
class AlarmStorage {
  constructor() {
    this.dbName = 'ADHSPlannerDB';
    this.dbVersion = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store für Aufgaben-Alarme
        if (!db.objectStoreNames.contains('taskAlarms')) {
          const taskStore = db.createObjectStore('taskAlarms', { keyPath: 'id' });
          taskStore.createIndex('endTime', 'endTime', { unique: false });
        }
        
        // Store für Abfahrts-Alarm
        if (!db.objectStoreNames.contains('departureAlarm')) {
          db.createObjectStore('departureAlarm', { keyPath: 'id' });
        }
      };
    });
  }

  async saveTaskAlarm(taskId, taskName, endTime) {
    const transaction = this.db.transaction(['taskAlarms'], 'readwrite');
    const store = transaction.objectStore('taskAlarms');
    
    return store.put({
      id: taskId,
      name: taskName,
      endTime: endTime,
      createdAt: new Date().toISOString(),
      active: true
    });
  }

  async saveDepartureAlarm(departureTime, alarmMinutes, alarmTime) {
    const transaction = this.db.transaction(['departureAlarm'], 'readwrite');
    const store = transaction.objectStore('departureAlarm');
    
    return store.put({
      id: 'departure',
      departureTime: departureTime,
      alarmMinutes: alarmMinutes,
      alarmTime: alarmTime,
      active: true
    });
  }

  async getAllTaskAlarms() {
    const transaction = this.db.transaction(['taskAlarms'], 'readonly');
    const store = transaction.objectStore('taskAlarms');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result.filter(alarm => alarm.active));
      request.onerror = () => reject(request.error);
    });
  }

  async getDepartureAlarm() {
    const transaction = this.db.transaction(['departureAlarm'], 'readonly');
    const store = transaction.objectStore('departureAlarm');
    
    return new Promise((resolve, reject) => {
      const request = store.get('departure');
      request.onsuccess = () => {
        const result = request.result;
        resolve(result && result.active ? result : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTaskAlarm(taskId) {
    const transaction = this.db.transaction(['taskAlarms'], 'readwrite');
    const store = transaction.objectStore('taskAlarms');
    return store.delete(taskId);
  }

  async deleteDepartureAlarm() {
    const transaction = this.db.transaction(['departureAlarm'], 'readwrite');
    const store = transaction.objectStore('departureAlarm');
    return store.delete('departure');
  }

  async clearAllAlarms() {
    const transaction = this.db.transaction(['taskAlarms', 'departureAlarm'], 'readwrite');
    
    const taskStore = transaction.objectStore('taskAlarms');
    const departureStore = transaction.objectStore('departureAlarm');
    
    await Promise.all([
      taskStore.clear(),
      departureStore.clear()
    ]);
  }
}

// ============================================================================
// ALARM MANAGER - Robuste Alarm-Verwaltung mit Wiederherstellung
// ============================================================================
class RobustAlarmManager {
  constructor() {
    this.storage = new AlarmStorage();
    this.activeTimeouts = new Map();
    this.checkInterval = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      await this.storage.init();
      await this.restoreAllAlarms();
      this.startPeriodicCheck();
      this.isInitialized = true;
      console.log('[AlarmManager] Initialized successfully');
    } catch (error) {
      console.error('[AlarmManager] Initialization failed:', error);
    }
  }

  async restoreAllAlarms() {
    console.log('[AlarmManager] Restoring alarms from storage...');
    
    try {
      // Aufgaben-Alarme wiederherstellen
      const taskAlarms = await this.storage.getAllTaskAlarms();
      for (const alarm of taskAlarms) {
        await this.scheduleTaskAlarmFromStorage(alarm);
      }
      
      // Abfahrts-Alarm wiederherstellen
      const departureAlarm = await this.storage.getDepartureAlarm();
      if (departureAlarm) {
        await this.scheduleDepartureAlarmFromStorage(departureAlarm);
      }
      
      console.log(`[AlarmManager] Restored ${taskAlarms.length} task alarms and ${departureAlarm ? 1 : 0} departure alarm`);
    } catch (error) {
      console.error('[AlarmManager] Error restoring alarms:', error);
    }
  }

  async scheduleTaskAlarmFromStorage(alarm) {
    const now = new Date();
    const endTime = new Date(alarm.endTime);
    const timeUntilAlarm = endTime.getTime() - now.getTime();
    
    if (timeUntilAlarm <= 0) {
      // Alarm ist überfällig - sofort auslösen
      console.log(`[AlarmManager] Task alarm for '${alarm.name}' is overdue`);
      await this.triggerOverdueTaskAlarm(alarm.id, alarm.name);
      await this.storage.deleteTaskAlarm(alarm.id);
      return;
    }
    
    // Alarm planen
    const timeoutId = setTimeout(() => {
      this.triggerTaskAlarm(alarm.id, alarm.name);
    }, timeUntilAlarm);
    
    this.activeTimeouts.set(`task-${alarm.id}`, timeoutId);
    console.log(`[AlarmManager] Restored task alarm for '${alarm.name}' in ${Math.floor(timeUntilAlarm / 60000)} minutes`);
  }

  async scheduleDepartureAlarmFromStorage(alarm) {
    const now = new Date();
    const alarmTime = new Date(alarm.alarmTime);
    const timeUntilAlarm = alarmTime.getTime() - now.getTime();
    
    if (timeUntilAlarm <= 0) {
      // Alarm ist überfällig
      console.log('[AlarmManager] Departure alarm is overdue');
      await this.triggerOverdueDepartureAlarm(alarm.departureTime, alarm.alarmMinutes);
      await this.storage.deleteDepartureAlarm();
      return;
    }
    
    // Alarm planen
    const timeoutId = setTimeout(() => {
      this.triggerDepartureAlarm(alarm.departureTime, alarm.alarmMinutes);
    }, timeUntilAlarm);
    
    this.activeTimeouts.set('departure', timeoutId);
    console.log(`[AlarmManager] Restored departure alarm in ${Math.floor(timeUntilAlarm / 60000)} minutes`);
  }

  // Periodische Überprüfung (Backup-Mechanismus)
  startPeriodicCheck() {
    // Alle 30 Sekunden prüfen
    this.checkInterval = setInterval(() => {
      this.checkAlarms();
    }, 30000);
  }

  async checkAlarms() {
    const now = new Date();
    
    try {
      // Prüfe Aufgaben-Alarme
      const taskAlarms = await this.storage.getAllTaskAlarms();
      for (const alarm of taskAlarms) {
        const endTime = new Date(alarm.endTime);
        const timeUntilAlarm = endTime.getTime() - now.getTime();
        
        // Wenn Alarm überfällig ist (mit 1-Minuten-Puffer)
        if (timeUntilAlarm <= -60000) {
          console.log(`[AlarmManager] Found overdue task alarm: ${alarm.name}`);
          await this.triggerOverdueTaskAlarm(alarm.id, alarm.name);
          await this.storage.deleteTaskAlarm(alarm.id);
        }
        // Wenn Alarm bald fällig ist, aber kein Timeout aktiv
        else if (timeUntilAlarm <= 60000 && timeUntilAlarm > 0 && !this.activeTimeouts.has(`task-${alarm.id}`)) {
          console.log(`[AlarmManager] Rescheduling missing task alarm: ${alarm.name}`);
          await this.scheduleTaskAlarmFromStorage(alarm);
        }
      }
      
      // Prüfe Abfahrts-Alarm
      const departureAlarm = await this.storage.getDepartureAlarm();
      if (departureAlarm) {
        const alarmTime = new Date(departureAlarm.alarmTime);
        const timeUntilAlarm = alarmTime.getTime() - now.getTime();
        
        if (timeUntilAlarm <= -60000) {
          console.log('[AlarmManager] Found overdue departure alarm');
          await this.triggerOverdueDepartureAlarm(departureAlarm.departureTime, departureAlarm.alarmMinutes);
          await this.storage.deleteDepartureAlarm();
        }
        else if (timeUntilAlarm <= 60000 && timeUntilAlarm > 0 && !this.activeTimeouts.has('departure')) {
          console.log('[AlarmManager] Rescheduling missing departure alarm');
          await this.scheduleDepartureAlarmFromStorage(departureAlarm);
        }
      }
    } catch (error) {
      console.error('[AlarmManager] Error during periodic check:', error);
    }
  }

  async triggerTaskAlarm(taskId, taskName) {
    console.log(`[AlarmManager] Task alarm triggered: ${taskName}`);
    
    // Notification anzeigen
    await this.showTaskNotification(taskId, taskName);
    
    // Aus Speicher und aktiven Timeouts entfernen
    await this.storage.deleteTaskAlarm(taskId);
    this.activeTimeouts.delete(`task-${taskId}`);
    
    // Clients benachrichtigen
    await this.notifyClients({
      type: 'TASK_ALARM',
      taskId: taskId,
      taskName: taskName
    });
  }

  async triggerOverdueTaskAlarm(taskId, taskName) {
    console.log(`[AlarmManager] Overdue task alarm: ${taskName}`);
    
    await this.showTaskNotification(taskId, taskName, true);
    await this.notifyClients({
      type: 'TASK_ALARM_OVERDUE',
      taskId: taskId,
      taskName: taskName
    });
  }

  async triggerDepartureAlarm(departureTime, alarmMinutes) {
    console.log(`[AlarmManager] Departure alarm triggered: ${alarmMinutes} min before ${departureTime}`);
    
    await this.showDepartureNotification(departureTime, alarmMinutes);
    
    // Aus Speicher und aktiven Timeouts entfernen
    await this.storage.deleteDepartureAlarm();
    this.activeTimeouts.delete('departure');
    
    await this.notifyClients({
      type: 'DEPARTURE_ALARM',
      departureTime: departureTime,
      alarmMinutes: alarmMinutes
    });
  }

  async triggerOverdueDepartureAlarm(departureTime, alarmMinutes) {
    console.log(`[AlarmManager] Overdue departure alarm: ${departureTime}`);
    
    await this.showDepartureNotification(departureTime, alarmMinutes, true);
    await this.notifyClients({
      type: 'DEPARTURE_ALARM_OVERDUE',
      departureTime: departureTime,
      alarmMinutes: alarmMinutes
    });
  }

  async showTaskNotification(taskId, taskName, isOverdue = false) {
    const title = 'ADHS Jetzt-Planer';
    const body = isOverdue 
      ? `Aufgabe überfällig: ${taskName}` 
      : `Aufgabe abgeschlossen: ${taskName}`;
    
    return self.registration.showNotification(title, {
      body: body,
      icon: '/icon-192x192.png',
      badge: '/badge-96x96.png',
      tag: `task-${taskId}`,
      renotify: true,
      requireInteraction: true,
      vibrate: isOverdue ? [300, 100, 300, 100, 300] : [200, 100, 200],
      silent: false,
      actions: [
        { action: 'mark-done', title: 'Erledigt' },
        { action: 'snooze', title: 'Später' }
      ]
    });
  }

  async showDepartureNotification(departureTime, alarmMinutes, isOverdue = false) {
    const title = 'ADHS Jetzt-Planer';
    const body = isOverdue
      ? `Du solltest schon unterwegs sein! (${departureTime})`
      : `In ${alarmMinutes} Minuten musst du rausgehen!`;
    
    return self.registration.showNotification(title, {
      body: body,
      icon: '/icon-192x192.png',
      badge: '/badge-96x96.png',
      tag: 'departure',
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 200, 300, 200, 300],
      silent: false,
      actions: [
        { action: 'got-it', title: 'Verstanden' },
        { action: 'snooze-5', title: '+5 Min' }
      ]
    });
  }

  async notifyClients(data) {
    const clients = await self.clients.matchAll({
      includeUncontrolled: true,
      type: 'window'
    });
    
    for (const client of clients) {
      client.postMessage(data);
    }
  }

  // Öffentliche Methoden für Service Worker
  async scheduleTaskAlarm(taskId, taskName, endTime) {
    // In Datenbank speichern
    await this.storage.saveTaskAlarm(taskId, taskName, endTime);
    
    // Sofort planen
    const alarm = { id: taskId, name: taskName, endTime: endTime };
    await this.scheduleTaskAlarmFromStorage(alarm);
  }

  async cancelTaskAlarm(taskId) {
    // Aus Datenbank löschen
    await this.storage.deleteTaskAlarm(taskId);
    
    // Timeout abbrechen
    const timeoutId = this.activeTimeouts.get(`task-${taskId}`);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.activeTimeouts.delete(`task-${taskId}`);
    }
  }

  async scheduleDepartureAlarm(departureTime, alarmMinutes, alarmTime) {
    // In Datenbank speichern
    await this.storage.saveDepartureAlarm(departureTime, alarmMinutes, alarmTime);
    
    // Sofort planen
    const alarm = { departureTime, alarmMinutes, alarmTime };
    await this.scheduleDepartureAlarmFromStorage(alarm);
  }

  async cancelDepartureAlarm() {
    // Aus Datenbank löschen
    await this.storage.deleteDepartureAlarm();
    
    // Timeout abbrechen
    const timeoutId = this.activeTimeouts.get('departure');
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.activeTimeouts.delete('departure');
    }
  }

  async cancelAllAlarms() {
    // Aus Datenbank löschen
    await this.storage.clearAllAlarms();
    
    // Alle Timeouts abbrechen
    for (const [key, timeoutId] of this.activeTimeouts) {
      clearTimeout(timeoutId);
    }
    this.activeTimeouts.clear();
  }
}

// ============================================================================
// SERVICE WORKER EVENTS
// ============================================================================

// Globale Alarm-Manager Instanz
let alarmManager = null;

// Install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', SW_VERSION);
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .catch(error => console.error('[Service Worker] Cache failed:', error))
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', SW_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Cache cleanup
      caches.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      }),
      
      // Initialize alarm manager
      initializeAlarmManager(),
      
      // Take control
      self.clients.claim()
    ])
  );
});

// Initialize alarm manager
async function initializeAlarmManager() {
  try {
    alarmManager = new RobustAlarmManager();
    await alarmManager.init();
    console.log('[Service Worker] Alarm manager initialized');
  } catch (error) {
    console.error('[Service Worker] Failed to initialize alarm manager:', error);
  }
}

// Fetch event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return Promise.race([
          fetch(event.request),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), 5000)
          )
        ]);
      })
      .catch(() => {
        if (event.request.url.includes('.html') || event.request.url.endsWith('/')) {
          return caches.match('/');
        }
        
        return new Response('Offline - Resource not available', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// Message handling
self.addEventListener('message', async (event) => {
  console.log('[Service Worker] Received message:', event.data);
  
  if (!alarmManager) {
    await initializeAlarmManager();
  }
  
  const { type } = event.data;
  
  try {
    switch (type) {
      case 'SCHEDULE_TASK_ALARM':
        await alarmManager.scheduleTaskAlarm(
          event.data.taskId,
          event.data.taskName,
          event.data.endTime
        );
        break;
        
      case 'CANCEL_TASK_ALARM':
        await alarmManager.cancelTaskAlarm(event.data.taskId);
        break;
        
      case 'SCHEDULE_DEPARTURE_ALARM':
        await alarmManager.scheduleDepartureAlarm(
          event.data.departureTime,
          event.data.alarmMinutes,
          event.data.alarmTime
        );
        break;
        
      case 'CANCEL_DEPARTURE_ALARM':
        await alarmManager.cancelDepartureAlarm();
        break;
        
      case 'CANCEL_ALL_ALARMS':
        await alarmManager.cancelAllAlarms();
        break;
        
      case 'REGISTER_ALARMS':
        await registerAlarms(event.data);
        break;
        
      case 'GET_ALARM_STATUS':
        await sendAlarmStatus();
        break;
        
      default:
        console.warn('[Service Worker] Unknown message type:', type);
    }
  } catch (error) {
    console.error('[Service Worker] Error handling message:', error);
    
    const clients = await self.clients.matchAll();
    for (const client of clients) {
      client.postMessage({
        type: 'ERROR',
        error: error.message,
        originalMessage: event.data
      });
    }
  }
});

// Alarm-Registrierung
async function registerAlarms(data) {
  const { departureTime, departureAlarm, tasks } = data;
  
  await alarmManager.cancelAllAlarms();
  
  // Abfahrts-Alarm planen
  if (departureAlarm?.enabled) {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const now = new Date();
    const alarmDate = new Date(now);
    
    alarmDate.setHours(hours, minutes - departureAlarm.minutesBefore, 0, 0);
    
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    
    await alarmManager.scheduleDepartureAlarm(
      departureTime,
      departureAlarm.minutesBefore,
      alarmDate.toISOString()
    );
  }
  
  // Aufgaben-Alarme planen
  for (const task of tasks) {
    if (task.endTime) {
      await alarmManager.scheduleTaskAlarm(
        task.id,
        task.name,
        task.endTime
      );
    }
  }
}

// Alarm-Status senden
async function sendAlarmStatus() {
  try {
    const taskAlarms = await alarmManager.storage.getAllTaskAlarms();
    const departureAlarm = await alarmManager.storage.getDepartureAlarm();
    
    const clients = await self.clients.matchAll();
    for (const client of clients) {
      client.postMessage({
        type: 'ALARM_STATUS',
        taskAlarms: taskAlarms,
        departureAlarm: departureAlarm
      });
    }
  } catch (error) {
    console.error('[Service Worker] Error sending alarm status:', error);
  }
}

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'mark-done') {
    handleTaskComplete(event.notification.tag);
  } else if (event.action === 'snooze') {
    handleTaskSnooze(event.notification.tag);
  } else if (event.action === 'snooze-5') {
    handleDepartureSnooze();
  } else {
    openApp();
  }
});

async function handleTaskComplete(tag) {
  const taskId = tag.replace('task-', '');
  
  const clients = await self.clients.matchAll({ type: 'window' });
  for (const client of clients) {
    client.postMessage({
      type: 'TASK_COMPLETED',
      taskId: taskId
    });
  }
}

async function handleTaskSnooze(tag) {
  const taskId = tag.replace('task-', '');
  const newEndTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  
  try {
    const taskAlarms = await alarmManager.storage.getAllTaskAlarms();
    const task = taskAlarms.find(t => t.id === taskId);
    
    if (task) {
      await alarmManager.scheduleTaskAlarm(taskId, task.name, newEndTime);
    }
  } catch (error) {
    console.error('[Service Worker] Error snoozing task:', error);
  }
}

async function handleDepartureSnooze() {
  const newAlarmTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  
  try {
    const departureAlarm = await alarmManager.storage.getDepartureAlarm();
    if (departureAlarm) {
      await alarmManager.scheduleDepartureAlarm(
        departureAlarm.departureTime,
        departureAlarm.alarmMinutes,
        newAlarmTime
      );
    }
  } catch (error) {
    console.error('[Service Worker] Error snoozing departure:', error);
  }
}

async function openApp() {
  const clients = await self.clients.matchAll({ type: 'window' });
  
  for (const client of clients) {
    if (client.url.includes('/') && 'focus' in client) {
      return client.focus();
    }
  }
  
  if (self.clients.openWindow) {
    return self.clients.openWindow('/');
  }
}

// Background sync
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'restore-alarms') {
    event.waitUntil(
      initializeAlarmManager()
        .then(() => alarmManager.restoreAllAlarms())
        .catch(error => console.error('[Service Worker] Sync failed:', error))
    );
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Unhandled error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[Service Worker] Unhandled promise rejection:', event.reason);
});

console.log('[Service Worker] Enhanced service worker loaded', SW_VERSION);
