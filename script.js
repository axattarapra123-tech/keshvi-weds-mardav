/**
 * Royal Wedding Invitation - Keshvi & Mardav
 * Designed & Engineered by AP Technologies (https://ap-technologies-one.vercel.app/)
 */

document.addEventListener('DOMContentLoaded', () => {
  initGateExperience();
  initGate3DInteractiveTilt();
  initPetalsCanvas();
  initCountdownTimer();
  initAudioPlayer();
  initRadioSelection();
  initCoupleCard3DTilt();
  initCeremonyCards3DTilt();
});

/* ========================================================
   1. 3D ROYAL GATE EXPERIENCE & PARALLAX REVEAL
   ======================================================== */
function initGateExperience() {
  const gateOverlay = document.getElementById('gate-overlay');
  const gateCenterSeal = document.getElementById('gate-center-seal');
  const enterSiteBtn = document.getElementById('enter-site-btn');
  const replayGateBtn = document.getElementById('replay-gate-btn');

  let isGateOpen = false;

  function openGate() {
    if (isGateOpen) return;
    isGateOpen = true;

    // Resonant brass temple bell chime
    playTempleBellChime();

    // Trigger smooth 3D Doors swing open animation
    gateOverlay.classList.add('opening');

    // Trigger celebratory flower petals explosion
    if (window.triggerCelebrationBurst) {
      window.triggerCelebrationBurst();
    }

    // Start background wedding music softly
    playWeddingMusic();

    showToast('॥ શ્રી ગણેશાય નમઃ ॥ • Welcome to the Royal Wedding');

    // Allow user 2.2 seconds to enjoy the 3D reveal before enabling gesture dismissal
    setTimeout(() => {
      enableGateAutoDismiss();
    }, 2200);
  }

  function dismissGate() {
    gateOverlay.classList.add('dismissed');
    document.body.style.overflowY = 'auto';

    // Smooth scroll down to celebration hero
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function enableGateAutoDismiss() {
    let touchStartY = 0;

    const handleWheel = (e) => {
      if (isGateOpen && !gateOverlay.classList.contains('dismissed') && e.deltaY > 30) {
        dismissGate();
        window.removeEventListener('wheel', handleWheel);
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isGateOpen || gateOverlay.classList.contains('dismissed')) return;
      const currentY = e.touches[0].clientY;
      // Require at least 50px deliberate downward swipe
      if (touchStartY - currentY > 50 || currentY - touchStartY > 60) {
        dismissGate();
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
  }

  if (gateCenterSeal) {
    gateCenterSeal.addEventListener('click', openGate);
    gateCenterSeal.addEventListener('touchstart', (e) => {
      e.preventDefault();
      openGate();
    }, { passive: false });
  }

  if (enterSiteBtn) {
    enterSiteBtn.addEventListener('click', () => {
      playTempleBellChime();
      if (window.triggerCelebrationBurst) window.triggerCelebrationBurst();
      dismissGate();
    });
  }

  if (replayGateBtn) {
    replayGateBtn.addEventListener('click', () => {
      isGateOpen = false;
      gateOverlay.classList.remove('dismissed', 'opening');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('3D Royal Palace Gate Re-locked. Tap to open!');
    });
  }
}

/* Authentic Temple Bell Chime Synthesizer (Offline & Instant) */
function playTempleBellChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Harmonics of an authentic Indian brass bell
    const harmonics = [587.33, 880, 1174.66, 1760, 2349.32];
    const now = ctx.currentTime;
    
    harmonics.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      const duration = 2.4 - idx * 0.28;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + duration);
    });
  } catch (e) {
    console.log('Chime sound note:', e);
  }
}

/* ========================================================
   2. 3D INTERACTIVE TILT (GATE & REVEAL PARALLAX)
   ======================================================== */
function initGate3DInteractiveTilt() {
  if (window.innerWidth < 768) return; // Keep mobile buttery smooth

  const overlay = document.getElementById('gate-overlay');
  const stage = document.getElementById('palace-arch-stage');
  const coupleWrap = document.getElementById('reveal-couple-wrap');
  const farmanCard = document.getElementById('reveal-farman-card');

  if (!overlay || !stage) return;

  overlay.addEventListener('mousemove', (e) => {
    const rect = overlay.getBoundingClientRect();
    const x = (e.clientX - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.height / 2) / (rect.height / 2);

    const rotX = -y * 6;
    const rotY = x * 6;

    stage.style.transform = `perspective(1600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    // Additional 3D depth for the reveal stage when gate is open
    if (overlay.classList.contains('opening')) {
      if (coupleWrap) {
        coupleWrap.style.transform = `perspective(800px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(20px)`;
      }
      if (farmanCard) {
        farmanCard.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(15px)`;
      }
    }
  });

  overlay.addEventListener('mouseleave', () => {
    stage.style.transform = 'perspective(1600px) rotateX(0deg) rotateY(0deg)';
    if (coupleWrap) coupleWrap.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    if (farmanCard) farmanCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  });
}


/* ========================================================
   2. 3D TILT EFFECT ON COUPLE PHOTO (DESKTOP ONLY FOR 60FPS)
   ======================================================== */
function initCoupleCard3DTilt() {
  if (window.innerWidth < 768) return; // Disable tilt on mobile for zero lag

  const card = document.getElementById('couple-card-tilt');
  if (!card) return;

  const frame = card.querySelector('.jharokha-frame');
  if (!frame) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* 3D Interactive Parallax Tilt for Ceremony & Profile Cards */
function initCeremonyCards3DTilt() {
  if (window.innerWidth < 768) return; // Keep mobile buttery 60fps
  const cards = document.querySelectorAll('.ceremony-card, .profile-card, .blessing-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* Global Celebration Cannon Handler (Triggered by Hero Button) */
window.triggerBlessingsCelebration = function() {
  playTempleBellChime();
  if (window.triggerCelebrationBurst) {
    window.triggerCelebrationBurst();
    setTimeout(() => {
      if (window.triggerCelebrationBurst) window.triggerCelebrationBurst();
    }, 450);
  }
  showToast('🌸 ॥ સર્વ મંગલ માંગલ્યે ॥ May Keshvi & Mardav be blessed with eternal happiness! ✨');
};


/* ========================================================
   3. TRADITIONAL WEDDING MUSIC & WEB AUDIO SYNTHESIZER
   ======================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let audioElem = null;

function initAudioPlayer() {
  audioElem = document.getElementById('wedding-audio');
  const musicToggleBtn = document.getElementById('music-toggle-btn');

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleMusic);
  }
}

function playWeddingMusic() {
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  
  if (audioElem) {
    audioElem.volume = 0.5;
    const playPromise = audioElem.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          if (musicToggleBtn) musicToggleBtn.classList.add('playing');
        })
        .catch(() => {
          startWebAudioTanpura();
          isMusicPlaying = true;
          if (musicToggleBtn) musicToggleBtn.classList.add('playing');
        });
    }
  } else {
    startWebAudioTanpura();
    isMusicPlaying = true;
    if (musicToggleBtn) musicToggleBtn.classList.add('playing');
  }
}

function toggleMusic() {
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  if (isMusicPlaying) {
    if (audioElem) audioElem.pause();
    stopWebAudioTanpura();
    isMusicPlaying = false;
    if (musicToggleBtn) musicToggleBtn.classList.remove('playing');
    showToast('Music Paused');
  } else {
    playWeddingMusic();
    showToast('Playing Wedding Music');
  }
}

let droneNodes = [];
function startWebAudioTanpura() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const baseFreqs = [138.59, 207.65, 277.18];

    droneNodes = baseFreqs.map(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      return { osc, gain };
    });
  } catch (e) {
    console.log('Audio notice:', e);
  }
}

function stopWebAudioTanpura() {
  if (droneNodes.length > 0) {
    droneNodes.forEach(({ osc, gain }) => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
        setTimeout(() => osc.stop(), 400);
      } catch (e) {}
    });
    droneNodes = [];
  }
}


/* ========================================================
   4. LIGHTWEIGHT ROSE PETALS CANVAS (BATTERY FRIENDLY)
   ======================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  // 16 particles on mobile, 28 on desktop for buttery 60fps
  const TOTAL_PETALS = window.innerWidth < 600 ? 16 : 28;
  let petalsEnabled = true;
  let isTabVisible = true;

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
  });

  const toggleBtn = document.getElementById('toggle-petals-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      petalsEnabled = !petalsEnabled;
      toggleBtn.classList.toggle('active', petalsEnabled);
      showToast(petalsEnabled ? 'Rose Petals: ON' : 'Rose Petals: OFF');
    });
  }

  const petalColors = ['#ff4d6d', '#ff758f', '#e63946', '#ffd166'];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -15;
      this.size = Math.random() * 10 + 8;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      this.flip = Math.random() * 360;
      this.flipSpeed = Math.random() * 2.5 + 1;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.opacity = Math.random() * 0.35 + 0.55;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin((this.y * Math.PI) / 180) * 0.6 + this.speedX;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      const flipScale = Math.sin((this.flip * Math.PI) / 180);
      ctx.scale(1, flipScale);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size / 2, this.size, 0, this.size * 1.2);
      ctx.bezierCurveTo(this.size / 2, this.size, this.size / 2, -this.size / 2, 0, 0);

      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  function animate() {
    if (isTabVisible && petalsEnabled) {
      ctx.clearRect(0, 0, width, height);
      for (let petal of petals) {
        petal.update();
        petal.draw();
      }
    }
    requestAnimationFrame(animate);
  }

  animate();

  window.triggerCelebrationBurst = function() {
    for (let i = 0; i < 20; i++) {
      const p = new Petal();
      p.x = width / 2;
      p.y = height / 2;
      p.speedY = (Math.random() - 0.5) * 8;
      p.speedX = (Math.random() - 0.5) * 8;
      petals.push(p);
    }
    setTimeout(() => {
      petals.splice(TOTAL_PETALS);
    }, 4000);
  };
}


/* ========================================================
   5. COUNTDOWN TIMER TO 13 DECEMBER 2026
   ======================================================== */
function initCountdownTimer() {
  const weddingDate = new Date('2026-12-13T19:00:00+05:30').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  function update() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}


/* ========================================================
   6. INTERACTIVE RSVP & WHATSAPP
   ======================================================== */
function initRadioSelection() {
  const radioCards = document.querySelectorAll('.attendance-radio-option');
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
}

function sendRsvpWhatsApp() {
  const guestName = document.getElementById('guest-name').value.trim();
  const guestCount = document.getElementById('guest-count').value;
  const guestMessage = document.getElementById('guest-message').value.trim();
  
  const selectedRadio = document.querySelector('input[name="attendance"]:checked');
  const attendance = selectedRadio ? selectedRadio.value : 'હા, અમે જરૂરથી પધારીશું!';

  if (!guestName) {
    showToast('Please enter your name (આપનું નામ દાખલ કરો)');
    document.getElementById('guest-name').focus();
    return;
  }

  const hostPhone = '918320757526';

  let text = `*॥ શ્રી ગણેશાય નમઃ ॥*\n\n`;
  text += `આદરણીય અકબરી પરિવાર,\n`;
  text += `ચિ. કેશ્વી અને ચિ. માર્દવના શુભ લગ્નનું ડિજિટલ આમંત્રણ મળેલ છે.\n\n`;
  text += `👤 *મહેમાનનું નામ:* ${guestName}\n`;
  text += `✨ *ઉપસ્થિતિ:* ${attendance}\n`;
  text += `👨‍👩‍👧‍👦 *સભ્યોની સંખ્યા:* ${guestCount}\n`;
  
  if (guestMessage) {
    text += `💌 *શુભ આશીર્વાદ:* ${guestMessage}\n`;
  }
  
  text += `\n*આપ સૌને અમારો વળતો જવાબ: OK* ✅\n`;
  text += `ખૂબ ખૂબ અભિનંદન! જયશ્રી કૃષ્ણ! 🙏`;

  const waUrl = `https://wa.me/${hostPhone}?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}


/* ========================================================
   7. GOOGLE CALENDAR ADD EVENT
   ======================================================== */
function addToGoogleCalendar(title, startIso, endIso, location, details) {
  const formatIso = (isoStr) => isoStr.replace(/-|:|\.\d\d\d/g, "");
  
  const start = formatIso(startIso);
  const end = formatIso(endIso);

  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details + ' - Keshvi & Mardav Wedding (AP Technologies)')}&location=${encodeURIComponent(location)}`;
  
  window.open(calUrl, '_blank');
}


/* ========================================================
   8. SOCIAL SHARING & CLIPBOARD
   ======================================================== */
function shareInvitationOnWhatsApp() {
  const currentUrl = window.location.href;
  const shareText = `🌸 *You are cordially invited to the Royal Wedding of Keshvi & Mardav* 🌸\n\n` +
    `Date: Sunday, 13 December 2026\n` +
    `Venue: Vrundavan Party Plot, Kalavad (Jamnagar)\n\n` +
    `Open the 3D Royal Gate Invitation here:\n${currentUrl}\n\n` +
    `_Invited with love by: Akbari Family - Kalavad_`;

  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(waShareUrl, '_blank');
}

function copyAddressToClipboard() {
  const address = `Vrundavan Party Plot, Next to Vrundavan Ice Cream Plant, Dhoraji Road, Kalavad (Shitala), District Jamnagar, Gujarat`;
  navigator.clipboard.writeText(address).then(() => {
    const btnText = document.getElementById('copy-btn-text');
    if (btnText) btnText.innerText = 'Address Copied! ✓ (સરનામું કોપી થયું)';
    showToast('Venue Address copied to clipboard!');
    setTimeout(() => {
      if (btnText) btnText.innerText = 'Copy Full Address (સરનામું કોપી કરો)';
    }, 2500);
  }).catch(() => {
    showToast('Venue: Vrundavan Party Plot, Kalavad');
  });
}

function copySiteLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('Invitation link copied! Share with family.');
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ========================================================
   9. TOAST NOTIFICATION UTILITY
   ======================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
