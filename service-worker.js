<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADHS Jetzt-Planer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            /* Modern color palette */
            --primary: #4F6F52;
            --primary-light: #739072;
            --primary-dark: #3A4D39;
            --accent: #D2001A;
            --accent-light: #FFAA9C;
            --bg-color: #F5F5F5;
            --surface: #FFFFFF;
            --surface-variant: #ECF0E8;
            --text-primary: #1A1A1A;
            --text-secondary: #555555;
            --success: #4CAF50;
            --warning: #FF9800;
            --danger: #F44336;
            
            /* Spacing units */
            --space-xs: 4px;
            --space-sm: 8px;
            --space-md: 16px;
            --space-lg: 24px;
            --space-xl: 32px;
            
            /* Border radius */
            --radius-sm: 8px;
            --radius-md: 12px;
            --radius-lg: 16px;
            --radius-full: 9999px;
            
            /* Shadows */
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.08);
            --shadow-lg: 0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.05);
            
            /* Transitions */
            --transition-fast: 150ms ease;
            --transition-normal: 250ms ease;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            padding: var(--space-md);
            padding-bottom: env(safe-area-inset-bottom, var(--space-xl));
        }
        
        /* Container */
        .app-container {
            max-width: 480px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
        }
        
        /* Header */
        .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .app-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-dark);
            letter-spacing: -0.02em;
        }
        
        .current-time {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--primary);
            background-color: var(--surface-variant);
            padding: var(--space-xs) var(--space-md);
            border-radius: var(--radius-full);
        }
        
        /* Countdown */
        .countdown {
            background: linear-gradient(to right, var(--primary), var(--primary-light));
            color: white;
            padding: var(--space-md);
            border-radius: var(--radius-md);
            text-align: center;
            font-weight: 600;
            box-shadow: var(--shadow-md);
            animation: pulse 2s infinite ease-in-out;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(79, 111, 82, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(79, 111, 82, 0); }
            100% { box-shadow: 0 0 0 0 rgba(79, 111, 82, 0); }
        }
        
        .task-countdown {
            background: linear-gradient(to right, var(--accent), #FF5252);
            color: white;
            padding: var(--space-md);
            border-radius: var(--radius-md);
            text-align: center;
            font-weight: 600;
            box-shadow: var(--shadow-md);
            display: none;
            animation: pulse-accent 2s infinite ease-in-out;
        }
        
        @keyframes pulse-accent {
            0% { box-shadow: 0 0 0 0 rgba(210, 0, 26, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(210, 0, 26, 0); }
            100% { box-shadow: 0 0 0 0 rgba(210, 0, 26, 0); }
        }
        
        /* Time summary */
        .time-summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-md);
        }
        
        .time-box {
            background-color: var(--surface);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            text-align: center;
            box-shadow: var(--shadow-sm);
            display: flex;
            flex-direction: column;
            transition: transform var(--transition-fast);
        }
        
        .time-box:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        .time-box-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        .time-box-value {
            font-size: 1.125rem;
            font-weight: 700;
            margin-top: var(--space-xs);
            color: var(--primary-dark);
        }
        
        .buffer-time {
            color: var(--success);
        }
        
        .buffer-time.warning {
            color: var(--warning);
        }
        
        .buffer-time.danger {
            color: var(--danger);
        }
        
        /* Activities section */
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-md);
        }
        
        .section-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--primary-dark);
        }
        
        .add-btn {
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: var(--radius-full);
            padding: var(--space-xs) var(--space-md);
            font-family: inherit;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: var(--space-xs);
        }
        
        .add-btn:hover {
            background-color: var(--primary-dark);
            box-shadow: var(--shadow-md);
        }
        
        .add-btn:active {
            transform: scale(0.97);
        }
        
        /* Add activity form */
        .add-form {
            background-color: var(--surface);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            margin-bottom: var(--space-md);
            box-shadow: var(--shadow-md);
            display: none;
            animation: slideDown var(--transition-normal);
        }
        
        @keyframes slideDown {
            from { 
                opacity: 0;
                transform: translateY(-10px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-row {
            display: flex;
            gap: var(--space-md);
            margin-bottom: var(--space-md);
        }
        
        .form-input {
            padding: var(--space-md);
            border: 1px solid #E0E0E0;
            border-radius: var(--radius-sm);
            font-size: 1rem;
            font-family: inherit;
            background-color: var(--surface);
            transition: border-color var(--transition-fast);
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--primary-light);
            box-shadow: 0 0 0 2px rgba(115, 144, 114, 0.2);
        }
        
        .form-input-name {
            flex: 1;
        }
        
        .form-input-duration {
            width: 80px;
            text-align: center;
        }
        
        .form-actions {
            display: flex;
            gap: var(--space-md);
        }
        
        .btn {
            padding: var(--space-md);
            border: none;
            border-radius: var(--radius-sm);
            font-family: inherit;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            text-align: center;
            flex: 1;
        }
        
        .btn-primary {
            background-color: var(--primary);
            color: white;
        }
        
        .btn-primary:hover {
            background-color: var(--primary-dark);
            box-shadow: var(--shadow-sm);
        }
        
        .btn-outline {
            background-color: transparent;
            color: var(--text-secondary);
            border: 1px solid #E0E0E0;
        }
        
        .btn-outline:hover {
            background-color: #F5F5F5;
        }
        
        .btn:active {
            transform: scale(0.98);
        }
        
        /* Activities list */
        .activities-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
        }
        
        .no-activities {
            text-align: center;
            padding: var(--space-xl) var(--space-md);
            color: var(--text-secondary);
            font-weight: 500;
            background-color: var(--surface-variant);
            border-radius: var(--radius-md);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-md);
        }
        
        .no-activities-icon {
            font-size: 2rem;
            color: var(--primary-light);
            margin-bottom: var(--space-sm);
        }
        
        .activity {
            display: grid;
            grid-template-columns: auto 1fr auto auto;
            align-items: center;
            gap: var(--space-md);
            background-color: var(--surface);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            box-shadow: var(--shadow-sm);
            transition: transform var(--transition-fast), box-shadow var(--transition-fast);
            position: relative;
            overflow: hidden;
        }
        
        .activity::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: var(--primary-light);
            opacity: 0.5;
        }
        
        .activity.current {
            box-shadow: var(--shadow-md);
            border: 1px solid rgba(210, 0, 26, 0.2);
            background-color: #FFF9F9;
        }
        
        .activity.current::before {
            background-color: var(--accent);
            opacity: 1;
        }
        
        .activity.completed {
            opacity: 0.7;
            background-color: var(--surface-variant);
        }
        
        .activity.completed::before {
            background-color: var(--success);
            opacity: 1;
        }
        
        .activity.completed .activity-name {
            text-decoration: line-through;
            color: var(--text-secondary);
        }
        
        .activity-time {
            font-weight: 700;
            font-size: 0.875rem;
            padding: var(--space-xs) var(--space-sm);
            border-radius: var(--radius-sm);
            background-color: var(--primary-light);
            color: white;
            min-width: 50px;
            text-align: center;
        }
        
        .activity.completed .activity-time {
            background-color: var(--success);
        }
        
        .activity-name {
            font-weight: 500;
            padding: 0 var(--space-sm);
            word-break: break-word;
        }
        
        .activity-duration {
            color: var(--text-secondary);
            font-size: 0.875rem;
            font-weight: 600;
            background-color: var(--surface-variant);
            padding: var(--space-xs) var(--space-sm);
            border-radius: var(--radius-sm);
            min-width: 45px;
            text-align: center;
        }
        
        .activity-actions {
            display: flex;
            gap: var(--space-xs);
        }
        
        .action-btn {
            border: none;
            width: 36px;
            height: 36px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.125rem;
            transition: all var(--transition-fast);
            background-color: var(--surface-variant);
        }
        
        .action-btn:active {
            transform: scale(0.9);
        }
        
        .complete-btn {
            color: var(--success);
        }
        
        .complete-btn:hover {
            background-color: rgba(76, 175, 80, 0.2);
        }
        
        .revert-btn {
            color: var(--warning);
        }
        
        .revert-btn:hover {
            background-color: rgba(255, 152, 0, 0.2);
        }
        
        .delete-btn {
            color: var(--danger);
        }
        
        .delete-btn:hover {
            background-color: rgba(244, 67, 54, 0.2);
        }
        
        /* Settings section */
        .settings-card {
            background-color: var(--surface);
            border-radius: var(--radius-md);
            padding: var(--space-lg);
            box-shadow: var(--shadow-md);
        }
        
        .settings-group {
            margin-bottom: var(--space-lg);
        }
        
        .settings-group:last-child {
            margin-bottom: 0;
        }
        
        .setting-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--space-md);
        }
        
        .setting-row:last-child {
            margin-bottom: 0;
        }
        
        .setting-label {
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: var(--space-xs);
        }
        
        .save-btn {
            background-color: var(--primary);
            color: white;
            width: 100%;
            padding: var(--space-md);
            border: none;
            border-radius: var(--radius-sm);
            font-family: inherit;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-sm);
            margin-top: var(--space-md);
        }
        
        .save-btn:hover {
            background-color: var(--primary-dark);
            box-shadow: var(--shadow-sm);
        }
        
        .save-btn:active {
            transform: scale(0.98);
        }
        
        .alarm-settings {
            margin-top: var(--space-md);
            padding-top: var(--space-md);
            border-top: 1px solid #E0E0E0;
        }
        
        /* Switch */
        .switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #E0E0E0;
            transition: var(--transition-normal);
            border-radius: var(--radius-full);
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: var(--transition-normal);
            border-radius: 50%;
            box-shadow: var(--shadow-sm);
        }
        
        input:checked + .slider {
            background-color: var(--primary);
        }
        
        input:checked + .slider:before {
            transform: translateX(24px);
        }
        
        .alarm-options {
            margin-top: var(--space-md);
            display: none;
            animation: fadeIn var(--transition-normal);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .alarm-options.visible {
            display: block;
        }
        
        .test-alarm-btn {
            background-color: var(--accent);
            color: white;
            border: none;
            border-radius: var(--radius-sm);
            padding: var(--space-xs) var(--space-sm);
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
            margin-left: var(--space-sm);
        }
        
        .test-alarm-btn:hover {
            background-color: #B80015;
        }
        
        .test-alarm-btn:active {
            transform: scale(0.95);
        }
        
        /* Footer actions */
        .footer-actions {
            margin-top: var(--space-lg);
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
        }
        
        .danger-btn {
            background-color: var(--danger);
            color: white;
            padding: var(--space-md);
            border: none;
            border-radius: var(--radius-md);
            font-family: inherit;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-sm);
            box-shadow: var(--shadow-sm);
        }
        
        .danger-btn:hover {
            background-color: #D32F2F;
            box-shadow: var(--shadow-md);
        }
        
        .danger-btn:active {
            transform: scale(0.98);
        }
        
        /* Notification */
        .notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--accent);
            color: white;
            padding: var(--space-md) var(--space-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transition: bottom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
            font-weight: 600;
            max-width: 90%;
            width: 320px;
        }
        
        .notification.show {
            bottom: calc(var(--space-lg) + env(safe-area-inset-bottom, 0));
        }
        
        /* Icon styles */
        .icon {
            font-size: 1.25rem;
            line-height: 1;
        }
        
        /* Media Queries for larger screens */
        @media (min-width: 640px) {
            body {
                padding: var(--space-lg);
            }
            
            .app-container {
                gap: var(--space-xl);
            }
            
            .activity {
                padding: var(--space-lg);
            }
            
            .settings-card {
                padding: var(--space-xl);
            }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Header -->
        <header class="app-header">
            <h1 class="app-title">ADHS Jetzt-Planer</h1>
            <div class="current-time" id="current-time">12:30</div>
        </header>
        
        <!-- Countdowns -->
        <div class="countdown" id="countdown">
            Du musst in 2 Stunden rausgehen
        </div>
        
        <div class="task-countdown" id="task-countdown">
            Aktuelle Aufgabe: noch 5 Minuten
        </div>
        
        <!-- Time summary -->
        <div class="time-summary">
            <div class="time-box">
                <div class="time-box-label">Verfügbar</div>
                <div class="time-box-value" id="available-time">2:00 Std</div>
            </div>
            <div class="time-box">
                <div class="time-box-label">Geplant</div>
                <div class="time-box-value" id="planned-time">45 Min</div>
            </div>
            <div class="time-box">
                <div class="time-box-label">Puffer</div>
                <div class="time-box-value buffer-time" id="buffer-time">1:15 Std</div>
            </div>
        </div>
        
        <!-- Activities Section -->
        <section>
            <div class="section-header">
                <h2 class="section-title">Meine Aktivitäten</h2>
                <button class="add-btn" id="show-add-form">
                    <span class="icon">+</span> Aktivität
                </button>
            </div>
            
            <!-- Add Activity Form -->
            <div class="add-form" id="add-form">
                <div class="form-row">
                    <input type="text" class="form-input form-input-name" id="activity-name" placeholder="Was willst du tun?">
                    <input type="number" class="form-input form-input-duration" id="activity-duration" placeholder="Min" value="10" min="1" max="180">
                </div>
                <div class="form-actions">
                    <button class="btn btn-primary" id="add-activity-btn">Hinzufügen</button>
                    <button class="btn btn-outline" id="cancel-add">Abbrechen</button>
                </div>
            </div>
            
            <!-- Activities List -->
            <div class="activities-list" id="activity-list">
                <!-- Activities will be dynamically added here -->
            </div>
        </section>
        
        <!-- Settings Section -->
        <section class="settings-card">
            <div class="settings-group">
                <div class="setting-row">
                    <div class="setting-label">Wann musst du rausgehen?</div>
                    <input type="time" class="form-input" id="departure-time" value="14:30">
                </div>
                
                <div class="alarm-settings">
                    <div class="setting-row">
                        <div class="setting-label">
                            Alarm aktivieren 
                            <span class="icon" style="color: var(--accent);">🔔</span>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="alarm-toggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="alarm-options visible" id="alarm-options">
                        <div class="setting-row">
                            <div class="setting-label">Alarm-Zeit vor Ausgehen:</div>
                            <div style="display: flex; align-items: center;">
                                <select class="form-input" id="alarm-time">
                                    <option value="5">5 Minuten</option>
                                    <option value="10">10 Minuten</option>
                                    <option value="15" selected>15 Minuten</option>
                                    <option value="30">30 Minuten</option>
                                    <option value="60">1 Stunde</option>
                                </select>
                                <button class="test-alarm-btn" id="test-alarm">Test</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <button class="save-btn" id="save-departure">
                <span class="icon">💾</span> Einstellungen speichern
            </button>
        </section>
        
        <!-- Footer Buttons -->
        <div class="footer-actions">
            <button class="danger-btn" id="delete-all-btn">
                <span class="icon">🗑️</span> Alle Aktivitäten löschen
            </button>
        </div>
    </div>
    
    <!-- Notification -->
    <div class="notification" id="notification">
        Zeit zum Ausgehen!
    </div>
    
    <script>
        // State management
        let state = {
            activities: [],
            departureTime: '14:30',
            alarm: {
                enabled: true,
                time: 15 // minutes before departure
            },
            currentTaskIndex: -1
        };
        
        // DOM Elements
        const currentTimeEl = document.getElementById('current-time');
        const countdownEl = document.getElementById('countdown');
        const taskCountdownEl = document.getElementById('task-countdown');
        const availableTimeEl = document.getElementById('available-time');
        const plannedTimeEl = document.getElementById('planned-time');
        const bufferTimeEl = document.getElementById('buffer-time');
        const activityListEl = document.getElementById('activity-list');
        const addFormEl = document.getElementById('add-form');
        const activityNameEl = document.getElementById('activity-name');
        const activityDurationEl = document.getElementById('activity-duration');
        const departureTimeEl = document.getElementById('departure-time');
        const alarmToggleEl = document.getElementById('alarm-toggle');
        const alarmOptionsEl = document.getElementById('alarm-options');
        const alarmTimeEl = document.getElementById('alarm-time');
        const notificationEl = document.getElementById('notification');
        
        // Audio context
        let audioContext = null;
        
        // Alarm variables
        let alarmTimeout = null;
        let notificationTimeout = null;
        let taskCountdownInterval = null;
        
        // Simple one-time audio context initialization
        function initAudio() {
            if (audioContext) return audioContext;
            
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
                return audioContext;
            } catch (e) {
                console.error("Web Audio API not supported:", e);
                return null;
            }
        }
        
        // Simple reliable beep sound using Web Audio API
        function playBeep(frequency = 800, duration = 200, type = 'sine', gain = 0.2) {
            try {
                // Get or create audio context
                const ctx = initAudio();
                if (!ctx) return false;
                
                // Resume context if suspended
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                
                // Create oscillator
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                oscillator.type = type;
                oscillator.frequency.value = frequency;
                gainNode.gain.value = gain;
                
                oscillator.start();
                
                // Stop after duration
                setTimeout(() => {
                    oscillator.stop();
                }, duration);
                
                return true;
            } catch (e) {
                console.error("Error playing beep:", e);
                
                // Fallback to vibration if available
                if ('vibrate' in navigator) {
                    navigator.vibrate(duration);
                }
                
                return false;
            }
        }
        
        // Play task complete sound - simple version that works
        function playTaskCompleteSound() {
            // Try to vibrate on mobile
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Play a success sound (higher pitch, shorter)
            playBeep(1300, 150, 'sine');
            setTimeout(() => {
                playBeep(1800, 100, 'sine');
            }, 170);
        }
        
        // Play alarm sound - simple version that works
        function playAlarm() {
            // Try to vibrate on mobile
            if ('vibrate' in navigator) {
                navigator.vibrate([300, 100, 300, 100, 300]);
            }
            
            // Play alarm pattern
            let count = 0;
            const alarmInterval = setInterval(() => {
                playBeep(count % 2 === 0 ? 800 : 600, 300, 'square', 0.3);
                count++;
                
                if (count >= 6) {
                    clearInterval(alarmInterval);
                }
            }, 400);
        }
        
        // Delete All Activities function
        function deleteAllActivities() {
            if (confirm('Möchtest du wirklich alle Aktivitäten löschen?')) {
                // Clear the activities array
                state.activities = [];
                
                // Reset current task index and clear timers
                state.currentTaskIndex = -1;
                
                // Clear any running task timer
                if (taskCountdownInterval) {
                    clearInterval(taskCountdownInterval);
                    taskCountdownInterval = null;
                }
                
                // Hide task countdown
                taskCountdownEl.style.display = 'none';
                
                // Update UI
                renderActivities();
                updateTimeSummary();
                saveState();
                
                // Show confirmation
                showNotification('Alle Aktivitäten wurden gelöscht', 3000);
            }
        }
        
        // Task countdown timer
        function startTaskCountdown() {
            // Clear any existing interval
            if (taskCountdownInterval) {
                clearInterval(taskCountdownInterval);
                taskCountdownInterval = null;
            }
            
            // Find the first non-completed activity
            const currentActivityIndex = state.activities.findIndex(a => !a.completed);
            if (currentActivityIndex === -1) {
                taskCountdownEl.style.display = 'none';
                return; // No active tasks
            }
            
            state.currentTaskIndex = currentActivityIndex;
            const currentActivity = state.activities[currentActivityIndex];
            
            // Set the end time for this task if not already set
            if (!currentActivity.endTime) {
                const now = new Date();
                const endTime = new Date(now.getTime() + (currentActivity.duration * 60 * 1000));
                currentActivity.endTime = endTime;
            }
            
            // Update the countdown display
            updateTaskCountdown();
            
            // Show the task countdown with a brief highlight
            taskCountdownEl.style.display = 'block';
            taskCountdownEl.style.backgroundColor = '#3CB371'; // Green highlight
            setTimeout(() => {
                taskCountdownEl.style.backgroundColor = ''; // Reset color
            }, 1500);
            
            // Start the interval to update the countdown
            taskCountdownInterval = setInterval(updateTaskCountdown, 1000);
        }
        
        function updateTaskCountdown() {
            if (state.currentTaskIndex === -1 || state.activities.length === 0) {
                taskCountdownEl.style.display = 'none';
                return;
            }
            
            const currentActivity = state.activities[state.currentTaskIndex];
            if (!currentActivity || currentActivity.completed) {
                // Move to the next task if current is completed
                const nextIndex = state.activities.findIndex(a => !a.completed);
                if (nextIndex === -1) {
                    taskCountdownEl.style.display = 'none';
                    return; // No more tasks
                }
                
                state.currentTaskIndex = nextIndex;
                const nextActivity = state.activities[nextIndex];
                
                // Set the end time for this task
                const now = new Date();
                const endTime = new Date(now.getTime() + (nextActivity.duration * 60 * 1000));
                nextActivity.endTime = endTime;
                
                // Highlight the transition to a new task
                taskCountdownEl.style.backgroundColor = '#3CB371'; // Green to indicate new task
                setTimeout(() => {
                    taskCountdownEl.style.backgroundColor = ''; // Reset after 2 seconds
                }, 2000);
                
                // Save state to persist the endTime
                saveState();
                
                // Re-render activities to update finish times
                renderActivities();
            }
            
            const activity = state.activities[state.currentTaskIndex];
            const now = new Date();
            const endTime = new Date(activity.endTime);
            
            // Calculate remaining time
            const remainingMs = endTime - now;
            
            if (remainingMs <= 0) {
                // Time's up for this task!
                console.log("Task time up:", activity.name);
                playTaskCompleteSound();
                showNotification(`Zeit abgelaufen für: ${activity.name}`, 5000);
                
                // Auto-complete the task
                completeActivity(activity.id, true);
                
                // Check if there are more tasks
                const nextIndex = state.activities.findIndex(a => !a.completed);
                if (nextIndex !== -1) {
                    // Start the next task automatically
                    state.currentTaskIndex = nextIndex;
                    const nextActivity = state.activities[nextIndex];
                    
                    // Set the end time for the next task
                    const newEndTime = new Date(now.getTime() + (nextActivity.duration * 60 * 1000));
                    nextActivity.endTime = newEndTime;
                    
                    // Show notification for next task
                    showNotification(`Nächste Aufgabe: ${nextActivity.name}`, 5000);
                    
                    // Save updated state
                    saveState();
                    
                    // Update UI for new task
                    renderActivities();
                } else {
                    // No more tasks
                    taskCountdownEl.style.display = 'none';
                    if (taskCountdownInterval) {
                        clearInterval(taskCountdownInterval);
                        taskCountdownInterval = null;
                    }
                    
                    // Show all tasks complete notification
                    showNotification('Alle Aufgaben abgeschlossen!', 5000);
                    return;
                }
            }
            
            // Update the display with the current task and remaining time
            const remainingMinutes = Math.floor(remainingMs / 60000);
            const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
            
            // Format the finish time for display
            const finishTime = new Date(endTime);
            const finishTimeStr = `${finishTime.getHours().toString().padStart(2, '0')}:${finishTime.getMinutes().toString().padStart(2, '0')}`;
            
            // Add a "current" or "next" prefix to clearly indicate which task is active
            const taskPrefix = activity.orderIndex === 0 ? '' : 'Aktuelle Aufgabe: ';
            
            taskCountdownEl.textContent = `${taskPrefix}${activity.name}: noch ${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')} Min (bis ${finishTimeStr})`;
            
            // Change color when less than 1 minute remains
            if (remainingMs < 60000) {
                taskCountdownEl.style.backgroundColor = '#FF4136'; // Bright red for urgency
            } else {
                taskCountdownEl.style.backgroundColor = '';
            }
        }
        
        // Activity-related functions
        function createActivityElement(activity, index) {
            const activityEl = document.createElement('div');
            activityEl.className = activity.completed ? 'activity completed' : 'activity';
            
            // Mark as current if it's the first non-completed activity
            if (!activity.completed && state.currentTaskIndex === index) {
                activityEl.classList.add('current');
            }
            
            activityEl.dataset.id = activity.id;
            
            // Calculate finish time for display
            let finishTimeDisplay = '';
            if (!activity.completed) {
                if (!activity.endTime) {
                    // If no end time set yet, calculate one from now
                    const now = new Date();
                    const endTime = new Date(now.getTime() + (activity.duration * 60 * 1000));
                    finishTimeDisplay = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
                } else {
                    // Use the saved end time
                    const endTime = new Date(activity.endTime);
                    finishTimeDisplay = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
                }
            } else {
                finishTimeDisplay = "✓";
            }
            
            activityEl.innerHTML = `
                <div class="activity-time">${finishTimeDisplay}</div>
                <div class="activity-name">${activity.name}</div>
                <div class="activity-duration">${activity.duration} min</div>
                <div class="activity-actions">
                    ${activity.completed 
                        ? '<button class="action-btn revert-btn">↺</button>'
                        : '<button class="action-btn complete-btn">✓</button>'}
                    <button class="action-btn delete-btn">×</button>
                </div>
            `;
            
            // Add event listeners
            const completeBtn = activityEl.querySelector('.complete-btn');
            if (completeBtn) {
                completeBtn.addEventListener('click', () => {
                    completeActivity(activity.id);
                });
            }
            
            const revertBtn = activityEl.querySelector('.revert-btn');
            if (revertBtn) {
                revertBtn.addEventListener('click', () => {
                    revertActivity(activity.id);
                });
            }
            
            const deleteBtn = activityEl.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                deleteActivity(activity.id);
            });
            
            return activityEl;
        }
        
        function renderActivities() {
            // Clear current list
            activityListEl.innerHTML = '';
            
            if (state.activities.length === 0) {
                activityListEl.innerHTML = `
                    <div class="no-activities">
                        <div class="no-activities-icon">📝</div>
                        <div>Keine Aktivitäten geplant.</div>
                        <div>Füge deine erste Aktivität hinzu!</div>
                    </div>
                `;
                
                // Hide task countdown when no activities
                taskCountdownEl.style.display = 'none';
                return;
            }
            
            // Render each activity in order
            state.activities.forEach((activity, index) => {
                activityListEl.appendChild(createActivityElement(activity, index));
            });
            
            // Start task countdown for the current task
            startTaskCountdown();
        }
        
        function addActivity() {
            // Initialize audio on first user interaction
            initAudio();
            
            const activityName = activityNameEl.value.trim();
            const activityDuration = parseInt(activityDurationEl.value);
            
            if (activityName && activityDuration > 0) {
                // Get the next order index
                const orderIndex = state.activities.length;
                
                // Create new activity
                const newActivity = {
                    id: Date.now().toString(), // Unique ID
                    name: activityName,
                    duration: activityDuration,
                    orderIndex: orderIndex,
                    completed: false
                };
                
                // Calculate end time for this task
                const now = new Date();
                
                // If this is the first activity or all others are completed
                if (state.currentTaskIndex === -1) {
                    // Set end time based on current time
                    newActivity.endTime = new Date(now.getTime() + (activityDuration * 60 * 1000));
                } else {
                    // Find the last non-completed activity's end time
                    const lastIncompleteActivity = [...state.activities]
                        .filter(a => !a.completed)
                        .sort((a, b) => {
                            if (!a.endTime && !b.endTime) return 0;
                            if (!a.endTime) return 1;
                            if (!b.endTime) return -1;
                            return a.endTime - b.endTime;
                        })
                        .pop();
                    
                    // If there's a last activity with an end time, use that as the start time for this one
                    if (lastIncompleteActivity && lastIncompleteActivity.endTime) {
                        const startTime = new Date(lastIncompleteActivity.endTime);
                        newActivity.endTime = new Date(startTime.getTime() + (activityDuration * 60 * 1000));
                    } else {
                        // Fallback to current time
                        newActivity.endTime = new Date(now.getTime() + (activityDuration * 60 * 1000));
                    }
                }
                
                // Add to state
                state.activities.push(newActivity);
                
                // Update time summary
                updateTimeSummary();
                
                // Reset form
                activityNameEl.value = '';
                addFormEl.style.display = 'none';
                
                // Save state
                saveState();
                
                // Render activities
                renderActivities();
                
                // Play a simple beep
                playBeep(1000, 100);
                
                // Show confirmation message
                showNotification(`"${activityName}" hinzugefügt`, 2000);
            }
        }
        
        function completeActivity(id, automated = false) {
            const activityIndex = state.activities.findIndex(a => a.id === id);
            if (activityIndex !== -1) {
                state.activities[activityIndex].completed = true;
                
                if (!automated) {
                    // Play completion sound only if manually completed
                    playTaskCompleteSound();
                    showNotification(`Aktivität erledigt: ${state.activities[activityIndex].name}`, 3000);
                }
                
                // Update UI
                renderActivities();
                updateTimeSummary();
                saveState();
            }
        }
        
        function revertActivity(id) {
            const activityIndex = state.activities.findIndex(a => a.id === id);
            if (activityIndex !== -1) {
                state.activities[activityIndex].completed = false;
                
                // Reset endTime
                delete state.activities[activityIndex].endTime;
                
                // Update UI
                renderActivities();
                updateTimeSummary();
                saveState();
                
                // Show confirmation
                showNotification(`"${state.activities[activityIndex].name}" wiederhergestellt`, 2000);
            }
        }
        
        function deleteActivity(id) {
            const activityIndex = state.activities.findIndex(a => a.id === id);
            if (activityIndex !== -1) {
                const activityName = state.activities[activityIndex].name;
                
                // Remove the activity
                state.activities.splice(activityIndex, 1);
                
                // Update order indices
                state.activities.forEach((activity, index) => {
                    activity.orderIndex = index;
                });
                
                // Reset current task index and find the next non-completed task
                state.currentTaskIndex = state.activities.findIndex(a => !a.completed);
                
                // Update UI
                renderActivities();
                updateTimeSummary();
                saveState();
                
                // Show confirmation
                showNotification(`"${activityName}" gelöscht`, 2000);
            }
        }
        
        // Time management functions
        function updateTimeDisplay() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            currentTimeEl.textContent = `${hours}:${minutes}`;
        }
        
        function updateTimeSummary() {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const departureMinutes = timeStringToMinutes(state.departureTime);
            
            // Available time
            let availableTime = departureMinutes - currentMinutes;
            if (availableTime < 0) availableTime = 0;
            
            // Planned time (sum of non-completed activities durations)
            const plannedTime = state.activities
                .filter(a => !a.completed)
                .reduce((total, activity) => total + parseInt(activity.duration), 0);
            
            // Buffer time
            const bufferTime = Math.max(0, availableTime - plannedTime);
            
            // Update display
            availableTimeEl.textContent = formatTimeValue(availableTime);
            plannedTimeEl.textContent = formatTimeValue(plannedTime);
            bufferTimeEl.textContent = formatTimeValue(bufferTime);
            
            // Update buffer time color
            if (bufferTime < 10) {
                bufferTimeEl.classList.add('danger');
                bufferTimeEl.classList.remove('warning');
            } else if (bufferTime < 30) {
                bufferTimeEl.classList.add('warning');
                bufferTimeEl.classList.remove('danger');
            } else {
                bufferTimeEl.classList.remove('warning');
                bufferTimeEl.classList.remove('danger');
            }
            
            // Update countdown
            if (availableTime <= 0) {
                countdownEl.textContent = 'Zeit zum Ausgehen!';
                countdownEl.style.backgroundColor = '#CD5C5C';
            } else {
                countdownEl.textContent = `Du musst in ${formatTimeSpan(availableTime)} rausgehen`;
                countdownEl.style.backgroundColor = '';
            }
        }
        
        // Settings functions
        function saveSettings() {
            // Initialize audio on first user interaction
            initAudio();
            
            state.departureTime = departureTimeEl.value;
            state.alarm.enabled = alarmToggleEl.checked;
            state.alarm.time = parseInt(alarmTimeEl.value);
            
            saveState();
            
            // Update UI
            updateTimeSummary();
            
            // Schedule alarm with new settings
            if (alarmTimeout) {
                clearTimeout(alarmTimeout);
                alarmTimeout = null;
            }
            
            if (state.alarm.enabled) {
                scheduleAlarm();
            }
            
            // Show confirmation
            const saveBtn = document.getElementById('save-departure');
            const originalText = saveBtn.textContent;
            saveBtn.textContent = '✓ Gespeichert!';
            saveBtn.disabled = true;
            
            // Play confirmation sound
            playBeep(1000, 100);
            
            setTimeout(() => {
                saveBtn.innerHTML = '<span class="icon">💾</span> Einstellungen speichern';
                saveBtn.disabled = false;
            }, 1500);
            
            // Show notification
            showNotification('Einstellungen gespeichert', 2000);
        }
        
        // Schedule alarm
        function scheduleAlarm() {
            console.log("Scheduling alarm");
            
            if (!state.alarm.enabled) {
                console.log("Alarm disabled, not scheduling");
                return;
            }
            
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const departureMinutes = timeStringToMinutes(state.departureTime);
            
            // Calculate time until alarm should trigger (departure time - alarm minutes)
            const alarmMinutes = departureMinutes - state.alarm.time;
            let timeUntilAlarm = alarmMinutes - currentMinutes;
            
            // If alarm time is in the past, don't schedule
            if (timeUntilAlarm <= 0) {
                console.log("Alarm time in past, not scheduling");
                return;
            }
            
            console.log(`Alarm scheduled for ${timeUntilAlarm} minutes from now`);
            
            // Clear any existing alarm
            if (alarmTimeout) {
                clearTimeout(alarmTimeout);
            }
            
            // Schedule alarm
            alarmTimeout = setTimeout(() => {
                console.log("Alarm triggered!");
                playAlarm();
                showNotification(`In ${state.alarm.time} Minuten musst du rausgehen!`, 10000);
            }, timeUntilAlarm * 60 * 1000);
        }
        
        function showNotification(message, duration = 5000) {
            // In-app notification
            notificationEl.textContent = message;
            notificationEl.classList.add('show');
            
            // Clear any existing timeout
            if (notificationTimeout) {
                clearTimeout(notificationTimeout);
            }
            
            // Hide notification after specified duration (default 5 seconds)
            notificationTimeout = setTimeout(() => {
                notificationEl.classList.remove('show');
            }, duration);
            
            // Try to vibrate on mobile
            if ('vibrate' in navigator) {
                navigator.vibrate(200);
            }
            
            // Try to show a system notification if permission granted
            try {
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('ADHS Jetzt-Planer', {
                        body: message,
                        vibrate: [200]
                    });
                }
            } catch (e) {
                console.warn("System notification failed:", e);
            }
        }
        
        // Utility functions
        function timeStringToMinutes(timeString) {
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        }
        
        function formatTimeValue(minutes) {
            if (minutes < 60) {
                return `${minutes} Min`;
            } else {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hours}:${mins.toString().padStart(2, '0')} Std`;
            }
        }
        
        function formatTimeSpan(minutes) {
            if (minutes < 60) {
                return `${minutes} Minuten`;
            } else {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                
                let result = `${hours} Stunde${hours !== 1 ? 'n' : ''}`;
                if (mins > 0) {
                    result += ` ${mins} Minute${mins !== 1 ? 'n' : ''}`;
                }
                
                return result;
            }
        }
        
        // Storage functions
        function saveState() {
            try {
                localStorage.setItem('adhsJetztPlaner', JSON.stringify(state));
            } catch (e) {
                console.log('localStorage not available:', e);
            }
        }
        
        function loadState() {
            try {
                const savedState = localStorage.getItem('adhsJetztPlaner');
                if (savedState) {
                    // Parse saved state
                    const parsedState = JSON.parse(savedState);
                    
                    // Make sure activities is an array
                    if (!Array.isArray(parsedState.activities)) {
                        parsedState.activities = [];
                    }
                    
                    // Convert date strings back to Date objects
                    parsedState.activities.forEach(activity => {
                        if (activity.endTime) {
                            activity.endTime = new Date(activity.endTime);
                        }
                    });
                    
                    // Use the parsed state
                    state = parsedState;
                    
                    // Handle older versions of state
                    if (state.currentTaskIndex === undefined) {
                        state.currentTaskIndex = -1;
                    }
                    
                    // Validate current task index
                    if (state.currentTaskIndex >= state.activities.length) {
                        state.currentTaskIndex = state.activities.findIndex(a => !a.completed);
                    }
                }
            } catch (e) {
                console.log('Error loading from localStorage:', e);
                // If there's an error, reset to defaults
                state = {
                    activities: [],
                    departureTime: '14:30',
                    alarm: {
                        enabled: true,
                        time: 15
                    },
                    currentTaskIndex: -1
                };
            }
        }
        
        // Register service worker for PWA support
        function registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                    });
            }
        }
        
        // Ensure notification permissions
        function checkNotifications() {
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
        
        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            try {
                // Register service worker
                registerServiceWorker();
                
                // Check notifications
                checkNotifications();
                
                // Load saved state
                loadState();
                
                // Initialize UI
                departureTimeEl.value = state.departureTime;
                alarmToggleEl.checked = state.alarm.enabled;
                alarmTimeEl.value = state.alarm.time;
                
                // Show/hide alarm options based on toggle state
                if (state.alarm.enabled) {
                    alarmOptionsEl.classList.add('visible');
                } else {
                    alarmOptionsEl.classList.remove('visible');
                }
                
                // Find current task index if not set
                if (state.currentTaskIndex === -1) {
                    state.currentTaskIndex = state.activities.findIndex(a => !a.completed);
                }
                
                // Render activities
                renderActivities();
                
                // Set up update intervals
                updateTimeDisplay();
                updateTimeSummary();
                setInterval(updateTimeDisplay, 10000); // Update time every 10 seconds
                setInterval(updateTimeSummary, 30000); // Update summary every 30 seconds
                
                // Set up alarm if enabled
                if (state.alarm.enabled) {
                    scheduleAlarm();
                }
                
                // Event listeners - initialize audio on first interaction
                document.addEventListener('click', function initOnFirstClick() {
                    initAudio();
                    document.removeEventListener('click', initOnFirstClick);
                }, { once: true });
                
                document.getElementById('show-add-form').addEventListener('click', function() {
                    addFormEl.style.display = 'block';
                    activityNameEl.focus();
                });
                
                document.getElementById('cancel-add').addEventListener('click', function() {
                    addFormEl.style.display = 'none';
                    activityNameEl.value = '';
                });
                
                document.getElementById('add-activity-btn').addEventListener('click', addActivity);
                document.getElementById('delete-all-btn').addEventListener('click', deleteAllActivities);
                document.getElementById('save-departure').addEventListener('click', saveSettings);
                
                alarmToggleEl.addEventListener('change', function() {
                    state.alarm.enabled = this.checked;
                    
                    if (this.checked) {
                        alarmOptionsEl.classList.add('visible');
                    } else {
                        alarmOptionsEl.classList.remove('visible');
                    }
                    
                    // Clear any existing alarms
                    if (alarmTimeout) {
                        clearTimeout(alarmTimeout);
                        alarmTimeout = null;
                    }
                    
                    // Schedule new alarm if enabled
                    if (state.alarm.enabled) {
                        scheduleAlarm();
                    }
                    
                    saveState();
                });
                
                alarmTimeEl.addEventListener('change', function() {
                    state.alarm.time = parseInt(this.value);
                    
                    // Clear any existing alarms
                    if (alarmTimeout) {
                        clearTimeout(alarmTimeout);
                        alarmTimeout = null;
                    }
                    
                    // Schedule new alarm if enabled
                    if (state.alarm.enabled) {
                        scheduleAlarm();
                    }
                    
                    saveState();
                });
                
                document.getElementById('test-alarm').addEventListener('click', function() {
                    playAlarm();
                    showNotification('Alarm Test!', 3000);
                });
                
                // Add activity on Enter key in fields
                activityNameEl.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        addActivity();
                    }
                });
                
                activityDurationEl.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        addActivity();
                    }
                });
                
                // Listen for visibility change to handle when app comes back into focus
                document.addEventListener('visibilitychange', function() {
                    if (!document.hidden) {
                        // App is visible again, update everything
                        updateTimeDisplay();
                        updateTimeSummary();
                        
                        // Try to resume audio context if suspended
                        if (audioContext && audioContext.state === 'suspended') {
                            audioContext.resume();
                        }
                        
                        // Check if we need to restart task countdown
                        if (!taskCountdownInterval && state.activities.some(a => !a.completed)) {
                            startTaskCountdown();
                        }
                    }
                });
                
            } catch (e) {
                console.error("Error initializing app:", e);
                alert("Es gab ein Problem beim Starten der App. Bitte laden Sie die Seite neu.");
            }
        });
    </script>
</body>
</html>
