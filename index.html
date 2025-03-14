// service-worker.js for ADHS Jetzt-Planer
// Handles background notifications for tasks and departure alarms

const SW_VERSION = '1.0.0';
const CACHE_NAME = 'adhs-jetzt-planer-cache-v1';

// Assets to cache for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/uplifting-intro-music-for-youtube-and-podcasts-by-joshua-wales-292600.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Scheduled alarms storage
const scheduledAlarms = {
  tasks: new Map(), // Maps task ID to alarm data
  departure: null   // Departure alarm data
};

// Install event - cache assets for offline use
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...', SW_VERSION);
  
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  // Cache assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...', SW_VERSION);
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  // Ensure the service worker takes control immediately
  return self.clients.claim();
});

// Fetch event - serve cached assets when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request);
      })
      .catch(() => {
        // Fallback for offline resources, e.g. show offline page
        return caches.match('/');
      })
  );
});

// Message event - handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Received message:', event.data);
  
  // Destructure message data
  const { type } = event.data;
  
  switch (type) {
    case 'SCHEDULE_TASK_ALARM':
      scheduleTaskAlarm(event.data);
      break;
      
    case 'CANCEL_TASK_ALARM':
      cancelTaskAlarm(event.data.taskId);
      break;
      
    case 'SCHEDULE_DEPARTURE_ALARM':
      scheduleDepartureAlarm(event.data);
      break;
      
    case 'CANCEL_DEPARTURE_ALARM':
      cancelDepartureAlarm();
      break;
      
    case 'CANCEL_ALL_ALARMS':
      cancelAllAlarms();
      break;
      
    case 'REGISTER_ALARMS':
      registerAlarms(event.data);
      break;
  }
});

// Schedule a task alarm
function scheduleTaskAlarm(data) {
  const { taskId, taskName, endTime } = data;
  
  // Calculate time until alarm
  const now = new Date();
  const alarmTime = new Date(endTime);
  const timeUntilAlarm = alarmTime.getTime() - now.getTime();
  
  // Don't schedule if the time is in the past
  if (timeUntilAlarm <= 0) {
    console.log('[Service Worker] Task alarm time is in the past, not scheduling');
    return;
  }
  
  console.log(`[Service Worker] Scheduling task alarm for '${taskName}' in ${Math.floor(timeUntilAlarm / 60000)} minutes`);
  
  // Store the task data
  const alarmData = {
    id: taskId,
    name: taskName,
    time: alarmTime,
    timeoutId: setTimeout(() => triggerTaskAlarm(taskId, taskName), timeUntilAlarm)
  };
  
  // Add to map of scheduled alarms
  scheduledAlarms.tasks.set(taskId, alarmData);
}

// Cancel a task alarm
function cancelTaskAlarm(taskId) {
  const alarmData = scheduledAlarms.tasks.get(taskId);
  
  if (alarmData) {
    console.log(`[Service Worker] Cancelling task alarm for ID: ${taskId}`);
    
    // Clear the timeout
    clearTimeout(alarmData.timeoutId);
    
    // Remove from map
    scheduledAlarms.tasks.delete(taskId);
  }
}

// Schedule departure alarm
function scheduleDepartureAlarm(data) {
  const { departureTime, alarmMinutes, alarmTime } = data;
  
  // Calculate time until alarm
  const now = new Date();
  const alarm = new Date(alarmTime);
  const timeUntilAlarm = alarm.getTime() - now.getTime();
  
  // Don't schedule if the time is in the past
  if (timeUntilAlarm <= 0) {
    console.log('[Service Worker] Departure alarm time is in the past, not scheduling');
    return;
  }
  
  console.log(`[Service Worker] Scheduling departure alarm ${alarmMinutes} minutes before ${departureTime}`);
  console.log(`[Service Worker] Alarm will trigger in ${Math.floor(timeUntilAlarm / 60000)} minutes`);
  
  // Cancel any existing departure alarm
  cancelDepartureAlarm();
  
  // Store the departure alarm data
  scheduledAlarms.departure = {
    departureTime: departureTime,
    alarmMinutes: alarmMinutes,
    time: alarm,
    timeoutId: setTimeout(() => triggerDepartureAlarm(departureTime, alarmMinutes), timeUntilAlarm)
  };
}

// Cancel departure alarm
function cancelDepartureAlarm() {
  if (scheduledAlarms.departure) {
    console.log('[Service Worker] Cancelling departure alarm');
    
    // Clear the timeout
    clearTimeout(scheduledAlarms.departure.timeoutId);
    
    // Reset departure alarm
    scheduledAlarms.departure = null;
  }
}

// Cancel all alarms
function cancelAllAlarms() {
  console.log('[Service Worker] Cancelling all alarms');
  
  // Cancel all task alarms
  for (const [taskId, alarmData] of scheduledAlarms.tasks) {
    clearTimeout(alarmData.timeoutId);
  }
  
  // Clear tasks map
  scheduledAlarms.tasks.clear();
  
  // Cancel departure alarm
  cancelDepartureAlarm();
}

// Register multiple alarms from main app
function registerAlarms(data) {
  const { departureTime, departureAlarm, tasks } = data;
  
  // Cancel all existing alarms first
  cancelAllAlarms();
  
  // Schedule departure alarm
  if (departureAlarm.enabled) {
    // Calculate alarm time
    const departureHours = parseInt(departureTime.split(':')[0]);
    const departureMinutes = parseInt(departureTime.split(':')[1]);
    
    const now = new Date();
    const alarmDate = new Date(now);
    
    // Set to departure time
    alarmDate.setHours(departureHours);
    alarmDate.setMinutes(departureMinutes);
    
    // Subtract alarm minutes
    alarmDate.setMinutes(alarmDate.getMinutes() - departureAlarm.minutesBefore);
    
    // If the time is in the past, add a day
    if (alarmDate < now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    
    // Schedule the alarm
    scheduleDepartureAlarm({
      departureTime: departureTime,
      alarmMinutes: departureAlarm.minutesBefore,
      alarmTime: alarmDate.toISOString()
    });
  }
  
  // Schedule task alarms
  for (const task of tasks) {
    if (task.endTime) {
      scheduleTaskAlarm({
        taskId: task.id,
        taskName: task.name,
        endTime: task.endTime
      });
    }
  }
}

// Trigger task alarm
function triggerTaskAlarm(taskId, taskName) {
  console.log(`[Service Worker] Task alarm triggered for: ${taskName}`);
  
  // Show notification
  self.registration.showNotification('ADHS Jetzt-Planer', {
    body: `Aufgabe abgeschlossen: ${taskName}`,
    icon: '/icon-192x192.png',
    badge: '/badge-96x96.png',
    tag: `task-${taskId}`,
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    silent: false
  });
  
  // Remove from scheduled alarms
  scheduledAlarms.tasks.delete(taskId);
  
  // Try to notify any open clients
  notifyClients({
    type: 'TASK_ALARM',
    taskId: taskId,
    taskName: taskName
  });
}

// Trigger departure alarm
function triggerDepartureAlarm(departureTime, alarmMinutes) {
  console.log(`[Service Worker] Departure alarm triggered: ${alarmMinutes} minutes before ${departureTime}`);
  
  // Show notification
  self.registration.showNotification('ADHS Jetzt-Planer', {
    body: `In ${alarmMinutes} Minuten musst du rausgehen!`,
    icon: '/icon-192x192.png',
    badge: '/badge-96x96.png',
    tag: 'departure',
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 200, 300, 200, 300],
    silent: false
  });
  
  // Reset departure alarm
  scheduledAlarms.departure = null;
  
  // Try to notify any open clients
  notifyClients({
    type: 'DEPARTURE_ALARM',
    departureTime: departureTime,
    alarmMinutes: alarmMinutes
  });
}

// Notify all clients
async function notifyClients(data) {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
  });
  
  for (const client of clients) {
    client.postMessage(data);
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  let title = 'ADHS Jetzt-Planer';
  let options = {
    body: 'Neue Nachricht',
    icon: '/icon-192x192.png',
    badge: '/badge-96x96.png'
  };
  
  // Try to parse the data
  if (event.data) {
    try {
      const data = event.data.json();
      if (data.title) title = data.title;
      if (data.body) options.body = data.body;
    } catch (e) {
      console.error('[Service Worker] Error parsing push data:', e);
    }
  }
  
  // Show the notification
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received:', event);
  
  // Close the notification
  event.notification.close();
  
  // Open the app when notification is clicked
  event.waitUntil(
    self.clients.matchAll({
      type: 'window'
    }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync event:', event);
  
  if (event.tag === 'check-alarms') {
    // Check and reschedule alarms if needed
    event.waitUntil(checkAndRescheduleAlarms());
  }
});

// Check and reschedule alarms after restart
async function checkAndRescheduleAlarms() {
  console.log('[Service Worker] Checking and rescheduling alarms');
  
  // Try to retrieve alarm data from IndexedDB or other storage
  // and reschedule them
  
  // This would need implementation to fully work
}

// Periodic background sync - Not widely supported yet
// but can be used for future compatibility
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-alarms') {
    event.waitUntil(checkAndRescheduleAlarms());
  }
});

console.log('[Service Worker] Service worker script loaded', SW_VERSION);
