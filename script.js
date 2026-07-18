const firstNames = [
  "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph",
  "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Donald",
  "Mark", "Paul", "Steven", "Andrew", "Kenneth", "Mary", "Patricia", "Jennifer",
  "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Nancy",
  "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Emily", "Donna",
  "Michelle"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
  "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
  "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis",
  "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez",
  "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter"
];

const origins = ["Los Santos", "Las Venturas", "Vice City", "Liberty City", "Dallas", "Detroit", "Chicago", "Phoenix", "Seattle"];
const traits = ["хладнокровный", "общительный", "закрытый", "амбициозный", "расчетливый", "спокойный", "наблюдательный", "упрямый"];
const jobs = ["автомеханик", "дальнобойщик", "охранник", "таксист", "юрист", "спасатель", "бармен", "продавец автомобилей", "фельдшер"];
const habits = ["курит слишком много кофе", "ведет заметки о каждом знакомом", "всегда приходит раньше времени", "избегает шумных мест", "тренируется по ночам", "носит старые часы как талисман"];
const childhoods = ["вырос в небогатой семье и рано начал работать", "воспитывался бабушкой и дедушкой", "провел детство между двумя городами", "рано увлекся машинами и уличной культурой", "с детства мечтал выбраться из своего района"];
const diseases = ["без хронических заболеваний", "слабое зрение", "старый перелом руки", "проблемы со сном", "хроническая мигрень"];
const weaponSkills = ["не владеет оружием", "умеет обращаться с пистолетом", "прошел базовую стрелковую подготовку", "уверенно стреляет на короткой дистанции"];

const bannedBadWords = [
  "fuck", "shit", "bitch", "nazi", "gay", "pidor", "eblan", "chmo", "piska", "pizda",
  "gandon", "rage", "ragerussia", "dodik", "govno", "xyi", "sosat", "givno", "cho",
  "govnyar", "zalupa", "russia", "ukraine", "terorism", "mq"
];

const bannedRoles = [
  "admin", "moder", "moderator", "administation", "osnova", "zga", "ga", "kyrator", "kyr"
];

const els = {
  input: document.getElementById("nicknameInput"),
  status: document.getElementById("statusBox"),
  random: document.getElementById("randomButton"),
  copy: document.getElementById("copyButton"),
  check: document.getElementById("checkButton"),
  recent: document.getElementById("recentList"),
  theme: document.getElementById("themeToggle"),
  faqButton: document.getElementById("faqButton"),
  faqModal: document.getElementById("faqModal"),
  loreModal: document.getElementById("loreModal"),
  loreInfo: document.getElementById("loreInfo"),
  loreBio: document.getElementById("loreBio"),
  loreCrime: document.getElementById("loreCrime"),
  loreTabs: document.getElementById("loreTabs")
};

let currentLore = null;
const recentChecksKey = "rp-checker-recent";
const themeKey = "rp-checker-theme";

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomNickname() {
  return `${randomFrom(firstNames)}_${randomFrom(lastNames)}`;
}

function capitalizeWord(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function generateCriminalRecord() {
  const roll = Math.random();
  if (roll < 0.55) {
    return {
      status: "Clean",
      text: "В базе нет серьезных правонарушений. Были только бытовые штрафы."
    };
  }

  if (roll < 0.85) {
    return {
      status: "Minor",
      text: "Есть несколько административных эпизодов: драка, нарушение порядка, мелкие долги."
    };
  }

  return {
    status: "Wanted",
    text: "Есть открытые вопросы у полиции, персонаж периодически менял адрес и круг общения."
  };
}

function generateLore(nickname) {
  const [firstName, lastName] = nickname.split("_");
  const age = Math.floor(Math.random() * 23) + 21;
  const criminalRecord = generateCriminalRecord();

  return {
    nickname,
    fullName: `${firstName} ${lastName}`,
    age,
    origin: randomFrom(origins),
    trait: randomFrom(traits),
    job: randomFrom(jobs),
    habit: randomFrom(habits),
    childhood: randomFrom(childhoods),
    health: randomFrom(diseases),
    weaponSkills: randomFrom(weaponSkills),
    criminalRecord
  };
}

function validateNickname(value) {
  const nickname = value.trim();
  const errors = [];
  const suggestions = [];

  if (!nickname) {
    return { isValid: false, errors, suggestions };
  }

  if (!nickname.includes("_")) {
    errors.push("Ник должен содержать нижнее подчеркивание (Имя_Фамилия).");
  }

  const parts = nickname.split("_");
  if (parts.length > 2) {
    errors.push("В нике слишком много частей. Используйте формат Имя_Фамилия.");
  }

  const firstName = parts[0] || "";
  const lastName = parts[1] || "";

  if (firstName.length < 2) {
    errors.push("Имя слишком короткое (минимум 2 буквы).");
  }

  if (lastName.length < 2) {
    errors.push("Фамилия слишком короткая (минимум 2 буквы).");
  }

  const lowered = nickname.toLowerCase();
  let containsBlockedWord = bannedBadWords.some((word) => lowered.includes(word));

  if (!containsBlockedWord) {
    const splitLower = lowered.split("_");
    containsBlockedWord = bannedRoles.some((role) => splitLower.some((part) => part === role));
  }

  if (containsBlockedWord) {
    errors.push("Ник содержит запрещенные слова или оскорбления.");
  }

  const latinOnly = /^[a-zA-Z]+$/;
  if (firstName && !latinOnly.test(firstName)) {
    errors.push("Имя должно состоять только из английских букв.");
  }
  if (lastName && !latinOnly.test(lastName)) {
    errors.push("Фамилия должна состоять только из английских букв.");
  }

  if (firstName && firstName[0] !== firstName[0].toUpperCase()) {
    errors.push("Имя должно начинаться с большой буквы.");
  }
  if (firstName && firstName.slice(1) !== firstName.slice(1).toLowerCase()) {
    errors.push("Остальные буквы имени должны быть строчными.");
  }
  if (lastName && lastName[0] !== lastName[0].toUpperCase()) {
    errors.push("Фамилия должна начинаться с большой буквы.");
  }
  if (lastName && lastName.slice(1) !== lastName.slice(1).toLowerCase()) {
    errors.push("Остальные буквы фамилии должны быть строчными.");
  }

  if (errors.length > 0 && !containsBlockedWord) {
    const firstClean = firstName.replace(/[^a-zA-Z]/g, "");
    const lastClean = lastName.replace(/[^a-zA-Z]/g, "");

    if (firstClean && lastClean) {
      const firstFixed = capitalizeWord(firstClean);
      const lastFixed = capitalizeWord(lastClean);
      suggestions.push(`${firstFixed}_${lastFixed}`);
      suggestions.push(`${firstFixed}_${lastFixed}ov`);
      suggestions.push(`${firstFixed}y_${lastFixed}`);
    } else if (firstClean) {
      const firstFixed = capitalizeWord(firstClean);
      suggestions.push(`${firstFixed}_Smith`);
      suggestions.push(`${firstFixed}_Johnson`);
    } else {
      suggestions.push("John_Doe");
      suggestions.push("Alex_Mason");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions: Array.from(new Set(suggestions)).slice(0, 3),
    lore: errors.length === 0 ? generateLore(nickname) : null
  };
}

function saveRecent(entry) {
  const current = loadRecent().filter((item) => item.nickname !== entry.nickname);
  const next = [entry, ...current].slice(0, 5);
  localStorage.setItem(recentChecksKey, JSON.stringify(next));
  renderRecent();
}

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(recentChecksKey) || "[]");
  } catch {
    return [];
  }
}

function renderRecent() {
  const recent = loadRecent();

  if (!recent.length) {
    els.recent.innerHTML = '<p class="muted">Пока пусто. Проверь первый ник.</p>';
    return;
  }

  els.recent.innerHTML = recent.map((item) => `
    <button class="recent-item" type="button" data-nick="${item.nickname}">
      <div>
        <strong>${item.nickname}</strong>
        <span>${item.valid ? "Прошел проверку" : "Есть ошибки"}</span>
      </div>
      <span>${item.valid ? "OK" : "ERR"}</span>
    </button>
  `).join("");

  els.recent.querySelectorAll("[data-nick]").forEach((button) => {
    button.addEventListener("click", () => {
      els.input.value = button.dataset.nick || "";
      runCheck();
    });
  });
}

function renderStatus(result, nickname) {
  if (!nickname) {
    els.status.innerHTML = '<p class="status-empty">Здесь появится результат проверки.</p>';
    return;
  }

  if (result.isValid) {
    currentLore = result.lore;
    els.status.innerHTML = `
      <div class="result-badge success">Ник прошел проверку</div>
      <h3>${nickname}</h3>
      <p>Формат выглядит корректно: имя и фамилия оформлены по RP-шаблону.</p>
      <div class="result-actions">
        <button class="show-lore" id="showLoreButton" type="button">Открыть личное дело</button>
        <button class="show-lore" id="reuseButton" type="button">Оставить этот ник</button>
      </div>
    `;

    document.getElementById("showLoreButton").addEventListener("click", openLoreModal);
    document.getElementById("reuseButton").addEventListener("click", () => {
      navigator.clipboard.writeText(nickname).catch(() => {});
    });
    return;
  }

  currentLore = null;
  const errorMarkup = result.errors.map((error) => `<li>${error}</li>`).join("");
  const suggestionsMarkup = result.suggestions.length
    ? `
      <div class="suggestions">
        ${result.suggestions.map((value) => `<button class="suggestion" data-suggestion="${value}" type="button">${value}</button>`).join("")}
      </div>
    `
    : "";

  els.status.innerHTML = `
    <div class="result-badge error">Ник не прошел проверку</div>
    <h3>${nickname}</h3>
    <ul class="error-list">${errorMarkup}</ul>
    ${suggestionsMarkup}
  `;

  els.status.querySelectorAll("[data-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      els.input.value = button.dataset.suggestion || "";
      runCheck();
    });
  });
}

function renderLore(lore) {
  if (!lore) return;

  els.loreInfo.innerHTML = `
    <div class="lore-grid">
      <div class="lore-card"><strong>Полное имя</strong><span>${lore.fullName}</span></div>
      <div class="lore-card"><strong>Возраст</strong><span>${lore.age}</span></div>
      <div class="lore-card"><strong>Происхождение</strong><span>${lore.origin}</span></div>
      <div class="lore-card"><strong>Работа</strong><span>${lore.job}</span></div>
    </div>
  `;

  els.loreBio.innerHTML = `
    <ul class="detail-list">
      <li>По характеру персонаж ${lore.trait}.</li>
      <li>В детстве ${lore.childhood}.</li>
      <li>Повседневная привычка: ${lore.habit}.</li>
      <li>Состояние здоровья: ${lore.health}.</li>
    </ul>
  `;

  els.loreCrime.innerHTML = `
    <ul class="detail-list">
      <li>Статус: ${lore.criminalRecord.status}.</li>
      <li>${lore.criminalRecord.text}</li>
      <li>Навыки оружия: ${lore.weaponSkills}.</li>
    </ul>
  `;
}

function openModal(dialog) {
  if (!dialog.open) {
    dialog.showModal();
  }
}

function closeModal(dialog) {
  if (dialog.open) {
    dialog.close();
  }
}

function openLoreModal() {
  renderLore(currentLore);
  setActiveTab("info");
  openModal(els.loreModal);
}

function setActiveTab(tabName) {
  els.loreTabs.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tabName);
  });
}

function runCheck() {
  const nickname = els.input.value.trim();
  const result = validateNickname(nickname);
  renderStatus(result, nickname);

  if (nickname) {
    saveRecent({
      nickname,
      valid: result.isValid
    });
  }
}

function setTheme(theme) {
  document.body.classList.toggle("is-dark", theme === "dark");
  localStorage.setItem(themeKey, theme);
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("is-dark") ? "light" : "dark";
  setTheme(nextTheme);
}

function initTheme() {
  const storedTheme = localStorage.getItem(themeKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    setTheme(storedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

els.random.addEventListener("click", () => {
  els.input.value = randomNickname();
  runCheck();
});

els.copy.addEventListener("click", async () => {
  const value = els.input.value.trim();
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
  } catch {}
});

els.check.addEventListener("click", runCheck);
els.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runCheck();
  }
});

els.theme.addEventListener("click", toggleTheme);
els.faqButton.addEventListener("click", () => openModal(els.faqModal));
els.loreTabs.addEventListener("click", (event) => {
  const target = event.target.closest("[data-tab]");
  if (!target) return;
  setActiveTab(target.dataset.tab);
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.close);
    if (dialog) {
      closeModal(dialog);
    }
  });
});

initTheme();
renderRecent();
renderStatus({ isValid: false, errors: [], suggestions: [] }, "");
