const firstNames = [
  "John", "Alex", "Michael", "Daniel", "Robert", "James", "Anthony", "David",
  "Ryan", "Kevin", "Thomas", "Oliver", "Lucas", "Adam", "Andrew"
];

const lastNames = [
  "Wick", "Smith", "Mason", "Walker", "Carter", "Miller", "Jackson", "Taylor",
  "Anderson", "Parker", "Hunter", "Cooper", "Brooks", "Foster", "Bennett"
];

const bannedBadWords = [
  "admin", "adm", "moder", "moderator", "curator", "owner", "helper", "support",
  "killer", "kill", "dead", "death", "terror", "terrorist", "nazi",
  "fuck", "fck", "shit", "bitch", "dick", "cock", "pussy", "sex",
  "pidor", "pidar", "pidoras", "ebal", "eblan", "blya", "blyad", "suka",
  "hui", "xui", "nahui", "gandon", "chmo", "dolbaeb", "debil", "idiot",
  "228", "666", "777", "1488"
];

const els = {
  input: document.getElementById("nicknameInput"),
  status: document.getElementById("statusBox"),
  random: document.getElementById("randomButton"),
  check: document.getElementById("checkButton"),
  recent: document.getElementById("recentList"),
  faqButton: document.getElementById("faqButton"),
  faqModal: document.getElementById("faqModal")
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

function validateNickname(value) {
  const nickname = value.trim();
  const errors = [];
  const suggestions = [];

  if (!nickname) {
    return { isValid: false, errors: [], suggestions: [] };
  }

  if (!nickname.includes("_")) {
    errors.push('Ник должен быть в формате Имя_Фамилия.');
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

function renderStatus(result, nickname) {
  if (!nickname) {
    els.status.innerHTML = '<p class="status-empty">Здесь появится результат проверки.</p>';
    return;
  }

  if (result.isValid) {
    els.status.innerHTML = `
      <div class="result-badge success">Ник прошел проверку</div>
      <h3>${nickname}</h3>
      <ul class="rules">
        <li>Формат ника правильный.</li>
        <li>Имя и фамилия выглядят корректно.</li>
      </ul>
    `;
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

renderRecent();
renderStatus({ isValid: false, errors: [], suggestions: [] }, "");
