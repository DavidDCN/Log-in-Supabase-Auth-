// ------------------------------------------------------------------
// 1. Fill these in from your Supabase project:
//    Project Settings -> API -> Project URL / anon public key
//    Double check these are copied exactly — a wrong key is the
//    #1 reason sign ups silently fail to appear in the Users table.
// ------------------------------------------------------------------
const SUPABASE_URL = ""; //
const SUPABASE_ANON_KEY = "";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ------------------------------------------------------------------
// Element references
// ------------------------------------------------------------------
const authCard = document.getElementById("authCard");
const dashboardCard = document.getElementById("dashboardCard");

const tabLogin = document.getElementById("tabLogin");
const tabSignUp = document.getElementById("tabSignUp");
const loginPanel = document.getElementById("loginPanel");
const signUpPanel = document.getElementById("signUpPanel");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

const signUpEmail = document.getElementById("signUpEmail");
const signUpPassword = document.getElementById("signUpPassword");
const signUpBtn = document.getElementById("signUpBtn");
const signUpMessage = document.getElementById("signUpMessage");

const logoutBtn = document.getElementById("logoutBtn");
const dashEmail = document.getElementById("dashEmail");
const avatarInitial = document.getElementById("avatarInitial");

// ------------------------------------------------------------------
// Tab switching
// ------------------------------------------------------------------
function activateTab(which) {
  const isLogin = which === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabSignUp.classList.toggle("active", !isLogin);
  tabLogin.setAttribute("aria-selected", isLogin);
  tabSignUp.setAttribute("aria-selected", !isLogin);
  loginPanel.classList.toggle("hidden", !isLogin);
  signUpPanel.classList.toggle("hidden", isLogin);
}
tabLogin.addEventListener("click", () => activateTab("login"));
tabSignUp.addEventListener("click", () => activateTab("signup"));

// ------------------------------------------------------------------
// UI helpers
// ------------------------------------------------------------------
function showMessage(el, text, kind) {
  // kind: "error" | "success" | "" (neutral)
  el.textContent = text;
  el.classList.toggle("error", kind === "error");
  el.classList.toggle("success", kind === "success");
}

function setLoading(btn, isLoading, label) {
  btn.disabled = isLoading;
  btn.querySelector(".btn-label").textContent = isLoading ? "Please wait..." : label;
}

function showLoggedInUI(user) {
  authCard.classList.add("hidden");
  dashboardCard.classList.remove("hidden");
  dashEmail.textContent = user.email;
  avatarInitial.textContent = user.email.charAt(0).toUpperCase();
}

function showLoggedOutUI() {
  authCard.classList.remove("hidden");
  dashboardCard.classList.add("hidden");
}

// ------------------------------------------------------------------
// Sign Up
// ------------------------------------------------------------------
signUpPanel.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signUpEmail.value.trim();
  const password = signUpPassword.value;

  showMessage(signUpMessage, "", "");
  setLoading(signUpBtn, true, "Create account");

  const { data, error } = await supabaseClient.auth.signUp({ email, password });

  setLoading(signUpBtn, false, "Create account");

  if (error) {
    // This is the branch a silent "always alert success" bug would skip.
    console.error("Sign up error:", error);
    showMessage(signUpMessage, error.message, "error");
    return;
  }

  if (!data.session) {
    showMessage(signUpMessage, "Account created! Check your email to confirm before logging in.", "success");
  } else {
    showMessage(signUpMessage, "Account created and logged in!", "success");
  }
});

// ------------------------------------------------------------------
// Login
// ------------------------------------------------------------------
loginPanel.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  showMessage(loginMessage, "", "");
  setLoading(loginBtn, true, "Log in");

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  setLoading(loginBtn, false, "Log in");

  if (error) {
    console.error("Login error:", error);
    showMessage(loginMessage, error.message, "error");
  }
  // On success, onAuthStateChange (below) handles the UI switch
});

// ------------------------------------------------------------------
// Logout
// ------------------------------------------------------------------
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) console.error("Logout error:", error);
  // onAuthStateChange handles the UI switch
});

// ------------------------------------------------------------------
// Keep the UI in sync with the current auth state
// ------------------------------------------------------------------
supabaseClient.auth.onAuthStateChange((_event, session) => {
  if (session && session.user) {
    showLoggedInUI(session.user);
  } else {
    showLoggedOutUI();
  }
});

// Check for an existing session on page load (e.g. user refreshed the page)
supabaseClient.auth.getSession().then(({ data: { session } }) => {
  if (session && session.user) {
    showLoggedInUI(session.user);
  } else {
    showLoggedOutUI();
  }
});