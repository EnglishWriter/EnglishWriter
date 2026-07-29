import { useState, useEffect, useRef } from "react";
const API = "http://localhost:5000";
const WORDS = [
  "I",
  "you",
  "he",
  "she",
  "we",
  "they",
  "this",
  "that",
  "these",
  "here",
  "there",
  "in",
  "on",
  "to",
  "from",
  "about",
  "with",
  "between",
  "under",
  "over",
  "then",
  "and",
  "or",
  "but",
  "because",
  "yes",
  "no",
  "all",
  "some",
  "many",
  "few",
  "today",
  "yesterday",
  "tomorrow",
  "morning",
  "evening",
  "house",
  "door",
  "window",
  "room",
  "school",
  "class",
  "book",
  "notebook",
  "pen",
  "bag",
  "teacher",
  "student",
  "boy",
  "girl",
  "mother",
  "father",
  "brother",
  "sister",
  "grandfather",
  "grandmother",
  "child",
  "man",
  "woman",
  "friend",
  "water",
  "food",
  "bread",
  "milk",
  "apple",
  "car",
  "street",
  "tree",
  "flower",
  "sun",
  "moon",
  "sky",
  "earth",
  "sea",
  "river",
  "mountain",
  "color",
  "red",
  "blue",
  "green",
  "big",
  "small",
  "tall",
  "short",
  "beautiful",
  "fast",
  "slow",
  "open",
  "close",
  "go",
  "come",
  "sit",
  "stand",
  "play",
  "write",
  "read",
  "eat",
  "drink",
  "sleep",
  "love",
];

// ─── معاني الكلمات بالعربي ─────────────────────────────────────────────────
const MEANINGS = {
  I: "أنا",
  you: "أنت",
  he: "هو",
  she: "هي",
  we: "نحن",
  they: "هم",
  this: "هذا",
  that: "ذلك",
  these: "هؤلاء",
  here: "هنا",
  there: "هناك",
  in: "في",
  on: "على",
  to: "إلى",
  from: "من",
  about: "عن",
  with: "مع",
  between: "بين",
  under: "تحت",
  over: "فوق",
  then: "ثم",
  and: "و",
  or: "أو",
  but: "لكن",
  because: "لأن",
  yes: "نعم",
  no: "لا",
  all: "كل",
  some: "بعض",
  many: "كثير",
  few: "قليل",
  today: "اليوم",
  yesterday: "أمس",
  tomorrow: "غداً",
  morning: "صباح",
  evening: "مساء",
  house: "بيت",
  door: "باب",
  window: "نافذة",
  room: "غرفة",
  school: "مدرسة",
  class: "صف",
  book: "كتاب",
  notebook: "دفتر",
  pen: "قلم",
  bag: "حقيبة",
  teacher: "معلم",
  student: "طالب",
  boy: "ولد",
  girl: "بنت",
  mother: "أم",
  father: "أب",
  brother: "أخ",
  sister: "أخت",
  grandfather: "جد",
  grandmother: "جدة",
  child: "طفل",
  man: "رجل",
  woman: "امرأة",
  friend: "صديق",
  water: "ماء",
  food: "طعام",
  bread: "خبز",
  milk: "حليب",
  apple: "تفاحة",
  car: "سيارة",
  street: "شارع",
  tree: "شجرة",
  flower: "زهرة",
  sun: "شمس",
  moon: "قمر",
  sky: "سماء",
  earth: "أرض",
  sea: "بحر",
  river: "نهر",
  mountain: "جبل",
  color: "لون",
  red: "أحمر",
  blue: "أزرق",
  green: "أخضر",
  big: "كبير",
  small: "صغير",
  tall: "طويل",
  short: "قصير",
  beautiful: "جميل",
  fast: "سريع",
  slow: "بطيء",
  open: "يفتح",
  close: "يغلق",
  go: "اذهب",
  come: "تعال",
  sit: "اجلس",
  stand: "قف",
  play: "العب",
  write: "اكتب",
  read: "اقرأ",
  eat: "كل",
  drink: "اشرب",
  sleep: "نم",
  love: "حب",
};
const meaningOf = (word) => MEANINGS[word] || "";

const TOTAL_BATCHES = Math.ceil(WORDS.length / 5);
const COPIES_REQUIRED = 3;

// ─── Avatars (4 choices: 2 for boys, 2 for girls) ──────────────────────────
const AVATAR_OPTIONS = [
  { id: "boy1", emoji: "👦", label: "ولد" },
  { id: "boy2", emoji: "🦸‍♂️", label: "بطل خارق" },
  { id: "girl1", emoji: "👧", label: "بنت" },
  { id: "girl2", emoji: "🦸‍♀️", label: "بطلة خارقة" },
];
const avatarEmoji = (id) =>
  AVATAR_OPTIONS.find((a) => a.id === id)?.emoji || "🦉";

const toAr = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function speak(word, onEnd) {
  const audio = new Audio(`./audio/${word}.mp3`);
  if (onEnd) audio.onended = onEnd;
  audio.play().catch((err) => {
    console.error(`تعذر تشغيل الصوت للكلمة: ${word}`, err);
  });
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function EnglishWriter() {
  // top-level screen: auth | avatarPick | menu | learn | write | review | done
  const [screen, setScreen] = useState("auth");

  // ── auth state ──
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [authName, setAuthName] = useState("");
  const [authAge, setAuthAge] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(null);
  const [editingAvatarOnly, setEditingAvatarOnly] = useState(false);

  // ── logged-in student ──
  const [student, setStudent] = useState(null);

  // ── learn state ──
  const [batchStart, setBatchStart] = useState(0);
  const [wordPos, setWordPos] = useState(0);
  const [phase, setPhase] = useState("learn"); // learn | write
  const [avatarAnim, setAvatarAnim] = useState("");
  const [bubbleMsg, setBubbleMsg] = useState(
    "أهلاً! استمع للكلمة ثم انتقل للتالية 😊",
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ── write (batch) state ──
  const [writeWordPos, setWriteWordPos] = useState(0); // 0..4 index within batch
  const [writeStage, setWriteStage] = useState("copy"); // copy | missing
  const [copyCount, setCopyCount] = useState(0);
  const [copyInput, setCopyInput] = useState("");
  const [copyError, setCopyError] = useState(false);
  const [missingIndex, setMissingIndex] = useState(0);
  const [missingInput, setMissingInput] = useState("");
  const [missingError, setMissingError] = useState(false);
  const [writeMistakes, setWriteMistakes] = useState(0);
  const [writeDone, setWriteDone] = useState(false);
  const missingInputRef = useRef(null);
  const copyInputRef = useRef(null);

  // ── review (cumulative) exam state — dictation/spelling ──
  const [reviewWords, setReviewWords] = useState([]);
  const [reviewRound, setReviewRound] = useState(0);
  const [reviewTarget, setReviewTarget] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [reviewResults, setReviewResults] = useState([]);
  const [reviewSelected, setReviewSelected] = useState(null);
  const [reviewDone, setReviewDone] = useState(false);
  const reviewRepeatRef = useRef(null);
  const reviewInputRef = useRef(null);

  const currentWordIdx = batchStart + wordPos;
  const currentWord = WORDS[currentWordIdx];
  const currentBatch = batchStart / 5;
  const currentWriteWord = WORDS[batchStart + writeWordPos];

  useEffect(() => {
    return () => {
      clearTimeout(reviewRepeatRef.current);
    };
  }, []);
  useEffect(() => {
    async function loadStudent() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch(`${API}/student/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();

        setStudent(data.student);

        setScreen("menu");
      }
    }

    loadStudent();
  }, []);

  // auto-focus inputs when the relevant stage becomes active
  useEffect(() => {
    if (screen === "write" && writeStage === "copy" && !writeDone) {
      copyInputRef.current?.focus();
    }
    if (screen === "write" && writeStage === "missing" && !writeDone) {
      missingInputRef.current?.focus();
    }
  }, [screen, writeStage, writeWordPos, missingIndex, writeDone]);

  useEffect(() => {
    if (screen === "review" && !reviewDone) {
      reviewInputRef.current?.focus();
    }
  }, [screen, reviewRound, reviewDone]);

  function animAvatar(type) {
    setAvatarAnim(type);
    setTimeout(() => setAvatarAnim(""), 700);
  }

  function speakWord(word, onEnd) {
    setIsSpeaking(true);
    animAvatar("talk");
    speak(word, () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    });
  }

  // ── Auth actions ─────────────────────────────────────────────────────────
  async function handleRegister() {
    setAuthError("");

    const name = authName.trim();

    if (!name || !authAge || !authPassword) {
      setAuthError("الرجاء تعبئة كل الحقول");
      return;
    }

    setAuthBusy(true);

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age: Number(authAge),
          password: authPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error);
        return;
      }

      localStorage.setItem("token", data.token);

      setPendingProfile(data.student);

      setScreen("avatarPick");
    } catch (err) {
      setAuthError("تعذر الاتصال بالسيرفر");
    } finally {
      setAuthBusy(false);
    }
  }
  async function handleLogin() {
    setAuthError("");

    if (!authName || !authPassword) {
      setAuthError("الاسم وكلمة المرور مطلوبان");
      return;
    }

    setAuthBusy(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: authName.trim(),

          password: authPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error);
        return;
      }

      localStorage.setItem("token", data.token);

      enterAppWithStudent(data.student);
    } catch (err) {
      setAuthError("تعذر الاتصال بالسيرفر");
    } finally {
      setAuthBusy(false);
    }
  }

  function enterAppWithStudent(profile) {
    setStudent(profile);
    setAuthName("");
    setAuthAge("");
    setAuthPassword("");
    setAuthError("");
    setScreen("menu");
    setBubbleMsg(`أهلاً بعودتك يا ${profile.name}! 😊`);
  }

  async function handleAvatarChosen(avatarId) {
    try {
      // إذا كان تغيير أفتار لطالب موجود
      if (editingAvatarOnly && student) {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/student/avatar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            avatar: avatarId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.log(data.error);
          return;
        }

        setStudent(data.student);
        setEditingAvatarOnly(false);
        setScreen("menu");

        return;
      }

      // اختيار الأفتار أول مرة بعد التسجيل
      const profile = {
        ...pendingProfile,
        avatar: avatarId,
        maxBatchReached: 0,
        batchPassed: Array(TOTAL_BATCHES).fill(false),
        createdAt: Date.now(),
      };

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/student/avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar: avatarId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        return;
      }

      enterAppWithStudent(data.student);
    } catch (err) {
      console.log(err);
    }
  }

  function handleLogout() {
    clearTimeout(reviewRepeatRef.current);
    window.speechSynthesis?.cancel();
    setStudent(null);
    setAuthMode("login");
    setScreen("auth");
    setPhase("learn");
    setBatchStart(0);
    setWordPos(0);
    setBubbleMsg("أهلاً! استمع للكلمة ثم انتقل للتالية 😊");
  }

  // ── Menu ─────────────────────────────────────────────────────────────────
  function goToLearning() {
    if (!student) return;
    const nextBatchIdx = Math.min(student.maxBatchReached, TOTAL_BATCHES - 1);
    setBatchStart(nextBatchIdx * 5);
    setWordPos(0);
    setPhase("learn");
    setScreen("learn");
    setBubbleMsg("هيا بنا نتعلم! 🚀");
  }

  function startReviewExam() {
    if (!student || student.maxBatchReached <= 0) return;
    const available = WORDS.slice(0, student.maxBatchReached * 5);
    const total = Math.min(10, available.length);
    const pool = shuffle(available).slice(0, total);
    setReviewWords(pool);
    setReviewRound(0);
    setReviewResults([]);
    setReviewDone(false);
    setReviewSelected(null);
    setReviewInput("");
    setScreen("review");
    setBubbleMsg("امتحان إملاء لكل الكلمات اللي خلصتها! ✍️");
    setTimeout(() => buildReviewRound(pool, 0), 300);
  }

  // ── Learn phase ──────────────────────────────────────────────────────────
  function handleSpeak() {
    setBubbleMsg("استمع جيداً... 👂");
    speakWord(currentWord);
  }
  function handleNext() {
    if (wordPos < 4) {
      setWordPos(wordPos + 1);
      setBubbleMsg("ممتاز! كلمة جديدة 🌟");
    } else {
      startWrite();
    }
  }
  function handlePrev() {
    if (wordPos > 0) {
      setWordPos(wordPos - 1);
      setBubbleMsg("العودة للكلمة السابقة ↩️");
    }
  }

  // ── Write phase (copy x3 then missing-letter) ───────────────────────────
  function resetWordWrite(pos) {
    setWriteStage("copy");
    setCopyCount(0);
    setCopyInput("");
    setCopyError(false);
    setMissingIndex(0);
    setMissingInput("");
    setMissingError(false);
  }

  function startWrite() {
    setPhase("write");
    setScreen("write");
    setWriteWordPos(0);
    setWriteMistakes(0);
    setWriteDone(false);
    resetWordWrite(0);
    setBubbleMsg(
      `انسخ الكلمة ${toAr(COPIES_REQUIRED)} مرات، بعدين خمّن الحرف الناقص ✍️`,
    );
  }

  function moveToNextWriteWord() {
    const next = writeWordPos + 1;
    if (next >= 5) {
      setWriteDone(true);
      setBubbleMsg(
        writeMistakes === 0
          ? "ممتاز! كتبت كل الكلمات صح من أول مرة 🏆"
          : `أحسنت! أنهيت المجموعة (${toAr(writeMistakes)} محاولة غلط) 💪`,
      );
      animAvatar("happy");
    } else {
      setWriteWordPos(next);
      resetWordWrite(next);
      setBubbleMsg("كلمة جديدة! هيا نكتبها 📝");
    }
  }

  function handleCopySubmit() {
    if (!copyInput.trim()) return;
    const ok = copyInput.trim().toLowerCase() === currentWriteWord.toLowerCase();
    if (ok) {
      const newCount = copyCount + 1;
      setCopyCount(newCount);
      setCopyInput("");
      setCopyError(false);
      animAvatar("happy");
      if (newCount >= COPIES_REQUIRED) {
        setBubbleMsg("رائع! والآن خمّن الحرف الناقص 🧩");
        setWriteStage("missing");
        setMissingIndex(0);
        setMissingInput("");
      } else {
        setBubbleMsg(`أحسنت! انسخها ${toAr(COPIES_REQUIRED - newCount)} مرة كمان ✍️`);
      }
    } else {
      setCopyError(true);
      setWriteMistakes((m) => m + 1);
      animAvatar("shake");
      setBubbleMsg("مو مضبوط، دقق بالحروف وحاول كمان مرة 🔎");
    }
  }

  function handleMissingSubmit() {
    if (!missingInput.trim()) return;
    const correctLetter = currentWriteWord[missingIndex].toLowerCase();
    const ok = missingInput.trim().toLowerCase() === correctLetter;
    if (ok) {
      animAvatar("happy");
      setMissingError(false);
      const nextIdx = missingIndex + 1;
      if (nextIdx >= currentWriteWord.length) {
        setBubbleMsg(`ممتاز! أكملت كلمة "${currentWriteWord}" ✅`);
        setTimeout(() => moveToNextWriteWord(), 700);
      } else {
        setBubbleMsg("صح! والحرف الجاي؟ 🧩");
        setMissingIndex(nextIdx);
        setMissingInput("");
      }
    } else {
      setMissingError(true);
      setMissingInput("");
      setWriteMistakes((m) => m + 1);
      animAvatar("shake");
      setBubbleMsg("حاول كمان مرة، ركّز على شكل الكلمة 💪");
    }
  }

  async function saveProgress() {
    const token = localStorage.getItem("token");

    const batchIndex = batchStart / 5;

    const res = await fetch(`${API}/student/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        batchIndex,
        passed: true,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setStudent(data.student);
    }
  }

  async function handleContinue() {
    window.speechSynthesis?.cancel();

    await saveProgress();

    const nextBatch = batchStart + 5;

    if (nextBatch >= WORDS.length) {
      setScreen("done");
      setBubbleMsg("أحسنت! أكملت جميع الكلمات 🎊");
      animAvatar("happy");
      return;
    }

    setBatchStart(nextBatch);
    setWordPos(0);
    setPhase("learn");
    setScreen("learn");
    setBubbleMsg("مجموعة جديدة! هيا نتعلم 🚀");
  }

  function handleReviewWords() {
    window.speechSynthesis?.cancel();
    setWordPos(0);
    setPhase("learn");
    setScreen("learn");
    setBubbleMsg("راجع الكلمات وارجع للكتابة 📖");
  }

  function handleRetryWrite() {
    window.speechSynthesis?.cancel();
    startWrite();
  }

  // ── Cumulative review (dictation / spelling test) ───────────────────────
  function buildReviewRound(pool, round) {
    const target = pool[round];
    setReviewTarget(target);
    setReviewInput("");
    setReviewSelected(null);
    setTimeout(() => {
      speakWord(target);
      scheduleReviewRepeat(target);
    }, 400);
  }

  function scheduleReviewRepeat(word) {
    clearTimeout(reviewRepeatRef.current);
    reviewRepeatRef.current = setTimeout(() => {
      speakWord(word, () => scheduleReviewRepeat(word));
    }, 3500);
  }

  function handleReviewReplay() {
    speakWord(reviewTarget);
    scheduleReviewRepeat(reviewTarget);
  }

  function handleReviewSubmit() {
    if (reviewSelected || !reviewInput.trim()) return;
    clearTimeout(reviewRepeatRef.current);
    window.speechSynthesis?.cancel();
    const correct = reviewInput.trim().toLowerCase() === reviewTarget.toLowerCase();
    setReviewSelected({ input: reviewInput, correct });
    const newResults = [...reviewResults, correct];
    setReviewResults(newResults);
    if (correct) {
      animAvatar("happy");
      setBubbleMsg(`صحيح! 🎉 (${reviewTarget} = ${meaningOf(reviewTarget)})`);
    } else {
      animAvatar("shake");
      setBubbleMsg(
        `الكلمة الصحيحة: ${reviewTarget} (${meaningOf(reviewTarget)})`,
      );
    }
    const next = reviewRound + 1;
    setTimeout(() => {
      if (next < reviewWords.length) {
        setReviewRound(next);
        buildReviewRound(reviewWords, next);
      } else {
        setReviewDone(true);
        const score = newResults.filter(Boolean).length;
        setBubbleMsg(
          `انتهى امتحان الإملاء! نتيجتك ${toAr(score)}/${toAr(reviewWords.length)} 🏆`,
        );
        animAvatar(score >= Math.ceil(reviewWords.length * 0.8) ? "happy" : "");
      }
    }, 1600);
  }

  // ── Progress ─────────────────────────────────────────────────────────────
  const learnedCount = student
    ? student.maxBatchReached * 5 + (screen === "learn" ? wordPos : 0)
    : 0;
  const progressPct = Math.round((learnedCount / WORDS.length) * 100);

  // ══════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════

  if (screen === "auth") {
    return (
      <div style={styles.root}>
        <div style={{ ...styles.avatar, marginTop: 12 }}>🦉</div>
        <div style={styles.bubble}>
          تعلّم كتابة ١٠٠ كلمة إنجليزية! سجّل حسابك أو ادخل عليه
        </div>
        <div style={styles.card}>
          <div style={styles.tabRow}>
            <button
              style={
                authMode === "login" ? styles.tabActive : styles.tabInactive
              }
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
              }}
            >
              تسجيل الدخول
            </button>
          </div>

          <input
            style={styles.input}
            placeholder="الاسم"
            value={authName}
            onChange={(e) => setAuthName(e.target.value)}
          />
          {authMode === "register" && (
            <input
              style={styles.input}
              placeholder="العمر"
              type="number"
              min="1"
              max="18"
              value={authAge}
              onChange={(e) => setAuthAge(e.target.value)}
            />
          )}
          <input
            style={styles.input}
            placeholder="كلمة المرور"
            type="password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
          />

          {authError && <div style={styles.errorText}>{authError}</div>}

          <button
            style={{
              ...styles.btnPrimary,
              marginTop: 14,
              width: "100%",
              justifyContent: "center",
            }}
            onClick={authMode === "login" ? handleLogin : handleRegister}
            disabled={authBusy}
          >
            {authBusy
              ? "..."
              : authMode === "login"
                ? "دخول 🔑"
                : "إنشاء الحساب →"}
          </button>

          <div style={styles.hintNote}>
            للاستفسار عن خدماتنا الاخرى او لملاحظاتكم عن هذه الخدمة يمكنكم
            التواصل على 0799142612
          </div>
        </div>
      </div>
    );
  }

  if (screen === "avatarPick") {
    return (
      <div style={styles.root}>
        <div style={styles.bubble}>
          {editingAvatarOnly
            ? "اختر أفتار جديد لك"
            : "اختر الأفتار اللي بيمثلك 😊"}
        </div>
        <div style={styles.card}>
          <div style={styles.avatarGrid}>
            {AVATAR_OPTIONS.map((a) => (
              <button
                key={a.id}
                style={styles.avatarOption}
                onClick={() => handleAvatarChosen(a.id)}
              >
                <div style={{ fontSize: 56 }}>{a.emoji}</div>
                <div style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
                  {a.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "menu") {
    return (
      <div style={styles.root}>
        <div style={styles.avatar}>{avatarEmoji(student.avatar)}</div>
        <div style={styles.bubble}>{bubbleMsg}</div>
        <div style={styles.card}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
            {student.name}
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
            العمر: {toAr(student.age)}
          </div>

          <div style={styles.progressWrap}>
            <div style={{ ...styles.progressFill, width: progressPct + "%" }} />
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
            أنجزت {toAr(student.maxBatchReached * 5)} من {toAr(WORDS.length)}{" "}
            كلمة ({toAr(progressPct)}%)
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              width: "100%",
            }}
          >
            {student.maxBatchReached < TOTAL_BATCHES ? (
              <button style={styles.btnPrimary} onClick={goToLearning}>
                متابعة التعلم 🚀
              </button>
            ) : (
              <div
                style={{
                  color: "#15803d",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                🎊 أكملت كل الكلمات!
              </div>
            )}
            <button
              style={
                student.maxBatchReached > 0
                  ? styles.btnSecondary
                  : styles.btnDisabled
              }
              onClick={startReviewExam}
              disabled={student.maxBatchReached <= 0}
            >
              ✍️ امتحان إملاء لكل الكلمات اللي خلصتها
            </button>
            <button
              style={styles.btnSecondary}
              onClick={() => {
                setEditingAvatarOnly(true);
                setScreen("avatarPick");
              }}
            >
              🧑‍🎨 غيّر الأفتار
            </button>
            <button style={styles.btnGhost} onClick={handleLogout}>
              🚪 تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "done") {
    return (
      <div style={styles.root}>
        <div style={styles.avatar}>{avatarEmoji(student.avatar)}</div>
        <div style={styles.bubble}>{bubbleMsg}</div>
        <div style={styles.card}>
          <div style={{ fontSize: 64 }}>🎊</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1e293b",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            أحسنت يا {student.name}! أتقنت كتابة جميع الكلمات
          </div>
          <button
            style={{ ...styles.btnPrimary, marginTop: 20 }}
            onClick={() => setScreen("menu")}
          >
            🏠 القائمة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (screen === "review") {
    return (
      <div style={styles.root}>
        <div
          style={{
            ...styles.avatar,
            animation:
              avatarAnim === "talk"
                ? "pulse 0.3s ease infinite alternate"
                : avatarAnim === "happy"
                  ? "bounce 0.5s ease"
                  : avatarAnim === "shake"
                    ? "shake 0.4s ease"
                    : "none",
          }}
        >
          {avatarEmoji(student.avatar)}
        </div>
        <div style={styles.bubble}>{bubbleMsg}</div>

        {!reviewDone ? (
          <div style={styles.card}>
            <div style={styles.quizHeader}>
              <span style={styles.quizTitle}>امتحان الإملاء</span>
              <span style={styles.quizRound}>
                {toAr(reviewRound + 1)} / {toAr(reviewWords.length)}
              </span>
            </div>

            <p style={styles.quizHint}>استمع واكتب الكلمة كاملة 👇</p>

            <button
              style={{ ...styles.btnListen, marginBottom: 16 }}
              onClick={handleReviewReplay}
              disabled={isSpeaking}
            >
              <SpeakerIcon /> &nbsp; إعادة الصوت
            </button>

            <input
              ref={reviewInputRef}
              style={{
                ...styles.writeInput,
                ...(reviewSelected
                  ? reviewSelected.correct
                    ? styles.inputCorrect
                    : styles.inputWrong
                  : {}),
              }}
              value={reviewSelected ? reviewSelected.input : reviewInput}
              onChange={(e) => setReviewInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReviewSubmit()}
              disabled={!!reviewSelected}
              placeholder="اكتب الكلمة هنا..."
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />

            {reviewSelected && !reviewSelected.correct && (
              <div style={styles.correctAnswerNote}>
                الصح: <b>{reviewTarget}</b> ({meaningOf(reviewTarget)})
              </div>
            )}

            {!reviewSelected && (
              <button
                style={{ ...styles.btnPrimary, marginTop: 16, width: "100%" }}
                onClick={handleReviewSubmit}
                disabled={!reviewInput.trim()}
              >
                تحقق ✓
              </button>
            )}
          </div>
        ) : (
          <div style={styles.card}>
            <div style={styles.scoreWrap}>
              <div style={styles.scoreBig}>
                {toAr(reviewResults.filter(Boolean).length)}
                <span style={styles.scoreOf}>/{toAr(reviewWords.length)}</span>
              </div>
              <div style={styles.scoreLabel}>نتيجة امتحان الإملاء</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 20,
                width: "100%",
              }}
            >
              <button style={styles.btnPrimary} onClick={startReviewExam}>
                🔁 أعد امتحان الإملاء
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => setScreen("menu")}
              >
                🏠 القائمة الرئيسية
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── learn & write screens (batch flow) ──
  return (
    <div style={styles.root}>
      <div style={styles.topBar}>
        <span style={styles.topLabel}>
          {toAr(Math.min(learnedCount + 1, WORDS.length))} /{" "}
          {toAr(WORDS.length)}
        </span>
        <div style={styles.progressWrap}>
          <div style={{ ...styles.progressFill, width: progressPct + "%" }} />
        </div>
        <span style={styles.topLabel}>{toAr(progressPct)}%</span>
      </div>

      <div style={styles.batchDots}>
        {Array.from({ length: TOTAL_BATCHES }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.batchDot,
              background:
                i < student.maxBatchReached
                  ? "#3b82f6"
                  : i === currentBatch
                    ? "#93c5fd"
                    : "#e2e8f0",
            }}
          />
        ))}
      </div>

      <div
        style={{
          ...styles.avatar,
          animation:
            avatarAnim === "talk"
              ? "pulse 0.3s ease infinite alternate"
              : avatarAnim === "happy"
                ? "bounce 0.5s ease"
                : avatarAnim === "shake"
                  ? "shake 0.4s ease"
                  : "none",
        }}
      >
        {avatarEmoji(student.avatar)}
      </div>

      <div style={styles.bubble}>{bubbleMsg}</div>

      {screen === "learn" && (
        <div style={styles.card}>
          <div style={styles.miniDots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  ...styles.miniDot,
                  background:
                    i < wordPos
                      ? "#3b82f6"
                      : i === wordPos
                        ? "#93c5fd"
                        : "#e2e8f0",
                  transform: i === wordPos ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>

          <div style={styles.wordText}>{currentWord}</div>
          <div style={styles.wordMeaning}>{meaningOf(currentWord)}</div>
          <div style={styles.wordSub}>
            كلمة {toAr(wordPos + 1)} من ٥ — المجموعة {toAr(currentBatch + 1)}
          </div>

          <button
            style={{ ...styles.btnPrimary, marginTop: 20 }}
            onClick={handleSpeak}
            disabled={isSpeaking}
          >
            <SpeakerIcon /> &nbsp; استمع للكلمة
          </button>

          <div style={styles.navRow}>
            <button
              style={styles.btnSecondary}
              onClick={handlePrev}
              disabled={wordPos === 0}
            >
              ← السابقة
            </button>
            <button style={styles.btnPrimary} onClick={handleNext}>
              {wordPos === 4 ? "✍️ ابدأ الكتابة" : "التالية →"}
            </button>
          </div>
          <button
            style={{ ...styles.btnGhost, marginTop: 12 }}
            onClick={() => setScreen("menu")}
          >
            🏠 القائمة الرئيسية
          </button>
        </div>
      )}

      {screen === "write" && !writeDone && (
        <div style={styles.card}>
          <div style={styles.quizHeader}>
            <span style={styles.quizTitle}>
              كتابة المجموعة {toAr(currentBatch + 1)}
            </span>
            <span style={styles.quizRound}>
              {toAr(writeWordPos + 1)} / ٥
            </span>
          </div>

          <div style={styles.miniDots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  ...styles.miniDot,
                  background:
                    i < writeWordPos
                      ? "#22c55e"
                      : i === writeWordPos
                        ? "#93c5fd"
                        : "#e2e8f0",
                  transform: i === writeWordPos ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>

          <div style={styles.wordMeaning}>{meaningOf(currentWriteWord)}</div>

          <button
            style={{ ...styles.btnListen, marginTop: 10, marginBottom: 18 }}
            onClick={() => speakWord(currentWriteWord)}
            disabled={isSpeaking}
          >
            <SpeakerIcon /> &nbsp; استمع للكلمة
          </button>

          {writeStage === "copy" && (
            <>
              <div style={styles.wordText}>{currentWriteWord}</div>
              <p style={styles.quizHint}>انسخ الكلمة كما هي 👇</p>

              <div style={styles.copyDots}>
                {Array.from({ length: COPIES_REQUIRED }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.copyDot,
                      background: i < copyCount ? "#22c55e" : "#e2e8f0",
                    }}
                  />
                ))}
              </div>

              <input
                ref={copyInputRef}
                style={{
                  ...styles.writeInput,
                  ...(copyError ? styles.inputWrong : {}),
                }}
                value={copyInput}
                onChange={(e) => {
                  setCopyInput(e.target.value);
                  setCopyError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleCopySubmit()}
                placeholder="اكتب الكلمة هنا..."
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />

              <button
                style={{ ...styles.btnPrimary, marginTop: 16, width: "100%" }}
                onClick={handleCopySubmit}
                disabled={!copyInput.trim()}
              >
                تحقق ✓
              </button>
            </>
          )}

          {writeStage === "missing" && (
            <>
              <p style={styles.quizHint}>خمّن الحرف الناقص 🧩</p>

              <div style={styles.letterRow}>
                {currentWriteWord.split("").map((ch, i) =>
                  i === missingIndex ? (
                    <input
                      key={i}
                      ref={missingInputRef}
                      style={{
                        ...styles.letterInput,
                        ...(missingError ? styles.inputWrong : {}),
                      }}
                      value={missingInput}
                      maxLength={1}
                      onChange={(e) => {
                        setMissingInput(e.target.value.slice(-1));
                        setMissingError(false);
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleMissingSubmit()
                      }
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  ) : (
                    <div key={i} style={styles.letterBox}>
                      {ch}
                    </div>
                  ),
                )}
              </div>

              <button
                style={{ ...styles.btnPrimary, marginTop: 20, width: "100%" }}
                onClick={handleMissingSubmit}
                disabled={!missingInput.trim()}
              >
                تحقق ✓
              </button>
            </>
          )}

          <button
            style={{ ...styles.btnGhost, marginTop: 14 }}
            onClick={() => setScreen("menu")}
          >
            🏠 القائمة الرئيسية
          </button>
        </div>
      )}

      {screen === "write" && writeDone && (
        <div style={styles.card}>
          <div style={styles.scoreWrap}>
            <div style={styles.scoreBig}>
              {toAr(5)}
              <span style={styles.scoreOf}>/٥</span>
            </div>
            <div style={styles.scoreLabel}>
              كلمات أنهيتها كتابةً
              {writeMistakes > 0 && (
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                  ({toAr(writeMistakes)} محاولة غلط)
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 24,
              width: "100%",
            }}
          >
            <button style={styles.btnPrimary} onClick={handleContinue}>
              متابعة للمجموعة الجاية 🚀
            </button>
            <button style={styles.btnSecondary} onClick={handleRetryWrite}>
              🔁 أعد كتابة المجموعة
            </button>
            <button style={styles.btnSecondary} onClick={handleReviewWords}>
              📖 راجع الكلمات الـ٥
            </button>
            <button style={styles.btnGhost} onClick={() => setScreen("menu")}>
              🏠 القائمة الرئيسية
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.07); } }
        @keyframes bounce { 0%,100%{transform:scale(1) rotate(0)} 30%{transform:scale(1.15) rotate(-8deg)} 70%{transform:scale(1.15) rotate(8deg)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        button:hover:not(:disabled) { filter: brightness(0.95); }
        button:active:not(:disabled) { transform: scale(0.97) !important; }
        button:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ verticalAlign: "middle" }}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

const styles = {
  root: {
    direction: "rtl",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 16px 40px",
    fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    maxWidth: 480,
    marginBottom: 8,
  },
  topLabel: {
    fontSize: 13,
    color: "#64748b",
    minWidth: 36,
    textAlign: "center",
  },
  progressWrap: {
    flex: 1,
    height: 10,
    background: "#dbeafe",
    borderRadius: 99,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    background: "#3b82f6",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  batchDots: {
    display: "flex",
    gap: 5,
    marginBottom: 16,
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 480,
  },
  batchDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "background 0.3s",
  },
  avatar: {
    fontSize: 72,
    lineHeight: 1,
    marginBottom: 8,
    userSelect: "none",
    cursor: "default",
  },
  bubble: {
    background: "#fff",
    border: "1.5px solid #dbeafe",
    borderRadius: 16,
    padding: "10px 20px",
    fontSize: 15,
    color: "#1e293b",
    textAlign: "center",
    maxWidth: 340,
    marginBottom: 20,
    boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
    lineHeight: 1.6,
  },
  card: {
    background: "#fff",
    borderRadius: 24,
    padding: "28px 24px",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 4px 24px rgba(59,130,246,0.10)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
  },
  miniDots: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    justifyContent: "center",
  },
  miniDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    transition: "background 0.3s, transform 0.2s",
  },
  wordText: {
    fontSize: 64,
    fontWeight: 700,
    color: "#1e293b",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    direction: "ltr",
    lineHeight: 1.2,
    textAlign: "center",
    marginBottom: 6,
  },
  wordMeaning: {
    fontSize: 22,
    fontWeight: 600,
    color: "#3b82f6",
    marginBottom: 6,
    textAlign: "center",
  },
  wordSub: { fontSize: 14, color: "#94a3b8", marginBottom: 0 },
  btnPrimary: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 99,
    padding: "13px 32px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "transform 0.1s",
    direction: "rtl",
    justifyContent: "center",
  },
  btnDisabled: {
    background: "#f1f5f9",
    color: "#94a3b8",
    border: "1.5px solid #e2e8f0",
    borderRadius: 99,
    padding: "13px 24px",
    fontSize: 15,
    fontWeight: 500,
    cursor: "not-allowed",
    direction: "rtl",
  },
  btnSecondary: {
    background: "#fff",
    color: "#475569",
    border: "1.5px solid #e2e8f0",
    borderRadius: 99,
    padding: "13px 24px",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    transition: "transform 0.1s",
    direction: "rtl",
  },
  btnGhost: {
    background: "transparent",
    color: "#94a3b8",
    border: "none",
    borderRadius: 99,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    direction: "rtl",
  },
  btnListen: {
    background: "#eff6ff",
    color: "#3b82f6",
    border: "1.5px solid #bfdbfe",
    borderRadius: 99,
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    direction: "rtl",
  },
  navRow: {
    display: "flex",
    gap: 10,
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
  },
  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  quizTitle: { fontSize: 17, fontWeight: 700, color: "#1e293b" },
  quizRound: {
    fontSize: 14,
    color: "#94a3b8",
    background: "#f1f5f9",
    borderRadius: 99,
    padding: "4px 12px",
  },
  quizHint: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    textAlign: "center",
  },
  copyDots: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  copyDot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    transition: "background 0.3s",
  },
  writeInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1.5px solid #e2e8f0",
    fontSize: 22,
    direction: "ltr",
    textAlign: "center",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    outline: "none",
    transition: "border 0.15s, background 0.15s",
  },
  inputCorrect: {
    border: "2px solid #22c55e",
    background: "#f0fdf4",
    color: "#15803d",
  },
  inputWrong: {
    border: "2px solid #ef4444",
    background: "#fef2f2",
    color: "#b91c1c",
  },
  correctAnswerNote: {
    marginTop: 10,
    fontSize: 14,
    color: "#b91c1c",
    textAlign: "center",
  },
  letterRow: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    flexWrap: "wrap",
    direction: "ltr",
  },
  letterBox: {
    width: 44,
    height: 52,
    borderRadius: 10,
    background: "#f1f5f9",
    border: "1.5px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    fontWeight: 700,
    color: "#1e293b",
  },
  letterInput: {
    width: 44,
    height: 52,
    borderRadius: 10,
    border: "2px solid #3b82f6",
    fontSize: 26,
    fontWeight: 700,
    textAlign: "center",
    outline: "none",
    color: "#1e293b",
  },
  scoreWrap: { textAlign: "center", marginBottom: 16 },
  scoreBig: { fontSize: 64, fontWeight: 800, color: "#3b82f6", lineHeight: 1 },
  scoreOf: { fontSize: 32, color: "#94a3b8" },
  scoreLabel: { fontSize: 16, color: "#64748b", marginTop: 4 },
  tabRow: { display: "flex", gap: 8, marginBottom: 20, width: "100%" },
  tabActive: {
    flex: 1,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 99,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    direction: "rtl",
  },
  tabInactive: {
    flex: 1,
    background: "#f1f5f9",
    color: "#64748b",
    border: "none",
    borderRadius: 99,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    direction: "rtl",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    borderRadius: 14,
    border: "1.5px solid #e2e8f0",
    fontSize: 15,
    marginBottom: 12,
    direction: "rtl",
    fontFamily: "inherit",
    outline: "none",
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  hintNote: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 14,
    textAlign: "center",
    lineHeight: 1.6,
  },
  avatarGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    width: "100%",
  },
  avatarOption: {
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 18,
    padding: "20px 10px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
