/**
 * Script de Interações da Hero Real - FNDD
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initSpotlightEffect();
  initScrollParallax();
  initNavbarBehavior();
  initScrollReveal();
  initAboutScrollParallax();
  initCanvasBackground();
  initInteractiveStage();
  initPillarsSystem();
  initManifestoMotion();
  initDirectorsGallery();
  initFeaturedPanelSpotlight();
  initEventsInteractiveCards();
  initFaqAccordion();
});

/**
 * Inicialização e controle de fade-in do vídeo de fundo cinematográfico
 * Adiciona um reveal suave e trata restrições de autoplay e carregamento.
 */
function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const handleVideoLoaded = () => {
    video.classList.add('loaded');
  };

  // Se o vídeo já carregou dados suficientes
  if (video.readyState >= 2) {
    handleVideoLoaded();
  } else {
    video.addEventListener('canplay', handleVideoLoaded);
  }

  // Tratamento robusto de reprodução para restrições e economia de energia
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.warn("Autoplay da Hero suspenso pelo navegador. Mantendo fallback de fundo institucional.", error);
    });
  }
}

/**
 * Efeito de Spotlight/Flashlight seguindo o cursor do mouse
 * Atualiza variáveis CSS (--mouse-x, --mouse-y) nos cards flutuantes e de pilares
 */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.float-metric-card, .step-card-glass, .node-body, .faq-item, .contact-main-panel');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * Efeito de Scroll Parallax Suave para os elementos da Hero
 * Evita Three.js ou bibliotecas pesadas, usando apenas cálculo nativo com requestAnimationFrame
 */
function initScrollParallax() {
  const orbs = document.querySelectorAll('.hero-glow-orb');
  const spotlight = document.querySelector('.hero-stage-spotlight');
  const logoFrame = document.querySelector('.hero-logo-frame');
  
  // Selecionando os cards flutuantes
  const cardRep = document.querySelector('.card-rep');
  const cardFormacao = document.querySelector('.card-formacao');
  const cardCompeticoes = document.querySelector('.card-competicoes');
  const cardValorizacao = document.querySelector('.card-valorizacao');
  
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    
    // Parallax se aplica apenas se estiver na dobra visível (Hero)
    if (scrollY < window.innerHeight) {
      // Reduz o brilho dos orbes e do holofote conforme rola
      const fadeFactor = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.8)));
      
      orbs.forEach(orb => {
        orb.style.opacity = (0.45 * fadeFactor).toString();
      });
      
      if (spotlight) {
        spotlight.style.opacity = (0.8 * fadeFactor).toString();
      }

      // Parallax sutil nos elementos
      if (logoFrame) {
        logoFrame.style.transform = `translateY(${scrollY * 0.1}px) scale(${1 - scrollY * 0.0005})`;
      }

      // Cada card se move com velocidades de paralaxe diferentes
      if (cardRep) {
        cardRep.style.transform = `translateY(${scrollY * -0.15}px)`;
      }
      if (cardFormacao) {
        cardFormacao.style.transform = `translateY(${scrollY * -0.08}px)`;
      }
      if (cardCompeticoes) {
        cardCompeticoes.style.transform = `translateY(${scrollY * -0.2}px)`;
      }
      if (cardValorizacao) {
        cardValorizacao.style.transform = `translateY(${scrollY * -0.12}px)`;
      }
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Comportamento dinâmico da Navbar (Scroll e Menu Mobile responsivo)
 */
function initNavbarBehavior() {
  const navbar = document.getElementById('fnddNavbar');
  const navToggle = document.getElementById('navToggle');
  const mobileOverlay = document.getElementById('mobileMenuOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!navbar) return;

  // 1. Alteração no scroll (background & blur)
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Executa no carregamento inicial caso já esteja scrollado

  // 2. Abrir/Fechar Menu Mobile
  if (navToggle && mobileOverlay) {
    const toggleMenu = () => {
      navToggle.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      
      // Impede o scroll no body quando o menu mobile está ativo
      if (mobileOverlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    navToggle.addEventListener('click', toggleMenu);

    // Fecha o menu mobile quando clica em qualquer link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileOverlay.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }
}

/**
 * Efeito de Scroll Reveal para elementos com classe .reveal-on-scroll
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Uma vez revelado, paramos de observar
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Lógica do Efeito Parallax de Scroll na Imagem Editorial da Seção Sobre e Elementos Locais
 */
function initAboutScrollParallax() {
  const image = document.getElementById('aboutImg');
  const traceLocal = document.querySelector('.trace-local');
  
  if (!image) return;

  let ticking = false;

  function updateScrollParallax() {
    // Reage apenas no desktop para evitar overhead de performance em dispositivos móveis
    if (window.innerWidth < 1024) return;

    const section = document.querySelector('.about-section');
    if (!section) return;
    
    const sectionRect = section.getBoundingClientRect();
    
    // Executa apenas se a seção estiver visível na janela do navegador
    if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
      const relativeScroll = window.innerHeight - sectionRect.top;
      
      // Parallax sutil na imagem editorial (deslocamento suave de -40px a +40px)
      const imgTranslateY = -40 + (relativeScroll * 0.05);
      image.style.transform = `translateY(${imgTranslateY}px) scale(1.08)`;
      
      // Parallax sutil nos rastros cinéticos locais
      if (traceLocal) {
        traceLocal.style.transform = `rotate(${45 + relativeScroll * 0.01}deg) translateY(${relativeScroll * 0.012}px)`;
      }
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollParallax();
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Lógica de Arena Cinematográfica Interativa reativa ao mouse (Tilt 3D) na Seção Sobre
 */
function initInteractiveStage() {
  const stage = document.querySelector('.about-section');
  const imgFrame = document.querySelector('.about-image-window');
  const imgBadge = document.querySelector('.choreo-badge');
  
  if (!stage) return;
  
  // Variáveis para interpolação suave (Lerp)
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  const ease = 0.05; // Lag visual sutil e elegante de palco
  
  // Ouvinte de movimento do mouse na seção Sobre para focar o efeito local
  stage.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 1024) return;
    
    const rect = stage.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    
    // Coordenadas normalizadas de -1 a 1 com base no centro da seção Sobre
    targetX = (e.clientX - rect.left - halfWidth) / halfWidth;
    targetY = (e.clientY - rect.top - halfHeight) / halfHeight;
  }, { passive: true });
  
  // Quando o mouse sai da seção, redefinimos os alvos de forma a retornar ao estado inicial suavemente
  stage.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });
  
  // Loop de animação de interpolação física rodando a 60fps via rAF (otimizado)
  function updateInteractiveElements() {
    const nextX = currentX + (targetX - currentX) * ease;
    const nextY = currentY + (targetY - currentY) * ease;
    
    if (nextX.toFixed(4) !== currentX.toFixed(4) || nextY.toFixed(4) !== currentY.toFixed(4)) {
      currentX = nextX;
      currentY = nextY;
      
      // Injeta as variáveis customizadas normalizadas no root para o CSS ler
      document.documentElement.style.setProperty('--mouse-nx', currentX.toFixed(4));
      document.documentElement.style.setProperty('--mouse-ny', currentY.toFixed(4));
      
      if (window.innerWidth >= 1024) {
        // Efeito Tilt 3D sutil e luxuoso na moldura editorial da imagem
        if (imgFrame) {
          const rotateXFactor = -currentY * 4.5;
          const rotateYFactor = currentX * 4.5;
          imgFrame.style.transform = `perspective(1000px) rotateX(${rotateXFactor}deg) rotateY(${rotateYFactor}deg) translateY(-8px)`;
        }
        
        // Efeito oposto na legenda flutuante para profundidade paralaxe impecável
        if (imgBadge) {
          imgBadge.style.transform = `translateX(${-25 + currentX * 15}px) translateY(${currentY * 10}px)`;
        }
      }
    }
    
    requestAnimationFrame(updateInteractiveElements);
  }
  
  // Inicia o loop cinético
  requestAnimationFrame(updateInteractiveElements);
}

/**
 * Background Global Animado via Canvas 2D
 * Sistema de partículas vivas com:
 * - Poeira de palco flutuante com movimento próprio
 * - Hazes volumétricas que respiram e vagam pela tela
 * - Reação suave ao mouse
 * - Performance otimizada com requestAnimationFrame
 */
function initCanvasBackground() {
  const canvas = document.getElementById('siteBgCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let W, H;
  let mouseX = 0, mouseY = 0;
  let smoothMouseX = 0, smoothMouseY = 0;
  
  // Resize handler
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  // Track mouse globalmente
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // ========================================
  // PARTÍCULAS DE POEIRA DE PALCO (VIVAS)
  // ========================================
  const PARTICLE_COUNT = 40; // Reduzido para ficar mais limpo e elegante
  const particles = [];
  
  // Cores da paleta FNDD
  const particleColors = [
    { r: 197, g: 168, b: 90 },   // Gold primary
    { r: 248, g: 226, b: 167 },  // Gold light
    { r: 234, g: 201, b: 125 },  // Gold warm
    { r: 253, g: 253, b: 253 },  // White puro
    { r: 180, g: 160, b: 100 },  // Gold muted
    { r: 220, g: 200, b: 140 },  // Gold cream
  ];
  
  function createParticle(forceNew) {
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    const size = Math.random() * 2.5 + 0.5; // 0.5px a 3px
    const isLarge = size > 2;
    
    return {
      x: forceNew ? (Math.random() > 0.5 ? -10 : W + 10) : Math.random() * W,
      y: Math.random() * H,
      size: size,
      color: color,
      alpha: Math.random() * 0.4 + 0.15, // 0.15 a 0.55
      alphaBase: 0,
      // Velocidade própria — cada partícula tem vida independente
      vx: (Math.random() - 0.5) * 0.4, // Drift horizontal leve
      vy: (Math.random() - 0.5) * 0.3 - 0.1, // Tendência de subir (como poeira)
      // Oscilação senoidal para movimento orgânico
      oscillateSpeed: Math.random() * 0.005 + 0.002,
      oscillateAmp: Math.random() * 20 + 8,
      oscillateOffset: Math.random() * Math.PI * 2,
      // Brilho pulsante
      shimmerSpeed: Math.random() * 0.02 + 0.008,
      shimmerPhase: Math.random() * Math.PI * 2,
      // Glow (só para partículas maiores)
      hasGlow: isLarge,
      // Reação ao mouse (mais forte = mais perto)
      mouseInfluence: Math.random() * 0.3 + 0.05,
      // Vida da partícula
      life: 0,
      maxLife: Infinity, // Vive para sempre, recicla nas bordas
    };
  }
  
  // Inicializa partículas espalhadas pela tela
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle(false));
  }
  
  // ========================================
  // HAZES VOLUMÉTRICAS (NEBLINA VIVA)
  // ========================================
  const hazes = [
    {
      x: W * 0.8, y: H * 0.25,
      baseX: W * 0.8, baseY: H * 0.25,
      radius: 300,
      color: { r: 197, g: 168, b: 90 },
      alpha: 0.06,
      driftSpeed: 0.0008,
      driftAmpX: 80,
      driftAmpY: 40,
      breatheSpeed: 0.003,
      breatheAmp: 0.03,
      phase: 0,
    },
    {
      x: W * 0.15, y: H * 0.65,
      baseX: W * 0.15, baseY: H * 0.65,
      radius: 350,
      color: { r: 197, g: 168, b: 90 },
      alpha: 0.045,
      driftSpeed: 0.0006,
      driftAmpX: 60,
      driftAmpY: 50,
      breatheSpeed: 0.002,
      breatheAmp: 0.025,
      phase: Math.PI,
    },
    {
      x: W * 0.5, y: H * 0.5,
      baseX: W * 0.5, baseY: H * 0.5,
      radius: 400,
      color: { r: 160, g: 140, b: 80 },
      alpha: 0.025,
      driftSpeed: 0.0004,
      driftAmpX: 100,
      driftAmpY: 60,
      breatheSpeed: 0.0015,
      breatheAmp: 0.02,
      phase: Math.PI * 0.5,
    }
  ];
  
  // Atualiza posições base das hazes no resize
  window.addEventListener('resize', () => {
    hazes[0].baseX = W * 0.8; hazes[0].baseY = H * 0.25;
    hazes[1].baseX = W * 0.15; hazes[1].baseY = H * 0.65;
    hazes[2].baseX = W * 0.5; hazes[2].baseY = H * 0.5;
  });
  
  // ========================================
  // RASTROS CURVOS DOURADOS (linhas orgânicas)
  // ========================================
  let tracePhase = 0;
  
  // ========================================
  // LOOP PRINCIPAL DE ANIMAÇÃO
  // ========================================
  let time = 0;
  
  function animate() {
    time++;
    ctx.clearRect(0, 0, W, H);
    
    // Suaviza a posição do mouse
    smoothMouseX += (mouseX - smoothMouseX) * 0.03;
    smoothMouseY += (mouseY - smoothMouseY) * 0.03;
    
    // Offset normalizado do mouse (-1 a 1)
    const mnx = (smoothMouseX / W) * 2 - 1;
    const mny = (smoothMouseY / H) * 2 - 1;
    
    const isSwitching = document.body.classList.contains('is-switching-director');
    
    // --- Desenhar HAZES volumétricas ---
    hazes.forEach(h => {
      h.phase += h.driftSpeed;
      
      // Posição vaga suavemente
      h.x = h.baseX + Math.sin(h.phase) * h.driftAmpX + mnx * 30;
      h.y = h.baseY + Math.cos(h.phase * 0.7) * h.driftAmpY + mny * 20;
      
      // Respiração do raio
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
    
    // --- Desenhar RASTROS CURVOS dourados (com rotação contínua visível) ---
    tracePhase += 0.003; // 10x mais rápido para rotação perceptível
    ctx.save();
    
    // === ARCO 1 — canto superior esquerdo, girando lentamente ===
    const cx1 = W * 0.15 + Math.sin(tracePhase * 0.3) * 50 + mnx * 25;
    const cy1 = H * 0.2 + Math.cos(tracePhase * 0.2) * 30 + mny * 18;
    const arcStart1 = tracePhase * 0.4; // Ângulo gira continuamente
    const arcEnd1 = arcStart1 + 2.2;    // Arco parcial (~120°)
    const r1 = 320 + Math.sin(tracePhase * 0.8) * 30;
    
    // Linha principal sólida
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = 'rgba(197, 168, 90, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx1, cy1, r1, arcStart1, arcEnd1);
    ctx.stroke();
    
    if (!isSwitching) {
      // Linha paralela tracejada (acompanha)
      ctx.setLineDash([8, 10]);
      ctx.globalAlpha = 0.09;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx1, cy1, r1 + 18, arcStart1 + 0.1, arcEnd1 + 0.1);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Glow sutil no arco
      ctx.globalAlpha = 0.04;
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(197, 168, 90, 0.4)';
      ctx.beginPath();
      ctx.arc(cx1, cy1, r1, arcStart1, arcEnd1);
      ctx.stroke();
    }
    
    // === ARCO 2 — canto inferior direito, gira no sentido oposto ===
    const cx2 = W * 0.82 + Math.sin(tracePhase * 0.25 + 2) * 40 - mnx * 20;
    const cy2 = H * 0.72 + Math.cos(tracePhase * 0.18 + 1) * 35 - mny * 15;
    const arcStart2 = -tracePhase * 0.35; // Gira no sentido oposto
    const arcEnd2 = arcStart2 + 2.5;
    const r2 = 380 + Math.sin(tracePhase * 0.6) * 25;
    
    // Linha principal sólida
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = 'rgba(197, 168, 90, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx2, cy2, r2, arcStart2, arcEnd2);
    ctx.stroke();
    
    if (!isSwitching) {
      // Linha paralela tracejada
      ctx.setLineDash([6, 9]);
      ctx.globalAlpha = 0.07;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx2, cy2, r2 + 20, arcStart2 - 0.1, arcEnd2 - 0.1);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Glow sutil no arco 2
      ctx.globalAlpha = 0.035;
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(197, 168, 90, 0.35)';
      ctx.beginPath();
      ctx.arc(cx2, cy2, r2, arcStart2, arcEnd2);
      ctx.stroke();
    }
    
    ctx.restore();
    
    // --- Desenhar PARTÍCULAS de poeira ---
    particles.forEach((p, i) => {
      p.life++;
      
      // Movimento orgânico (drift + oscilação senoidal)
      const osc = Math.sin(p.life * p.oscillateSpeed + p.oscillateOffset) * p.oscillateAmp * 0.02;
      p.x += p.vx + osc;
      p.y += p.vy + Math.cos(p.life * p.oscillateSpeed * 0.7 + p.oscillateOffset) * 0.15;
      
      // Reação suave ao mouse (atrai levemente)
      const dx = smoothMouseX - p.x;
      const dy = smoothMouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300) {
        const force = (1 - dist / 300) * p.mouseInfluence * 0.3;
        p.x += dx * force * 0.01;
        p.y += dy * force * 0.01;
      }
      
      // Brilho pulsante (shimmer)
      const shimmer = 0.5 + 0.5 * Math.sin(p.life * p.shimmerSpeed + p.shimmerPhase);
      const finalAlpha = p.alpha * (0.4 + shimmer * 0.6);
      
      // Reciclar partícula se sair da tela
      if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
        // Reentrar de uma borda aleatória
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { p.x = -5; p.y = Math.random() * H; }      // esquerda
        else if (side === 1) { p.x = W + 5; p.y = Math.random() * H; } // direita
        else if (side === 2) { p.x = Math.random() * W; p.y = H + 5; }  // baixo
        else { p.x = Math.random() * W; p.y = -5; }                    // topo
        
        // Novo vetor de velocidade
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = (Math.random() - 0.5) * 0.3 - 0.1;
      }
      
      // Desenhar glow (apenas partículas maiores)
      if (p.hasGlow && !isSwitching) {
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        glowGrad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalAlpha * 0.3})`);
        glowGrad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Desenhar partícula principal
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    if (!isSwitching) {
      // --- Dot grids sutis nos cantos ---
      ctx.save();
      ctx.globalAlpha = 0.035 + Math.sin(time * 0.005) * 0.015;
      const dotSpacing = 18;
      const dotSize = 1;
      
      // Grid canto superior direito
      const gridX1 = W - 280 + mnx * 10;
      const gridY1 = 80 + mny * 8;
      ctx.fillStyle = `rgba(197, 168, 90, 0.5)`;
      for (let row = 0; row < 14; row++) {
        for (let col = 0; col < 14; col++) {
          const gx = gridX1 + col * dotSpacing;
          const gy = gridY1 + row * dotSpacing;
          // Fade radial
          const gdist = Math.sqrt(Math.pow(col - 7, 2) + Math.pow(row - 7, 2));
          if (gdist < 7) {
            const ga = 1 - gdist / 7;
            ctx.globalAlpha = ga * (0.035 + Math.sin(time * 0.005) * 0.015);
            ctx.beginPath();
            ctx.arc(gx, gy, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Grid canto inferior esquerdo
      const gridX2 = 50 - mnx * 8;
      const gridY2 = H - 320 - mny * 6;
      ctx.fillStyle = `rgba(253, 253, 253, 0.4)`;
      for (let row = 0; row < 14; row++) {
        for (let col = 0; col < 14; col++) {
          const gx = gridX2 + col * dotSpacing;
          const gy = gridY2 + row * dotSpacing;
          const gdist = Math.sqrt(Math.pow(col - 7, 2) + Math.pow(row - 7, 2));
          if (gdist < 7) {
            const ga = 1 - gdist / 7;
            ctx.globalAlpha = ga * (0.025 + Math.sin(time * 0.004 + 1) * 0.01);
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

/**
 * Inicialização e interatividade da seção Pilares de Atuação (Sistema de Atuação FNDD)
 * Controla o acendimento das linhas de conexão, dots e reações do núcleo FNDD ao passar o mouse
 */
function initPillarsSystem() {
  const stage = document.getElementById('pillarsStage');
  const nodes = document.querySelectorAll('.pillar-node');
  const core = document.getElementById('pillarsCore');
  const connLines = document.querySelectorAll('.conn-line');
  const connDots = document.querySelectorAll('.conn-dot');
  const coreDot = document.querySelector('.conn-dot-core');

  if (!stage || !nodes.length) return;

  nodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      // 1. Ativa estado global no palco
      stage.classList.add('has-active');
      
      // 2. Ativa o nó atual
      node.classList.add('active');
      
      // 3. Ativa a reação do núcleo central
      if (core) core.classList.add('reacting');
      
      // 4. Acende a linha de conexão e a faísca (spark) correspondente
      const lineId = node.getAttribute('data-line');
      const targetLine = document.getElementById(lineId);
      if (targetLine) targetLine.classList.add('active');
      
      const sparkId = lineId.replace('connLine', 'connSpark');
      const targetSpark = document.getElementById(sparkId);
      if (targetSpark) targetSpark.classList.add('active');
      
      // 5. Acende o ponto (dot) do lado do módulo correspondente pelo índice físico
      if (connDots[index]) {
        connDots[index].classList.add('active');
      }
      
      // 6. Acende o ponto do núcleo central
      if (coreDot) coreDot.classList.add('active');
    });

    node.addEventListener('mouseleave', () => {
      // 1. Remove estado global do palco
      stage.classList.remove('has-active');
      
      // 2. Desativa o nó atual
      node.classList.remove('active');
      
      // 3. Desativa a reação do núcleo
      if (core) core.classList.remove('reacting');
      
      // 4. Apaga todas as linhas de conexão e faíscas
      connLines.forEach(line => line.classList.remove('active'));
      const sparks = document.querySelectorAll('.conn-spark');
      sparks.forEach(spark => spark.classList.remove('active'));
      
      // 5. Apaga todos os pontos (dots) de conexão
      connDots.forEach(dot => dot.classList.remove('active'));
      
      // 6. Apaga o ponto do núcleo
      if (coreDot) coreDot.classList.remove('active');
    });
  });

  // Interação ao passar o mouse sobre o núcleo central (Reação limpa e focada)
  if (core) {
    core.addEventListener('mouseenter', () => {
      core.classList.add('reacting');
      if (coreDot) coreDot.classList.add('active');
      
      // Garante de forma proativa que todas as conexões e sparks estejam inativos ao passar o mouse no core
      stage.classList.remove('has-active');
      nodes.forEach(node => node.classList.remove('active'));
      connLines.forEach(line => line.classList.remove('active'));
      const sparks = document.querySelectorAll('.conn-spark');
      sparks.forEach(spark => spark.classList.remove('active'));
      connDots.forEach(dot => dot.classList.remove('active'));
    });

    core.addEventListener('mouseleave', () => {
      core.classList.remove('reacting');
      if (coreDot) coreDot.classList.remove('active');
    });
  }
}

/**
 * Inicialização e controle cinético da seção Manifesto em Movimento
 * Efeitos de:
 * - Spotlight ultra suave acompanhando o mouse
 * - Proximidade do mouse acendendo a linha fluida (SVG)
 * - Progresso cronológico com coreografia 3D horizontal de revelação das palavras
 * - Sincronização luminosa da faísca do SVG com o rastro cinético corporal
 */
function initManifestoMotion() {
  const section = document.getElementById('manifesto-movimento');
  const spotlight = document.getElementById('manifestoSpotlight');
  const stage = document.getElementById('manifestoWordStage');
  const words = document.querySelectorAll('.manifesto-word');
  const spark = document.querySelector('.manifesto-path-spark');
  
  if (!section || !words.length) return;

  // 1. Efeito Spotlight & Acendimento de Linha por proximidade do cursor
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    section.style.setProperty('--manifesto-mouse-x', `${x}px`);
    section.style.setProperty('--manifesto-mouse-y', `${y}px`);

    // Calcula a proximidade vertical do mouse com o centro do palco (onde a linha fica)
    if (stage) {
      const stageRect = stage.getBoundingClientRect();
      const stageCenterY = stageRect.top - rect.top + stageRect.height / 2;
      const distY = Math.abs(y - stageCenterY);
      
      // Se o mouse estiver a menos de 220px da linha, ela brilha progressivamente
      let glowFactor = 1 - (distY / 220);
      glowFactor = Math.max(0.12, Math.min(1.0, glowFactor)); // Brilho base de 0.12 a 1.0
      section.style.setProperty('--manifesto-line-glow', glowFactor.toString());
    }
  }, { passive: true });

  // 2. Progresso de palavras e animação de linha no Scroll
  let ticking = false;

  const pinContainer = document.getElementById('manifesto-pin-container');

  const updateManifestoScroll = () => {
    const parentContainer = pinContainer || section;
    const rect = parentContainer.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    
    // Executa apenas se o container de pinning estiver visível
    if (rect.top < viewHeight && rect.bottom > 0) {
      // Como o parentContainer é o .manifesto-pin-container, a rolagem útil (pinning)
      // ocorre de fato a partir do momento em que o topo do container pai atinge o topo da tela (rect.top = 0)
      // até que a base do container pai chegue à base da tela (rect.bottom = viewHeight).
      const scrollRange = rect.height - viewHeight;
      
      // O progresso de scroll dentro do pinning varia de 0 a 1
      let progress = -rect.top / scrollRange;
      progress = Math.max(0, Math.min(1, progress)); // Clampa entre 0 e 1

      // Mapeamento dos slides:
      // De progress 0 a 0.88 transicionamos de forma linear as 7 palavras (indices de 0 a 6).
      // De progress 0.88 a 1.00 exibimos e fixamos o card final (indice 7).
      const transitionEndProgress = 0.88;
      
      let activeIndex = 0;
      if (progress >= transitionEndProgress) {
        activeIndex = 7; // Card final ativado
      } else {
        const norm = progress / transitionEndProgress; // Mapeia linearmente de 0 a 1
        activeIndex = Math.floor(norm * 7); // Mapeia para os índices de 0 a 6
        if (activeIndex > 6) activeIndex = 6;
      }

      // Calcula um wordProgress para manter os efeitos de transição das palavras e parallax suaves
      let wordProgress = 0;
      if (progress >= transitionEndProgress) {
        wordProgress = 0.99;
      } else {
        wordProgress = (progress / transitionEndProgress) * 0.85;
      }

      const totalWords = words.length;

      // 3. Atualiza a palavra ativa com transição de opacidade/escala e coreografia 3D horizontal
      words.forEach((word, index) => {
        word.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
        word.style.transform = '';
        
        // Verifica se é mobile para simplificar o layout e evitar sobreposição tridimensional lateral
        const isMobile = window.innerWidth < 768;

        if (index === activeIndex) {
          word.classList.add('active');
          if (word.classList.contains('manifesto-word-final')) {
            // Card final fica estático e centralizado para melhor legibilidade
            word.style.transform = 'scale(1) translateZ(0)';
          } else {
            const scrollFraction = (wordProgress * totalWords) - index; // De -0.5 a 0.5
            const parallaxOffset = scrollFraction * 20; 
            word.style.transform = `translateX(${parallaxOffset}px) scale(1.1) translateZ(0)`;
          }
        } else if (index === activeIndex - 1 && !isMobile) {
          word.classList.add('prev');
          const scrollFraction = (wordProgress * totalWords) - index; 
          const parallaxOffset = -190 + (scrollFraction * 20);
          word.style.transform = `translateX(${parallaxOffset}px) scale(0.78) rotate(-3.5deg) translateZ(0)`;
        } else if (index === activeIndex + 1 && !isMobile) {
          word.classList.add('next');
          const scrollFraction = (wordProgress * totalWords) - index;
          const parallaxOffset = 190 + (scrollFraction * 20);
          word.style.transform = `translateX(${parallaxOffset}px) scale(0.78) rotate(3.5deg) translateZ(0)`;
        } else if (index < activeIndex - 1 && !isMobile) {
          word.classList.add('far-prev');
          word.style.transform = `translateX(-380px) scale(0.55) translateZ(0)`;
        } else if (!isMobile) {
          word.classList.add('far-next');
          word.style.transform = `translateX(380px) scale(0.55) translateZ(0)`;
        } else {
          // No mobile, as palavras não ativas ficam totalmente ocultas
          word.classList.add('far-next');
          word.style.transform = `scale(0.5) translateZ(0)`;
        }
      });

      // 4. Sincroniza a faísca do rastro do SVG em sentidos dinâmicos
      if (spark) {
        const maxOffset = 1120;
        const minOffset = 220;
        // Corre até o final do rastro quando a transição de palavras acaba
        const sparkProgress = Math.min(1.0, progress / transitionEndProgress);
        const currentSparkOffset = maxOffset - (sparkProgress * (maxOffset - minOffset));
        spark.style.strokeDashoffset = currentSparkOffset;
      }
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateManifestoScroll();
      });
      ticking = true;
    }
  }, { passive: true });

  // Executa no resize para recalcular comportamento mobile se necessário
  window.addEventListener('resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateManifestoScroll();
      });
      ticking = true;
    }
  }, { passive: true });

  // Executa uma vez no carregamento para posicionamento correto
  updateManifestoScroll();
}

/**
 * Galeria de Liderança da Diretoria FNDD — Otimizada para Performance
 * 
 * Estratégia de performance:
 * - Event delegation: 1 listener no rail
 * - Click lock (debounce) de proteção para evitar clique-spam
 * - Pré-carregamento nativo no background (sem decode síncrono ou promessas que travam)
 * - Transição suave de fade via CSS classes com setTimeout no tempo correto do frame
 * - Zero reflow: troca de src e textContent instantânea
 */
function initDirectorsGallery() {
  const rail = document.getElementById('directorsRail');
  const featuredPanel = document.getElementById('featuredPanel');
  if (!rail || !featuredPanel) return;

  // Referências DOM cacheadas (buscadas UMA vez)
  const featuredImg = document.getElementById('featuredImg');
  const featuredName = document.getElementById('featuredName');
  const featuredRole = document.getElementById('featuredRole');
  const featuredBio = document.getElementById('featuredBio');
  const featuredNum = document.getElementById('featuredNum');
  const bioWrapper = document.getElementById('bioWrapper');

  // 1. Pré-carregamento assíncrono nativo de todas as fotos na inicialização
  const railItems = rail.querySelectorAll('.rail-item');
  railItems.forEach(item => {
    const imgUrl = item.dataset.img;
    if (imgUrl) {
      const imgObj = new Image();
      imgObj.src = imgUrl; // Força o browser a colocar no cache HTTP
    }
  });

  // 2. Lock de proteção contra cliques repetidos
  let isLocked = false;

  // 3. Event delegation — Um único listener para cliques
  rail.addEventListener('click', (e) => {
    const item = e.target.closest('.rail-item');
    if (!item || item.classList.contains('active') || isLocked) return;

    isLocked = true;

    // Dados do item selecionado
    const name = item.dataset.name;
    const role = item.dataset.role;
    const bio = item.dataset.bio;
    const img = item.dataset.img;
    const num = item.dataset.num;

    // Ativa classe para otimizar renderizações do canvas se necessário
    document.body.classList.add('is-switching-director');

    // Inicia animação de fade-out do painel principal (rápida e fluida)
    featuredPanel.classList.add('updating');

    // Aguarda o término do fade-out rápido (90ms) para trocar os conteúdos
    setTimeout(() => {
      // Atualiza imagem
      if (featuredImg) {
        featuredImg.src = img;
        featuredImg.alt = name;
      }

      // Atualiza textos
      if (featuredName) featuredName.textContent = name;
      if (featuredRole) featuredRole.textContent = role;
      if (featuredBio) featuredBio.textContent = bio;
      if (featuredNum) featuredNum.textContent = num;

      // Reseta o scroll da bio para o topo
      if (bioWrapper) bioWrapper.scrollTop = 0;

      // Atualiza estado ativo no menu lateral (rail)
      const prevActive = rail.querySelector('.rail-item.active');
      if (prevActive) prevActive.classList.remove('active');
      item.classList.add('active');

      // Centraliza o item clicado no trilho
      scrollRailToItem(item);

      // Inicia animação de fade-in usando requestAnimationFrame duplo (evita jank)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          featuredPanel.classList.remove('updating');

          // Desativa o switch lock após a transição terminar (rápido e fluído)
          setTimeout(() => {
            document.body.classList.remove('is-switching-director');
            isLocked = false;
          }, 120);
        });
      });
    }, 90);
  });

  /**
   * Centraliza o item clicado no trilho (vertical no desktop, horizontal no mobile)
   */
  function scrollRailToItem(item) {
    const isMobile = window.innerWidth < 992;

    if (isMobile) {
      const targetLeft = item.offsetLeft - (rail.clientWidth / 2) + (item.clientWidth / 2);
      rail.scrollTo({ left: targetLeft, behavior: 'smooth' });
    } else {
      const targetTop = item.offsetTop - (rail.clientHeight / 2) + (item.clientHeight / 2);
      rail.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }
}

/**
 * Adiciona um Spotlight (efeito holofote de palco) sutil que segue o cursor do mouse
 * nas superfícies e bordas do painel destacado de membros da diretoria, sem rotações tridimensionais.
 */
function initFeaturedPanelSpotlight() {
  const panel = document.getElementById('featuredPanel');
  if (!panel) return;

  panel.addEventListener('mousemove', (e) => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Injeta as variáveis customizadas do mouse no estilo do painel
    panel.style.setProperty('--panel-mouse-x', `${x}px`);
    panel.style.setProperty('--panel-mouse-y', `${y}px`);
  }, { passive: true });

  panel.addEventListener('mouseleave', () => {
    panel.style.setProperty('--panel-mouse-x', `-999px`);
    panel.style.setProperty('--panel-mouse-y', `-999px`);
  });
}

/**
 * Inicialização dos efeitos 3D Premium e de Spotlight Dinâmico nos Cards de Eventos.
 * Fornece inclinação 3D sutil que acompanha o cursor (3D Tilt Effect) e atualiza 
 * coordenadas para os glows e bordas brilhantes.
 */
function initEventsInteractiveCards() {
  const cards = document.querySelectorAll('.station-card, .station-card-highlight, .events-cta-simple');
  
  if (cards.length === 0) return;
  
  // Desativa em dispositivos móveis por questões de performance e acessibilidade táctil
  if (window.innerWidth < 992) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Coordenada X relativa ao card
      const y = e.clientY - rect.top;  // Coordenada Y relativa ao card
      
      // Injeta as coordenadas como CSS Variables para glows em CSS
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Calcula a porcentagem do cursor de -0.5 a 0.5
      const xc = ((x / rect.width) - 0.5);
      const yc = ((y / rect.height) - 0.5);
      
      // Define a inclinação máxima (ex: 3 graus para o CTA grande, 5 para os cartões menores)
      const maxTilt = card.classList.contains('events-cta-simple') ? 3 : 5;
      
      // Ângulo de rotação invertido para acompanhar de forma intuitiva
      const rotateX = yc * -maxTilt;
      const rotateY = xc * maxTilt;
      
      // Aplica a transformação 3D com transição suave
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    }, { passive: true });

    // Reset ao retirar o mouse
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', `-999px`);
      card.style.setProperty('--mouse-y', `-999px`);
      card.style.transform = '';
    });
  });
}

/**
 * Inicializa a interatividade do Acordeão de FAQ Premium.
 * Realiza transições suaves usando scrollHeight dinâmico e suporta acessibilidade (ARIA).
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

      // Fecha todos os outros itens ativos para manter a interface limpa e premium
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Alterna o estado do item atual
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Atualiza as alturas dos itens ativos no redimensionamento da janela
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('active')) {
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });
}

