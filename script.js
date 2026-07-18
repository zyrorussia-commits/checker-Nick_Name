const firstNames = [
  "John", "Alex", "Michael", "Daniel", "Robert", "James", "Anthony", "David",
  "Ryan", "Kevin", "Thomas", "Oliver", "Lucas", "Adam", "Andrew"
];

const lastNames = [
  "Wick", "Smith", "Mason", "Walker", "Carter", "Miller", "Jackson", "Taylor",
  "Anderson", "Parker", "Hunter", "Cooper", "Brooks", "Foster", "Bennett", "Rodriguez"
];

const bannedBadWords = [
  "admin", "adm", "moder", "moderator", "curator", "owner", "helper", "support",
  "killer", "kill", "dead", "death", "terror", "terrorist", "nazi",
  "fuck", "fck", "shit", "bitch", "dick", "cock", "pussy", "sex",
  "pidor", "pidar", "pidoras", "ebal", "eblan", "blya", "blyad", "suka",
  "hui", "xui", "nahui", "gandon", "chmo", "dolbaeb", "debil", "idiot",
  "228", "666", "777", "1488"
];

const dossierOrigins = [
  "🇺🇸 Вайс-Сити (США)",
  "🇺🇸 Лос-Сантос (США)",
  "🇺🇸 Сан-Фиерро (США)",
  "🇺🇸 Либерти-Сити (США)",
  "🇨🇦 Торонто (Канада)"
];

const dossierTraits = [
  "Хитрый манипулятор",
  "Спокойный стратег",
  "Холодный прагматик",
  "Упрямый карьерист",
  "Сдержанный реалист"
];

const dossierHabits = [
  "Коллекционирует старые монеты",
  "Записывает мысли в потрепанный блокнот",
  "Каждое утро слушает полицейскую волну",
  "Носит при себе счастливую зажигалку",
  "Любит ночные прогулки по набережной"
];

const dossierYouthItems = [
  "Вырос в благополучной семье, но всегда искал острых ощущений.",
  "С ранних лет привык рассчитывать только на себя и быстро взрослел.",
  "Половину детства провел на улицах района, где уважение приходилось заслуживать.",
  "Учился хорошо, но чаще тянулся к риску, чем к спокойной жизни."
];

const dossierAdultItems = [
  "Имеет медицинское образование, но был уволен за нарушение субординации.",
  "Работал в нескольких частных структурах, пока не решил начать жизнь с нуля.",
  "Сменил несколько профессий и научился держать лицо даже под давлением.",
  "Быстро поднялся по карьерной лестнице, но не ужился с жесткими правилами."
];

const dossierHealthItems = [
  "Здоров, противопоказаний нет",
  "Физически вынослив, хронических заболеваний не имеет",
  "Состояние здоровья стабильное, жалоб не зафиксировано",
  "Медицинских ограничений не выявлено"
];

const cleanCrimeStatuses = [
  "Не привлекался к уголовной ответственности.",
  "Судимостей не имеет, в розыске не числится.",
  "По базе проходит как законопослушный гражданин."
];

const els = {
  input: document.getElementById("nicknameInput"),
  status: document.getElementById("statusBox"),
  random: document.getElementById("randomButton"),
  check: document.getElementById("checkButton"),
  recent: document.getElementById("recentList"),
  faqButton: document.getElementById("faqButton"),
  faqModal: document.getElementById("faqModal"),
  dossierModal: document.getElementById("dossierModal"),
  dossierCitizen: document.getElementById("dossierCitizen"),
  dossierAge: document.getElementById("dossierAge"),
  dossierOrigin: document.getElementById("dossierOrigin"),
  dossierTrait: document.getElementById("dossierTrait"),
  dossierHabit: document.getElementById("dossierHabit"),
  dossierYouth: document.getElementById("dossierYouth"),
  dossierAdult: document.getElementById("dossierAdult"),
  dossierHealth: document.getElementById("dossierHealth"),
  dossierCrimeStatus: document.getElementById("dossierCrimeStatus"),
  skillList: document.getElementById("skillList")
};

const recentChecksKey = "zyro-russia-recent";

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

function seededNumber(value, min, max) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }

  return min + Math.abs(hash % (max - min + 1));
}

function seededPick(value, list) {
  return list[seededNumber(value, 0, list.length - 1)];
}

function validateNickname(value) {
  const nickname = value.trim();
  const errors = [];
  const suggestions = [];

  if (!nickname) {
    return { isValid: false, errors: [], suggestions: [] };
  }

  if (!nickname.includes("_")) {
    errors.push("Ник должен быть в формате Имя_Фамилия.");
  }

  const parts = nickname.split("_");
  if (parts.length !== 2) {
    errors.push('Ник должен содержать только имя и фамилию через "_".');
  }

  const firstName = parts[0] || "";
  const lastName = parts[1] || "";
  const latinOnly = /^[A-Za-z]+$/;

  if (firstName.length < 2 || lastName.length < 2) {
    errors.push("Имя и фамилия должны быть не короче 2 букв.");
  }

  if (/\d/.test(nickname)) {
    errors.push("В нике не должно быть цифр.");
  }

  if (firstName && !latinOnly.test(firstName)) {
    errors.push("Имя должно быть только на английском.");
  }

  if (lastName && !latinOnly.test(lastName)) {
    errors.push("Фамилия должна быть только на английском.");
  }

  if (firstName && firstName !== capitalizeWord(firstName)) {
    errors.push("Имя должно начинаться с заглавной буквы.");
  }

  if (lastName && lastName !== capitalizeWord(lastName)) {
    errors.push("Фамилия должна начинаться с заглавной буквы.");
  }

  const lowered = nickname.toLowerCase();
  if (bannedBadWords.some((word) => lowered.includes(word))) {
    errors.push("Ник содержит запрещенные слова.");
  }

  if (errors.length > 0) {
    const firstClean = capitalizeWord(firstName.replace(/[^A-Za-z]/g, "")) || randomFrom(firstNames);
    const lastClean = capitalizeWord(lastName.replace(/[^A-Za-z]/g, "")) || randomFrom(lastNames);

    suggestions.push(`${firstClean}_${lastClean}`);
    suggestions.push(randomNickname());
    suggestions.push("John_Wick");
  }

  return {
    isValid: errors.length === 0,
    errors: Array.from(new Set(errors)),
    suggestions: Array.from(new Set(suggestions)).slice(0, 3)
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
    els.recent.innerHTML = '<p class="muted">Последние проверки появятся здесь.</p>';
    return;
  }

  els.recent.innerHTML = recent.map((item) => `
    <button class="recent-item" type="button" data-nick="${item.nickname}">
      <div>
        <strong>${item.nickname}</strong>
        <span>${item.valid ? "Ник принят" : "Есть ошибки"}</span>
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

function buildSkills(nickname) {
  return [
    { name: "Deagle", value: seededNumber(`${nickname}-deagle`, 5, 85) },
    { name: "M4 Carbine", value: seededNumber(`${nickname}-m4`, 25, 96) },
    { name: "Shotgun", value: seededNumber(`${nickname}-shotgun`, 10, 78) },
    { name: "AK-47", value: seededNumber(`${nickname}-ak`, 8, 88) }
  ];
}

function fillDossier(nickname) {
  const [firstName = "John", lastName = "Rodriguez"] = nickname.split("_");
  const fullName = `${capitalizeWord(firstName)} ${capitalizeWord(lastName)}`;

  els.dossierCitizen.textContent = fullName;
  els.dossierAge.textContent = String(seededNumber(`${nickname}-age`, 24, 52));
  els.dossierOrigin.textContent = seededPick(`${nickname}-origin`, dossierOrigins);
  els.dossierTrait.textContent = seededPick(`${nickname}-trait`, dossierTraits);
  els.dossierHabit.textContent = seededPick(`${nickname}-habit`, dossierHabits);
  els.dossierYouth.textContent = seededPick(`${nickname}-youth`, dossierYouthItems);
  els.dossierAdult.textContent = seededPick(`${nickname}-adult`, dossierAdultItems);
  els.dossierHealth.textContent = seededPick(`${nickname}-health`, dossierHealthItems);
  els.dossierCrimeStatus.textContent = seededPick(`${nickname}-crime`, cleanCrimeStatuses);

  els.skillList.innerHTML = buildSkills(nickname).map((skill) => `
    <div class="skill-row">
      <span class="skill-name">${skill.name}</span>
      <span class="skill-value">${skill.value}%</span>
      <div class="skill-bar"><span style="width:${skill.value}%"></span></div>
    </div>
  `).join("");
}

function renderStatus(result, nickname) {
  if (!nickname) {
    els.status.innerHTML = '<p class="status-empty">Здесь появится результат проверки.</p>';
    return;
  }

  if (result.isValid) {
    els.status.innerHTML = `
      <div class="result-badge success">Ник прошел проверку</div>
      <h3>${nickname}</h3>
      <p><strong>Отличный ник!</strong><br>Ваш ник полностью соответствует правилам RP.</p>
      <div class="result-actions">
        <button class="show-lore" id="openDossierButton" type="button">📂 Открыть расширенное досье</button>
      </div>
    `;

    const dossierButton = document.getElementById("openDossierButton");
    if (dossierButton) {
      dossierButton.addEventListener("click", () => {
        fillDossier(nickname);
        openModal(els.dossierModal);
      });
    }

    return;
  }

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

function openModal(dialog) {
  if (dialog && !dialog.open) {
    dialog.showModal();
  }
}

function closeModal(dialog) {
  if (dialog && dialog.open) {
    dialog.close();
  }
}

function setupTabs() {
  const tabButtons = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll("[data-panel]");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      tabButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.panel === target);
      });
    });
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

els.random.addEventListener("click", () => {
  els.input.value = randomNickname();
  runCheck();
});

els.check.addEventListener("click", runCheck);
els.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runCheck();
  }
});

els.faqButton.addEventListener("click", () => openModal(els.faqModal));

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.close);
    closeModal(dialog);
  });
});

setupTabs();
renderRecent();
renderStatus({ isValid: false, errors: [], suggestions: [] }, "");
