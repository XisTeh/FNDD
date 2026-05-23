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
  initGlobalBgParallax();
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
  const cards = document.querySelectorAll('.float-metric-card, .step-card-glass');
  
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
 * Lógica do Efeito Parallax de Scroll nos Elementos de Background Global (Movimento Dourado)
 */
function initGlobalBgParallax() {
  const traceOne = document.querySelector('.trace-one');
  const traceTwo = document.querySelector('.trace-two');
  const hazeOne = document.querySelector('.site-haze-one');
  const hazeTwo = document.querySelector('.site-haze-two');
  const particlesOne = document.querySelector('.site-particles-one');
  const particlesTwo = document.querySelector('.site-particles-two');
  
  let ticking = false;
  
  function updateBgParallax() {
    // Reage apenas no desktop para evitar overhead de performance em dispositivos móveis
    if (window.innerWidth < 1024) return;
    
    const scrollY = window.scrollY;
    
    // Parallax sutil nos rastros cinéticos
    if (traceOne) {
      traceOne.style.transform = `translateY(${scrollY * 0.05}px) rotate(${-22 + scrollY * 0.003}deg)`;
    }
    if (traceTwo) {
      traceTwo.style.transform = `translateY(${scrollY * -0.03}px) rotate(${32 - scrollY * 0.003}deg)`;
    }
    
    // Parallax sutil nos glows
    if (hazeOne) {
      hazeOne.style.transform = `translateY(${scrollY * 0.07}px)`;
    }
    if (hazeTwo) {
      hazeTwo.style.transform = `translateY(${scrollY * -0.04}px)`;
    }
    
    // Parallax sutil nas poeiras/partículas de palco
    if (particlesOne) {
      particlesOne.style.transform = `translateY(${scrollY * -0.05}px)`;
    }
    if (particlesTwo) {
      particlesTwo.style.transform = `translateY(${scrollY * 0.05}px)`;
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateBgParallax();
      });
      ticking = true;
    }
  }, { passive: true });
}
