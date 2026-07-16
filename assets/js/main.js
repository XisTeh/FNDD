/**
 * main.js — FNDD
 * Script consolidado de alta performance da Federação Nacional de Danças Desportivas (FNDD).
 * Organizado de forma modular com comentários de cabeçalho, garantindo 100% de compatibilidade
 * local (sem problemas de CORS em file:///) e deploy real com uma única requisição HTTP leve.
 *
 * Tabela de Conteúdos:
 *   1. Canvas Background Animado (Partículas e Hazes)
 *   2. Barra de Navegação (Navbar & Mobile Menu)
 *   3. Efeitos da Hero (Spotlight & Scroll Parallax)
 *   4. Scroll Reveal (Intersection Observer)
 *   5. Arena Cinematográfica (Linha Coreográfica & Tilt 3D)
 *   6. Pilares de Atuação (Sistema de Órbitas Interativas)
 *   7. Manifesto em Movimento (Word Reveal & SVG Spark)
 *   8. Galeria da Diretoria (Event Delegation & Preload)
 *   9. Cards de Eventos (Tilt 3D)
 *   10. Acordeão de FAQ Premium (Acessibilidade ARIA)
 */


/* ==========================================================================
   1. CANVAS BACKGROUND ANIMADO (PARTÍCULAS E HAZES)
   ========================================================================== */
/**
 * background.js — FNDD
 * Background Global Animado via Canvas 2D
 * Sistema de partículas vivas: poeira de palco, hazes volumétricas, rastros curvos dourados.
 * Reação suave ao mouse. Performance otimizada.
 */
function initCanvasBackground() {
  const canvas = document.getElementById('siteBgCanvas');
  if (!canvas) return;

  // Desativa completamente o canvas no mobile para maximizar performance (reduz TBT/CPU a zero)
  if (window.innerWidth < 768) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W, H;
  let mouseX = 0, mouseY = 0;
  let smoothMouseX = 0, smoothMouseY = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (hazes && hazes.length >= 3) {
      hazes[0].baseX = W * 0.8; hazes[0].baseY = H * 0.25;
      hazes[1].baseX = W * 0.15; hazes[1].baseY = H * 0.65;
      hazes[2].baseX = W * 0.5; hazes[2].baseY = H * 0.5;
    }
  }

  // ========================================
  // PARTÍCULAS DE POEIRA DE PALCO (VIVAS)
  // Aumentado para 115 partículas para riqueza visual magnífica e imersiva
  // ========================================
  const PARTICLE_COUNT = 115;
  const particles = [];

  const particleColors = [
    { r: 197, g: 168, b: 90 }, // Dourado
    { r: 248, g: 226, b: 167 }, // Dourado claro
    { r: 234, g: 201, b: 125 }, // Dourado médio
    { r: 253, g: 253, b: 253 }, // Branco brilhante
    { r: 180, g: 160, b: 100 },
    { r: 220, g: 200, b: 140 },
  ];

  function createParticle(forceNew) {
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    const size = Math.random() * 2.8 + 0.6; // Partículas ligeiramente maiores
    const isLarge = size > 2.0;
    return {
      x: forceNew ? (Math.random() > 0.5 ? -10 : W + 10) : Math.random() * W,
      y: Math.random() * H,
      size,
      color,
      alpha: Math.random() * 0.45 + 0.18, // Ligeiramente mais visível
      alphaBase: 0,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25 - 0.08,
      oscillateSpeed: Math.random() * 0.005 + 0.002,
      oscillateAmp: Math.random() * 20 + 8,
      oscillateOffset: Math.random() * Math.PI * 2,
      shimmerSpeed: Math.random() * 0.02 + 0.008,
      shimmerPhase: Math.random() * Math.PI * 2,
      hasGlow: isLarge,
      mouseInfluence: Math.random() * 0.25 + 0.05,
      life: 0,
      maxLife: Infinity,
    };
  }

  // ========================================
  // HAZES VOLUMÉTRICAS (NEBLINA VIVA) - ORIGINAL RESTAURADO
  // ========================================
  let hazes = [];
  
  function initHazes() {
    hazes = [
      { x: W * 0.8, y: H * 0.25, baseX: W * 0.8, baseY: H * 0.25, radius: 280, color: { r: 197, g: 168, b: 90 }, alpha: 0.05, driftSpeed: 0.0006, driftAmpX: 60, driftAmpY: 30, breatheSpeed: 0.0025, breatheAmp: 0.025, phase: 0 },
      { x: W * 0.15, y: H * 0.65, baseX: W * 0.15, baseY: H * 0.65, radius: 320, color: { r: 197, g: 168, b: 90 }, alpha: 0.04, driftSpeed: 0.0005, driftAmpX: 50, driftAmpY: 40, breatheSpeed: 0.0018, breatheAmp: 0.02, phase: Math.PI },
      { x: W * 0.5, y: H * 0.5, baseX: W * 0.5, baseY: H * 0.5, radius: 360, color: { r: 160, g: 140, b: 80 }, alpha: 0.02, driftSpeed: 0.0003, driftAmpX: 80, driftAmpY: 50, breatheSpeed: 0.0012, breatheAmp: 0.015, phase: Math.PI * 0.5 },
    ];
  }

  resize();
  initHazes();
  window.addEventListener('resize', resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle(false));
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Otimização Sênior: Pausar loop quando a aba estiver inativa
  let isTabVisible = true;
  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
  });

  // Otimização Sênior: Pausar loop quando o canvas não estiver visível (Intersection Observer)
  let isCanvasVisible = true;
  if ('IntersectionObserver' in window) {
    const canvasObserver = new IntersectionObserver((entries) => {
      isCanvasVisible = entries[0].isIntersecting;
    }, { threshold: 0.01 });
    canvasObserver.observe(canvas);
  }

  let tracePhase = 0;
  let time = 0;

  function animate() {
    // Se a aba ou o canvas não estiverem visíveis, pulamos o processamento gráfico
    if (!isTabVisible || !isCanvasVisible) {
      requestAnimationFrame(animate);
      return;
    }

    time++;
    ctx.clearRect(0, 0, W, H);

    smoothMouseX += (mouseX - smoothMouseX) * 0.03;
    smoothMouseY += (mouseY - smoothMouseY) * 0.03;

    const mnx = (smoothMouseX / W) * 2 - 1;
    const mny = (smoothMouseY / H) * 2 - 1;

    const isSwitching = document.body.classList.contains('is-switching-director');

    // --- Hazes volumétricas ---
    hazes.forEach(h => {
      h.phase += h.driftSpeed;
      h.x = h.baseX + Math.sin(h.phase) * h.driftAmpX + mnx * 30;
      h.y = h.baseY + Math.cos(h.phase * 0.7) * h.driftAmpY + mny * 20;
      const breathe = 1 + Math.sin(time * h.breatheSpeed) * h.breatheAmp;
      const r = h.radius * breathe;
      const grad = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, r);
      grad.addColorStop(0, `rgba(${h.color.r}, ${h.color.g}, ${h.color.b}, ${h.alpha})`);
      grad.addColorStop(0.4, `rgba(${h.color.r}, ${h.color.g}, ${h.color.b}, ${h.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${h.color.r}, ${h.color.g}, ${h.color.b}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(h.x, h.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- Rastros curvos dourados (ORIGINAL RESTAURADO) ---
    tracePhase += 0.002;
    ctx.save();

    const cx1 = W * 0.15 + Math.sin(tracePhase * 0.3) * 50 + mnx * 25;
    const cy1 = H * 0.2 + Math.cos(tracePhase * 0.2) * 30 + mny * 18;
    const arcStart1 = tracePhase * 0.4;
    const arcEnd1 = arcStart1 + 2.2;
    const r1 = 320 + Math.sin(tracePhase * 0.8) * 30;

    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = 'rgba(197, 168, 90, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx1, cy1, r1, arcStart1, arcEnd1);
    ctx.stroke();

    if (!isSwitching) {
      ctx.setLineDash([8, 10]);
      ctx.globalAlpha = 0.07;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx1, cy1, r1 + 18, arcStart1 + 0.1, arcEnd1 + 0.1);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.03;
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(197, 168, 90, 0.4)';
      ctx.beginPath();
      ctx.arc(cx1, cy1, r1, arcStart1, arcEnd1);
      ctx.stroke();
    }

    const cx2 = W * 0.82 + Math.sin(tracePhase * 0.25 + 2) * 40 - mnx * 20;
    const cy2 = H * 0.72 + Math.cos(tracePhase * 0.18 + 1) * 35 - mny * 15;
    const arcStart2 = -tracePhase * 0.35;
    const arcEnd2 = arcStart2 + 2.5;
    const r2 = 380 + Math.sin(tracePhase * 0.6) * 25;

    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = 'rgba(197, 168, 90, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx2, cy2, r2, arcStart2, arcEnd2);
    ctx.stroke();

    if (!isSwitching) {
      ctx.setLineDash([6, 9]);
      ctx.globalAlpha = 0.05;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx2, cy2, r2 + 20, arcStart2 - 0.1, arcEnd2 - 0.1);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.025;
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(197, 168, 90, 0.35)';
      ctx.beginPath();
      ctx.arc(cx2, cy2, r2, arcStart2, arcEnd2);
      ctx.stroke();
    }

    ctx.restore();

    // --- Partículas de poeira ---
    particles.forEach((p) => {
      p.life++;
      const osc = Math.sin(p.life * p.oscillateSpeed + p.oscillateOffset) * p.oscillateAmp * 0.02;
      p.x += p.vx + osc;
      p.y += p.vy + Math.cos(p.life * p.oscillateSpeed * 0.7 + p.oscillateOffset) * 0.15;

      const dx = smoothMouseX - p.x;
      const dy = smoothMouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250) {
        const force = (1 - dist / 250) * p.mouseInfluence * 0.25;
        p.x += dx * force * 0.01;
        p.y += dy * force * 0.01;
      }

      const shimmer = 0.5 + 0.5 * Math.sin(p.life * p.shimmerSpeed + p.shimmerPhase);
      const finalAlpha = p.alpha * (0.4 + shimmer * 0.6);

      if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { p.x = -5; p.y = Math.random() * H; }
        else if (side === 1) { p.x = W + 5; p.y = Math.random() * H; }
        else if (side === 2) { p.x = Math.random() * W; p.y = H + 5; }
        else { p.x = Math.random() * W; p.y = -5; }
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = (Math.random() - 0.5) * 0.3 - 0.1;
      }

      if (p.hasGlow && !isSwitching) {
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        glowGrad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalAlpha * 0.25})`);
        glowGrad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!isSwitching) {
      ctx.save();
      ctx.globalAlpha = 0.025 + Math.sin(time * 0.005) * 0.01;
      const dotSpacing = 18;
      const dotSize = 1;

      const gridX1 = W - 280 + mnx * 10;
      const gridY1 = 80 + mny * 8;
      ctx.fillStyle = `rgba(197, 168, 90, 0.5)`;
      for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 12; col++) {
          const gx = gridX1 + col * dotSpacing;
          const gy = gridY1 + row * dotSpacing;
          const gdist = Math.sqrt(Math.pow(col - 6, 2) + Math.pow(row - 6, 2));
          if (gdist < 6) {
            const ga = 1 - gdist / 6;
            ctx.globalAlpha = ga * (0.025 + Math.sin(time * 0.005) * 0.01);
            ctx.beginPath();
            ctx.arc(gx, gy, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      const gridX2 = 50 - mnx * 8;
      const gridY2 = H - 320 - mny * 6;
      ctx.fillStyle = `rgba(253, 253, 253, 0.4)`;
      for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 12; col++) {
          const gx = gridX2 + col * dotSpacing;
          const gy = gridY2 + row * dotSpacing;
          const gdist = Math.sqrt(Math.pow(col - 6, 2) + Math.pow(row - 6, 2));
          if (gdist < 6) {
            const ga = 1 - gdist / 6;
            ctx.globalAlpha = ga * (0.02 + Math.sin(time * 0.004 + 1) * 0.008);
            ctx.beginPath();
            ctx.arc(gx, gy, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}


/* ==========================================================================
   2. BARRA DE NAVEGAÇÃO (NAVBAR & MOBILE MENU)
   ========================================================================== */
/**
 * navbar.js â€” FNDD
 * Comportamento dinÃ¢mico da Navbar: scroll, menu mobile responsivo.
 */

function initNavbarBehavior() {
  const navbar = document.getElementById('fnddNavbar');
  const navToggle = document.getElementById('navToggle');
  const mobileOverlay = document.getElementById('mobileMenuOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!navbar) return;

  // 1. AlteraÃ§Ã£o visual no scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Executa no carregamento inicial

  // 2. Abrir/Fechar Menu Mobile
  if (navToggle && mobileOverlay) {
    const toggleMenu = () => {
      navToggle.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileOverlay.classList.contains('active')) toggleMenu();
      });
    });
  }
}

/**
 * initScrollSpy — FNDD
 * Controla a ativação visual dos links da navbar durante a rolagem (Scroll Spy)
 * e o comportamento de rolagem suave com offset da navbar.
 */
function initScrollSpy() {
  const sections = [
    { id: 'heroSection', link: '#' },
    { id: 'sobre', link: '#sobre' },
    { id: 'diretoria', link: '#diretoria' },
    { id: 'eventos', link: '#eventos' },
    { id: 'faq', link: '#faq' },
    { id: 'contato', link: '#contato' }
  ];

  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const updateActiveLink = () => {
    let activeSectionId = 'heroSection';
    // Offset para compensar a navbar fixada
    const scrollPosition = window.scrollY + 120;

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          activeSectionId = section.id;
        }
      }
    }

    // Se o usuário rolou até o fim da página, ativa o Contato
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 15) {
      activeSectionId = 'contato';
    }

    const activeLinkHref = activeSectionId === 'heroSection' ? '#' : `#${activeSectionId}`;

    // Atualiza links de desktop
    navLinks.forEach(link => {
      if (link.getAttribute('href') === activeLinkHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Atualiza links de mobile
    mobileLinks.forEach(link => {
      if (link.getAttribute('href') === activeLinkHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateActiveLink(); // Inicializa o estado correto no load

  // Suporte a clique com scroll suave preciso
  const allLinks = [...navLinks, ...mobileLinks];
  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href === '#' ? 'heroSection' : href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const targetOffset = targetEl.offsetTop - 75; // Compensação da altura da navbar fixada
          window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
          });

          // Atualiza classes ativas imediatamente
          allLinks.forEach(l => {
            if (l.getAttribute('href') === href) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });
        }
      }
    });
  });
}


/* ==========================================================================
   3. EFEITOS DA HERO (SPOTLIGHT & SCROLL PARALLAX)
   ========================================================================== */
/**
 * hero.js â€” FNDD
 * InicializaÃ§Ã£o e controle do vÃ­deo de fundo cinematogrÃ¡fico da Hero.
 * Parallax suave nos orbes, holofote, logo e cards flutuantes durante o scroll.
 * Efeito Spotlight/Flashlight por mouse nos cards e painÃ©is.
 */

function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const dataSrc = video.getAttribute('data-src');
  if (!dataSrc) return;

  const isMobile = window.innerWidth < 768;

  const startVideo = () => {
    video.src = dataSrc;
    video.load();

    const handleVideoLoaded = () => video.classList.add('loaded');

    if (video.readyState >= 2) {
      handleVideoLoaded();
    } else {
      video.addEventListener('canplay', handleVideoLoaded);
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Autoplay da Hero suspenso pelo navegador.', error);
      });
    }
  };

  if (isMobile) {
    // No mobile, carregar o vídeo apenas após a página estar totalmente carregada
    // para não competir com recursos críticos (CSS, fontes, LCP)
    if (document.readyState === 'complete') {
      setTimeout(startVideo, 1200);
    } else {
      window.addEventListener('load', () => {
        setTimeout(startVideo, 1200);
      });
    }
  } else {
    // No desktop, inicia imediatamente
    startVideo();
  }
}

function initScrollParallax() {
  // Desativa parallax no mobile por performance (evita repaints/TBT)
  if (window.innerWidth < 768) return;

  const orbs = document.querySelectorAll('.hero-glow-orb');
  const spotlight = document.querySelector('.hero-stage-spotlight');
  const logoFrame = document.querySelector('.hero-logo-frame');
  const cardRep = document.querySelector('.card-rep');
  const cardFormacao = document.querySelector('.card-formacao');
  const cardCompeticoes = document.querySelector('.card-competicoes');
  const cardValorizacao = document.querySelector('.card-valorizacao');

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    // Parallax desabilitado em orbs removidos
    if (scrollY < window.innerHeight) {
      const fadeFactor = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.8)));

      if (spotlight) spotlight.style.opacity = (0.8 * fadeFactor).toString();
      if (logoFrame) logoFrame.style.transform = `translateY(${scrollY * 0.1}px) scale(${1 - scrollY * 0.0005})`;
      if (cardRep) cardRep.style.transform = `translateY(${scrollY * -0.15}px)`;
      if (cardFormacao) cardFormacao.style.transform = `translateY(${scrollY * -0.08}px)`;
      if (cardCompeticoes) cardCompeticoes.style.transform = `translateY(${scrollY * -0.2}px)`;
      if (cardValorizacao) cardValorizacao.style.transform = `translateY(${scrollY * -0.12}px)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

function initSpotlightEffect() {
  const cards = document.querySelectorAll('.float-metric-card, .step-card-glass, .node-body, .faq-item, .contact-main-panel');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}


/* ==========================================================================
   4. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
/**
 * scroll.js â€” FNDD
 * Scroll Reveal (IntersectionObserver) para elementos com .reveal-on-scroll.
 */

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  });

  revealElements.forEach(el => observer.observe(el));
}


/* ==========================================================================
   5. ARENA CINEMATOGRÁFICA (LINHA COREOGRÁFICA & TILT 3D)
   ========================================================================== */
/**
 * about.js â€” FNDD
 * Parallax de scroll na imagem editorial da seÃ§Ã£o Sobre.
 * Efeito Tilt 3D interativo via mouse na arena cinematogrÃ¡fica.
 */

function initAboutScrollParallax() {
  const image = document.getElementById('aboutImg');
  const traceLocal = document.querySelector('.trace-local');

  if (!image) return;

  let ticking = false;

  function updateScrollParallax() {
    if (window.innerWidth < 1024) return;

    const section = document.querySelector('.about-section');
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();

    if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
      const relativeScroll = window.innerHeight - sectionRect.top;
      const imgTranslateY = -40 + (relativeScroll * 0.05);
      image.style.transform = `translateY(${imgTranslateY}px) scale(1.08)`;

      if (traceLocal) {
        traceLocal.style.transform = `rotate(${45 + relativeScroll * 0.01}deg) translateY(${relativeScroll * 0.012}px)`;
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollParallax);
      ticking = true;
    }
  }, { passive: true });
}

function initInteractiveStage() {
  const stage = document.querySelector('.about-section');
  const imgFrame = document.querySelector('.about-image-window');
  const imgBadge = document.querySelector('.choreo-badge');

  if (!stage) return;

  // Promove elementos para compositor layer desde o início
  if (imgFrame) imgFrame.style.willChange = 'transform';
  if (imgBadge) imgBadge.style.willChange = 'transform';

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  const ease = 0.05;
  let rafId = null;
  let isActive = false; // Controle: rAF só roda quando há movimento pendente

  stage.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 1024) return;
    const rect = stage.getBoundingClientRect();
    targetX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    targetY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    // Inicia o loop apenas se não estiver rodando
    if (!isActive) {
      isActive = true;
      rafId = requestAnimationFrame(updateInteractiveElements);
    }
  }, { passive: true });

  stage.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    // Deixa o loop convergir para zero naturalmente
  });

  function updateInteractiveElements() {
    const nextX = currentX + (targetX - currentX) * ease;
    const nextY = currentY + (targetY - currentY) * ease;

    const deltaX = Math.abs(nextX - currentX);
    const deltaY = Math.abs(nextY - currentY);

    // Continua apenas se ainda há movimento perceptivel (> 0.0001)
    if (deltaX > 0.0001 || deltaY > 0.0001) {
      currentX = nextX;
      currentY = nextY;

      document.documentElement.style.setProperty('--mouse-nx', currentX.toFixed(4));
      document.documentElement.style.setProperty('--mouse-ny', currentY.toFixed(4));

      if (window.innerWidth >= 1024) {
        if (imgFrame) {
          imgFrame.style.transform = `perspective(1000px) rotateX(${-currentY * 4.5}deg) rotateY(${currentX * 4.5}deg) translateY(-8px)`;
        }
        if (imgBadge) {
          imgBadge.style.transform = `translateX(${-25 + currentX * 15}px) translateY(${currentY * 10}px)`;
        }
      }

      rafId = requestAnimationFrame(updateInteractiveElements);
    } else {
      // Convergiu: para o loop e reseta para zero limpo
      currentX = targetX;
      currentY = targetY;
      isActive = false;
      rafId = null;
    }
  }
  // Não inicia o rAF no DOMContentLoaded — só ao mover o mouse
}

/**
 * initVideoVolumeControl — FNDD
 * Inicializa os controles customizados de volume do vídeo da seção Sobre.
 */
function initVideoVolumeControl() {
  const video = document.getElementById('aboutVideo');
  const slider = document.getElementById('videoVolumeSlider');
  const btn = document.getElementById('videoVolumeBtn');
  const icon = document.getElementById('volumeIcon');

  if (!video || !slider || !btn || !icon) return;

  let lastVolume = 1;

  const updateIcon = (vol) => {
    if (vol === 0) {
      icon.setAttribute('icon', 'solar:volume-mute-bold-duotone');
    } else if (vol < 0.5) {
      icon.setAttribute('icon', 'solar:volume-low-bold-duotone');
    } else {
      icon.setAttribute('icon', 'solar:volume-loud-bold-duotone');
    }
  };

  slider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    video.volume = vol;
    video.muted = (vol === 0);
    updateIcon(vol);
    if (vol > 0) {
      lastVolume = vol;
    }
  });

  btn.addEventListener('click', () => {
    if (video.muted || video.volume === 0) {
      video.muted = false;
      video.volume = lastVolume;
      slider.value = lastVolume;
      updateIcon(lastVolume);
    } else {
      video.muted = true;
      video.volume = 0;
      slider.value = 0;
      updateIcon(0);
    }
  });

  video.addEventListener('volumechange', () => {
    if (video.muted) {
      slider.value = 0;
      updateIcon(0);
    } else {
      slider.value = video.volume;
      updateIcon(video.volume);
      if (video.volume > 0) {
        lastVolume = video.volume;
      }
    }
  });
}


/* ==========================================================================
   6. PILARES DE ATUAÇÃO (SISTEMA DE ÓRBITAS INTERATIVAS)
   ========================================================================== */
/**
 * pillars.js â€” FNDD
 * Interatividade do sistema de Pilares de AtuaÃ§Ã£o FNDD.
 * Controla acendimento das linhas de conexÃ£o, faÃ­scas, dots e reaÃ§Ã£o do nÃºcleo central.
 */

function initPillarsSystem() {
  const stage = document.getElementById('pillarsStage');
  const nodes = document.querySelectorAll('.pillar-node');
  const core = document.getElementById('pillarsCore');
  const connLines = document.querySelectorAll('.conn-line');
  const connDots = document.querySelectorAll('.conn-dot');
  const coreDot = document.querySelector('.conn-dot-core');

  if (!stage || !nodes.length) return;

  function deactivateAll() {
    stage.classList.remove('has-active');
    nodes.forEach(n => n.classList.remove('active'));
    if (core) core.classList.remove('reacting');
    connLines.forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.conn-spark').forEach(s => s.classList.remove('active'));
    connDots.forEach(d => d.classList.remove('active'));
    if (coreDot) coreDot.classList.remove('active');
  }

  nodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      stage.classList.add('has-active');
      node.classList.add('active');
      if (core) core.classList.add('reacting');

      const lineId = node.getAttribute('data-line');
      const targetLine = document.getElementById(lineId);
      if (targetLine) targetLine.classList.add('active');

      const sparkId = lineId.replace('connLine', 'connSpark');
      const targetSpark = document.getElementById(sparkId);
      if (targetSpark) targetSpark.classList.add('active');

      if (connDots[index]) connDots[index].classList.add('active');
      if (coreDot) coreDot.classList.add('active');
    });

    node.addEventListener('mouseleave', deactivateAll);
  });

  if (core) {
    core.addEventListener('mouseenter', () => {
      deactivateAll();
      core.classList.add('reacting');
      if (coreDot) coreDot.classList.add('active');
    });

    core.addEventListener('mouseleave', () => {
      core.classList.remove('reacting');
      if (coreDot) coreDot.classList.remove('active');
    });
  }
}


/* ==========================================================================
   7. MANIFESTO EM MOVIMENTO (WORD REVEAL & SVG SPARK)
   ========================================================================== */
/**
 * manifesto.js â€” FNDD
 * SeÃ§Ã£o Manifesto em Movimento.
 * Spotlight suave seguindo o mouse, coreografia 3D de palavras pelo scroll,
 * sincronizaÃ§Ã£o luminosa da faÃ­sca SVG com o rastro cinÃ©tico.
 */

function initManifestoMotion() {
  const section = document.getElementById('manifesto-movimento');
  const stage = document.getElementById('manifestoWordStage');
  const words = document.querySelectorAll('.manifesto-word');
  const spark = document.querySelector('.manifesto-path-spark');

  if (!section || !words.length) return;

  // Spotlight seguindo o mouse
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    section.style.setProperty('--manifesto-mouse-x', `${x}px`);
    section.style.setProperty('--manifesto-mouse-y', `${y}px`);

    if (stage) {
      const stageRect = stage.getBoundingClientRect();
      const stageCenterY = stageRect.top - rect.top + stageRect.height / 2;
      const distY = Math.abs(y - stageCenterY);
      const glowFactor = Math.max(0.12, Math.min(1.0, 1 - distY / 220));
      section.style.setProperty('--manifesto-line-glow', glowFactor.toString());
    }
  }, { passive: true });

  // Scroll: progresso das palavras
  let ticking = false;
  const pinContainer = document.getElementById('manifesto-pin-container');

  const updateManifestoScroll = () => {
    const isTabletOrMobile = window.innerWidth < 1024;
    
    // Desconecta o IntersectionObserver mobile se existir
    if (window.manifestoMobileObserver) {
      window.manifestoMobileObserver.disconnect();
      window.manifestoMobileObserver = null;
    }

    const parentContainer = pinContainer || section;
    const rect = parentContainer.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    // Pinning via JavaScript (Apenas no Desktop)
    if (!isTabletOrMobile && pinContainer) {
      if (rect.top <= 0 && rect.bottom >= viewHeight) {
        // PIN: fixar na tela
        section.style.position = 'fixed';
        section.style.top = '0';
        section.style.bottom = 'auto';
        section.style.left = '0';
        section.style.width = '100%';
        section.style.zIndex = '100';
      } else if (rect.bottom < viewHeight) {
        // UNPIN inferior: ancorar no fundo do container
        section.style.position = 'absolute';
        section.style.top = 'auto';
        section.style.bottom = '0';
        section.style.left = '0';
        section.style.width = '100%';
        section.style.zIndex = '3';
      } else {
        // UNPIN superior (antes de entrar): comportamento padrão
        section.style.position = 'relative';
        section.style.top = '0';
        section.style.bottom = 'auto';
        section.style.left = '0';
        section.style.width = '100%';
        section.style.zIndex = '3';
      }
    } else if (isTabletOrMobile && section) {
      // Garante limpeza de estilos inline no mobile (onde usamos CSS sticky)
      section.style.position = '';
      section.style.top = '';
      section.style.bottom = '';
      section.style.left = '';
      section.style.width = '';
      section.style.zIndex = '';
    }

    if (rect.top < viewHeight && rect.bottom > 0) {
      const scrollRange = rect.height - viewHeight;
      let progress = Math.max(0, Math.min(1, -rect.top / scrollRange));

      const transitionEndProgress = 0.88;
      let activeIndex = 0;

      if (progress >= transitionEndProgress) {
        activeIndex = 7;
      } else {
        const norm = progress / transitionEndProgress;
        activeIndex = Math.min(6, Math.floor(norm * 7));
      }

      let wordProgress = progress >= transitionEndProgress
        ? 0.99
        : (progress / transitionEndProgress) * 0.85;

      const totalWords = words.length;

      words.forEach((word, index) => {
        word.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
        word.style.transform = '';

        if (index === activeIndex) {
          word.classList.add('active');
          if (!isTabletOrMobile) {
            if (word.classList.contains('manifesto-word-final')) {
              word.style.transform = 'scale(1) translateZ(0)';
            } else {
              const scrollFraction = (wordProgress * totalWords) - index;
              word.style.transform = `translateX(${scrollFraction * 20}px) scale(1.1) translateZ(0)`;
            }
          }
        } else if (!isTabletOrMobile) {
          if (index === activeIndex - 1) {
            word.classList.add('prev');
            const sf = (wordProgress * totalWords) - index;
            word.style.transform = `translateX(${-190 + sf * 20}px) scale(0.78) rotate(-3.5deg) translateZ(0)`;
          } else if (index === activeIndex + 1) {
            word.classList.add('next');
            const sf = (wordProgress * totalWords) - index;
            word.style.transform = `translateX(${190 + sf * 20}px) scale(0.78) rotate(3.5deg) translateZ(0)`;
          } else if (index < activeIndex - 1) {
            word.classList.add('far-prev');
            word.style.transform = `translateX(-380px) scale(0.55) translateZ(0)`;
          } else {
            word.classList.add('far-next');
            word.style.transform = `translateX(380px) scale(0.55) translateZ(0)`;
          }
        }
      });

      // Atualiza indicador de progresso no mobile
      const progressFill = document.getElementById('manifestoMobileProgressFill');
      const progressNumCurrent = document.querySelector('.manifesto-mobile-progress .progress-num:first-child');
      if (isTabletOrMobile) {
        const displayIndex = activeIndex === 7 ? 7 : activeIndex + 1;
        if (progressNumCurrent) {
          progressNumCurrent.textContent = `0${displayIndex}`;
        }
        if (progressFill) {
          const fillPercentage = activeIndex === 7 ? 100 : ((activeIndex + 1) / 7) * 100;
          progressFill.style.width = `${fillPercentage}%`;
        }
      }

      // Faísca SVG sincronizada (Apenas no Desktop)
      if (spark && !isTabletOrMobile) {
        const maxOffset = 1120, minOffset = 220;
        const sparkProgress = Math.min(1.0, progress / transitionEndProgress);
        spark.style.strokeDashoffset = maxOffset - (sparkProgress * (maxOffset - minOffset));
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateManifestoScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateManifestoScroll);
      ticking = true;
    }
  }, { passive: true });

  updateManifestoScroll();
}


/* ==========================================================================
   8. GALERIA DA DIRETORIA (EVENT DELEGATION & PRELOAD)
   ========================================================================== */
/**
 * directors.js â€” FNDD
 * Galeria de LideranÃ§a da Diretoria FNDD â€” Otimizada para Performance.
 * Event delegation, prÃ©-carregamento de imagens, transiÃ§Ãµes suaves e spotlight no painel destacado.
 */

function initDirectorsGallery() {
  const rail = document.getElementById('directorsRail');
  const featuredPanel = document.getElementById('featuredPanel');
  if (!rail || !featuredPanel) return;

  const featuredImg = document.getElementById('featuredImg');
  const featuredName = document.getElementById('featuredName');
  const featuredRole = document.getElementById('featuredRole');
  const featuredBio = document.getElementById('featuredBio');
  const featuredNum = document.getElementById('featuredNum');
  const bioWrapper = document.getElementById('bioWrapper');

  // PrÃ©-carregamento assÃ­ncrono de todas as fotos
  rail.querySelectorAll('.rail-item').forEach(item => {
    if (item.dataset.img) {
      const img = new Image();
      img.src = item.dataset.img;
    }
  });

  let isLocked = false;

  // Event delegation â€” um Ãºnico listener
  rail.addEventListener('click', (e) => {
    const item = e.target.closest('.rail-item');
    if (!item || item.classList.contains('active') || isLocked) return;

    isLocked = true;
    document.body.classList.add('is-switching-director');
    featuredPanel.classList.add('updating');

    setTimeout(() => {
      if (featuredImg) { featuredImg.src = item.dataset.img; featuredImg.alt = item.dataset.name; }
      if (featuredName) featuredName.textContent = item.dataset.name;
      if (featuredRole) featuredRole.textContent = item.dataset.role;
      if (featuredBio) featuredBio.textContent = item.dataset.bio;
      if (featuredNum) featuredNum.textContent = item.dataset.num;
      if (bioWrapper) bioWrapper.scrollTop = 0;

      const activeItem = rail.querySelector('.rail-item.active');
      const activeId = activeItem ? parseInt(activeItem.dataset.id) : 1;
      const clickedId = parseInt(item.dataset.id);
      const direction = clickedId > activeId ? 'right' : 'left';

      activeItem?.classList.remove('active');
      item.classList.add('active');
      scrollRailToItem(item, direction);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          featuredPanel.classList.remove('updating');
          setTimeout(() => {
            document.body.classList.remove('is-switching-director');
            isLocked = false;
          }, 120);
        });
      });
    }, 90);
  });
  function scrollRailToItem(item, direction) {
    const isMobile = window.innerWidth < 992;
    if (isMobile) {
      if (direction === 'right') {
        rail.scrollTo({ left: item.offsetLeft - 16, behavior: 'smooth' });
      } else {
        rail.scrollTo({ left: item.offsetLeft - rail.clientWidth + item.clientWidth + 16, behavior: 'smooth' });
      }
    } else {
      rail.scrollTo({ top: item.offsetTop - rail.clientHeight / 2 + item.clientHeight / 2, behavior: 'smooth' });
    }
  }
}

function initFeaturedPanelSpotlight() {
  const panel = document.getElementById('featuredPanel');
  if (!panel) return;

  panel.addEventListener('mousemove', (e) => {
    const rect = panel.getBoundingClientRect();
    panel.style.setProperty('--panel-mouse-x', `${e.clientX - rect.left}px`);
    panel.style.setProperty('--panel-mouse-y', `${e.clientY - rect.top}px`);
  }, { passive: true });

  panel.addEventListener('mouseleave', () => {
    panel.style.setProperty('--panel-mouse-x', '-999px');
    panel.style.setProperty('--panel-mouse-y', '-999px');
  });
}


/* ==========================================================================
   9. CARDS DE EVENTOS (TILT 3D)
   ========================================================================== */
/**
 * events.js â€” FNDD
 * Efeitos 3D Premium (Tilt + Spotlight) nos Cards de Eventos.
 * Desativado em dispositivos mÃ³veis por performance e acessibilidade tÃ¡ctil.
 */

function initEventsInteractiveCards() {
  if (window.innerWidth < 992) return;

  const cards = document.querySelectorAll('.station-card, .station-card-highlight, .events-cta-simple');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const xc = (x / rect.width) - 0.5;
      const yc = (y / rect.height) - 0.5;
      const maxTilt = card.classList.contains('events-cta-simple') ? 3 : 5;

      card.style.transform = `perspective(1000px) rotateX(${yc * -maxTilt}deg) rotateY(${xc * maxTilt}deg) translateY(-2px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
      card.style.transform = '';
    });
  });
}


/* ==========================================================================
   10. ACORDEÃO DE FAQ PREMIUM (ACESSIBILIDADE ARIA)
   ========================================================================== */
/**
 * faq.js â€” FNDD
 * AcordeÃ£o de FAQ Premium com transiÃ§Ãµes suaves via scrollHeight dinÃ¢mico.
 * Suporte completo a acessibilidade (ARIA).
 */

function initFaqAccordion() {
  const accordionContainer = document.getElementById('faqAccordion');
  if (!accordionContainer) return;

  const faqItems = accordionContainer.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros itens
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Alterna o item atual
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  // Atualiza alturas no redimensionamento
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('active')) {
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

/* ==========================================================================
   FORMULÁRIO DE CONTATO SEGURO (Prevenção de Warnings do Navegador)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('fnddContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    if (!nameInput || !emailInput || !messageInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Validação básica dos campos obrigatórios
    if (!name) {
      alert('Por favor, preencha o seu nome.');
      nameInput.focus();
      return;
    }
    if (!email || !email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      emailInput.focus();
      return;
    }
    if (!message) {
      alert('Por favor, digite a sua mensagem.');
      messageInput.focus();
      return;
    }

    const emailDestino = 'fndd.federacao@gmail.com';
    const assunto = 'Contato pelo site da FNDD';
    const corpo = `Nome: ${name}
E-mail: ${email}
Mensagem:
${message}`;

    const mailtoUrl = `mailto:${emailDestino}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    
    // Abre o mailto com segurança
    window.location.href = mailtoUrl;
  });
}



/* ==========================================================================
   INICIALIZAÇÃO GLOBAL (DOMContentLoaded) & LAZY LOADING DE SCRIPTS
   ========================================================================== */
/**
 * lazyInitSection — FNDD
 * Inicializa scripts de forma preguiçosa apenas quando a respectiva seção entra na viewport.
 * Melhora drasticamente o TBT (Total Blocking Time) e a performance de renderização móvel.
 */
function lazyInitSection(sectionSelector, initFunction) {
  const section = document.querySelector(sectionSelector);
  if (!section) {
    initFunction();
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        initFunction();
        observer.disconnect();
      }
    }, { rootMargin: '300px 0px' }); // Carrega quando o scroll estiver a 300px de distância
    observer.observe(section);
  } else {
    // Fallback se o navegador não suportar IntersectionObserver
    initFunction();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Background global animado (canvas de partículas vivas) - desativado no mobile internamente
  initCanvasBackground();

  // 2. Comportamento da Navbar e mobile menu (crítico para primeiro render)
  initNavbarBehavior();
  
  // Inicialização do Scroll Spy para destacar itens no menu conforme rolagem/clique
  initScrollSpy();

  // 3. Inicializações da Hero (crítico)
  initHeroVideo();
  initScrollParallax();
  initSpotlightEffect();

  // 4. Scroll Reveal global (IntersectionObserver interno leve)
  initScrollReveal();

  // 5. Arena Cinematográfica (Linha Coreográfica) — Lazy Init
  lazyInitSection('.about-section', () => {
    initAboutScrollParallax();
    initInteractiveStage();
    initVideoVolumeControl();
  });

  // 6. Sistema interativo de Pilares de Atuação — Lazy Init
  lazyInitSection('.pillars-section', () => {
    initPillarsSystem();
  });

  // 7. Seção Manifesto em Movimento — Lazy Init
  lazyInitSection('.manifesto-pin-container', () => {
    initManifestoMotion();
  });

  // 8. Galeria da Diretoria — Lazy Init
  lazyInitSection('.directors-section', () => {
    initDirectorsGallery();
    initFeaturedPanelSpotlight();
  });

  // 9. Cards de Eventos interativos — Lazy Init
  lazyInitSection('.events-section', () => {
    initEventsInteractiveCards();
  });

  // 10. Acordeão de FAQ — Lazy Init
  lazyInitSection('.faq-section', () => {
    initFaqAccordion();
  });

  // 11. Formulário de Contato Seguro
  initContactForm();
});