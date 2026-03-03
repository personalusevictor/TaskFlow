/* ═══════════════════════════════════════════════
   TREECO — Auth Page Logic
   ═══════════════════════════════════════════════ */

	 const API_BASE = 'http://localhost:8080';

	 // ── State ────────────────────────────────────────
	 const state = {
		 mode: 'login', // 'login' | 'register'
	 };
	 
	 // ── DOM References ───────────────────────────────
	 const panelsWrapper     = document.getElementById('panels-wrapper');
	 const sliderOverlay     = document.getElementById('slider-overlay');
	 const overlayInner      = document.getElementById('overlay-inner');
	 
	 // Login form
	 const formLogin         = document.getElementById('form-login');
	 const inputLoginEmail   = document.getElementById('login-email');
	 const inputLoginPass    = document.getElementById('login-password');
	 const btnLoginSubmit    = document.getElementById('btn-login-submit');
	 const errorLoginBanner  = document.getElementById('login-error');
	 
	 // Register form
	 const formRegister      = document.getElementById('form-register');
	 const inputRegUsername  = document.getElementById('register-username');
	 const inputRegEmail     = document.getElementById('register-email');
	 const inputRegPass      = document.getElementById('register-password');
	 const btnRegSubmit      = document.getElementById('btn-register-submit');
	 const errorRegBanner    = document.getElementById('register-error');
	 
	 // Mobile
	 const mobileTabs        = document.querySelectorAll('.mobile-tab');
	 const panelLogin        = document.getElementById('panel-login');
	 const panelRegister     = document.getElementById('panel-register');
	 
	 // ── Mode Switcher ────────────────────────────────
	 function setMode(newMode, instant = false) {
		 if (newMode === state.mode) return;
		 state.mode = newMode;
	 
		 // Slide overlay
		 panelsWrapper.classList.remove('state-login', 'state-register');
		 panelsWrapper.classList.add(`state-${newMode}`);
	 
		 // Fade overlay content then swap
		 overlayInner.classList.add('fading');
		 setTimeout(() => {
			 updateOverlayContent(newMode);
			 overlayInner.classList.remove('fading');
		 }, 200);
	 
		 // Mobile tabs
		 mobileTabs.forEach(tab => {
			 tab.classList.toggle('active', tab.dataset.mode === newMode);
		 });
	 
		 // Mobile panels
		 updateMobilePanels(newMode);
	 
		 // Clear errors
		 clearErrors();
	 }
	 
	 function updateOverlayContent(mode) {
		 const overlayEyebrow = document.getElementById('overlay-eyebrow');
		 const overlayTitle   = document.getElementById('overlay-title');
		 const overlayDesc    = document.getElementById('overlay-desc');
		 const overlayIcon    = document.getElementById('overlay-icon');
		 const overlayBtn     = document.getElementById('overlay-btn');
	 
		 if (mode === 'login') {
			 // Overlay is on the RIGHT (covers register panel) → CTA to go to register
			 overlayEyebrow.textContent = '¿Primera vez?';
			 overlayTitle.textContent   = 'Empieza a crecer';
			 overlayDesc.textContent    = 'Crea una cuenta y gestiona tus proyectos con TreeCO.';
			 overlayIcon.textContent    = '🌱';
			 overlayBtn.querySelector('.btn-label').textContent = 'Crear cuenta';
			 overlayBtn.onclick         = () => setMode('register');
		 } else {
			 // Overlay is on the LEFT (covers login panel) → CTA to go to login
			 overlayEyebrow.textContent = 'Ya tienes cuenta';
			 overlayTitle.textContent   = 'Bienvenido de nuevo';
			 overlayDesc.textContent    = 'Accede a tus proyectos y tareas donde lo dejaste.';
			 overlayIcon.textContent    = '🌿';
			 overlayBtn.querySelector('.btn-label').textContent = 'Iniciar sesión';
			 overlayBtn.onclick         = () => setMode('login');
		 }
	 }
	 
	 function updateMobilePanels(mode) {
		 panelLogin.classList.toggle('mobile-active', mode === 'login');
		 panelRegister.classList.toggle('mobile-active', mode === 'register');
	 }
	 
	 // ── Input Validation ─────────────────────────────
	 const validators = {
		 required: (val) => val.trim().length > 0,
		 email: (val) => /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(val.trim()),
		 minLen: (n) => (val) => val.trim().length >= n,
	 };
	 
	 function validateField(input, rules) {
		 const errorEl = document.getElementById(`${input.id}-error`);
		 let valid = true;
		 let msg = '';
	 
		 for (const { check, message } of rules) {
			 if (!check(input.value)) {
				 valid = false;
				 msg = message;
				 break;
			 }
		 }
	 
		 input.classList.toggle('error', !valid);
		 if (errorEl) {
			 errorEl.textContent = msg;
			 errorEl.classList.toggle('visible', !valid);
		 }
	 
		 return valid;
	 }
	 
	 function clearErrors() {
		 document.querySelectorAll('.input-field.error').forEach(el => el.classList.remove('error'));
		 document.querySelectorAll('.field-error.visible').forEach(el => el.classList.remove('visible'));
		 document.querySelectorAll('.error-banner.visible').forEach(el => el.classList.remove('visible'));
	 }
	 
	 function showBanner(bannerEl, message) {
		 bannerEl.querySelector('.banner-text').textContent = message;
		 bannerEl.classList.add('visible');
	 }
	 
	 // ── Button Loading State ─────────────────────────
	 function setLoading(btn, loading) {
		 btn.disabled = loading;
		 btn.classList.toggle('loading', loading);
	 }
	 
	 // ── Login Handler ────────────────────────────────
	 formLogin.addEventListener('submit', async (e) => {
		 e.preventDefault();
		 clearErrors();
	 
		 const emailOk = validateField(inputLoginEmail, [
			 { check: validators.required, message: 'El email es obligatorio' },
			 { check: validators.email,    message: 'Introduce un email válido' },
		 ]);
		 const passOk = validateField(inputLoginPass, [
			 { check: validators.required, message: 'La contraseña es obligatoria' },
		 ]);
	 
		 if (!emailOk || !passOk) return;
	 
		 setLoading(btnLoginSubmit, true);
	 
		 try {
			 const res = await fetch(`${API_BASE}/auth/login`, {
				 method: 'POST',
				 headers: { 'Content-Type': 'application/json' },
				 body: JSON.stringify({
					 email:    inputLoginEmail.value.trim(),
					 password: inputLoginPass.value,
				 }),
			 });
	 
			 const data = await res.json();
	 
			 if (!res.ok) {
				 showBanner(errorLoginBanner, data.error || 'Credenciales incorrectas');
				 return;
			 }
	 
			 // ✅ Success — store user and redirect
			 sessionStorage.setItem('treeco_user', JSON.stringify(data));
			 showSuccessAndRedirect(btnLoginSubmit, '¡Bienvenido!', () => {
				 window.location.href = 'dashboard.html';
			 });
	 
		 } catch (err) {
			 showBanner(errorLoginBanner, 'No se pudo conectar al servidor');
		 } finally {
			 setLoading(btnLoginSubmit, false);
		 }
	 });
	 
	 // ── Register Handler ─────────────────────────────
	 formRegister.addEventListener('submit', async (e) => {
		 e.preventDefault();
		 clearErrors();
	 
		 const userOk = validateField(inputRegUsername, [
			 { check: validators.required,    message: 'El nombre es obligatorio' },
			 { check: validators.minLen(3),   message: 'Mínimo 3 caracteres' },
		 ]);
		 const emailOk = validateField(inputRegEmail, [
			 { check: validators.required, message: 'El email es obligatorio' },
			 { check: validators.email,    message: 'Introduce un email válido' },
		 ]);
		 const passOk = validateField(inputRegPass, [
			 { check: validators.required,  message: 'La contraseña es obligatoria' },
			 { check: validators.minLen(8), message: 'Mínimo 8 caracteres' },
		 ]);
	 
		 if (!userOk || !emailOk || !passOk) return;
	 
		 setLoading(btnRegSubmit, true);
	 
		 try {
			 const res = await fetch(`${API_BASE}/auth/register`, {
				 method: 'POST',
				 headers: { 'Content-Type': 'application/json' },
				 body: JSON.stringify({
					 username: inputRegUsername.value.trim(),
					 email:    inputRegEmail.value.trim(),
					 password: inputRegPass.value,
				 }),
			 });
	 
			 const data = await res.json();
	 
			 if (!res.ok) {
				 showBanner(errorRegBanner, data.error || 'Error al registrar usuario');
				 return;
			 }
	 
			 // ✅ Success → switch to login with a hint
			 showSuccessAndRedirect(btnRegSubmit, '¡Cuenta creada!', () => {
				 setMode('login');
				 inputLoginEmail.value = inputRegEmail.value;
				 inputRegUsername.value = '';
				 inputRegEmail.value    = '';
				 inputRegPass.value     = '';
			 });
	 
		 } catch (err) {
			 showBanner(errorRegBanner, 'No se pudo conectar al servidor');
		 } finally {
			 setLoading(btnRegSubmit, false);
		 }
	 });
	 
	 // ── Password Toggle ──────────────────────────────
	 document.querySelectorAll('.btn-toggle-pass').forEach(btn => {
		 btn.addEventListener('click', () => {
			 const targetId = btn.dataset.target;
			 const input    = document.getElementById(targetId);
			 const isPass   = input.type === 'password';
			 input.type     = isPass ? 'text' : 'password';
	 
			 // swap icon
			 btn.innerHTML = isPass
				 ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
				 : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
		 });
	 });
	 
	 // ── Success micro-feedback ───────────────────────
	 function showSuccessAndRedirect(btn, label, callback) {
		 const originalHTML = btn.innerHTML;
		 btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${label}</span>`;
		 btn.style.background = 'linear-gradient(135deg, #2cc06e, #1da85a)';
		 setTimeout(() => {
			 callback();
			 btn.innerHTML = originalHTML;
			 btn.style.background = '';
		 }, 900);
	 }
	 
	 // ── Mobile Tabs ──────────────────────────────────
	 mobileTabs.forEach(tab => {
		 tab.addEventListener('click', () => setMode(tab.dataset.mode));
	 });
	 
	 // ── Init ─────────────────────────────────────────
	 (function init() {
		 panelsWrapper.classList.add('state-login');
		 updateOverlayContent('login');
		 updateMobilePanels('login');
	 })();