const wisdomLibrary = [
    {
        situation: "distraction",
        source: "Bhagavad Gita 6.26",
        teaching:
            "Whenever the restless mind wanders away, bring it back gently to the chosen focus.",
        practice:
            "When you notice yourself reaching for your phone, pause and return to what you chose to do."
    },

    {
        situation: "craving",
        source: "Bhagavad Gita 2.62–63",
        teaching:
            "Repeated attention toward something can strengthen attachment to it.",
        practice:
            "Notice the urge to scroll before acting on it. Give yourself a moment of choice."
    },

    {
        situation: "focus",
        source: "Bhagavad Gita 2.47",
        teaching:
            "Your responsibility is to your action, rather than being consumed by its result.",
        practice:
            "For the next session, give your attention to the work itself rather than constantly checking the outcome."
    },

    {
        situation: "boredom",
        source: "Inspired by Vijñāna Bhairava Tantra",
        teaching:
            "Moments between ordinary activities can become opportunities for awareness.",
        practice:
            "During your break, resist immediately filling the silence. Simply notice what arises."
    },

    {
        situation: "consistency",
        source: "Bhagavad Gita 6.35",
        teaching:
            "The restless mind can be brought under direction through practice and detachment.",
        practice:
            "Don't aim for perfection. Return to your practice each time you wander."
    }
];
const achievements = [
    {
        id: "first_return",
        icon: "🌱",
        name: "First Return",
        description: "Complete your first focus session.",
        unlocked: stats => stats.sessions >= 1
    },

    {
        id: "steady_practice",
        icon: "🌿",
        name: "Steady Practice",
        description: "Complete 5 focus sessions.",
        unlocked: stats => stats.sessions >= 5
    },

    {
        id: "deep_practice",
        icon: "🏔️",
        name: "Deep Practice",
        description: "Complete 25 focus sessions.",
        unlocked: stats => stats.sessions >= 25
    },

    {
        id: "seven_days",
        icon: "🔥",
        name: "Seven Days of Practice",
        description: "Maintain a 7-day practice streak.",
        unlocked: stats => stats.streak >= 7
    },

    {
        id: "conscious_pause",
        icon: "🪷",
        name: "Conscious Pause",
        description: "Pause a scrolling craving.",
        unlocked: stats => stats.cravingsPaused >= 1
    },

    {
        id: "hundred_sessions",
        icon: "🏵️",
        name: "100 Returns",
        description: "Complete 100 focus sessions.",
        unlocked: stats => stats.sessions >= 100
    }
];
function getUnlockedAchievements() {

    const stats = getStats();

    return achievements.filter(
        achievement => achievement.unlocked(stats)
    );
}
function chooseWisdom(data) {

    if (data.cravingsPaused > 0) {
        return wisdomLibrary.find(
            item => item.situation === "craving"
        );
    }

    if (data.recentSessions.length === 0) {
        return wisdomLibrary.find(
            item => item.situation === "focus"
        );
    }

    if (data.currentStreak >= 7) {
        return wisdomLibrary.find(
            item => item.situation === "consistency"
        );
    }

    const averageMinutes =
        data.recentSessions.reduce(
            (sum, session) => sum + session.minutes,
            0
        ) / data.recentSessions.length;

    if (averageMinutes >= 30) {
        return wisdomLibrary.find(
            item => item.situation === "focus"
        );
    }

    return wisdomLibrary.find(
        item => item.situation === "boredom"
    );
}
function getStats() {

    return JSON.parse(
        localStorage.getItem("dhyanaStats")
    ) || {
        sessions: 0,
        focusMinutes: 0,
        reflections: 0,
        cravingsPaused: 0,
        streak: 0,
        lastPracticeDate: null,
        todaySessions: 0,
todayMinutes: 0,
todayDate: null
    };
}


function saveStats(stats) {

    localStorage.setItem(
        "dhyanaStats",
        JSON.stringify(stats)
    );
}
function getToday() {
    return new Date().toISOString().split("T")[0];
}
function recordPracticeDay() {

    let stats = getStats();

    const today = getToday();

    if (stats.lastPracticeDate === today) {
        return;
    }

    if (stats.lastPracticeDate) {

        const lastDate =
            new Date(stats.lastPracticeDate);

        const currentDate =
            new Date(today);

        const difference =
            Math.floor(
                (currentDate - lastDate) /
                (1000 * 60 * 60 * 24)
            );

        if (difference === 1) {
            stats.streak++;
        } else {
            stats.streak = 1;
        }

    } else {
        stats.streak = 1;
    }

    stats.lastPracticeDate = today;

    saveStats(stats);
}
function startFocus() {

    const intention =
     document.getElementById("intention").value.trim();

    if (intention === "") {
        alert("Choose an intention before you begin.");
        return;
    }
window.currentIntention = intention;

    // Store the session start time
    window.focusStartTime = Date.now();
const unlockedAchievements =
    getUnlockedAchievements();

const achievementsHTML =
    unlockedAchievements.length > 0
        ? unlockedAchievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon">
                    ${achievement.icon}
                </div>

                <div>
                    <strong>${achievement.name}</strong>
                    <span>${achievement.description}</span>
                </div>
            </div>
        `).join("")
        : `
            <p class="focus-message">
                Your first achievement is waiting.
                Begin with one intentional session.
            </p>
        `;
    document.querySelector(".app").innerHTML = `
        <div class="focus-screen">

            <div class="logo">D</div>

            <p class="small-text">YOUR INTENTION</p>

            <h1>${intention}</h1>

<div class="timer" id="timer">
    ${String(window.selectedDuration).padStart(2, "0")}:00
</div>

            <p class="focus-message">
                Stay with what matters.
            </p>

            <button onclick="finishFocus()">
                Complete Session
            </button>

        </div>
    `;
   startTimer(window.selectedDuration * 60);
}
function startTimer(seconds) {

    let remaining = seconds;

    const timer = setInterval(() => {

        const minutes = Math.floor(remaining / 60);
        const secondsLeft = remaining % 60;

        document.getElementById("timer").textContent =
            `${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;

        remaining--;

        if (remaining < 0) {
            clearInterval(timer);

            document.getElementById("timer").textContent = "00:00";

            alert("Focus session complete 🌱");

            finishFocus();
        }

    }, 1000);
}

function finishFocus() {

    // Calculate actual minutes spent
    const elapsedMilliseconds =
        Date.now() - window.focusStartTime;

    const elapsedMinutes =
        Math.max(1, Math.round(elapsedMilliseconds / 60000));

    let stats = getStats();

recordPracticeDay();

stats = getStats();

const today = getToday();

if (stats.todayDate !== today) {
    stats.todayDate = today;
    stats.todaySessions = 0;
    stats.todayMinutes = 0;
}

stats.sessions++;
stats.focusMinutes += elapsedMinutes;

stats.todaySessions++;
stats.todayMinutes += elapsedMinutes;

// Save this session for future insights
if (!stats.sessionHistory) {
    stats.sessionHistory = [];
}

stats.sessionHistory.push({
    intention: window.currentIntention,
    minutes: elapsedMinutes,
    date: getToday()
});

saveStats(stats);

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">✓</div>

            <h1>Well done.</h1>

            <p class="focus-message">
                You focused for ${elapsedMinutes} minute${elapsedMinutes === 1 ? "" : "s"}.
                <br><br>
                You kept your intention.
            </p>

            <button onclick="showBreaks()">
                Take a Conscious Break
            </button>

        </div>
    `;
}

function showBreaks() {

    document.querySelector(".app").innerHTML = `
        <div class="break-screen">

            <div class="logo">🌿</div>

            <p class="small-text">CONSCIOUS BREAK</p>

            <h1>Choose your break</h1>

            <p class="focus-message">
                Your break is part of your practice.
                Choose consciously.
            </p>

            <div class="break-options">

                <button onclick="chooseBreak('Boredom')">
                    🌿 Be Still
                </button>

                <button onclick="chooseBreak('Movement')">
                    🚶 Move
                </button>

                <button onclick="chooseBreak('Reflection')">
                    💭 Reflect
                </button>

                <button onclick="chooseBreak('Learning')">
                    🎧 Learn
                </button>

            </div>

            <button onclick="showProgress()">
                🌱 View My Practice
            </button>

            <button onclick="generateInsight()">
                🧠 My Insight
            </button>

            <button
                class="secondary-button"
                onclick="location.reload()">
                Back to Dhyana
            </button>

        </div>
    `;
}

function chooseBreak(type) {

    if (type === "Boredom") {
        startStillBreak();
        return;
    }

    if (type === "Reflection") {
        startReflection();
        return;
    }

    document.querySelector(".app").innerHTML = `
        <div class="break-screen">

            <div class="logo">🌱</div>

            <p class="small-text">YOUR BREAK</p>

            <h1>${type}</h1>

            <p class="focus-message">
                Take this time intentionally.
            </p>

            <button onclick="finishBreak()">
                Finish Break
            </button>

        </div>
    `;
}
function startReflection() {

    document.querySelector(".app").innerHTML = `
        <div class="break-screen">

            <div class="logo">💭</div>

            <p class="small-text">REFLECTION</p>

            <h1>What did you notice?</h1>

            <p class="focus-message">
                Write anything that came to mind.
                There is no right answer.
            </p>

            <textarea
                id="reflection"
                placeholder="I noticed..."
            ></textarea>

            <button onclick="saveReflection()">
                Save Reflection
            </button>

        </div>
    `;
}
function saveReflection() {

    const reflection =
        document.getElementById("reflection").value.trim();

    if (reflection === "") {
        alert("Write something before saving.");
        return;
    }
let stats = getStats();

stats.reflections++;

saveStats(stats);
    localStorage.setItem(
        "lastReflection",
        reflection
    );

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">🌱</div>

            <h1>Reflection saved.</h1>

            <p class="focus-message">
                A thought noticed is a thought remembered.
            </p>

            <button onclick="finishBreak()">
                Continue
            </button>

        </div>
    `;
}
function startStillBreak() {

    let remaining = 5;

    document.querySelector(".app").innerHTML = `
        <div class="break-screen">

            <div class="logo">🌿</div>

            <p class="small-text">BE STILL</p>

            <h1>Nothing to do.</h1>

            <p class="focus-message">
                Put the phone down.<br>
                Let your mind wander.
            </p>

            <div class="timer" id="breakTimer">
                00:10
            </div>

            <p class="focus-message">
                Notice what arises without needing to act on it.
            </p>

            <button id="breakButton" disabled>
                Stay here...
            </button>

        </div>
    `;

    const timer = setInterval(() => {

        remaining--;

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        document.getElementById("breakTimer").textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (remaining <= 0) {

            clearInterval(timer);

            document.getElementById("breakTimer").textContent = "00:00";

            const button = document.getElementById("breakButton");

            button.disabled = false;
            button.textContent = "I’m ready to return";
            button.onclick = finishBreak;
        }

    }, 1000);
}


function finishBreak() {

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">🌱</div>

            <h1>Ready to return?</h1>

            <p class="focus-message">
                You can begin another meaningful session whenever you're ready.
            </p>

            <button onclick="location.reload()">
                Start Again
            </button>

        </div>
    `;
}
function showJar() {

    document.querySelector(".app").innerHTML = `
        <div class="break-screen">

            <div class="logo">🫙</div>

            <p class="small-text">GOOD THINGS JAR</p>

            <h1>What was good today?</h1>

            <p class="focus-message">
                Even something small counts.
            </p>

            <textarea
                id="goodThing"
                placeholder="Today I..."
            ></textarea>

            <button onclick="saveGoodThing()">
                Put it in the Jar 🫙
            </button>

            <button
                class="secondary-button"
                onclick="showRandomMemory()">
                Pick a Random Memory
            </button>

        </div>
    `;
}
function saveGoodThing() {

    const text =
        document.getElementById("goodThing").value.trim();

    if (text === "") {
        alert("Write something good first.");
        return;
    }

    let goodThings =
        JSON.parse(localStorage.getItem("goodThings")) || [];

    goodThings.push({
        text: text,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem(
        "goodThings",
        JSON.stringify(goodThings)
    );

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">🫙</div>

            <h1>Into the jar.</h1>

            <p class="focus-message">
                One small good thing is now saved.
            </p>

            <button onclick="showJar()">
                Add Another
            </button>

            <button
                class="secondary-button"
                onclick="showRandomMemory()">
                Pick a Random Memory
            </button>

        </div>
    `;
}
function showRandomMemory() {

    const goodThings =
        JSON.parse(localStorage.getItem("goodThings")) || [];

    if (goodThings.length === 0) {
        alert("Your jar is empty. Add your first good thing!");
        return;
    }

    const randomIndex =
        Math.floor(Math.random() * goodThings.length);

    const memory = goodThings[randomIndex];

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">❤️</div>

            <p class="small-text">A MEMORY FROM YOUR JAR</p>

            <h1>“${memory.text}”</h1>

            <p class="focus-message">
                Saved on ${memory.date}
            </p>

            <button onclick="showJar()">
                Keep Memory
            </button>

            <button
                class="delete-button"
                onclick="deleteMemory(${randomIndex})">
                🗑️ Delete Memory
            </button>

        </div>
    `;
}
function deleteMemory(index) {

    let goodThings =
        JSON.parse(localStorage.getItem("goodThings")) || [];

    goodThings.splice(index, 1);

    localStorage.setItem(
        "goodThings",
        JSON.stringify(goodThings)
    );

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">🌱</div>

            <h1>Memory removed.</h1>

            <p class="focus-message">
                Your jar belongs to you.
            </p>

            <button onclick="showJar()">
                Back to Jar
            </button>

        </div>
    `;
}
function showCravingMode() {

    document.querySelector(".app").innerHTML = `
        <div class="break-screen">

            <div class="logo">🧍</div>

            <p class="small-text">CRAVING MODE</p>

            <h1>Want to scroll?</h1>

            <p class="focus-message">
                You can choose to watch.<br>
                First, change the conditions.
            </p>

            <div class="craving-card">

                <h2>🧍 Stand while watching</h2>

                <p>
                    Standing makes the action intentional
                    instead of automatic.
                </p>

            </div>

            <button onclick="startStandingChallenge()">
                Start Standing Challenge
            </button>

            <button
                class="secondary-button"
                onclick="finishBreak()">
                Never mind
            </button>

        </div>
    `;
}
function startStandingChallenge() {

    let remaining = 30;

    document.querySelector(".app").innerHTML = `
        <div class="break-screen">

            <div class="logo">🧍</div>

            <p class="small-text">STANDING CHALLENGE</p>

            <h1>Stay standing.</h1>

            <p class="focus-message">
                If you still want to watch,
                you can.<br><br>

                Just stay aware of your choice.
            </p>

            <div class="timer" id="cravingTimer">
                00:30
            </div>

            <button id="cravingButton" disabled>
                Challenge in progress...
            </button>

        </div>
    `;

    const timer = setInterval(() => {

        remaining--;

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        document.getElementById("cravingTimer").textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (remaining <= 0) {

            clearInterval(timer);

            const button =
                document.getElementById("cravingButton");

            button.disabled = false;
            button.textContent = "I made a conscious choice";

            button.onclick = cravingCompleted;
        }

    }, 1000);
}
function cravingCompleted() {
    let stats = getStats();

stats.cravingsPaused++;

saveStats(stats);

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">🌱</div>

            <h1>You paused.</h1>

            <p class="focus-message">
                The goal wasn't to fight the craving.
                <br><br>
                You noticed it and chose consciously.
            </p>

            <button onclick="location.reload()">
                Return to Dhyana
            </button>

        </div>
    `;
}
function showProgress() {

    const stats = getStats();
    
   

    let level = "🌱 Beginning";

    if (stats.sessions >= 25) {
        level = "🏔️ Deep Practice";
    } else if (stats.sessions >= 10) {
        level = "🌳 Growing";
    } else if (stats.sessions >= 5) {
        level = "🌿 Steady Practice";
    } else if (stats.sessions >= 1) {
        level = "🌱 First Step";
    }

    // Recent practice history
    let historyHTML = "";

    if (stats.sessionHistory && stats.sessionHistory.length > 0) {

        const history = stats.sessionHistory
            .slice(-5)
            .reverse()
            .map(session => `
                <div class="session-item">
                    <strong>${session.intention}</strong>
                    <span>${session.minutes} min · ${session.date}</span>
                </div>
            `)
            .join("");

        historyHTML = `
            <div class="session-history">

                <p class="small-text">RECENT PRACTICE</p>

                ${history}

            </div>
        `;
    }

    // Achievements
    const unlockedAchievements =
        getUnlockedAchievements();

    const achievementsHTML =
        unlockedAchievements.length > 0
            ? unlockedAchievements.map(achievement => `
                <div class="achievement-item">

                    <div class="achievement-icon">
                        ${achievement.icon}
                    </div>

                    <div>
                        <strong>${achievement.name}</strong>
                        <span>${achievement.description}</span>
                    </div>

                </div>
            `).join("")
            : `
                <p class="focus-message">
                    Your first achievement is waiting.
                    Begin with one intentional session.
                </p>
            `;

    // Display the practice screen
    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">🌱</div>

            <p class="small-text">YOUR PRACTICE</p>

            <h1>${level}</h1>

            <div class="stats-card">

                <p>🔥 Practice streak</p>
                <h2>
                    ${stats.streak || 0}
                    day${stats.streak === 1 ? "" : "s"}
                </h2>

                <p>🎯 Focus sessions</p>
                <h2>${stats.sessions}</h2>

                <p>⏱️ Focused minutes</p>
                <h2>${stats.focusMinutes}</h2>

                <p>💭 Reflections</p>
                <h2>${stats.reflections}</h2>

                <p>🧍 Cravings paused</p>
                <h2>${stats.cravingsPaused}</h2>

            </div>

            <div class="achievement-section">

                <p class="small-text">YOUR ACHIEVEMENTS</p>

                ${achievementsHTML}

            </div>

            ${historyHTML}

            <button onclick="location.reload()">
                Return to Dhyana
            </button>

        </div>
    `;
}
function showFocusSetup() {

    document.querySelector(".app").innerHTML = `
        <div class="welcome-card">

            <div class="logo">D</div>

            <h2>What would you like to focus on?</h2>

            <p class="focus-message">
                Choose one thing. Give it your attention.
            </p>

            <input
                type="text"
                id="intention"
                placeholder="e.g. Study Digital Electronics"
            >

            <p class="small-text">CHOOSE YOUR TIME</p>

            <div class="duration-options">

                <button
                    class="duration-button selected"
                    data-minutes="25"
                    onclick="selectDuration(this)">
                    25 min
                </button>

                <button
                    class="duration-button"
                    data-minutes="10"
                    onclick="selectDuration(this)">
                    10 min
                </button>

                <button
                    class="duration-button"
                    data-minutes="45"
                    onclick="selectDuration(this)">
                    45 min
                </button>

                <button
                    class="duration-button"
                    data-minutes="60"
                    onclick="selectDuration(this)">
                    60 min
                </button>

            </div>

            <button onclick="startFocus()">
                Begin Focus
            </button>

            <button
                class="secondary-button"
                onclick="location.reload()">
                Back
            </button>

        </div>
    `;

    window.selectedDuration = 25;
}
function selectDuration(button) {

    document.querySelectorAll(".duration-button")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    button.classList.add("selected");

    window.selectedDuration =
        Number(button.dataset.minutes);
}
async function generateInsight() {

    const data = getPracticeDataForAI();

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">🧠</div>

            <p class="small-text">DHYANA INSIGHT</p>

            <h1>Reflecting...</h1>

            <p class="focus-message">
                Dhyana is looking at your practice.
            </p>

        </div>
    `;

    try {

        const response = await fetch(
            "https://dhyana-khaki.vercel.app/api/insight",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error("AI response failed");
        }

        document.querySelector(".app").innerHTML = `
            <div class="complete-screen">

                <div class="logo">🕉️</div>

                <p class="small-text">DHYANA INSIGHT</p>

                <h1>Your reflection</h1>

                <div class="insight-card">

                    <p class="focus-message">
                        ${result.insight}
                    </p>

                </div>

                <button onclick="location.reload()">
                    Return to Dhyana
                </button>

            </div>
        `;

    } catch (error) {

        console.error(error);

        document.querySelector(".app").innerHTML = `
            <div class="complete-screen">

                <div class="logo">🌱</div>

                <h1>Insight unavailable</h1>

                <p class="focus-message">
                    Dhyana couldn't connect to its reflection service.
                    Your practice is still saved.
                </p>

                <button onclick="location.reload()">
                    Return to Dhyana
                </button>

            </div>
        `;
    }
}
function updateHomeMessage() {

    const message = document.getElementById("homeMessage");

    if (!message) return;

    const stats = getStats();
    

    if (stats.sessions === 0) {
        message.textContent =
            "What matters right now?";
    }
    else if (stats.streak >= 7) {
        message.textContent =
            "Your practice is becoming a habit.";
    }
    else if (stats.todaySessions > 0) {
        message.textContent =
            "You've already given yourself some attention today.";
    }
    else {
        message.textContent =
            "Ready to return to what matters?";
    }
}
function updateHomeMessage() {

    const message = document.getElementById("homeMessage");

    if (!message) return;

    const stats = getStats();

    if (stats.sessions === 0) {
        message.textContent =
            "What matters right now?";
    }
    else if (stats.streak >= 7) {
        message.textContent =
            "Your practice is becoming a habit.";
    }
    else if (stats.todaySessions > 0) {
        message.textContent =
            "You've already given yourself some attention today.";
    }
    else {
        message.textContent =
            "Ready to return to what matters?";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    updateHomeDashboard();
    updateHomeMessage();
});
function getPracticeDataForAI() {

    const stats = getStats();

    return {
        totalSessions: stats.sessions || 0,
        totalFocusMinutes: stats.focusMinutes || 0,
        currentStreak: stats.streak || 0,
        reflections: stats.reflections || 0,
        cravingsPaused: stats.cravingsPaused || 0,

        recentSessions: (stats.sessionHistory || [])
            .slice(-10)
            .map(session => ({
                intention: session.intention,
                minutes: session.minutes,
                date: session.date
            }))
    };
}
function generateInsight() {

    const data = getPracticeDataForAI();
const wisdom = chooseWisdom(data);
    let averageMinutes = 0;

    if (data.recentSessions.length > 0) {
        const total = data.recentSessions.reduce(
            (sum, session) => sum + session.minutes,
            0
        );

        averageMinutes =
            Math.round(total / data.recentSessions.length);
    }

    let pattern = "";
    let suggestion = "";

    if (data.totalSessions === 0) {

        pattern = "Your practice is just beginning.";

        suggestion =
            "Choose one small task and give it your full attention.";

    } else if (data.currentStreak >= 7) {

        pattern =
            `You've maintained a ${data.currentStreak}-day practice streak.`;

        suggestion =
            "Protect this consistency rather than trying to do more.";

    } else if (averageMinutes >= 30) {

        pattern =
            `Your recent sessions average ${averageMinutes} minutes.`;

        suggestion =
            "Try keeping your next session distraction-free rather than making it longer.";

    } else if (data.cravingsPaused > 0) {

        pattern =
            `You've paused ${data.cravingsPaused} scrolling craving${data.cravingsPaused === 1 ? "" : "s"}.`;

        suggestion =
            "Notice the urge before deciding what to do next.";

    } else {

        pattern =
            `You've completed ${data.totalSessions} focus session${data.totalSessions === 1 ? "" : "s"}.`;

        suggestion =
            "Before your next session, write one specific intention.";
    }

    document.querySelector(".app").innerHTML = `
        <div class="complete-screen">

            <div class="logo">🧠</div>

            <p class="small-text">DHYANA INSIGHT</p>

            <h1>Your practice</h1>

            <div class="insight-card">
<p class="small-text">TODAY'S WISDOM</p>

<h2>${wisdom.source}</h2>

<p class="focus-message">
    ${wisdom.teaching}
</p>

<p class="small-text">PRACTICE</p>

<p class="focus-message">
    ${wisdom.practice}
</p>
                <p class="small-text">YOUR PATTERN</p>

                <p class="focus-message">
                    ${pattern}
                </p>

                <p class="small-text">TRY THIS</p>

                <p class="focus-message">
                    ${suggestion}
                </p>

            </div>

            <button onclick="location.reload()">
                Return to Dhyana
            </button>

        </div>
    `;
}
