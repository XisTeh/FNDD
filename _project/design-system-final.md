# Design System FNDD — Federação Nacional de Danças Desportivas

Este documento define o **Design System Visual Premium** da FNDD. Ele serve como base conceitual, visual e de engenharia para a criação das futuras interfaces do site institucional da Federação, garantindo autoridade, sofisticação e fluidez de movimento.

---

## 1. Conceito Criativo e Direção Visual

A identidade visual da FNDD é fundamentada no conceito da **Dança como Esporte, Profissão e Movimento Nacional**. O objetivo é equilibrar a rigidez institucional de uma federação nacional com a fluidez, a expressividade artística e a emoção do palco.

*   **Palavras-chave:** Federação, Arte, Esporte, Movimento, Prestígio, Credibilidade.
*   **O que transmitir:** Autoridade máxima no segmento, profissionalismo, elegância, dinamismo, orgulho nacional.
*   **O que evitar:** Visual amador ou genérico, visual de "balada" ou festa noturna informal, excesso de dourado reluzente sem contraste (estilo brega), cards 2D achatados e sem profundidade, ausência de microinterações.

---

## 2. Paleta de Cores e Tokens CSS

Para alcançar a sensação premium institucional, a paleta utiliza tons profundos de cinza e preto com acentos de dourado refinado e texturas de luz controladas.

```css
:root {
  /* Tons Neutros de Fundo */
  --bg-deep: #070708;       /* Preto profundo para máxima imersão */
  --bg-surface: #121214;    /* Superfície primária para cards e seções */
  --bg-surface-alt: #18181C;/* Superfície secundária */
  
  /* Cores de Destaque (Dourado Premium) */
  --gold-primary: #C5A85A;  /* Dourado institucional fosco */
  --gold-glow: #F1D487;     /* Dourado claro para brilho e estados ativos */
  --gold-dark: #8F6E2C;     /* Dourado escuro para bordas e gradientes */
  --gold-bg: rgba(197, 168, 90, 0.03); /* Fundo com tom dourado extremamente sutil */
  
  /* Cores Auxiliares */
  --text-primary: #F8F9FA;  /* Branco off-white para ótima legibilidade */
  --text-secondary: #A0A5B5;/* Cinza azulado suave para subtítulos e descrições */
  --text-muted: #6C7284;    /* Cinza escuro para detalhes adicionais */
  
  /* Efeitos e Bordas */
  --border-glass: rgba(255, 255, 255, 0.05);
  --border-gold-glass: rgba(197, 168, 90, 0.15);
  --shadow-premium: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
  --shadow-gold: 0 0 30px rgba(197, 168, 90, 0.15);
  
  /* Transições padrão */
  --transition-smooth: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-bounce: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 3. Tipografia

A tipografia do projeto utiliza fontes modernas com excelente legibilidade e personalidade forte:

*   **Títulos (Headings):** `Outfit` (Sans-serif geométrica de alta personalidade, com largura ampla que expressa sofisticação e presença institucional).
*   **Texto Corrido (Body text):** `Inter` ou `Plus Jakarta Sans` (Clara, moderna e legível mesmo em tamanhos reduzidos).

### Escala Tipográfica (Rem com base em 16px):

*   **Display / Hero H1:** `3.5rem` a `5rem` (56px a 80px) | `font-weight: 700` | `letter-spacing: -0.03em` | `line-height: 1.05`
*   **H2 (Títulos de Seção):** `2.5rem` a `3rem` (40px a 48px) | `font-weight: 600` | `letter-spacing: -0.02em` | `line-height: 1.15`
*   **H3 (Subseções/Cards):** `1.5rem` a `1.75rem` (24px a 28px) | `font-weight: 600` | `line-height: 1.25`
*   **H4 (Títulos Menores):** `1.25rem` (20px) | `font-weight: 600`
*   **Body Large:** `1.125rem` (18px) | `font-weight: 300` ou `400` | `line-height: 1.6`
*   **Body:** `1rem` (16px) | `font-weight: 400` | `line-height: 1.6`
*   **Body Small / Caption:** `0.875rem` (14px) | `font-weight: 400` | `line-height: 1.5`
*   **Eyebrow / Overline:** `0.75rem` (12px) | `font-weight: 600` | `text-transform: uppercase` | `letter-spacing: 0.15em`

---

## 4. Superfícies, Gradientes e Efeitos Visuais

O Design System conta com superfícies ricas em camadas e texturas exclusivas, simulando a iluminação de um palco e a tridimensionalidade de uma federação premium:

1.  **Textura de Ruído Orgânico (Noise Overlay):** Uma camada de ruído estético aplicada globalmente (`opacity: 0.02`) para suavizar gradientes digitais e conferir grão analógico de altíssimo prestígio.
2.  **Cursor Customizado Lag-Interpolado:** Um cursor de design minimalista (anel de 40px com ponto interno) que segue o cursor físico com uma interpolação linear suave (lerp) em JavaScript, criando atrito visual dinâmico.
3.  **Molduras Institucionais Finais:** Moldura de 1px a 20px das bordas com cantoneiras de destaque nos cantos para simular medalhas, certificados e insígnias.
4.  **Orbes Dourados Flutuantes (Glow Orbs):** Duas grandes fontes de brilho radial (`blur(120px)`) em tons dourados que orbitam o plano de fundo da Hero de forma contínua por meio de `@keyframes floatOrb`.
5.  **Varredura de Holofote (Stage Sweeper Beam):** Uma faixa gradiente dourada que cruza diagonalmente o fundo da hero ciclicamente, simulando um holofote de teatro em movimento.
6.  **Spotlight Interativo (Flashlight):** Uso de coordenadas CSS customizadas `--mouse-x` e `--mouse-y` atualizadas via JavaScript para criar um feixe de luz que segue o cursor nas bordas e superfícies dos cartões.
7.  **Painel de Vidro (Glassmorphism):**
    ```css
    .glass-panel {
      background: rgba(18, 18, 20, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass);
    }
    ```

---

## 5. Botões e Microinterações

Cada chamada para ação (CTA) deve ter uma resposta tátil e visual clara, sem alterar abruptamente a paleta de cores.

1.  **Botão Primário (Gold Shimmer):** Dourado refinado, com uma máscara linear que reflete luz em hover (efeito Shimmer).
2.  **Botão Secundário (Outline Premium):** Borda sutil de 1px com gradiente de dourado e transparência. Ao passar o mouse, a cor preenche o fundo de forma suave com deslocamento leve do ícone indicador.
3.  **Botão WhatsApp / Contato de Emergência:** Fundo verde esmeralda institucional profundo ou dourado com ícone vibrante, usando uma animação pulse suave no ícone para capturar atenção.

---

## 6. Componentes e Estrutura de Cards

Os cards não devem parecer chapados. Eles utilizam `border-radius: 12px` ou `16px` com bordas sutis e sombras profundas.

*   **Cards de Pilares:** Apresentam o título e uma descrição curta com um ícone linear dourado. Em hover, elevam-se sutilmente (`translateY(-6px)`) com um aumento gradual do brilho (glow) de fundo.
*   **Cards de Equipe (Diretoria):** Exibem a foto oficial em tons elegantes (opcionalmente com filtro desaturado), com sobreposição gradiente preta na base para garantir leitura impecável do nome e cargo do diretor.
*   **Cards de Eventos / Cursos:** Estruturados com tags de categoria na parte superior, datas em destaque geométrico e transição de zoom suave na imagem de fundo em hover.

---

## 7. Motion & Animações

O movimento na FNDD representa a própria essência da dança: fluidez, precisão e elegância. Animações rítmicas e coordenadas no CSS dão vida ao visual:

*   **Shine Gold Text:** O título principal reluz de forma metálica infinitamente através do deslocamento do seu gradiente dourado via `@keyframes`.
*   **Glow Pulse e Bounces:** Brilhos lentos (`@keyframes glowPulse`) e pulsações suaves em botões e seções de alta relevância capturam a atenção de forma elegante e rítmica.
*   **Hover Lifts & Transições:** Cartões, links e botões utilizam a curva `cubic-bezier(0.16, 1, 0.3, 1)` para deslocamento vertical (`translateY`) e expansão suave de sombras, imitando o tempo de atrito natural e precisão das danças desportivas.
*   **Staggered Entry (Cascata sutil):** Utilização de pequenos atrasos no CSS (`transition-delay` ou `animation-delay`) para coordenar a aparição sequencial de elementos em listas e grids.

---

## 8. Tradução para Frameworks Modernos (React / Next.js / Tailwind)

Para quando o site real for desenvolvido em React ou Tailwind CSS, o mapeamento dos tokens é simples:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        fndd: {
          bg: '#070708',
          surface: '#121214',
          'surface-alt': '#18181C',
          gold: '#C5A85A',
          'gold-glow': '#F1D487',
          'gold-dark': '#8F6E2C',
        }
      },
      fontFamily: {
        title: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'stage-glow': 'radial-gradient(circle at center, rgba(197, 168, 90, 0.08) 0%, transparent 70%)',
      }
    }
  }
}
```

---

## 9. Regras para o Desenvolvimento Dobra por Dobra

1.  **Não crie páginas inteiras de uma vez:** A construção do site deve ser modular e focada no refinamento pixel-perfect de cada dobra.
2.  **Consistência Absoluta:** Nenhuma nova seção pode usar cores ou fontes fora das variáveis e diretrizes declaradas.
3.  **Foco em Microinterações:** Todos os elementos clicáveis devem responder de alguma forma (mudança suave de background, translate discreto ou brilho de borda).
4.  **Uso de Imagens:** Fotos da diretoria e da dança devem passar por filtros consistentes de cores e proporções geométricas douradas.


