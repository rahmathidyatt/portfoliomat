/* ============================================================
   Portfolio Rahmat Hidayat - Main JavaScript
   ------------------------------------------------------------
   File ini berisi seluruh interaksi utama website portfolio:
   1. Mobile navigation
   2. Skill show more / show less
   3. Background tab Education / Organization
   4. Project carousel menggunakan Swiper
   5. Typed text pada hero section
   6. Contact form menggunakan EmailJS
   7. Active navigation, sticky shadow, scroll up, dan dark mode

   Catatan maintenance:
   - Semua selector penting memakai id atau data-attribute agar mudah dicari.
   - Konfigurasi EmailJS sengaja dikumpulkan di satu tempat, yaitu EMAILJS_CONFIG.
   - Jangan menampilkan pesan sukses palsu. Status sukses hanya muncul saat EmailJS benar-benar mengembalikan response sukses.
   ============================================================ */

/* =========================
   01. Mobile navigation
   ========================= */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Membuka menu mobile saat ikon menu diklik.
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

// Menutup menu mobile saat ikon close diklik.
if (navClose && navMenu) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

// Menutup menu mobile setelah salah satu link navigasi dipilih.
document.querySelectorAll('.nav__link').forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu) navMenu.classList.remove('show-menu');
  });
});

/* =========================
   02. Skills: lihat semua
   =========================
   Struktur HTML yang dibutuhkan:
   - Card skill memiliki atribut data-skill-card
   - Tombol memiliki atribut data-show-more
   - Item tambahan diberi class: skill-item is-hidden
*/
document.querySelectorAll('[data-show-more]').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('[data-skill-card]');
    if (!card) return;

    const isExpanded = card.classList.toggle('is-expanded');
    const label = button.querySelector('[data-toggle-label]');

    button.setAttribute('aria-expanded', String(isExpanded));
    if (label) label.textContent = isExpanded ? 'Tampilkan lebih sedikit' : 'Lihat semua';
  });
});

/* =========================
   03. Background tabs
   =========================
   Dipakai untuk mengganti konten Education dan Organization.
*/
const qualificationTabs = document.querySelectorAll('[data-target]');
const qualificationContents = document.querySelectorAll('[data-content]');

qualificationTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.target);
    if (!target) return;

    qualificationContents.forEach((content) => {
      content.classList.remove('qualification__active');
    });

    qualificationTabs.forEach((button) => {
      button.classList.remove('qualification__active');
    });

    target.classList.add('qualification__active');
    tab.classList.add('qualification__active');
  });
});

/* =========================
   04. Services modal
   =========================
   Saat ini struktur services tidak tampil di halaman utama, namun logic ini dipertahankan agar aman jika section services dipakai kembali.
*/
const modalViews = document.querySelectorAll('.services__modal');
const modalButtons = document.querySelectorAll('.services__button');
const modalCloseButtons = document.querySelectorAll('.services__modal-close');

modalButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (modalViews[index]) modalViews[index].classList.add('active-modal');
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modalViews.forEach((modal) => modal.classList.remove('active-modal'));
  });
});

/* =========================
   05. Project carousel
   =========================
   Perbaikan utama:
   - loop dimatikan agar slide tidak meloncat ke project pertama.
   - threshold kecil agar swipe terasa responsif.
   - observer aktif agar Swiper menghitung ulang ukuran ketika layout berubah.
*/
if (typeof Swiper !== 'undefined' && document.querySelector('.portfolio__container')) {
  new Swiper('.portfolio__container', {
    loop: false,
    rewind: false,
    speed: 350,
    slidesPerView: 1,
    spaceBetween: 24,
    grabCursor: true,
    threshold: 5,
    resistanceRatio: 0.35,
    preventClicks: true,
    preventClicksPropagation: true,
    watchOverflow: true,
    observer: true,
    observeParents: true,
    updateOnWindowResize: true,

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
  });
}

/* =========================
   06. Hero typed text
   ========================= */
if (typeof Typed !== 'undefined' && document.querySelector('.multiple-text')) {
  new Typed('.multiple-text', {
    strings: ['Open to Work', 'Information System', 'Data Analyst'],
    smartBackspace: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
    typeSpeed: 35,
    backSpeed: 35,
    backDelay: 1000,
    loop: true,
  });
}

/*==================== EMAIL JS ====================*/
const contactForm = document.getElementById('contact-form'),
        contactName = document.getElementById('contact-name'),
        contactEmail = document.getElementById('contact-email'),
        userMessage = document.getElementById('user-message'),
        contactMessage = document.getElementById('contact-message')

/*
  Notifikasi sukses contact form.
  Catatan penting:
  - Alur EmailJS di bawah sengaja tetap mengikuti kode lama yang sudah berhasil.
  - Fungsi ini hanya dipanggil setelah EmailJS masuk ke callback sukses .then().
  - Tidak ada catch/failure handler agar alur pengiriman tidak berubah dari versi lama.
*/
const showEmailSuccessNotification = () => {
    let notification = document.getElementById('email-success-notification')

    if (!notification) {
        notification = document.createElement('div')
        notification.id = 'email-success-notification'
        notification.setAttribute('role', 'status')
        notification.setAttribute('aria-live', 'polite')
        document.body.appendChild(notification)
    }

    notification.textContent = 'Pesan berhasil dikirim'

    Object.assign(notification.style, {
        position: 'fixed',
        top: '24px',
        left: '50%',
        zIndex: '999999',
        maxWidth: 'calc(100vw - 32px)',
        padding: '14px 22px',
        borderRadius: '16px',
        fontFamily: 'inherit',
        fontSize: '15px',
        fontWeight: '600',
        lineHeight: '1.5',
        textAlign: 'center',
        color: '#166534',
        background: '#dcfce7',
        border: '1px solid rgba(34, 197, 94, .45)',
        boxShadow: '0 20px 50px rgba(15, 23, 42, .22)',
        opacity: '0',
        transform: 'translate(-50%, -12px)',
        pointerEvents: 'none',
        transition: 'opacity .25s ease, transform .25s ease'
    })

    requestAnimationFrame(() => {
        notification.style.opacity = '1'
        notification.style.transform = 'translate(-50%, 0)'
    })

    clearTimeout(window.emailSuccessNotificationTimer)
    window.emailSuccessNotificationTimer = setTimeout(() => {
        notification.style.opacity = '0'
        notification.style.transform = 'translate(-50%, -12px)'
    }, 4200)
}

const sendEmail = (e) => {
    e.preventDefault()

    if (contactName.value === '' || contactEmail.value === '' || userMessage.value === "") {
        contactMessage.classList.remove('color-blue', 'color-green')
        contactMessage.classList.add('color-red')
 
        contactMessage.textContent = "Field input tidak boleh kosong"
    } else {
        emailjs.sendForm('service_39oxs8i', 'template_lykg67g', '#contact-form', 'QvQIyg2CW3CKLIkS9')
            .then(() =>  {
                contactMessage.classList.remove('color-red', 'color-blue')
                contactMessage.classList.add('color-green')
                contactMessage.textContent = "Pesan telah dikirim"

                showEmailSuccessNotification()

                contactForm.reset()
                contactName.value = ''
                contactEmail.value = ''
                userMessage.value = ''

                setTimeout(() => {
                    contactMessage.textContent = ""
                    contactMessage.classList.remove('color-green')
                }, 5000 )
            })
    }
}

contactForm.addEventListener('submit', sendEmail)

/* =========================
   08. Active navigation on scroll
   ========================= */
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 80;
    const sectionId = current.getAttribute('id');
    const navItem = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

    if (!navItem) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navItem.classList.add('active-link');
    } else {
      navItem.classList.remove('active-link');
    }
  });
};

window.addEventListener('scroll', scrollActive);

/* =========================
   09. Header shadow on scroll
   ========================= */
const scrollHeader = () => {
  const header = document.getElementById('header');
  if (!header) return;

  if (window.scrollY >= 80) {
    header.classList.add('scroll-header');
  } else {
    header.classList.remove('scroll-header');
  }
};

window.addEventListener('scroll', scrollHeader);

/* =========================
   10. Scroll up button
   ========================= */
const scrollUp = () => {
  const scrollUpButton = document.getElementById('scrollUp');
  if (!scrollUpButton) return;

  if (window.scrollY >= 900) {
    scrollUpButton.classList.add('show-scroll');
  } else {
    scrollUpButton.classList.remove('show-scroll');
  }
};

window.addEventListener('scroll', scrollUp);

/* =========================
   11. Dark mode
   ========================= */
const themeButton = document.getElementById('mode-button');
const darkTheme = 'dark-theme';
const iconTheme = 'uil-sun';

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

const getCurrentTheme = () => (document.body.classList.contains(darkTheme) ? 'dark' : 'light');
const getCurrentIcon = () => (themeButton?.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun');

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
}

if (themeButton && selectedIcon) {
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme);
}

if (themeButton) {
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
  });
}
