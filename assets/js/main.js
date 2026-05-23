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
  const cards = document.querySelectorAll('.float-metric-card, .step-card-glass, .pillar-panel');
  
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
  
  // Loop de animação de interpolação física rodando a 60fps via rAF
  function updateInteractiveElements() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    
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
  const PARTICLE_COUNT = 80; // Quantidade boa sem peso
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
    
    // --- Desenhar RASTROS CURVOS dourados ---
    tracePhase += 0.0003;
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = 'rgba(197, 168, 90, 0.6)';
    ctx.lineWidth = 1;
    
    // Curva 1 (canto superior esquerdo)
    ctx.beginPath();
    const cx1 = W * 0.2 + Math.sin(tracePhase) * 40 + mnx * 20;
    const cy1 = H * 0.15 + Math.cos(tracePhase * 0.7) * 20 + mny * 15;
    ctx.arc(cx1, cy1, 350 + Math.sin(tracePhase * 2) * 20, -0.5, 1.5);
    ctx.stroke();
    
    // Curva 2 (canto inferior direito)
    ctx.strokeStyle = 'rgba(197, 168, 90, 0.5)';
    ctx.beginPath();
    const cx2 = W * 0.85 + Math.sin(tracePhase + 2) * 30 - mnx * 15;
    const cy2 = H * 0.75 + Math.cos(tracePhase * 0.5 + 1) * 25 - mny * 10;
    ctx.arc(cx2, cy2, 400 + Math.sin(tracePhase * 1.5) * 25, 2, 4.5);
    ctx.stroke();
    
    // Linhas tracejadas paralelas
    ctx.setLineDash([6, 8]);
    ctx.globalAlpha = 0.04;
    ctx.beginPath();
    ctx.arc(cx1, cy1, 370, -0.5, 1.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx2, cy2, 420, 2, 4.5);
    ctx.stroke();
    ctx.setLineDash([]);
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
      if (p.hasGlow) {
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
    
    requestAnimationFrame(animate);
  }
  
  animate();
}
