// University Schedule Timer Application
class ScheduleTimer {
    constructor() {
        this.currentLanguage = 'ar';
        this.schedule = {
            sunday: [
                {time: "9:30-11:00", subject: "tp methodes numérique"},
                {time: "11:00-12:30", subject: "cour vibration"},
                {time: "15:00-16:30", subject: "td organique"}
            ],
            monday: [
                {time: "8:00-9:30", subject: "cour technique d'analyse"},
                {time: "9:30-11:00", subject: "cour organique"},
                {time: "11:00-12:30", subject: "td vibration"},
                {time: "13:30-15:00", subject: "td technique d'analyse"}
            ],
            tuesday: [
                {time: "8:00-11:00", subject: "tp organique او tp minéral"},
                {time: "13:30-15:00", subject: "cour méthodes numerique"}
            ],
            wednesday: [
                {time: "8:00-9:30", subject: "cour minéral"},
                {time: "9:30-11:00", subject: "td math"},
                {time: "13:30-15:00", subject: "td minéral"},
                {time: "15:00-16:30", subject: "cour math"}
            ],
            thursday: [
                {time: "9:30-11:00", subject: "cour minéral"}
            ]
        };

        this.translations = {
            ar: {
                appTitle: "البرنامج الزمني الجامعي",
                currentTime: "الوقت الحالي",
                todaySchedule: "جدول اليوم",
                weeklySchedule: "الجدول الأسبوعي",
                nextClass: "الحصة التالية",
                timeUntil: "الوقت المتبقي",
                noClassToday: "لا توجد حصص اليوم",
                currentlyInClass: "جاري الآن",
                hours: "ساعة",
                minutes: "دقيقة",
                seconds: "ثانية",
                days: {
                    sunday: "الأحد",
                    monday: "الإثنين", 
                    tuesday: "الثلاثاء",
                    wednesday: "الأربعاء",
                    thursday: "الخميس",
                    friday: "الجمعة",
                    saturday: "السبت"
                }
            },
            fr: {
                appTitle: "Emploi du Temps Universitaire",
                currentTime: "Heure Actuelle",
                todaySchedule: "Emploi du Jour",
                weeklySchedule: "Emploi Hebdomadaire",
                nextClass: "Prochain Cours",
                timeUntil: "Temps Restant",
                noClassToday: "Aucun cours aujourd'hui",
                currentlyInClass: "En cours",
                hours: "heures",
                minutes: "minutes",
                seconds: "secondes",
                days: {
                    sunday: "Dimanche",
                    monday: "Lundi",
                    tuesday: "Mardi", 
                    wednesday: "Mercredi",
                    thursday: "Jeudi",
                    friday: "Vendredi",
                    saturday: "Samedi"
                }
            },
            en: {
                appTitle: "University Schedule Timer",
                currentTime: "Current Time",
                todaySchedule: "Today's Schedule",
                weeklySchedule: "Weekly Schedule", 
                nextClass: "Next Class",
                timeUntil: "Time Until",
                noClassToday: "No classes today",
                currentlyInClass: "Currently",
                hours: "hours",
                minutes: "minutes",
                seconds: "seconds",
                days: {
                    sunday: "Sunday",
                    monday: "Monday",
                    tuesday: "Tuesday",
                    wednesday: "Wednesday", 
                    thursday: "Thursday",
                    friday: "Friday",
                    saturday: "Saturday"
                }
            }
        };

        this.dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        this.currentClass = null;
        this.nextClass = null;
        this.countdownInterval = null;
        this.clockInterval = null;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('Initializing Schedule Timer App...');
        
        this.setupEventListeners();
        this.updateLanguage();
        this.renderWeeklySchedule();
        this.updateClock();
        this.updateSchedule();
        
        // Start intervals
        this.clockInterval = setInterval(() => {
            this.updateClock();
            this.updateSchedule();
        }, 1000);

        this.addEntranceAnimations();
        console.log('App initialized successfully');
    }

    setupEventListeners() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                console.log('Language changed to:', e.target.value);
                this.currentLanguage = e.target.value;
                this.updateLanguage();
                this.updateSchedule();
                this.renderWeeklySchedule();
            });
        }
    }

    updateLanguage() {
        const html = document.documentElement;
        const t = this.translations[this.currentLanguage];

        console.log('Updating language to:', this.currentLanguage);

        // Update direction and language
        html.setAttribute('lang', this.currentLanguage);
        html.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');

        // Update title
        document.title = t.appTitle;

        // Update text content with null checks
        const updateElement = (id, text) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        };

        updateElement('appTitle', t.appTitle);
        updateElement('currentTimeTitle', t.currentTime);
        updateElement('todayScheduleTitle', t.todaySchedule);
        updateElement('weeklyScheduleTitle', t.weeklySchedule);
        updateElement('nextClassTitle', t.nextClass);

        // Update day titles
        Object.keys(t.days).forEach(day => {
            updateElement(`${day}Title`, t.days[day]);
        });

        // Update timer labels
        const timerLabels = document.querySelectorAll('.timer-label');
        if (timerLabels.length >= 3) {
            timerLabels[0].textContent = t.hours;
            timerLabels[1].textContent = t.minutes;
            timerLabels[2].textContent = t.seconds;
        }

        console.log('Language updated successfully');
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        let locale = 'en-US';
        if (this.currentLanguage === 'ar') {
            locale = 'ar-SA';
        } else if (this.currentLanguage === 'fr') {
            locale = 'fr-FR';
        }

        const dateString = now.toLocaleDateString(locale, dateOptions);

        const currentTimeElement = document.getElementById('currentTime');
        const currentDateElement = document.getElementById('currentDate');
        
        if (currentTimeElement) {
            currentTimeElement.textContent = timeString;
        }
        if (currentDateElement) {
            currentDateElement.textContent = dateString;
        }
    }

    getCurrentDay() {
        const now = new Date();
        return this.dayNames[now.getDay()];
    }

    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    updateSchedule() {
        const currentDay = this.getCurrentDay();
        const todaySchedule = this.schedule[currentDay] || [];
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        this.renderTodaySchedule(todaySchedule, currentTime);
        this.updateNextClass(todaySchedule, currentTime);
        this.highlightCurrentDay(currentDay);
    }

    renderTodaySchedule(schedule, currentTime) {
        const container = document.getElementById('todaySchedule');
        if (!container) return;

        const t = this.translations[this.currentLanguage];

        if (schedule.length === 0) {
            container.innerHTML = `<div class="schedule-item"><div class="schedule-subject">${t.noClassToday}</div></div>`;
            return;
        }

        container.innerHTML = schedule.map(item => {
            const [startTime, endTime] = item.time.split('-');
            const startMinutes = this.parseTime(startTime);
            const endMinutes = this.parseTime(endTime);
            
            let className = 'schedule-item';
            if (currentTime >= startMinutes && currentTime < endMinutes) {
                className += ' current';
            } else if (currentTime < startMinutes) {
                className += ' active';
            }

            return `
                <div class="${className}">
                    <div class="schedule-time">${item.time}</div>
                    <div class="schedule-subject">${item.subject}</div>
                </div>
            `;
        }).join('');
    }

    updateNextClass(schedule, currentTime) {
        const t = this.translations[this.currentLanguage];
        const nextClassElement = document.getElementById('nextClassName');
        if (!nextClassElement) return;
        
        // Find current or next class
        let nextClass = null;
        let isCurrentClass = false;
        let targetTime = null;

        for (const item of schedule) {
            const [startTime, endTime] = item.time.split('-');
            const startMinutes = this.parseTime(startTime);
            const endMinutes = this.parseTime(endTime);

            if (currentTime >= startMinutes && currentTime < endMinutes) {
                // Currently in class
                nextClass = item;
                isCurrentClass = true;
                targetTime = endTime;
                break;
            } else if (currentTime < startMinutes) {
                // Next upcoming class
                nextClass = item;
                isCurrentClass = false;
                targetTime = startTime;
                break;
            }
        }

        if (!nextClass) {
            // Check tomorrow's first class
            const tomorrow = this.getTomorrowSchedule();
            if (tomorrow.schedule.length > 0) {
                nextClass = tomorrow.schedule[0];
                nextClassElement.textContent = `${t.days[tomorrow.day]} - ${nextClass.subject}`;
                this.startCountdown(tomorrow.day, nextClass.time.split('-')[0]);
            } else {
                nextClassElement.textContent = t.noClassToday;
                this.clearCountdown();
            }
        } else {
            if (isCurrentClass) {
                nextClassElement.textContent = `${t.currentlyInClass}: ${nextClass.subject}`;
                this.startCountdown('today', targetTime, true);
            } else {
                nextClassElement.textContent = nextClass.subject;
                this.startCountdown('today', targetTime);
            }
        }
    }

    getTomorrowSchedule() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDay = this.dayNames[tomorrow.getDay()];
        return {
            day: tomorrowDay,
            schedule: this.schedule[tomorrowDay] || []
        };
    }

    startCountdown(day, timeString, isEndTime = false) {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const updateCountdown = () => {
            const now = new Date();
            let targetTime = new Date();

            if (day !== 'today') {
                // Tomorrow's class
                targetTime.setDate(targetTime.getDate() + 1);
            }

            const [hours, minutes] = timeString.split(':').map(Number);
            targetTime.setHours(hours, minutes, 0, 0);

            const timeDiff = targetTime - now;

            if (timeDiff <= 0) {
                this.clearCountdown();
                return;
            }

            const diffHours = Math.floor(timeDiff / (1000 * 60 * 60));
            const diffMins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const diffSecs = Math.floor((timeDiff % (1000 * 60)) / 1000);

            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (hoursElement) hoursElement.textContent = diffHours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = diffMins.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = diffSecs.toString().padStart(2, '0');

            // Add pulse animation to timer numbers
            if (diffSecs === 0) {
                document.querySelectorAll('.timer-number').forEach(el => {
                    el.style.transform = 'scale(1.1)';
                    setTimeout(() => el.style.transform = 'scale(1)', 200);
                });
            }
        };

        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        if (hoursElement) hoursElement.textContent = '00';
        if (minutesElement) minutesElement.textContent = '00';
        if (secondsElement) secondsElement.textContent = '00';
    }

    highlightCurrentDay(currentDay) {
        // Remove previous highlights
        document.querySelectorAll('.day-card').forEach(card => {
            card.classList.remove('today');
        });

        // Add highlight to current day
        const currentDayCard = document.querySelector(`[data-day="${currentDay}"]`);
        if (currentDayCard) {
            currentDayCard.classList.add('today');
        }
    }

    renderWeeklySchedule() {
        const workDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
        const t = this.translations[this.currentLanguage];
        
        workDays.forEach(day => {
            const schedule = this.schedule[day] || [];
            const container = document.getElementById(`${day}Schedule`);
            
            if (!container) return;

            if (schedule.length === 0) {
                container.innerHTML = `<div class="day-schedule-item">${t.noClassToday}</div>`;
                return;
            }

            container.innerHTML = schedule.map(item => `
                <div class="day-schedule-item">
                    <div class="schedule-time">${item.time}</div>
                    <div class="schedule-subject">${item.subject}</div>
                </div>
            `).join('');
        });
    }

    addEntranceAnimations() {
        // Add staggered animations to cards
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fadeInUp');
        });

        // Add success glow effect on load
        setTimeout(() => {
            const timeCard = document.querySelector('.time-card');
            if (timeCard) {
                timeCard.classList.add('success-glow');
            }
        }, 1000);
    }
}

// Initialize the application
let scheduleApp;

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('DOM loaded, initializing app...');
    scheduleApp = new ScheduleTimer();
}

// Add interactive effects
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.005;
        const x = (mouseX * speed) % 100;
        const y = (mouseY * speed) % 100;
        
        particle.style.transform = `translate(${x - 50}px, ${y - 50}px)`;
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.activeElement?.classList.add('keyboard-focus');
    }
});

document.addEventListener('click', () => {
    document.querySelectorAll('.keyboard-focus').forEach(el => {
        el.classList.remove('keyboard-focus');
    });
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    document.addEventListener('touchstart', (e) => {
        const target = e.target.closest('.glass-card, .btn, .schedule-item');
        if (target) {
            target.style.transform = 'scale(0.98)';
        }
    });
    
    document.addEventListener('touchend', (e) => {
        const target = e.target.closest('.glass-card, .btn, .schedule-item');
        if (target) {
            setTimeout(() => {
                target.style.transform = '';
            }, 150);
        }
    });
}