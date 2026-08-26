// ------------------------------
// Login + Signup Logic (LocalStorage Demo)
// ------------------------------

const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Switch Tabs
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
});

// Inline Links
document.getElementById('goSignup').addEventListener('click', (e) => {
  e.preventDefault();
  signupTab.click();
});
document.getElementById('goLogin').addEventListener('click', (e) => {
  e.preventDefault();
  loginTab.click();
});

// Signup
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass = document.getElementById('signupPassword').value.trim();

  if (!name || !email || !pass) {
    alert("Please fill all fields!");
    return;
  }

  const user = { name, email, pass };
  localStorage.setItem('user', JSON.stringify(user));
  alert("Account created successfully! Please login.");
  loginTab.click();
  signupForm.reset();
});

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();

  const stored = JSON.parse(localStorage.getItem('user'));
  if (stored && stored.email === email && stored.pass === pass) {
    alert(`Welcome ${stored.name}! Redirecting to dashboard...`);
    localStorage.setItem('loggedIn', 'true');
    window.location.href = "AI.html"; // redirect to dashboard
  } else {
    alert("Invalid email or password!");
  }
});

// ------------------------------
// Login / Logout Buttons Logic (Topbar)
// ------------------------------
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (localStorage.getItem('loggedIn') === 'true') {
  loginBtn.style.display = 'none';
  logoutBtn.style.display = 'inline';
} else {
  logoutBtn.style.display = 'none';
}

loginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.auth-box').scrollIntoView({ behavior: 'smooth' });
});

logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('loggedIn');
  alert('You have been logged out!');
  logoutBtn.style.display = 'none';
  loginBtn.style.display = 'inline';
});
