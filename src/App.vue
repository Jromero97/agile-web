<template lang="pug">
  .scene
    img#logo(src="./assets/agile-shift-logo.svg")
    router-view
</template>

<script>
  // import Cursor from '@/assets/js/cursor';

  export default {
    name: 'app',
    mounted() {
      const body = document.querySelector('body');
      // const scene = document.querySelector('.scene');
      const light = document.querySelector('.light');
      const lightInner = document.querySelector('.light-inner');
      const shadow = document.querySelector('.shadow');
      const shadowInner = document.querySelector('.shadow-inner');
      const lightclick = document.querySelector('.lightclick');
      const lightclickInner = document.querySelector('.lightclick-inner');
      // const links = document.querySelectorAll('a');
      const animation = false;
      // var timeout;

      const settings = {
        smoothness: 4,
        snapScale: 1.8,
        maxSnapScale: 6,
        defaultScale: 50, // size of the ball in px (needed for calculations)
      };

      const state = {
        movementSmoothness: 4,
        rotation: 0,
        currentX: 0,
        currentY: 0,
        currentScale: 1,
        clientX: 0,
        clientY: 0,
        clientScale: 1,
        target: null,
        targetScaleMultiplier: 0,
      };

      function move(e) {
        if (!animation && (e.clientX)) {
          // position of the mouse based on the window
          const mouseX = (e.clientX);
          const mouseY = (e.clientY);

          if (state.transition) {
            state.clientScale = state.transition;
          } else if (state.target) {
            state.clientScale = state.target.scale;
          } else {
            state.clientScale = 1;
          }

          // get the target position, usualy the mouse position if not snapping
          state.clientX = state.target ? state.target.x : (mouseX); // mouse X position or snap target
          state.clientY = state.target ? state.target.y : (mouseY); // mouse Y position or snap target
        }
      }

      // function moveScroll(e) {
        // get the target position, usualy the mouse position if not snapping
        // state.clientX = state.rawClientX; // mouse X position or snap target
        // state.clientY = state.rawClientY; // mouse Y position or snap target
      // }

      function snap() {
        const offset = $(this).offset();

        // how far the page has scrolled
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        let scale = Math.min(
          Math.max(this.offsetWidth, this.offsetHeight)
          / (settings.defaultScale * settings.snapScale, settings.maxSnapScale),
        );

        if ($(this).data('snap-scale') !== undefined) {
          scale = $(this).data('snap-scale');
        }

        state.movementSmoothness = settings.smoothness;
        state.target = {
          x: (offset.left + ((this.offsetWidth / 2) - scrollX)),
          y: (offset.top + ((this.offsetHeight / 2) - scrollY)),
          scale,
        };
        state.clientX = state.target.x;
        state.clientY = state.target.y;
        state.clientScale = state.target.scale;
      }

      function unsnap() {
        state.target = null;
        setTimeout(() => {
          state.movementSmoothness = 4;
        }, 500);
      }

      function click() {
        // click anim
        $(lightclickInner).addClass('active');

        const isSafariMac = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
          && (navigator.appVersion.indexOf('Mac') !== -1);

        // upscale halo
        if ($(this).hasClass('js-upscale') && !isSafariMac) {
          state.transition = 50;
          $(lightInner).removeClass('downscaling').addClass('upscaling');
          $(shadowInner).removeClass('downscaling').addClass('upscaling');
          state.clientScale = state.transition;
          setTimeout(() => {
            $(lightInner).removeClass('upscaling').addClass('downscaling');
            $(shadowInner).removeClass('upscaling').addClass('downscaling');
            setTimeout(() => {
              $(lightInner).removeClass('downscaling');
              $(shadowInner).removeClass('downscaling');
              state.transition = 0;
              state.clientScale = 1;
            }, 1000);
          }, 1250);
        }

        setTimeout(unsnap, 500);
        setTimeout(() => {
          $(lightclickInner).removeClass('active');
        }, 1000);
      }

      unsnap();

      setTimeout(() => {
        state.transition = 0;
        state.clientScale = 0.01;
      }, 1500);
      const supportsCssVariables = (window.CSS && window.CSS.supports && window.CSS.supports('--fake-var', 0));

      function repeatOften() {
        // set state
        state.currentX = +(state.currentX +
          ((state.clientX - state.currentX) / state.movementSmoothness)).toFixed(2);
        state.currentY = +(state.currentY +
          ((state.clientY - state.currentY) / state.movementSmoothness)).toFixed(2);
        state.currentScale = state.clientScale;
        if (supportsCssVariables) {
          // set the css variables
          light.style.setProperty('--x', `${state.currentX}px`);
          light.style.setProperty('--y', `${state.currentY}px`);
          lightInner.style.setProperty('--scale', (state.currentScale).toFixed(2));
          // lightInner.style.setProperty('--scaleY', (state.currentScale).toFixed(2));

          shadow.style.setProperty('--x', `${state.currentX}px`);
          shadow.style.setProperty('--y', `${state.currentY}px`);
          shadowInner.style.setProperty('--scale', (state.currentScale).toFixed(2));
          // shadowInner.style.setProperty('--scaleY', (state.currentScale).toFixed(2));

          lightclick.style.setProperty('--x', `${state.currentX}px`);
          lightclick.style.setProperty('--y', `${state.currentY}px`);
          // lightclickInner.style.setProperty('--scaleX', (state.currentScale).toFixed(2));
          // lightclickInner.style.setProperty('--scaleY', (state.currentScale).toFixed(2));
        } else {
          light.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;
          lightInner.style.transform = `scale(${(state.currentScale).toFixed(2)})`;

          shadow.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;
          shadowInner.style.transform = `scale(${(state.currentScale).toFixed(2)})`;

          lightclick.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;
        }

        requestAnimationFrame(repeatOften);
      }

      requestAnimationFrame(repeatOften);

      function init() {
        $('.light,.shadow,.lightclick').show();
        if (window.PointerEvent) {
          body.removeEventListener('pointermove', init);
        } else {
          body.removeEventListener('mousemove', init);
        }
      }

      if (window.PointerEvent) {
        body.addEventListener('pointermove', init);
        body.addEventListener('pointermove', move);
      } else {
        body.addEventListener('mousemove', init);
        body.addEventListener('mousemove', move);
      }

      // document.addEventListener("scroll", moveScroll);

      $('body').delegate('.snapCursor', 'mouseenter', snap);
      $('body').delegate('.snapCursor', 'mouseleave', unsnap);
      $('body').delegate('.snapCursor, .js-upscale', 'click', click);
      $('body').delegate('.snapCursor', 'focus', snap);
      $('body').delegate('.snapCursor', 'blur', unsnap);

      $('.light,.shadow,.lightclick').one('pointermove', () => {
        this.style.display = 'block';
      });

      $('body').bind('unsnap', () => {
        unsnap();
      });
    },
  };
</script>

<style>

  #logo{
    width:20%;
  }

  .scene {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }

  @media print {
    *,*::before,*::after {
      text-shadow: none !important;
      box-shadow: none !important
    }

    a,a:visited {
      text-decoration: underline
    }

    abbr[title]::after {
      content: " (" attr(title) ")"
    }

    pre {
      white-space: pre-wrap !important
    }

    pre,blockquote {
      border: 1px solid #999;
      page-break-inside: avoid
    }

    thead {
      display: table-header-group
    }

    tr,img {
      page-break-inside: avoid
    }

    p,h2,h3 {
      orphans: 3;
      widows: 3
    }

    h2,h3 {
      page-break-after: avoid
    }

    .navbar {
      display: none
    }

    .badge {
      border: 1px solid #000
    }

    .table {
      border-collapse: collapse !important
    }

    .table td,.table th {
      background-color: #fff !important
    }

    .table-bordered th,.table-bordered td {
      border: 1px solid #ddd !important
    }
  }

  *,*::before,*::after {
    box-sizing: border-box
  }

  html {
    font-family: sans-serif;
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -ms-overflow-style: scrollbar;
    -webkit-tap-highlight-color: transparent
  }

  @-ms-viewport {
    width: device-width
  }

  article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section {
    display: block
  }

  body {
    margin: 0;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5;
    color: #4c4d58;
    text-align: left;
    background-color: #f5f5f5
  }

  [tabindex="-1"]:focus {
    outline: none !important
  }

  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible
  }

  h1,h2,h3,h4,h5,h6 {
    margin-top: 0;
    margin-bottom: .5rem
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem
  }

  abbr[title],abbr[data-original-title] {
    text-decoration: underline;
    text-decoration: underline dotted;
    cursor: help;
    border-bottom: 0
  }

  address {
    margin-bottom: 1rem;
    font-style: normal;
    line-height: inherit
  }

  ol,ul,dl {
    margin-top: 0;
    margin-bottom: 1rem
  }

  ol ol,ul ul,ol ul,ul ol {
    margin-bottom: 0
  }

  dt {
    font-weight: bold
  }

  dd {
    margin-bottom: .5rem;
    margin-left: 0
  }

  blockquote {
    margin: 0 0 1rem
  }

  dfn {
    font-style: italic
  }

  b,strong {
    font-weight: bolder
  }

  small {
    font-size: 80%
  }

  sub,sup {
    position: relative;
    font-size: 75%;
    line-height: 0;
    vertical-align: baseline
  }

  sub {
    bottom: -.25em
  }

  sup {
    top: -.5em
  }

  a {
    color: #007bff;
    text-decoration: none;
    background-color: transparent;
    -webkit-text-decoration-skip: objects
  }

  a:hover {
    color: #0056b3;
    text-decoration: underline
  }

  a:not([href]):not([tabindex]) {
    color: inherit;
    text-decoration: none
  }

  a:not([href]):not([tabindex]):focus,a:not([href]):not([tabindex]):hover {
    color: inherit;
    text-decoration: none
  }

  a:not([href]):not([tabindex]):focus {
    outline: 0
  }

  pre,code,kbd,samp {
    font-family: monospace, monospace;
    font-size: 1em
  }

  pre {
    margin-top: 0;
    margin-bottom: 1rem;
    overflow: auto
  }

  figure {
    margin: 0 0 1rem
  }

  img {
    vertical-align: middle;
    border-style: none
  }

  svg:not(:root) {
    overflow: hidden
  }

  a,area,button,[role="button"],input,label,select,summary,textarea {
    touch-action: manipulation
  }

  table {
    border-collapse: collapse
  }

  caption {
    padding-top: .75rem;
    padding-bottom: .75rem;
    color: #868e96;
    text-align: left;
    caption-side: bottom
  }

  th {
    text-align: inherit
  }

  label {
    display: inline-block;
    margin-bottom: .5rem
  }

  button:focus {
    outline: 1px dotted;
    outline: 5px auto -webkit-focus-ring-color
  }

  input,button,select,optgroup,textarea {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit
  }

  button,input {
    overflow: visible
  }

  button,select {
    text-transform: none
  }

  button,html [type="button"],[type="reset"],[type="submit"] {
    -webkit-appearance: button
  }

  button::-moz-focus-inner,[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner {
    padding: 0;
    border-style: none
  }

  input[type="radio"],input[type="checkbox"] {
    box-sizing: border-box;
    padding: 0
  }

  input[type="date"],input[type="time"],input[type="datetime-local"],input[type="month"] {
    -webkit-appearance: listbox
  }

  textarea {
    overflow: auto;
    resize: vertical
  }

  fieldset {
    min-width: 0;
    padding: 0;
    margin: 0;
    border: 0
  }

  legend {
    display: block;
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin-bottom: .5rem;
    font-size: 1.5rem;
    line-height: inherit;
    color: inherit;
    white-space: normal
  }

  progress {
    vertical-align: baseline
  }

  [type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button {
    height: auto
  }

  [type="search"] {
    outline-offset: -2px;
    -webkit-appearance: none
  }

  [type="search"]::-webkit-search-cancel-button,[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none
  }

  ::-webkit-file-upload-button {
    font: inherit;
    -webkit-appearance: button
  }

  output {
    display: inline-block
  }

  summary {
    display: list-item
  }

  template {
    display: none
  }

  [hidden] {
    display: none !important
  }

  h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6 {
    margin-bottom: .5rem;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: #262633
  }

  h1,.h1 {
    font-size: 2.5rem
  }

  h2,.h2 {
    font-size: 2rem
  }

  h3,.h3 {
    font-size: 1.75rem
  }

  h4,.h4 {
    font-size: 1.5rem
  }

  h5,.h5 {
    font-size: 1.25rem
  }

  h6,.h6 {
    font-size: 1rem
  }

  .lead {
    font-size: 1.25rem;
    font-weight: 300
  }

  .display-1 {
    font-size: 6rem;
    font-weight: 300;
    line-height: 1.1
  }

  .display-2 {
    font-size: 5.5rem;
    font-weight: 300;
    line-height: 1.1
  }

  .display-3 {
    font-size: 4.5rem;
    font-weight: 300;
    line-height: 1.1
  }

  .display-4 {
    font-size: 3.5rem;
    font-weight: 300;
    line-height: 1.1
  }

  hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: 0;
    border-top: 1px solid rgba(4,5,21,0.1)
  }

  small,.small {
    font-size: 80%;
    font-weight: normal
  }

  mark,.mark {
    padding: .2em;
    background-color: #fcf8e3
  }

  .list-unstyled {
    padding-left: 0;
    list-style: none
  }

  .list-inline {
    padding-left: 0;
    list-style: none
  }

  .list-inline-item {
    display: inline-block
  }

  .list-inline-item:not(:last-child) {
    margin-right: 5px
  }

  .initialism {
    font-size: 90%;
    text-transform: uppercase
  }

  .blockquote {
    margin-bottom: 1rem;
    font-size: 1.25rem
  }

  .blockquote-footer {
    display: block;
    font-size: 80%;
    color: #868e96
  }

  .blockquote-footer::before {
    content: "\2014 \00A0"
  }

  .img-fluid {
    max-width: 100%;
    height: auto
  }

  .img-thumbnail {
    padding: .25rem;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: .25rem;
    transition: all 0.2s ease-in-out;
    max-width: 100%;
    height: auto
  }

  .figure {
    display: inline-block
  }

  .figure-img {
    margin-bottom: .5rem;
    line-height: 1
  }

  .figure-caption {
    font-size: 90%;
    color: #868e96
  }

  .container {
    margin-right: auto;
    margin-left: auto;
    padding-right: 20px;
    padding-left: 20px;
    width: 100%
  }

  @media (min-width: 576px) {
    .container {
      max-width:540px
    }
  }

  @media (min-width: 768px) {
    .container {
      max-width:720px
    }
  }

  @media (min-width: 992px) {
    .container {
      max-width:960px
    }
  }

  @media (min-width: 1240px) {
    .container {
      max-width:1200px
    }
  }

  .container-fluid {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 20px;
    padding-left: 20px;
    width: 100%
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -20px;
    margin-left: -20px
  }

  .no-gutters {
    margin-right: 0;
    margin-left: 0
  }

  .no-gutters>.col,.no-gutters>[class*="col-"] {
    padding-right: 0;
    padding-left: 0
  }

  .col-1,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-10,.col,.col-auto,.col-sm-1,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-10,.col-sm,.col-sm-auto,.col-md-1,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-10,.col-md,.col-md-auto,.col-lg-1,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-10,.col-lg,.col-lg-auto,.col-xl-1,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-10,.col-xl,.col-xl-auto {
    position: relative;
    width: 100%;
    min-height: 1px;
    padding-right: 20px;
    padding-left: 20px
  }

  .col {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%
  }

  .col-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: none
  }

  .col-1 {
    flex: 0 0 10%;
    max-width: 10%
  }

  .col-2 {
    flex: 0 0 20%;
    max-width: 20%
  }

  .col-3 {
    flex: 0 0 30%;
    max-width: 30%
  }

  .col-4 {
    flex: 0 0 40%;
    max-width: 40%
  }

  .col-5 {
    flex: 0 0 50%;
    max-width: 50%
  }

  .col-6 {
    flex: 0 0 60%;
    max-width: 60%
  }

  .col-7 {
    flex: 0 0 70%;
    max-width: 70%
  }

  .col-8 {
    flex: 0 0 80%;
    max-width: 80%
  }

  .col-9 {
    flex: 0 0 90%;
    max-width: 90%
  }

  .col-10 {
    flex: 0 0 100%;
    max-width: 100%
  }

  .order-1 {
    order: 1
  }

  .order-2 {
    order: 2
  }

  .order-3 {
    order: 3
  }

  .order-4 {
    order: 4
  }

  .order-5 {
    order: 5
  }

  .order-6 {
    order: 6
  }

  .order-7 {
    order: 7
  }

  .order-8 {
    order: 8
  }

  .order-9 {
    order: 9
  }

  .order-10 {
    order: 10
  }

  @media (min-width: 576px) {
    .col-sm {
      flex-basis:0;
      flex-grow: 1;
      max-width: 100%
    }

    .col-sm-auto {
      flex: 0 0 auto;
      width: auto;
      max-width: none
    }

    .col-sm-1 {
      flex: 0 0 10%;
      max-width: 10%
    }

    .col-sm-2 {
      flex: 0 0 20%;
      max-width: 20%
    }

    .col-sm-3 {
      flex: 0 0 30%;
      max-width: 30%
    }

    .col-sm-4 {
      flex: 0 0 40%;
      max-width: 40%
    }

    .col-sm-5 {
      flex: 0 0 50%;
      max-width: 50%
    }

    .col-sm-6 {
      flex: 0 0 60%;
      max-width: 60%
    }

    .col-sm-7 {
      flex: 0 0 70%;
      max-width: 70%
    }

    .col-sm-8 {
      flex: 0 0 80%;
      max-width: 80%
    }

    .col-sm-9 {
      flex: 0 0 90%;
      max-width: 90%
    }

    .col-sm-10 {
      flex: 0 0 100%;
      max-width: 100%
    }

    .order-sm-1 {
      order: 1
    }

    .order-sm-2 {
      order: 2
    }

    .order-sm-3 {
      order: 3
    }

    .order-sm-4 {
      order: 4
    }

    .order-sm-5 {
      order: 5
    }

    .order-sm-6 {
      order: 6
    }

    .order-sm-7 {
      order: 7
    }

    .order-sm-8 {
      order: 8
    }

    .order-sm-9 {
      order: 9
    }

    .order-sm-10 {
      order: 10
    }
  }

  @media (min-width: 768px) {
    .col-md {
      flex-basis:0;
      flex-grow: 1;
      max-width: 100%
    }

    .col-md-auto {
      flex: 0 0 auto;
      width: auto;
      max-width: none
    }

    .col-md-1 {
      flex: 0 0 10%;
      max-width: 10%
    }

    .col-md-2 {
      flex: 0 0 20%;
      max-width: 20%
    }

    .col-md-3 {
      flex: 0 0 30%;
      max-width: 30%
    }

    .col-md-4 {
      flex: 0 0 40%;
      max-width: 40%
    }

    .col-md-5 {
      flex: 0 0 50%;
      max-width: 50%
    }

    .col-md-6 {
      flex: 0 0 60%;
      max-width: 60%
    }

    .col-md-7 {
      flex: 0 0 70%;
      max-width: 70%
    }

    .col-md-8 {
      flex: 0 0 80%;
      max-width: 80%
    }

    .col-md-9 {
      flex: 0 0 90%;
      max-width: 90%
    }

    .col-md-10 {
      flex: 0 0 100%;
      max-width: 100%
    }

    .order-md-1 {
      order: 1
    }

    .order-md-2 {
      order: 2
    }

    .order-md-3 {
      order: 3
    }

    .order-md-4 {
      order: 4
    }

    .order-md-5 {
      order: 5
    }

    .order-md-6 {
      order: 6
    }

    .order-md-7 {
      order: 7
    }

    .order-md-8 {
      order: 8
    }

    .order-md-9 {
      order: 9
    }

    .order-md-10 {
      order: 10
    }
  }

  @media (min-width: 992px) {
    .col-lg {
      flex-basis:0;
      flex-grow: 1;
      max-width: 100%
    }

    .col-lg-auto {
      flex: 0 0 auto;
      width: auto;
      max-width: none
    }

    .col-lg-1 {
      flex: 0 0 10%;
      max-width: 10%
    }

    .col-lg-2 {
      flex: 0 0 20%;
      max-width: 20%
    }

    .col-lg-3 {
      flex: 0 0 30%;
      max-width: 30%
    }

    .col-lg-4 {
      flex: 0 0 40%;
      max-width: 40%
    }

    .col-lg-5 {
      flex: 0 0 50%;
      max-width: 50%
    }

    .col-lg-6 {
      flex: 0 0 60%;
      max-width: 60%
    }

    .col-lg-7 {
      flex: 0 0 70%;
      max-width: 70%
    }

    .col-lg-8 {
      flex: 0 0 80%;
      max-width: 80%
    }

    .col-lg-9 {
      flex: 0 0 90%;
      max-width: 90%
    }

    .col-lg-10 {
      flex: 0 0 100%;
      max-width: 100%
    }

    .order-lg-1 {
      order: 1
    }

    .order-lg-2 {
      order: 2
    }

    .order-lg-3 {
      order: 3
    }

    .order-lg-4 {
      order: 4
    }

    .order-lg-5 {
      order: 5
    }

    .order-lg-6 {
      order: 6
    }

    .order-lg-7 {
      order: 7
    }

    .order-lg-8 {
      order: 8
    }

    .order-lg-9 {
      order: 9
    }

    .order-lg-10 {
      order: 10
    }
  }

  @media (min-width: 1240px) {
    .col-xl {
      flex-basis:0;
      flex-grow: 1;
      max-width: 100%
    }

    .col-xl-auto {
      flex: 0 0 auto;
      width: auto;
      max-width: none
    }

    .col-xl-1 {
      flex: 0 0 10%;
      max-width: 10%
    }

    .col-xl-2 {
      flex: 0 0 20%;
      max-width: 20%
    }

    .col-xl-3 {
      flex: 0 0 30%;
      max-width: 30%
    }

    .col-xl-4 {
      flex: 0 0 40%;
      max-width: 40%
    }

    .col-xl-5 {
      flex: 0 0 50%;
      max-width: 50%
    }

    .col-xl-6 {
      flex: 0 0 60%;
      max-width: 60%
    }

    .col-xl-7 {
      flex: 0 0 70%;
      max-width: 70%
    }

    .col-xl-8 {
      flex: 0 0 80%;
      max-width: 80%
    }

    .col-xl-9 {
      flex: 0 0 90%;
      max-width: 90%
    }

    .col-xl-10 {
      flex: 0 0 100%;
      max-width: 100%
    }

    .order-xl-1 {
      order: 1
    }

    .order-xl-2 {
      order: 2
    }

    .order-xl-3 {
      order: 3
    }

    .order-xl-4 {
      order: 4
    }

    .order-xl-5 {
      order: 5
    }

    .order-xl-6 {
      order: 6
    }

    .order-xl-7 {
      order: 7
    }

    .order-xl-8 {
      order: 8
    }

    .order-xl-9 {
      order: 9
    }

    .order-xl-10 {
      order: 10
    }
  }

  .form-control {
    display: block;
    width: 100%;
    padding: .5rem .75rem;
    font-size: 1rem;
    line-height: 1.25;
    color: #495057;
    background-color: #fff;
    background-image: none;
    background-clip: padding-box;
    border: 1px solid rgba(4,5,21,0.15);
    border-radius: .25rem;
    transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s
  }

  .form-control::-ms-expand {
    background-color: transparent;
    border: 0
  }

  .form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: none
  }

  .form-control::placeholder {
    color: #868e96;
    opacity: 1
  }

  .form-control:disabled,.form-control[readonly] {
    background-color: #e9ecef;
    opacity: 1
  }

  select.form-control:not([size]):not([multiple]) {
    height: calc(2.25rem + 2px)
  }

  select.form-control:focus::-ms-value {
    color: #495057;
    background-color: #fff
  }

  .form-control-file,.form-control-range {
    display: block
  }

  .col-form-label {
    padding-top: calc(.5rem - 1px * 2);
    padding-bottom: calc(.5rem - 1px * 2);
    margin-bottom: 0
  }

  .col-form-label-lg {
    padding-top: calc(.5rem - 1px * 2);
    padding-bottom: calc(.5rem - 1px * 2);
    font-size: 1.25rem
  }

  .col-form-label-sm {
    padding-top: calc(.25rem - 1px * 2);
    padding-bottom: calc(.25rem - 1px * 2);
    font-size: .875rem
  }

  .col-form-legend {
    padding-top: .5rem;
    padding-bottom: .5rem;
    margin-bottom: 0;
    font-size: 1rem
  }

  .form-control-plaintext {
    padding-top: .5rem;
    padding-bottom: .5rem;
    margin-bottom: 0;
    line-height: 1.25;
    border: solid transparent;
    border-width: 1px 0
  }

  .form-control-plaintext.form-control-sm,.form-control-plaintext.form-control-lg {
    padding-right: 0;
    padding-left: 0
  }

  .form-control-sm {
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .2rem
  }

  select.form-control-sm:not([size]):not([multiple]) {
    height: calc(1.8125rem + 2px)
  }

  .form-control-lg {
    padding: .5rem 1rem;
    font-size: 1.25rem;
    line-height: 1.5;
    border-radius: .3rem
  }

  select.form-control-lg:not([size]):not([multiple]) {
    height: calc(2.875rem + 2px)
  }

  .form-group {
    margin-bottom: 1rem
  }

  .form-text {
    display: block;
    margin-top: .25rem
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -5px;
    margin-left: -5px
  }

  .form-row>.col,.form-row>[class*="col-"] {
    padding-right: 5px;
    padding-left: 5px
  }

  .form-check {
    position: relative;
    display: block;
    margin-bottom: .5rem
  }

  .form-check.disabled .form-check-label {
    color: #868e96
  }

  .form-check-label {
    padding-left: 1.25rem;
    margin-bottom: 0
  }

  .form-check-input {
    position: absolute;
    margin-top: .25rem;
    margin-left: -1.25rem
  }

  .form-check-inline {
    display: inline-block
  }

  .form-check-inline .form-check-label {
    vertical-align: middle
  }

  .form-check-inline+.form-check-inline {
    margin-left: .75rem
  }

  .invalid-feedback {
    display: none;
    margin-top: .25rem;
    font-size: .875rem;
    color: #dc3545
  }

  .invalid-tooltip {
    position: absolute;
    top: 100%;
    z-index: 5;
    display: none;
    width: 250px;
    padding: .5rem;
    margin-top: .1rem;
    font-size: .875rem;
    line-height: 1;
    color: #fff;
    background-color: rgba(220,53,69,0.8);
    border-radius: .2rem
  }

  .was-validated .form-control:valid,.form-control.is-valid,.was-validated .custom-select:valid,.custom-select.is-valid {
    border-color: #28a745
  }

  .was-validated .form-control:valid:focus,.form-control.is-valid:focus,.was-validated .custom-select:valid:focus,.custom-select.is-valid:focus {
    box-shadow: 0 0 0 0.2rem rgba(40,167,69,0.25)
  }

  .was-validated .form-control:valid ~ .invalid-feedback,.was-validated .form-control:valid ~ .invalid-tooltip,.form-control.is-valid ~ .invalid-feedback,.form-control.is-valid ~ .invalid-tooltip,.was-validated .custom-select:valid ~ .invalid-feedback,.was-validated .custom-select:valid ~ .invalid-tooltip,.custom-select.is-valid ~ .invalid-feedback,.custom-select.is-valid ~ .invalid-tooltip {
    display: block
  }

  .was-validated .form-check-input:valid+.form-check-label,.form-check-input.is-valid+.form-check-label {
    color: #28a745
  }

  .was-validated .custom-control-input:valid ~ .custom-control-indicator,.custom-control-input.is-valid ~ .custom-control-indicator {
    background-color: rgba(40,167,69,0.25)
  }

  .was-validated .custom-control-input:valid ~ .custom-control-description,.custom-control-input.is-valid ~ .custom-control-description {
    color: #28a745
  }

  .was-validated .custom-file-input:valid ~ .custom-file-control,.custom-file-input.is-valid ~ .custom-file-control {
    border-color: #28a745
  }

  .was-validated .custom-file-input:valid ~ .custom-file-control::before,.custom-file-input.is-valid ~ .custom-file-control::before {
    border-color: inherit
  }

  .was-validated .custom-file-input:valid:focus,.custom-file-input.is-valid:focus {
    box-shadow: 0 0 0 0.2rem rgba(40,167,69,0.25)
  }

  .was-validated .form-control:invalid,.form-control.is-invalid,.was-validated .custom-select:invalid,.custom-select.is-invalid {
    border-color: #dc3545
  }

  .was-validated .form-control:invalid:focus,.form-control.is-invalid:focus,.was-validated .custom-select:invalid:focus,.custom-select.is-invalid:focus {
    box-shadow: 0 0 0 0.2rem rgba(220,53,69,0.25)
  }

  .was-validated .form-control:invalid ~ .invalid-feedback,.was-validated .form-control:invalid ~ .invalid-tooltip,.form-control.is-invalid ~ .invalid-feedback,.form-control.is-invalid ~ .invalid-tooltip,.was-validated .custom-select:invalid ~ .invalid-feedback,.was-validated .custom-select:invalid ~ .invalid-tooltip,.custom-select.is-invalid ~ .invalid-feedback,.custom-select.is-invalid ~ .invalid-tooltip {
    display: block
  }

  .was-validated .form-check-input:invalid+.form-check-label,.form-check-input.is-invalid+.form-check-label {
    color: #dc3545
  }

  .was-validated .custom-control-input:invalid ~ .custom-control-indicator,.custom-control-input.is-invalid ~ .custom-control-indicator {
    background-color: rgba(220,53,69,0.25)
  }

  .was-validated .custom-control-input:invalid ~ .custom-control-description,.custom-control-input.is-invalid ~ .custom-control-description {
    color: #dc3545
  }

  .was-validated .custom-file-input:invalid ~ .custom-file-control,.custom-file-input.is-invalid ~ .custom-file-control {
    border-color: #dc3545
  }

  .was-validated .custom-file-input:invalid ~ .custom-file-control::before,.custom-file-input.is-invalid ~ .custom-file-control::before {
    border-color: inherit
  }

  .was-validated .custom-file-input:invalid:focus,.custom-file-input.is-invalid:focus {
    box-shadow: 0 0 0 0.2rem rgba(220,53,69,0.25)
  }

  .form-inline {
    display: flex;
    flex-flow: row wrap;
    align-items: center
  }

  .form-inline .form-check {
    width: 100%
  }

  @media (min-width: 576px) {
    .form-inline label {
      display:flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0
    }

    .form-inline .form-group {
      display: flex;
      flex: 0 0 auto;
      flex-flow: row wrap;
      align-items: center;
      margin-bottom: 0
    }

    .form-inline .form-control {
      display: inline-block;
      width: auto;
      vertical-align: middle
    }

    .form-inline .form-control-plaintext {
      display: inline-block
    }

    .form-inline .input-group {
      width: auto
    }

    .form-inline .form-control-label {
      margin-bottom: 0;
      vertical-align: middle
    }

    .form-inline .form-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      margin-top: 0;
      margin-bottom: 0
    }

    .form-inline .form-check-label {
      padding-left: 0
    }

    .form-inline .form-check-input {
      position: relative;
      margin-top: 0;
      margin-right: .25rem;
      margin-left: 0
    }

    .form-inline .custom-control {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 0
    }

    .form-inline .custom-control-indicator {
      position: static;
      display: inline-block;
      margin-right: .25rem;
      vertical-align: text-bottom
    }

    .form-inline .has-feedback .form-control-feedback {
      top: 0
    }
  }

  .btn {
    display: inline-block;
    font-weight: normal;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    padding: .5rem .75rem;
    font-size: 1rem;
    line-height: 1.25;
    border-radius: .25rem;
    transition: background-color 0.15s ease-in-out,border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out
  }

  .btn:focus,.btn:hover {
    text-decoration: none
  }

  .btn:focus,.btn.focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.25)
  }

  .btn.disabled,.btn:disabled {
    opacity: .65
  }

  .btn:active,.btn.active {
    background-image: none
  }

  a.btn.disabled,fieldset[disabled] a.btn {
    pointer-events: none
  }

  .btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff
  }

  .btn-primary:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc
  }

  .btn-primary:focus,.btn-primary.focus {
    box-shadow: 0 0 0 3px rgba(0,123,255,0.5)
  }

  .btn-primary.disabled,.btn-primary:disabled {
    background-color: #007bff;
    border-color: #007bff
  }

  .btn-primary:active,.btn-primary.active,.show>.btn-primary.dropdown-toggle {
    background-color: #0069d9;
    background-image: none;
    border-color: #0062cc
  }

  .btn-secondary {
    color: #fff;
    background-color: #868e96;
    border-color: #868e96
  }

  .btn-secondary:hover {
    color: #fff;
    background-color: #727b84;
    border-color: #6c757d
  }

  .btn-secondary:focus,.btn-secondary.focus {
    box-shadow: 0 0 0 3px rgba(134,142,150,0.5)
  }

  .btn-secondary.disabled,.btn-secondary:disabled {
    background-color: #868e96;
    border-color: #868e96
  }

  .btn-secondary:active,.btn-secondary.active,.show>.btn-secondary.dropdown-toggle {
    background-color: #727b84;
    background-image: none;
    border-color: #6c757d
  }

  .btn-success {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745
  }

  .btn-success:hover {
    color: #fff;
    background-color: #218838;
    border-color: #1e7e34
  }

  .btn-success:focus,.btn-success.focus {
    box-shadow: 0 0 0 3px rgba(40,167,69,0.5)
  }

  .btn-success.disabled,.btn-success:disabled {
    background-color: #28a745;
    border-color: #28a745
  }

  .btn-success:active,.btn-success.active,.show>.btn-success.dropdown-toggle {
    background-color: #218838;
    background-image: none;
    border-color: #1e7e34
  }

  .btn-info {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8
  }

  .btn-info:hover {
    color: #fff;
    background-color: #138496;
    border-color: #117a8b
  }

  .btn-info:focus,.btn-info.focus {
    box-shadow: 0 0 0 3px rgba(23,162,184,0.5)
  }

  .btn-info.disabled,.btn-info:disabled {
    background-color: #17a2b8;
    border-color: #17a2b8
  }

  .btn-info:active,.btn-info.active,.show>.btn-info.dropdown-toggle {
    background-color: #138496;
    background-image: none;
    border-color: #117a8b
  }

  .btn-warning {
    color: #111;
    background-color: #ffc107;
    border-color: #ffc107
  }

  .btn-warning:hover {
    color: #111;
    background-color: #e0a800;
    border-color: #d39e00
  }

  .btn-warning:focus,.btn-warning.focus {
    box-shadow: 0 0 0 3px rgba(255,193,7,0.5)
  }

  .btn-warning.disabled,.btn-warning:disabled {
    background-color: #ffc107;
    border-color: #ffc107
  }

  .btn-warning:active,.btn-warning.active,.show>.btn-warning.dropdown-toggle {
    background-color: #e0a800;
    background-image: none;
    border-color: #d39e00
  }

  .btn-danger {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545
  }

  .btn-danger:hover {
    color: #fff;
    background-color: #c82333;
    border-color: #bd2130
  }

  .btn-danger:focus,.btn-danger.focus {
    box-shadow: 0 0 0 3px rgba(220,53,69,0.5)
  }

  .btn-danger.disabled,.btn-danger:disabled {
    background-color: #dc3545;
    border-color: #dc3545
  }

  .btn-danger:active,.btn-danger.active,.show>.btn-danger.dropdown-toggle {
    background-color: #c82333;
    background-image: none;
    border-color: #bd2130
  }

  .btn-light {
    color: #111;
    background-color: #f8f9fa;
    border-color: #f8f9fa
  }

  .btn-light:hover {
    color: #111;
    background-color: #e2e6ea;
    border-color: #dae0e5
  }

  .btn-light:focus,.btn-light.focus {
    box-shadow: 0 0 0 3px rgba(248,249,250,0.5)
  }

  .btn-light.disabled,.btn-light:disabled {
    background-color: #f8f9fa;
    border-color: #f8f9fa
  }

  .btn-light:active,.btn-light.active,.show>.btn-light.dropdown-toggle {
    background-color: #e2e6ea;
    background-image: none;
    border-color: #dae0e5
  }

  .btn-dark {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40
  }

  .btn-dark:hover {
    color: #fff;
    background-color: #23272b;
    border-color: #1d2124
  }

  .btn-dark:focus,.btn-dark.focus {
    box-shadow: 0 0 0 3px rgba(52,58,64,0.5)
  }

  .btn-dark.disabled,.btn-dark:disabled {
    background-color: #343a40;
    border-color: #343a40
  }

  .btn-dark:active,.btn-dark.active,.show>.btn-dark.dropdown-toggle {
    background-color: #23272b;
    background-image: none;
    border-color: #1d2124
  }

  .btn-outline-primary {
    color: #007bff;
    background-color: transparent;
    background-image: none;
    border-color: #007bff
  }

  .btn-outline-primary:hover {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff
  }

  .btn-outline-primary:focus,.btn-outline-primary.focus {
    box-shadow: 0 0 0 3px rgba(0,123,255,0.5)
  }

  .btn-outline-primary.disabled,.btn-outline-primary:disabled {
    color: #007bff;
    background-color: transparent
  }

  .btn-outline-primary:active,.btn-outline-primary.active,.show>.btn-outline-primary.dropdown-toggle {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff
  }

  .btn-outline-secondary {
    color: #868e96;
    background-color: transparent;
    background-image: none;
    border-color: #868e96
  }

  .btn-outline-secondary:hover {
    color: #fff;
    background-color: #868e96;
    border-color: #868e96
  }

  .btn-outline-secondary:focus,.btn-outline-secondary.focus {
    box-shadow: 0 0 0 3px rgba(134,142,150,0.5)
  }

  .btn-outline-secondary.disabled,.btn-outline-secondary:disabled {
    color: #868e96;
    background-color: transparent
  }

  .btn-outline-secondary:active,.btn-outline-secondary.active,.show>.btn-outline-secondary.dropdown-toggle {
    color: #fff;
    background-color: #868e96;
    border-color: #868e96
  }

  .btn-outline-success {
    color: #28a745;
    background-color: transparent;
    background-image: none;
    border-color: #28a745
  }

  .btn-outline-success:hover {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745
  }

  .btn-outline-success:focus,.btn-outline-success.focus {
    box-shadow: 0 0 0 3px rgba(40,167,69,0.5)
  }

  .btn-outline-success.disabled,.btn-outline-success:disabled {
    color: #28a745;
    background-color: transparent
  }

  .btn-outline-success:active,.btn-outline-success.active,.show>.btn-outline-success.dropdown-toggle {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745
  }

  .btn-outline-info {
    color: #17a2b8;
    background-color: transparent;
    background-image: none;
    border-color: #17a2b8
  }

  .btn-outline-info:hover {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8
  }

  .btn-outline-info:focus,.btn-outline-info.focus {
    box-shadow: 0 0 0 3px rgba(23,162,184,0.5)
  }

  .btn-outline-info.disabled,.btn-outline-info:disabled {
    color: #17a2b8;
    background-color: transparent
  }

  .btn-outline-info:active,.btn-outline-info.active,.show>.btn-outline-info.dropdown-toggle {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8
  }

  .btn-outline-warning {
    color: #ffc107;
    background-color: transparent;
    background-image: none;
    border-color: #ffc107
  }

  .btn-outline-warning:hover {
    color: #fff;
    background-color: #ffc107;
    border-color: #ffc107
  }

  .btn-outline-warning:focus,.btn-outline-warning.focus {
    box-shadow: 0 0 0 3px rgba(255,193,7,0.5)
  }

  .btn-outline-warning.disabled,.btn-outline-warning:disabled {
    color: #ffc107;
    background-color: transparent
  }

  .btn-outline-warning:active,.btn-outline-warning.active,.show>.btn-outline-warning.dropdown-toggle {
    color: #fff;
    background-color: #ffc107;
    border-color: #ffc107
  }

  .btn-outline-danger {
    color: #dc3545;
    background-color: transparent;
    background-image: none;
    border-color: #dc3545
  }

  .btn-outline-danger:hover {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545
  }

  .btn-outline-danger:focus,.btn-outline-danger.focus {
    box-shadow: 0 0 0 3px rgba(220,53,69,0.5)
  }

  .btn-outline-danger.disabled,.btn-outline-danger:disabled {
    color: #dc3545;
    background-color: transparent
  }

  .btn-outline-danger:active,.btn-outline-danger.active,.show>.btn-outline-danger.dropdown-toggle {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545
  }

  .btn-outline-light {
    color: #f8f9fa;
    background-color: transparent;
    background-image: none;
    border-color: #f8f9fa
  }

  .btn-outline-light:hover {
    color: #fff;
    background-color: #f8f9fa;
    border-color: #f8f9fa
  }

  .btn-outline-light:focus,.btn-outline-light.focus {
    box-shadow: 0 0 0 3px rgba(248,249,250,0.5)
  }

  .btn-outline-light.disabled,.btn-outline-light:disabled {
    color: #f8f9fa;
    background-color: transparent
  }

  .btn-outline-light:active,.btn-outline-light.active,.show>.btn-outline-light.dropdown-toggle {
    color: #fff;
    background-color: #f8f9fa;
    border-color: #f8f9fa
  }

  .btn-outline-dark {
    color: #343a40;
    background-color: transparent;
    background-image: none;
    border-color: #343a40
  }

  .btn-outline-dark:hover {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40
  }

  .btn-outline-dark:focus,.btn-outline-dark.focus {
    box-shadow: 0 0 0 3px rgba(52,58,64,0.5)
  }

  .btn-outline-dark.disabled,.btn-outline-dark:disabled {
    color: #343a40;
    background-color: transparent
  }

  .btn-outline-dark:active,.btn-outline-dark.active,.show>.btn-outline-dark.dropdown-toggle {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40
  }

  .btn-link {
    font-weight: normal;
    color: #007bff;
    border-radius: 0
  }

  .btn-link,.btn-link:active,.btn-link.active,.btn-link:disabled {
    background-color: transparent
  }

  .btn-link,.btn-link:focus,.btn-link:active {
    border-color: transparent;
    box-shadow: none
  }

  .btn-link:hover {
    border-color: transparent
  }

  .btn-link:focus,.btn-link:hover {
    color: #0056b3;
    text-decoration: underline;
    background-color: transparent
  }

  .btn-link:disabled {
    color: #868e96
  }

  .btn-link:disabled:focus,.btn-link:disabled:hover {
    text-decoration: none
  }

  .btn-lg {
    padding: .5rem 1rem;
    font-size: 1.25rem;
    line-height: 1.5;
    border-radius: .3rem
  }

  .btn-sm {
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .2rem
  }

  .btn-block {
    display: block;
    width: 100%
  }

  .btn-block+.btn-block {
    margin-top: .5rem
  }

  input[type="submit"].btn-block,input[type="reset"].btn-block,input[type="button"].btn-block {
    width: 100%
  }

  .fade {
    opacity: 0;
    transition: opacity 0.15s linear
  }

  .fade.show {
    opacity: 1
  }

  .collapse {
    display: none
  }

  .collapse.show {
    display: block
  }

  tr.collapse.show {
    display: table-row
  }

  tbody.collapse.show {
    display: table-row-group
  }

  .collapsing {
    position: relative;
    height: 0;
    overflow: hidden;
    transition: height 0.35s ease
  }

  .close {
    float: right;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1;
    color: #040515;
    text-shadow: 0 1px 0 #fff;
    opacity: .5
  }

  .close:focus,.close:hover {
    color: #040515;
    text-decoration: none;
    opacity: .75
  }

  button.close {
    padding: 0;
    background: transparent;
    border: 0;
    -webkit-appearance: none
  }

  .modal-open {
    overflow: hidden
  }

  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    display: none;
    overflow: hidden;
    outline: 0
  }

  .modal.fade .modal-dialog {
    transition: transform 0.3s ease-out;
    transform: translate(0, -25%)
  }

  .modal.show .modal-dialog {
    transform: translate(0, 0)
  }

  .modal-open .modal {
    overflow-x: hidden;
    overflow-y: auto
  }

  .modal-dialog {
    position: relative;
    width: auto;
    margin: 10px
  }

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(4,5,21,0.2);
    border-radius: .3rem;
    outline: 0
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1040;
    background-color: #040515
  }

  .modal-backdrop.fade {
    opacity: 0
  }

  .modal-backdrop.show {
    opacity: .5
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid #e9ecef
  }

  .modal-header .close {
    margin-left: auto
  }

  .modal-title {
    margin-bottom: 0;
    line-height: 1.5
  }

  .modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 15px
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 15px;
    border-top: 1px solid #e9ecef
  }

  .modal-footer>:not(:first-child) {
    margin-left: .25rem
  }

  .modal-footer>:not(:last-child) {
    margin-right: .25rem
  }

  .modal-scrollbar-measure {
    position: absolute;
    top: -9999px;
    width: 50px;
    height: 50px;
    overflow: scroll
  }

  @media (min-width: 576px) {
    .modal-dialog {
      max-width:500px;
      margin: 30px auto
    }

    .modal-sm {
      max-width: 300px
    }
  }

  @media (min-width: 992px) {
    .modal-lg {
      max-width:800px
    }
  }

  .align-baseline {
    vertical-align: baseline !important
  }

  .align-top {
    vertical-align: top !important
  }

  .align-middle {
    vertical-align: middle !important
  }

  .align-bottom {
    vertical-align: bottom !important
  }

  .align-text-bottom {
    vertical-align: text-bottom !important
  }

  .align-text-top {
    vertical-align: text-top !important
  }

  .bg-primary {
    background-color: #007bff !important
  }

  a.bg-primary:focus,a.bg-primary:hover {
    background-color: #0062cc !important
  }

  .bg-secondary {
    background-color: #868e96 !important
  }

  a.bg-secondary:focus,a.bg-secondary:hover {
    background-color: #6c757d !important
  }

  .bg-success {
    background-color: #28a745 !important
  }

  a.bg-success:focus,a.bg-success:hover {
    background-color: #1e7e34 !important
  }

  .bg-info {
    background-color: #17a2b8 !important
  }

  a.bg-info:focus,a.bg-info:hover {
    background-color: #117a8b !important
  }

  .bg-warning {
    background-color: #ffc107 !important
  }

  a.bg-warning:focus,a.bg-warning:hover {
    background-color: #d39e00 !important
  }

  .bg-danger {
    background-color: #dc3545 !important
  }

  a.bg-danger:focus,a.bg-danger:hover {
    background-color: #bd2130 !important
  }

  .bg-light {
    background-color: #f8f9fa !important
  }

  a.bg-light:focus,a.bg-light:hover {
    background-color: #dae0e5 !important
  }

  .bg-dark {
    background-color: #343a40 !important
  }

  a.bg-dark:focus,a.bg-dark:hover {
    background-color: #1d2124 !important
  }

  .bg-white {
    background-color: #f5f5f5 !important
  }

  .bg-transparent {
    background-color: transparent !important
  }

  .border {
    border: 1px solid #e9ecef !important
  }

  .border-0 {
    border: 0 !important
  }

  .border-top-0 {
    border-top: 0 !important
  }

  .border-right-0 {
    border-right: 0 !important
  }

  .border-bottom-0 {
    border-bottom: 0 !important
  }

  .border-left-0 {
    border-left: 0 !important
  }

  .border-primary {
    border-color: #007bff !important
  }

  .border-secondary {
    border-color: #868e96 !important
  }

  .border-success {
    border-color: #28a745 !important
  }

  .border-info {
    border-color: #17a2b8 !important
  }

  .border-warning {
    border-color: #ffc107 !important
  }

  .border-danger {
    border-color: #dc3545 !important
  }

  .border-light {
    border-color: #f8f9fa !important
  }

  .border-dark {
    border-color: #343a40 !important
  }

  .border-white {
    border-color: #f5f5f5 !important
  }

  .rounded {
    border-radius: .25rem !important
  }

  .rounded-top {
    border-top-left-radius: .25rem !important;
    border-top-right-radius: .25rem !important
  }

  .rounded-right {
    border-top-right-radius: .25rem !important;
    border-bottom-right-radius: .25rem !important
  }

  .rounded-bottom {
    border-bottom-right-radius: .25rem !important;
    border-bottom-left-radius: .25rem !important
  }

  .rounded-left {
    border-top-left-radius: .25rem !important;
    border-bottom-left-radius: .25rem !important
  }

  .rounded-circle {
    border-radius: 50%
  }

  .rounded-0 {
    border-radius: 0
  }

  .clearfix::after {
    display: block;
    clear: both;
    content: ""
  }

  .d-none {
    display: none !important
  }

  .d-inline {
    display: inline !important
  }

  .d-inline-block {
    display: inline-block !important
  }

  .d-block {
    display: block !important
  }

  .d-table {
    display: table !important
  }

  .d-table-cell {
    display: table-cell !important
  }

  .d-flex {
    display: flex !important
  }

  .d-inline-flex {
    display: inline-flex !important
  }

  @media (min-width: 576px) {
    .d-sm-none {
      display:none !important
    }

    .d-sm-inline {
      display: inline !important
    }

    .d-sm-inline-block {
      display: inline-block !important
    }

    .d-sm-block {
      display: block !important
    }

    .d-sm-table {
      display: table !important
    }

    .d-sm-table-cell {
      display: table-cell !important
    }

    .d-sm-flex {
      display: flex !important
    }

    .d-sm-inline-flex {
      display: inline-flex !important
    }
  }

  @media (min-width: 768px) {
    .d-md-none {
      display:none !important
    }

    .d-md-inline {
      display: inline !important
    }

    .d-md-inline-block {
      display: inline-block !important
    }

    .d-md-block {
      display: block !important
    }

    .d-md-table {
      display: table !important
    }

    .d-md-table-cell {
      display: table-cell !important
    }

    .d-md-flex {
      display: flex !important
    }

    .d-md-inline-flex {
      display: inline-flex !important
    }
  }

  @media (min-width: 992px) {
    .d-lg-none {
      display:none !important
    }

    .d-lg-inline {
      display: inline !important
    }

    .d-lg-inline-block {
      display: inline-block !important
    }

    .d-lg-block {
      display: block !important
    }

    .d-lg-table {
      display: table !important
    }

    .d-lg-table-cell {
      display: table-cell !important
    }

    .d-lg-flex {
      display: flex !important
    }

    .d-lg-inline-flex {
      display: inline-flex !important
    }
  }

  @media (min-width: 1240px) {
    .d-xl-none {
      display:none !important
    }

    .d-xl-inline {
      display: inline !important
    }

    .d-xl-inline-block {
      display: inline-block !important
    }

    .d-xl-block {
      display: block !important
    }

    .d-xl-table {
      display: table !important
    }

    .d-xl-table-cell {
      display: table-cell !important
    }

    .d-xl-flex {
      display: flex !important
    }

    .d-xl-inline-flex {
      display: inline-flex !important
    }
  }

  .d-print-block {
    display: none !important
  }

  @media print {
    .d-print-block {
      display: block !important
    }
  }

  .d-print-inline {
    display: none !important
  }

  @media print {
    .d-print-inline {
      display: inline !important
    }
  }

  .d-print-inline-block {
    display: none !important
  }

  @media print {
    .d-print-inline-block {
      display: inline-block !important
    }
  }

  @media print {
    .d-print-none {
      display: none !important
    }
  }

  .embed-responsive {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    overflow: hidden
  }

  .embed-responsive::before {
    display: block;
    content: ""
  }

  .embed-responsive .embed-responsive-item,.embed-responsive iframe,.embed-responsive embed,.embed-responsive object,.embed-responsive video {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0
  }

  .embed-responsive-21by9::before {
    padding-top: 42.85714%
  }

  .embed-responsive-16by9::before {
    padding-top: 56.25%
  }

  .embed-responsive-4by3::before {
    padding-top: 75%
  }

  .embed-responsive-1by1::before {
    padding-top: 100%
  }

  .flex-row {
    flex-direction: row !important
  }

  .flex-column {
    flex-direction: column !important
  }

  .flex-row-reverse {
    flex-direction: row-reverse !important
  }

  .flex-column-reverse {
    flex-direction: column-reverse !important
  }

  .flex-wrap {
    flex-wrap: wrap !important
  }

  .flex-nowrap {
    flex-wrap: nowrap !important
  }

  .flex-wrap-reverse {
    flex-wrap: wrap-reverse !important
  }

  .justify-content-start {
    justify-content: flex-start !important
  }

  .justify-content-end {
    justify-content: flex-end !important
  }

  .justify-content-center {
    justify-content: center !important
  }

  .justify-content-between {
    justify-content: space-between !important
  }

  .justify-content-around {
    justify-content: space-around !important
  }

  .align-items-start {
    align-items: flex-start !important
  }

  .align-items-end {
    align-items: flex-end !important
  }

  .align-items-center {
    align-items: center !important
  }

  .align-items-baseline {
    align-items: baseline !important
  }

  .align-items-stretch {
    align-items: stretch !important
  }

  .align-content-start {
    align-content: flex-start !important
  }

  .align-content-end {
    align-content: flex-end !important
  }

  .align-content-center {
    align-content: center !important
  }

  .align-content-between {
    align-content: space-between !important
  }

  .align-content-around {
    align-content: space-around !important
  }

  .align-content-stretch {
    align-content: stretch !important
  }

  .align-self-auto {
    align-self: auto !important
  }

  .align-self-start {
    align-self: flex-start !important
  }

  .align-self-end {
    align-self: flex-end !important
  }

  .align-self-center {
    align-self: center !important
  }

  .align-self-baseline {
    align-self: baseline !important
  }

  .align-self-stretch {
    align-self: stretch !important
  }

  @media (min-width: 576px) {
    .flex-sm-row {
      flex-direction:row !important
    }

    .flex-sm-column {
      flex-direction: column !important
    }

    .flex-sm-row-reverse {
      flex-direction: row-reverse !important
    }

    .flex-sm-column-reverse {
      flex-direction: column-reverse !important
    }

    .flex-sm-wrap {
      flex-wrap: wrap !important
    }

    .flex-sm-nowrap {
      flex-wrap: nowrap !important
    }

    .flex-sm-wrap-reverse {
      flex-wrap: wrap-reverse !important
    }

    .justify-content-sm-start {
      justify-content: flex-start !important
    }

    .justify-content-sm-end {
      justify-content: flex-end !important
    }

    .justify-content-sm-center {
      justify-content: center !important
    }

    .justify-content-sm-between {
      justify-content: space-between !important
    }

    .justify-content-sm-around {
      justify-content: space-around !important
    }

    .align-items-sm-start {
      align-items: flex-start !important
    }

    .align-items-sm-end {
      align-items: flex-end !important
    }

    .align-items-sm-center {
      align-items: center !important
    }

    .align-items-sm-baseline {
      align-items: baseline !important
    }

    .align-items-sm-stretch {
      align-items: stretch !important
    }

    .align-content-sm-start {
      align-content: flex-start !important
    }

    .align-content-sm-end {
      align-content: flex-end !important
    }

    .align-content-sm-center {
      align-content: center !important
    }

    .align-content-sm-between {
      align-content: space-between !important
    }

    .align-content-sm-around {
      align-content: space-around !important
    }

    .align-content-sm-stretch {
      align-content: stretch !important
    }

    .align-self-sm-auto {
      align-self: auto !important
    }

    .align-self-sm-start {
      align-self: flex-start !important
    }

    .align-self-sm-end {
      align-self: flex-end !important
    }

    .align-self-sm-center {
      align-self: center !important
    }

    .align-self-sm-baseline {
      align-self: baseline !important
    }

    .align-self-sm-stretch {
      align-self: stretch !important
    }
  }

  @media (min-width: 768px) {
    .flex-md-row {
      flex-direction:row !important
    }

    .flex-md-column {
      flex-direction: column !important
    }

    .flex-md-row-reverse {
      flex-direction: row-reverse !important
    }

    .flex-md-column-reverse {
      flex-direction: column-reverse !important
    }

    .flex-md-wrap {
      flex-wrap: wrap !important
    }

    .flex-md-nowrap {
      flex-wrap: nowrap !important
    }

    .flex-md-wrap-reverse {
      flex-wrap: wrap-reverse !important
    }

    .justify-content-md-start {
      justify-content: flex-start !important
    }

    .justify-content-md-end {
      justify-content: flex-end !important
    }

    .justify-content-md-center {
      justify-content: center !important
    }

    .justify-content-md-between {
      justify-content: space-between !important
    }

    .justify-content-md-around {
      justify-content: space-around !important
    }

    .align-items-md-start {
      align-items: flex-start !important
    }

    .align-items-md-end {
      align-items: flex-end !important
    }

    .align-items-md-center {
      align-items: center !important
    }

    .align-items-md-baseline {
      align-items: baseline !important
    }

    .align-items-md-stretch {
      align-items: stretch !important
    }

    .align-content-md-start {
      align-content: flex-start !important
    }

    .align-content-md-end {
      align-content: flex-end !important
    }

    .align-content-md-center {
      align-content: center !important
    }

    .align-content-md-between {
      align-content: space-between !important
    }

    .align-content-md-around {
      align-content: space-around !important
    }

    .align-content-md-stretch {
      align-content: stretch !important
    }

    .align-self-md-auto {
      align-self: auto !important
    }

    .align-self-md-start {
      align-self: flex-start !important
    }

    .align-self-md-end {
      align-self: flex-end !important
    }

    .align-self-md-center {
      align-self: center !important
    }

    .align-self-md-baseline {
      align-self: baseline !important
    }

    .align-self-md-stretch {
      align-self: stretch !important
    }
  }

  @media (min-width: 992px) {
    .flex-lg-row {
      flex-direction:row !important
    }

    .flex-lg-column {
      flex-direction: column !important
    }

    .flex-lg-row-reverse {
      flex-direction: row-reverse !important
    }

    .flex-lg-column-reverse {
      flex-direction: column-reverse !important
    }

    .flex-lg-wrap {
      flex-wrap: wrap !important
    }

    .flex-lg-nowrap {
      flex-wrap: nowrap !important
    }

    .flex-lg-wrap-reverse {
      flex-wrap: wrap-reverse !important
    }

    .justify-content-lg-start {
      justify-content: flex-start !important
    }

    .justify-content-lg-end {
      justify-content: flex-end !important
    }

    .justify-content-lg-center {
      justify-content: center !important
    }

    .justify-content-lg-between {
      justify-content: space-between !important
    }

    .justify-content-lg-around {
      justify-content: space-around !important
    }

    .align-items-lg-start {
      align-items: flex-start !important
    }

    .align-items-lg-end {
      align-items: flex-end !important
    }

    .align-items-lg-center {
      align-items: center !important
    }

    .align-items-lg-baseline {
      align-items: baseline !important
    }

    .align-items-lg-stretch {
      align-items: stretch !important
    }

    .align-content-lg-start {
      align-content: flex-start !important
    }

    .align-content-lg-end {
      align-content: flex-end !important
    }

    .align-content-lg-center {
      align-content: center !important
    }

    .align-content-lg-between {
      align-content: space-between !important
    }

    .align-content-lg-around {
      align-content: space-around !important
    }

    .align-content-lg-stretch {
      align-content: stretch !important
    }

    .align-self-lg-auto {
      align-self: auto !important
    }

    .align-self-lg-start {
      align-self: flex-start !important
    }

    .align-self-lg-end {
      align-self: flex-end !important
    }

    .align-self-lg-center {
      align-self: center !important
    }

    .align-self-lg-baseline {
      align-self: baseline !important
    }

    .align-self-lg-stretch {
      align-self: stretch !important
    }
  }

  @media (min-width: 1240px) {
    .flex-xl-row {
      flex-direction:row !important
    }

    .flex-xl-column {
      flex-direction: column !important
    }

    .flex-xl-row-reverse {
      flex-direction: row-reverse !important
    }

    .flex-xl-column-reverse {
      flex-direction: column-reverse !important
    }

    .flex-xl-wrap {
      flex-wrap: wrap !important
    }

    .flex-xl-nowrap {
      flex-wrap: nowrap !important
    }

    .flex-xl-wrap-reverse {
      flex-wrap: wrap-reverse !important
    }

    .justify-content-xl-start {
      justify-content: flex-start !important
    }

    .justify-content-xl-end {
      justify-content: flex-end !important
    }

    .justify-content-xl-center {
      justify-content: center !important
    }

    .justify-content-xl-between {
      justify-content: space-between !important
    }

    .justify-content-xl-around {
      justify-content: space-around !important
    }

    .align-items-xl-start {
      align-items: flex-start !important
    }

    .align-items-xl-end {
      align-items: flex-end !important
    }

    .align-items-xl-center {
      align-items: center !important
    }

    .align-items-xl-baseline {
      align-items: baseline !important
    }

    .align-items-xl-stretch {
      align-items: stretch !important
    }

    .align-content-xl-start {
      align-content: flex-start !important
    }

    .align-content-xl-end {
      align-content: flex-end !important
    }

    .align-content-xl-center {
      align-content: center !important
    }

    .align-content-xl-between {
      align-content: space-between !important
    }

    .align-content-xl-around {
      align-content: space-around !important
    }

    .align-content-xl-stretch {
      align-content: stretch !important
    }

    .align-self-xl-auto {
      align-self: auto !important
    }

    .align-self-xl-start {
      align-self: flex-start !important
    }

    .align-self-xl-end {
      align-self: flex-end !important
    }

    .align-self-xl-center {
      align-self: center !important
    }

    .align-self-xl-baseline {
      align-self: baseline !important
    }

    .align-self-xl-stretch {
      align-self: stretch !important
    }
  }

  .float-left {
    float: left !important
  }

  .float-right {
    float: right !important
  }

  .float-none {
    float: none !important
  }

  @media (min-width: 576px) {
    .float-sm-left {
      float:left !important
    }

    .float-sm-right {
      float: right !important
    }

    .float-sm-none {
      float: none !important
    }
  }

  @media (min-width: 768px) {
    .float-md-left {
      float:left !important
    }

    .float-md-right {
      float: right !important
    }

    .float-md-none {
      float: none !important
    }
  }

  @media (min-width: 992px) {
    .float-lg-left {
      float:left !important
    }

    .float-lg-right {
      float: right !important
    }

    .float-lg-none {
      float: none !important
    }
  }

  @media (min-width: 1240px) {
    .float-xl-left {
      float:left !important
    }

    .float-xl-right {
      float: right !important
    }

    .float-xl-none {
      float: none !important
    }
  }

  .position-static {
    position: static !important
  }

  .position-relative {
    position: relative !important
  }

  .position-absolute {
    position: absolute !important
  }

  .position-fixed {
    position: fixed !important
  }

  .position-sticky {
    position: sticky !important
  }

  .fixed-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030
  }

  .fixed-bottom {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1030
  }

  @supports (position: sticky) {
    .sticky-top {
      position:sticky;
      top: 0;
      z-index: 1020
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
    border: 0
  }

  .sr-only-focusable:active,.sr-only-focusable:focus {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip: auto;
    white-space: normal;
    clip-path: none
  }

  .w-25 {
    width: 25% !important
  }

  .w-50 {
    width: 50% !important
  }

  .w-75 {
    width: 75% !important
  }

  .w-100 {
    width: 100% !important
  }

  .h-25 {
    height: 25% !important
  }

  .h-50 {
    height: 50% !important
  }

  .h-75 {
    height: 75% !important
  }

  .h-100 {
    height: 100% !important
  }

  .mw-100 {
    max-width: 100% !important
  }

  .mh-100 {
    max-height: 100% !important
  }

  .m-0 {
    margin: 0 !important
  }

  .mt-0,.my-0 {
    margin-top: 0 !important
  }

  .mr-0,.mx-0 {
    margin-right: 0 !important
  }

  .mb-0,.my-0 {
    margin-bottom: 0 !important
  }

  .ml-0,.mx-0 {
    margin-left: 0 !important
  }

  .m-1 {
    margin: .25rem !important
  }

  .mt-1,.my-1 {
    margin-top: .25rem !important
  }

  .mr-1,.mx-1 {
    margin-right: .25rem !important
  }

  .mb-1,.my-1 {
    margin-bottom: .25rem !important
  }

  .ml-1,.mx-1 {
    margin-left: .25rem !important
  }

  .m-2 {
    margin: .5rem !important
  }

  .mt-2,.my-2 {
    margin-top: .5rem !important
  }

  .mr-2,.mx-2 {
    margin-right: .5rem !important
  }

  .mb-2,.my-2 {
    margin-bottom: .5rem !important
  }

  .ml-2,.mx-2 {
    margin-left: .5rem !important
  }

  .m-3 {
    margin: 1rem !important
  }

  .mt-3,.my-3 {
    margin-top: 1rem !important
  }

  .mr-3,.mx-3 {
    margin-right: 1rem !important
  }

  .mb-3,.my-3 {
    margin-bottom: 1rem !important
  }

  .ml-3,.mx-3 {
    margin-left: 1rem !important
  }

  .m-4 {
    margin: 1.5rem !important
  }

  .mt-4,.my-4 {
    margin-top: 1.5rem !important
  }

  .mr-4,.mx-4 {
    margin-right: 1.5rem !important
  }

  .mb-4,.my-4 {
    margin-bottom: 1.5rem !important
  }

  .ml-4,.mx-4 {
    margin-left: 1.5rem !important
  }

  .m-5 {
    margin: 3rem !important
  }

  .mt-5,.my-5 {
    margin-top: 3rem !important
  }

  .mr-5,.mx-5 {
    margin-right: 3rem !important
  }

  .mb-5,.my-5 {
    margin-bottom: 3rem !important
  }

  .ml-5,.mx-5 {
    margin-left: 3rem !important
  }

  .p-0 {
    padding: 0 !important
  }

  .pt-0,.py-0 {
    padding-top: 0 !important
  }

  .pr-0,.px-0 {
    padding-right: 0 !important
  }

  .pb-0,.py-0 {
    padding-bottom: 0 !important
  }

  .pl-0,.px-0 {
    padding-left: 0 !important
  }

  .p-1 {
    padding: .25rem !important
  }

  .pt-1,.py-1 {
    padding-top: .25rem !important
  }

  .pr-1,.px-1 {
    padding-right: .25rem !important
  }

  .pb-1,.py-1 {
    padding-bottom: .25rem !important
  }

  .pl-1,.px-1 {
    padding-left: .25rem !important
  }

  .p-2 {
    padding: .5rem !important
  }

  .pt-2,.py-2 {
    padding-top: .5rem !important
  }

  .pr-2,.px-2 {
    padding-right: .5rem !important
  }

  .pb-2,.py-2 {
    padding-bottom: .5rem !important
  }

  .pl-2,.px-2 {
    padding-left: .5rem !important
  }

  .p-3 {
    padding: 1rem !important
  }

  .pt-3,.py-3 {
    padding-top: 1rem !important
  }

  .pr-3,.px-3 {
    padding-right: 1rem !important
  }

  .pb-3,.py-3 {
    padding-bottom: 1rem !important
  }

  .pl-3,.px-3 {
    padding-left: 1rem !important
  }

  .p-4 {
    padding: 1.5rem !important
  }

  .pt-4,.py-4 {
    padding-top: 1.5rem !important
  }

  .pr-4,.px-4 {
    padding-right: 1.5rem !important
  }

  .pb-4,.py-4 {
    padding-bottom: 1.5rem !important
  }

  .pl-4,.px-4 {
    padding-left: 1.5rem !important
  }

  .p-5 {
    padding: 3rem !important
  }

  .pt-5,.py-5 {
    padding-top: 3rem !important
  }

  .pr-5,.px-5 {
    padding-right: 3rem !important
  }

  .pb-5,.py-5 {
    padding-bottom: 3rem !important
  }

  .pl-5,.px-5 {
    padding-left: 3rem !important
  }

  .m-auto {
    margin: auto !important
  }

  .mt-auto,.my-auto {
    margin-top: auto !important
  }

  .mr-auto,.mx-auto {
    margin-right: auto !important
  }

  .mb-auto,.my-auto {
    margin-bottom: auto !important
  }

  .ml-auto,.mx-auto {
    margin-left: auto !important
  }

  @media (min-width: 576px) {
    .m-sm-0 {
      margin:0 !important
    }

    .mt-sm-0,.my-sm-0 {
      margin-top: 0 !important
    }

    .mr-sm-0,.mx-sm-0 {
      margin-right: 0 !important
    }

    .mb-sm-0,.my-sm-0 {
      margin-bottom: 0 !important
    }

    .ml-sm-0,.mx-sm-0 {
      margin-left: 0 !important
    }

    .m-sm-1 {
      margin: .25rem !important
    }

    .mt-sm-1,.my-sm-1 {
      margin-top: .25rem !important
    }

    .mr-sm-1,.mx-sm-1 {
      margin-right: .25rem !important
    }

    .mb-sm-1,.my-sm-1 {
      margin-bottom: .25rem !important
    }

    .ml-sm-1,.mx-sm-1 {
      margin-left: .25rem !important
    }

    .m-sm-2 {
      margin: .5rem !important
    }

    .mt-sm-2,.my-sm-2 {
      margin-top: .5rem !important
    }

    .mr-sm-2,.mx-sm-2 {
      margin-right: .5rem !important
    }

    .mb-sm-2,.my-sm-2 {
      margin-bottom: .5rem !important
    }

    .ml-sm-2,.mx-sm-2 {
      margin-left: .5rem !important
    }

    .m-sm-3 {
      margin: 1rem !important
    }

    .mt-sm-3,.my-sm-3 {
      margin-top: 1rem !important
    }

    .mr-sm-3,.mx-sm-3 {
      margin-right: 1rem !important
    }

    .mb-sm-3,.my-sm-3 {
      margin-bottom: 1rem !important
    }

    .ml-sm-3,.mx-sm-3 {
      margin-left: 1rem !important
    }

    .m-sm-4 {
      margin: 1.5rem !important
    }

    .mt-sm-4,.my-sm-4 {
      margin-top: 1.5rem !important
    }

    .mr-sm-4,.mx-sm-4 {
      margin-right: 1.5rem !important
    }

    .mb-sm-4,.my-sm-4 {
      margin-bottom: 1.5rem !important
    }

    .ml-sm-4,.mx-sm-4 {
      margin-left: 1.5rem !important
    }

    .m-sm-5 {
      margin: 3rem !important
    }

    .mt-sm-5,.my-sm-5 {
      margin-top: 3rem !important
    }

    .mr-sm-5,.mx-sm-5 {
      margin-right: 3rem !important
    }

    .mb-sm-5,.my-sm-5 {
      margin-bottom: 3rem !important
    }

    .ml-sm-5,.mx-sm-5 {
      margin-left: 3rem !important
    }

    .p-sm-0 {
      padding: 0 !important
    }

    .pt-sm-0,.py-sm-0 {
      padding-top: 0 !important
    }

    .pr-sm-0,.px-sm-0 {
      padding-right: 0 !important
    }

    .pb-sm-0,.py-sm-0 {
      padding-bottom: 0 !important
    }

    .pl-sm-0,.px-sm-0 {
      padding-left: 0 !important
    }

    .p-sm-1 {
      padding: .25rem !important
    }

    .pt-sm-1,.py-sm-1 {
      padding-top: .25rem !important
    }

    .pr-sm-1,.px-sm-1 {
      padding-right: .25rem !important
    }

    .pb-sm-1,.py-sm-1 {
      padding-bottom: .25rem !important
    }

    .pl-sm-1,.px-sm-1 {
      padding-left: .25rem !important
    }

    .p-sm-2 {
      padding: .5rem !important
    }

    .pt-sm-2,.py-sm-2 {
      padding-top: .5rem !important
    }

    .pr-sm-2,.px-sm-2 {
      padding-right: .5rem !important
    }

    .pb-sm-2,.py-sm-2 {
      padding-bottom: .5rem !important
    }

    .pl-sm-2,.px-sm-2 {
      padding-left: .5rem !important
    }

    .p-sm-3 {
      padding: 1rem !important
    }

    .pt-sm-3,.py-sm-3 {
      padding-top: 1rem !important
    }

    .pr-sm-3,.px-sm-3 {
      padding-right: 1rem !important
    }

    .pb-sm-3,.py-sm-3 {
      padding-bottom: 1rem !important
    }

    .pl-sm-3,.px-sm-3 {
      padding-left: 1rem !important
    }

    .p-sm-4 {
      padding: 1.5rem !important
    }

    .pt-sm-4,.py-sm-4 {
      padding-top: 1.5rem !important
    }

    .pr-sm-4,.px-sm-4 {
      padding-right: 1.5rem !important
    }

    .pb-sm-4,.py-sm-4 {
      padding-bottom: 1.5rem !important
    }

    .pl-sm-4,.px-sm-4 {
      padding-left: 1.5rem !important
    }

    .p-sm-5 {
      padding: 3rem !important
    }

    .pt-sm-5,.py-sm-5 {
      padding-top: 3rem !important
    }

    .pr-sm-5,.px-sm-5 {
      padding-right: 3rem !important
    }

    .pb-sm-5,.py-sm-5 {
      padding-bottom: 3rem !important
    }

    .pl-sm-5,.px-sm-5 {
      padding-left: 3rem !important
    }

    .m-sm-auto {
      margin: auto !important
    }

    .mt-sm-auto,.my-sm-auto {
      margin-top: auto !important
    }

    .mr-sm-auto,.mx-sm-auto {
      margin-right: auto !important
    }

    .mb-sm-auto,.my-sm-auto {
      margin-bottom: auto !important
    }

    .ml-sm-auto,.mx-sm-auto {
      margin-left: auto !important
    }
  }

  @media (min-width: 768px) {
    .m-md-0 {
      margin:0 !important
    }

    .mt-md-0,.my-md-0 {
      margin-top: 0 !important
    }

    .mr-md-0,.mx-md-0 {
      margin-right: 0 !important
    }

    .mb-md-0,.my-md-0 {
      margin-bottom: 0 !important
    }

    .ml-md-0,.mx-md-0 {
      margin-left: 0 !important
    }

    .m-md-1 {
      margin: .25rem !important
    }

    .mt-md-1,.my-md-1 {
      margin-top: .25rem !important
    }

    .mr-md-1,.mx-md-1 {
      margin-right: .25rem !important
    }

    .mb-md-1,.my-md-1 {
      margin-bottom: .25rem !important
    }

    .ml-md-1,.mx-md-1 {
      margin-left: .25rem !important
    }

    .m-md-2 {
      margin: .5rem !important
    }

    .mt-md-2,.my-md-2 {
      margin-top: .5rem !important
    }

    .mr-md-2,.mx-md-2 {
      margin-right: .5rem !important
    }

    .mb-md-2,.my-md-2 {
      margin-bottom: .5rem !important
    }

    .ml-md-2,.mx-md-2 {
      margin-left: .5rem !important
    }

    .m-md-3 {
      margin: 1rem !important
    }

    .mt-md-3,.my-md-3 {
      margin-top: 1rem !important
    }

    .mr-md-3,.mx-md-3 {
      margin-right: 1rem !important
    }

    .mb-md-3,.my-md-3 {
      margin-bottom: 1rem !important
    }

    .ml-md-3,.mx-md-3 {
      margin-left: 1rem !important
    }

    .m-md-4 {
      margin: 1.5rem !important
    }

    .mt-md-4,.my-md-4 {
      margin-top: 1.5rem !important
    }

    .mr-md-4,.mx-md-4 {
      margin-right: 1.5rem !important
    }

    .mb-md-4,.my-md-4 {
      margin-bottom: 1.5rem !important
    }

    .ml-md-4,.mx-md-4 {
      margin-left: 1.5rem !important
    }

    .m-md-5 {
      margin: 3rem !important
    }

    .mt-md-5,.my-md-5 {
      margin-top: 3rem !important
    }

    .mr-md-5,.mx-md-5 {
      margin-right: 3rem !important
    }

    .mb-md-5,.my-md-5 {
      margin-bottom: 3rem !important
    }

    .ml-md-5,.mx-md-5 {
      margin-left: 3rem !important
    }

    .p-md-0 {
      padding: 0 !important
    }

    .pt-md-0,.py-md-0 {
      padding-top: 0 !important
    }

    .pr-md-0,.px-md-0 {
      padding-right: 0 !important
    }

    .pb-md-0,.py-md-0 {
      padding-bottom: 0 !important
    }

    .pl-md-0,.px-md-0 {
      padding-left: 0 !important
    }

    .p-md-1 {
      padding: .25rem !important
    }

    .pt-md-1,.py-md-1 {
      padding-top: .25rem !important
    }

    .pr-md-1,.px-md-1 {
      padding-right: .25rem !important
    }

    .pb-md-1,.py-md-1 {
      padding-bottom: .25rem !important
    }

    .pl-md-1,.px-md-1 {
      padding-left: .25rem !important
    }

    .p-md-2 {
      padding: .5rem !important
    }

    .pt-md-2,.py-md-2 {
      padding-top: .5rem !important
    }

    .pr-md-2,.px-md-2 {
      padding-right: .5rem !important
    }

    .pb-md-2,.py-md-2 {
      padding-bottom: .5rem !important
    }

    .pl-md-2,.px-md-2 {
      padding-left: .5rem !important
    }

    .p-md-3 {
      padding: 1rem !important
    }

    .pt-md-3,.py-md-3 {
      padding-top: 1rem !important
    }

    .pr-md-3,.px-md-3 {
      padding-right: 1rem !important
    }

    .pb-md-3,.py-md-3 {
      padding-bottom: 1rem !important
    }

    .pl-md-3,.px-md-3 {
      padding-left: 1rem !important
    }

    .p-md-4 {
      padding: 1.5rem !important
    }

    .pt-md-4,.py-md-4 {
      padding-top: 1.5rem !important
    }

    .pr-md-4,.px-md-4 {
      padding-right: 1.5rem !important
    }

    .pb-md-4,.py-md-4 {
      padding-bottom: 1.5rem !important
    }

    .pl-md-4,.px-md-4 {
      padding-left: 1.5rem !important
    }

    .p-md-5 {
      padding: 3rem !important
    }

    .pt-md-5,.py-md-5 {
      padding-top: 3rem !important
    }

    .pr-md-5,.px-md-5 {
      padding-right: 3rem !important
    }

    .pb-md-5,.py-md-5 {
      padding-bottom: 3rem !important
    }

    .pl-md-5,.px-md-5 {
      padding-left: 3rem !important
    }

    .m-md-auto {
      margin: auto !important
    }

    .mt-md-auto,.my-md-auto {
      margin-top: auto !important
    }

    .mr-md-auto,.mx-md-auto {
      margin-right: auto !important
    }

    .mb-md-auto,.my-md-auto {
      margin-bottom: auto !important
    }

    .ml-md-auto,.mx-md-auto {
      margin-left: auto !important
    }
  }

  @media (min-width: 992px) {
    .m-lg-0 {
      margin:0 !important
    }

    .mt-lg-0,.my-lg-0 {
      margin-top: 0 !important
    }

    .mr-lg-0,.mx-lg-0 {
      margin-right: 0 !important
    }

    .mb-lg-0,.my-lg-0 {
      margin-bottom: 0 !important
    }

    .ml-lg-0,.mx-lg-0 {
      margin-left: 0 !important
    }

    .m-lg-1 {
      margin: .25rem !important
    }

    .mt-lg-1,.my-lg-1 {
      margin-top: .25rem !important
    }

    .mr-lg-1,.mx-lg-1 {
      margin-right: .25rem !important
    }

    .mb-lg-1,.my-lg-1 {
      margin-bottom: .25rem !important
    }

    .ml-lg-1,.mx-lg-1 {
      margin-left: .25rem !important
    }

    .m-lg-2 {
      margin: .5rem !important
    }

    .mt-lg-2,.my-lg-2 {
      margin-top: .5rem !important
    }

    .mr-lg-2,.mx-lg-2 {
      margin-right: .5rem !important
    }

    .mb-lg-2,.my-lg-2 {
      margin-bottom: .5rem !important
    }

    .ml-lg-2,.mx-lg-2 {
      margin-left: .5rem !important
    }

    .m-lg-3 {
      margin: 1rem !important
    }

    .mt-lg-3,.my-lg-3 {
      margin-top: 1rem !important
    }

    .mr-lg-3,.mx-lg-3 {
      margin-right: 1rem !important
    }

    .mb-lg-3,.my-lg-3 {
      margin-bottom: 1rem !important
    }

    .ml-lg-3,.mx-lg-3 {
      margin-left: 1rem !important
    }

    .m-lg-4 {
      margin: 1.5rem !important
    }

    .mt-lg-4,.my-lg-4 {
      margin-top: 1.5rem !important
    }

    .mr-lg-4,.mx-lg-4 {
      margin-right: 1.5rem !important
    }

    .mb-lg-4,.my-lg-4 {
      margin-bottom: 1.5rem !important
    }

    .ml-lg-4,.mx-lg-4 {
      margin-left: 1.5rem !important
    }

    .m-lg-5 {
      margin: 3rem !important
    }

    .mt-lg-5,.my-lg-5 {
      margin-top: 3rem !important
    }

    .mr-lg-5,.mx-lg-5 {
      margin-right: 3rem !important
    }

    .mb-lg-5,.my-lg-5 {
      margin-bottom: 3rem !important
    }

    .ml-lg-5,.mx-lg-5 {
      margin-left: 3rem !important
    }

    .p-lg-0 {
      padding: 0 !important
    }

    .pt-lg-0,.py-lg-0 {
      padding-top: 0 !important
    }

    .pr-lg-0,.px-lg-0 {
      padding-right: 0 !important
    }

    .pb-lg-0,.py-lg-0 {
      padding-bottom: 0 !important
    }

    .pl-lg-0,.px-lg-0 {
      padding-left: 0 !important
    }

    .p-lg-1 {
      padding: .25rem !important
    }

    .pt-lg-1,.py-lg-1 {
      padding-top: .25rem !important
    }

    .pr-lg-1,.px-lg-1 {
      padding-right: .25rem !important
    }

    .pb-lg-1,.py-lg-1 {
      padding-bottom: .25rem !important
    }

    .pl-lg-1,.px-lg-1 {
      padding-left: .25rem !important
    }

    .p-lg-2 {
      padding: .5rem !important
    }

    .pt-lg-2,.py-lg-2 {
      padding-top: .5rem !important
    }

    .pr-lg-2,.px-lg-2 {
      padding-right: .5rem !important
    }

    .pb-lg-2,.py-lg-2 {
      padding-bottom: .5rem !important
    }

    .pl-lg-2,.px-lg-2 {
      padding-left: .5rem !important
    }

    .p-lg-3 {
      padding: 1rem !important
    }

    .pt-lg-3,.py-lg-3 {
      padding-top: 1rem !important
    }

    .pr-lg-3,.px-lg-3 {
      padding-right: 1rem !important
    }

    .pb-lg-3,.py-lg-3 {
      padding-bottom: 1rem !important
    }

    .pl-lg-3,.px-lg-3 {
      padding-left: 1rem !important
    }

    .p-lg-4 {
      padding: 1.5rem !important
    }

    .pt-lg-4,.py-lg-4 {
      padding-top: 1.5rem !important
    }

    .pr-lg-4,.px-lg-4 {
      padding-right: 1.5rem !important
    }

    .pb-lg-4,.py-lg-4 {
      padding-bottom: 1.5rem !important
    }

    .pl-lg-4,.px-lg-4 {
      padding-left: 1.5rem !important
    }

    .p-lg-5 {
      padding: 3rem !important
    }

    .pt-lg-5,.py-lg-5 {
      padding-top: 3rem !important
    }

    .pr-lg-5,.px-lg-5 {
      padding-right: 3rem !important
    }

    .pb-lg-5,.py-lg-5 {
      padding-bottom: 3rem !important
    }

    .pl-lg-5,.px-lg-5 {
      padding-left: 3rem !important
    }

    .m-lg-auto {
      margin: auto !important
    }

    .mt-lg-auto,.my-lg-auto {
      margin-top: auto !important
    }

    .mr-lg-auto,.mx-lg-auto {
      margin-right: auto !important
    }

    .mb-lg-auto,.my-lg-auto {
      margin-bottom: auto !important
    }

    .ml-lg-auto,.mx-lg-auto {
      margin-left: auto !important
    }
  }

  @media (min-width: 1240px) {
    .m-xl-0 {
      margin:0 !important
    }

    .mt-xl-0,.my-xl-0 {
      margin-top: 0 !important
    }

    .mr-xl-0,.mx-xl-0 {
      margin-right: 0 !important
    }

    .mb-xl-0,.my-xl-0 {
      margin-bottom: 0 !important
    }

    .ml-xl-0,.mx-xl-0 {
      margin-left: 0 !important
    }

    .m-xl-1 {
      margin: .25rem !important
    }

    .mt-xl-1,.my-xl-1 {
      margin-top: .25rem !important
    }

    .mr-xl-1,.mx-xl-1 {
      margin-right: .25rem !important
    }

    .mb-xl-1,.my-xl-1 {
      margin-bottom: .25rem !important
    }

    .ml-xl-1,.mx-xl-1 {
      margin-left: .25rem !important
    }

    .m-xl-2 {
      margin: .5rem !important
    }

    .mt-xl-2,.my-xl-2 {
      margin-top: .5rem !important
    }

    .mr-xl-2,.mx-xl-2 {
      margin-right: .5rem !important
    }

    .mb-xl-2,.my-xl-2 {
      margin-bottom: .5rem !important
    }

    .ml-xl-2,.mx-xl-2 {
      margin-left: .5rem !important
    }

    .m-xl-3 {
      margin: 1rem !important
    }

    .mt-xl-3,.my-xl-3 {
      margin-top: 1rem !important
    }

    .mr-xl-3,.mx-xl-3 {
      margin-right: 1rem !important
    }

    .mb-xl-3,.my-xl-3 {
      margin-bottom: 1rem !important
    }

    .ml-xl-3,.mx-xl-3 {
      margin-left: 1rem !important
    }

    .m-xl-4 {
      margin: 1.5rem !important
    }

    .mt-xl-4,.my-xl-4 {
      margin-top: 1.5rem !important
    }

    .mr-xl-4,.mx-xl-4 {
      margin-right: 1.5rem !important
    }

    .mb-xl-4,.my-xl-4 {
      margin-bottom: 1.5rem !important
    }

    .ml-xl-4,.mx-xl-4 {
      margin-left: 1.5rem !important
    }

    .m-xl-5 {
      margin: 3rem !important
    }

    .mt-xl-5,.my-xl-5 {
      margin-top: 3rem !important
    }

    .mr-xl-5,.mx-xl-5 {
      margin-right: 3rem !important
    }

    .mb-xl-5,.my-xl-5 {
      margin-bottom: 3rem !important
    }

    .ml-xl-5,.mx-xl-5 {
      margin-left: 3rem !important
    }

    .p-xl-0 {
      padding: 0 !important
    }

    .pt-xl-0,.py-xl-0 {
      padding-top: 0 !important
    }

    .pr-xl-0,.px-xl-0 {
      padding-right: 0 !important
    }

    .pb-xl-0,.py-xl-0 {
      padding-bottom: 0 !important
    }

    .pl-xl-0,.px-xl-0 {
      padding-left: 0 !important
    }

    .p-xl-1 {
      padding: .25rem !important
    }

    .pt-xl-1,.py-xl-1 {
      padding-top: .25rem !important
    }

    .pr-xl-1,.px-xl-1 {
      padding-right: .25rem !important
    }

    .pb-xl-1,.py-xl-1 {
      padding-bottom: .25rem !important
    }

    .pl-xl-1,.px-xl-1 {
      padding-left: .25rem !important
    }

    .p-xl-2 {
      padding: .5rem !important
    }

    .pt-xl-2,.py-xl-2 {
      padding-top: .5rem !important
    }

    .pr-xl-2,.px-xl-2 {
      padding-right: .5rem !important
    }

    .pb-xl-2,.py-xl-2 {
      padding-bottom: .5rem !important
    }

    .pl-xl-2,.px-xl-2 {
      padding-left: .5rem !important
    }

    .p-xl-3 {
      padding: 1rem !important
    }

    .pt-xl-3,.py-xl-3 {
      padding-top: 1rem !important
    }

    .pr-xl-3,.px-xl-3 {
      padding-right: 1rem !important
    }

    .pb-xl-3,.py-xl-3 {
      padding-bottom: 1rem !important
    }

    .pl-xl-3,.px-xl-3 {
      padding-left: 1rem !important
    }

    .p-xl-4 {
      padding: 1.5rem !important
    }

    .pt-xl-4,.py-xl-4 {
      padding-top: 1.5rem !important
    }

    .pr-xl-4,.px-xl-4 {
      padding-right: 1.5rem !important
    }

    .pb-xl-4,.py-xl-4 {
      padding-bottom: 1.5rem !important
    }

    .pl-xl-4,.px-xl-4 {
      padding-left: 1.5rem !important
    }

    .p-xl-5 {
      padding: 3rem !important
    }

    .pt-xl-5,.py-xl-5 {
      padding-top: 3rem !important
    }

    .pr-xl-5,.px-xl-5 {
      padding-right: 3rem !important
    }

    .pb-xl-5,.py-xl-5 {
      padding-bottom: 3rem !important
    }

    .pl-xl-5,.px-xl-5 {
      padding-left: 3rem !important
    }

    .m-xl-auto {
      margin: auto !important
    }

    .mt-xl-auto,.my-xl-auto {
      margin-top: auto !important
    }

    .mr-xl-auto,.mx-xl-auto {
      margin-right: auto !important
    }

    .mb-xl-auto,.my-xl-auto {
      margin-bottom: auto !important
    }

    .ml-xl-auto,.mx-xl-auto {
      margin-left: auto !important
    }
  }

  .text-justify {
    text-align: justify !important
  }

  .text-nowrap {
    white-space: nowrap !important
  }

  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  .text-left {
    text-align: left !important
  }

  .text-right {
    text-align: right !important
  }

  .text-center {
    text-align: center !important
  }

  @media (min-width: 576px) {
    .text-sm-left {
      text-align:left !important
    }

    .text-sm-right {
      text-align: right !important
    }

    .text-sm-center {
      text-align: center !important
    }
  }

  @media (min-width: 768px) {
    .text-md-left {
      text-align:left !important
    }

    .text-md-right {
      text-align: right !important
    }

    .text-md-center {
      text-align: center !important
    }
  }

  @media (min-width: 992px) {
    .text-lg-left {
      text-align:left !important
    }

    .text-lg-right {
      text-align: right !important
    }

    .text-lg-center {
      text-align: center !important
    }
  }

  @media (min-width: 1240px) {
    .text-xl-left {
      text-align:left !important
    }

    .text-xl-right {
      text-align: right !important
    }

    .text-xl-center {
      text-align: center !important
    }
  }

  .text-lowercase {
    text-transform: lowercase !important
  }

  .text-uppercase {
    text-transform: uppercase !important
  }

  .text-capitalize {
    text-transform: capitalize !important
  }

  .font-weight-light {
    font-weight: 300 !important
  }

  .font-weight-normal {
    font-weight: normal !important
  }

  .font-weight-bold {
    font-weight: bold !important
  }

  .font-italic {
    font-style: italic !important
  }

  .text-white {
    color: #fff !important
  }

  .text-primary {
    color: #007bff !important
  }

  a.text-primary:focus,a.text-primary:hover {
    color: #0062cc !important
  }

  .text-secondary {
    color: #868e96 !important
  }

  a.text-secondary:focus,a.text-secondary:hover {
    color: #6c757d !important
  }

  .text-success {
    color: #28a745 !important
  }

  a.text-success:focus,a.text-success:hover {
    color: #1e7e34 !important
  }

  .text-info {
    color: #17a2b8 !important
  }

  a.text-info:focus,a.text-info:hover {
    color: #117a8b !important
  }

  .text-warning {
    color: #ffc107 !important
  }

  a.text-warning:focus,a.text-warning:hover {
    color: #d39e00 !important
  }

  .text-danger {
    color: #dc3545 !important
  }

  a.text-danger:focus,a.text-danger:hover {
    color: #bd2130 !important
  }

  .text-light {
    color: #f8f9fa !important
  }

  a.text-light:focus,a.text-light:hover {
    color: #dae0e5 !important
  }

  .text-dark {
    color: #343a40 !important
  }

  a.text-dark:focus,a.text-dark:hover {
    color: #1d2124 !important
  }

  .text-muted {
    color: #868e96 !important
  }

  .text-hide {
    font: 0/0 a;
    color: transparent;
    text-shadow: none;
    background-color: transparent;
    border: 0
  }

  .visible {
    visibility: visible !important
  }

  .invisible {
    visibility: hidden !important
  }

  /*! Flickity v2.0.10
http://flickity.metafizzy.co
---------------------------------------------- */
  .flickity-enabled {
    position: relative
  }

  .flickity-enabled:focus {
    outline: none
  }

  .flickity-viewport {
    overflow: hidden;
    position: relative;
    height: 100%
  }

  .flickity-slider {
    position: absolute;
    width: 100%;
    height: 100%
  }

  .flickity-enabled.is-draggable {
    -webkit-tap-highlight-color: transparent;
    tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .flickity-enabled.is-draggable .flickity-viewport {
    cursor: move;
    cursor: -webkit-grab;
    cursor: grab
  }

  .flickity-enabled.is-draggable .flickity-viewport.is-pointer-down {
    cursor: -webkit-grabbing;
    cursor: grabbing
  }

  .flickity-prev-next-button {
    position: absolute;
    top: 50%;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: white;
    background: rgba(255,255,255,0.75);
    cursor: pointer;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%)
  }

  .flickity-prev-next-button:hover {
    background: white
  }

  .flickity-prev-next-button:focus {
    outline: none;
    box-shadow: 0 0 0 5px #09F
  }

  .flickity-prev-next-button:active {
    opacity: 0.6
  }

  .flickity-prev-next-button.previous {
    left: 10px
  }

  .flickity-prev-next-button.next {
    right: 10px
  }

  .flickity-rtl .flickity-prev-next-button.previous {
    left: auto;
    right: 10px
  }

  .flickity-rtl .flickity-prev-next-button.next {
    right: auto;
    left: 10px
  }

  .flickity-prev-next-button:disabled {
    opacity: 0.3;
    cursor: auto
  }

  .flickity-prev-next-button svg {
    position: absolute;
    left: 20%;
    top: 20%;
    width: 60%;
    height: 60%
  }

  .flickity-prev-next-button .arrow {
    fill: #333
  }

  .flickity-page-dots {
    position: absolute;
    width: 100%;
    bottom: -25px;
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: center;
    line-height: 1
  }

  .flickity-rtl .flickity-page-dots {
    direction: rtl
  }

  .flickity-page-dots .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 8px;
    background: #333;
    border-radius: 50%;
    opacity: 0.25;
    cursor: pointer
  }

  .flickity-page-dots .dot.is-selected {
    opacity: 1
  }

  ::selection {
    background: #f9d243;
  }

  html {
    overflow: hidden
  }

  html,body {
    position: relative;
    color: #64656f;
    background: #F5F5F5
  }

  .barba-container>section:not(.slide-spacer) {
    background: #F5F5F5
  }

  .barba-container+.barba-container {
    display: none
  }

  h1 {
    font-family: 'MajestiBanner-Bold';
    font-size: 60px;
    line-height: 50px;
    margin-bottom: 60px
  }

  body.inverse .navbar-brand,body.inverse .navbar-nav li a,body.inverse h1,body.inverse p,body.inverse a {
    color: white
  }

  body.inverse .navbar-nav li .nav-link:after {
    border-bottom: solid 1px white !important
  }

  p {
    font-family: 'Calibre-Regular';
    color: #4C4D58;
    letter-spacing: 0.5px;
    line-height: 1.6;
    font-size: 17px
  }

  p a {
    color: black;
    text-decoration: underline
  }

  .mask-transition {
    background-color: #fdfdfd;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    width: 100%
  }

  .scene {
    position: relative;
    z-index: 10
  }

  main {
    position: relative
  }

  section {
    position: relative;
    z-index: 10
  }

  section.slide {
    height: 100vh;
    width: 100%
  }

  section.slide-spacer {
    height: 0;
    margin-bottom: 100vh;
    pointer-events: none
  }

  .page-overlay {
    background: #f5f5f5;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 900;
    opacity: 0;
    visibility: hidden
  }

  .btn-forward {
    font-family: 'Calibre-Medium';
    font-size: 17px;
    line-height: 100%;
    color: #262633;
    border-radius: 0;
    border: 0;
    padding: 5px 20px 5px 0;
    margin-top: 5px;
    text-decoration: none;
    transition: color 0.5s
  }

  .btn-forward .icon {
    margin-left: 15px;
    display: inline-block;
    vertical-align: middle;
    transition: transform 0.5s
  }

  .btn-forward .icon .triangle {
    fill: #262633;
    transition: fill 0.5s
  }

  .btn-forward:hover,.btn-forward:focus {
    color: #f03232
  }

  .btn-forward:hover .icon,.btn-forward:focus .icon {
    transform: translateX(-7px)
  }

  .btn-forward:hover .icon .triangle,.btn-forward:focus .icon .triangle {
    fill: #f03232
  }

  @media (max-width: 767px) {
    .row-mobile-padding {
      padding-left:25px;
      padding-right: 25px
    }
  }

  @media (max-width: 767px) {
    .col-mobile-padding {
      padding-left:45px;
      padding-right: 45px
    }
  }

  @media (max-width: 767px) {
    p.first {
      margin-top:10px
    }
  }

  .block-text-expertises h4 {
    transform: rotate(-90deg) translate(0, 40px);
    transform-origin: 0 0;
    position: absolute
  }

  @media (max-width: 991px) {
    .block-text-expertises h4 {
      display:none
    }
  }

  .block-text-expertises:before {
    content: none
  }

  @media (max-width: 991px) {
    .block-text-expertises:after {
      content:none
    }
  }

  .btn-scroll-down {
    display: inline-block;
    color: #262633;
    font-family: 'Calibre-Medium';
    letter-spacing: 1px;
    font-size: 14px;
    cursor: pointer;
    margin-left: -45px;
    position: relative
  }

  .btn-scroll-down .main-circle {
    transition: fill 0.8s
  }

  .btn-scroll-down .outer-circle {
    stroke: rgba(4,5,21,0.1)
  }

  .btn-scroll-down .bottom-line {
    position: absolute;
    height: 80px;
    border-left: 1px solid rgba(4,5,21,0.1);
    top: 100%;
    margin-top: 30px;
    left: 50%
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .btn-scroll-down .bottom-line {
      margin-top:0
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .btn-scroll-down {
      bottom:50px
    }
  }

  @media (min-width: 768px) {
    .stickyOnTop {
      position:sticky;
      top: 100px
    }
  }

  header {
    display: none;
    width: 100%;
    margin-top: 120px;
    position: absolute;
    width: 100%;
    z-index: 100;
    transition: all 0s ease
  }

  header.invisible {
    visibility: visible !important;
    transform: translateY(-160px);
    transition: all .2s ease
  }

  header.detached {
    position: fixed;
    background: #f5f5f5;
    margin-top: 0px;
    padding: 25px 0 10px 0;
    transition: all .2s ease
  }

  @media (max-width: 991px) {
    header.detached {
      padding:20px 0 20px 0
    }
  }

  header.fixed {
    position: fixed !important;
    margin-top: 120px;
    padding: 0;
    transform: translateY(0px);
    transition: transform 1s ease;
    background: transparent
  }

  @media (max-width: 991px) {
    header.fixed {
      margin-top:45px
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    header.fixed {
      margin-top:25px
    }
  }

  @media (max-height: 640px) and (min-width: 992px) {
    header.fixed {
      margin-top:45px
    }
  }

  @media (max-width: 991px) {
    header {
      margin-top:60px
    }
  }

  @media (max-height: 640px) and (min-width: 992px) {
    header {
      margin-top:60px
    }
  }

  header a.navbar-brand {
    display: inline-block
  }

  header a.navbar-brand .large {
    font-family: 'MajestiBanner-Bold';
    position: relative;
    text-decoration: none;
    text-transform: uppercase;
    display: inline-block;
    color: black;
    font-size: 30px;
    background: url("/assets/images/walkingmen-logo.svg") no-repeat;
    text-indent: -9999px;
    background-size: contain;
    height: 20px;
    width: 210px
  }

  @media (max-width: 991px) {
    header a.navbar-brand .large {
      display:none
    }
  }

  header a.navbar-brand .mini {
    background: url("/assets/images/walkingmen-ambigramme.svg") no-repeat;
    text-indent: -9999px;
    background-size: contain;
    display: inline-block;
    height: 25px;
    width: 55px
  }

  @media (min-width: 992px) {
    header a.navbar-brand .mini {
      display:none
    }
  }

  header .navbar-nav {
    padding: 0;
    margin: 0
  }

  @media (max-width: 991px) {
    header .navbar-nav {
      display:none
    }
  }

  header .navbar-nav li {
    list-style: none;
    display: inline-block;
    padding-right: 90px
  }

  header .navbar-nav li:last-child {
    padding-right: 0px
  }

  header .navbar-nav li .nav-link {
    display: none;
    position: relative;
    text-decoration: none;
    display: inline-block;
    color: #262633;
    font-family: 'Calibre-Medium';
    letter-spacing: 1px;
    font-size: 14px
  }

  header .navbar-nav li .nav-link.active {
    color: #f03232
  }

  @media (max-width: 991px) {
    .mobile-nav-open {
      overflow:hidden;
      position: fixed;
      width: 100%
    }
  }

  .button_container {
    position: absolute;
    top: 5%;
    right: 20px;
    height: 27px;
    width: 30px;
    cursor: pointer;
    z-index: 100;
    transition: opacity .25s ease
  }

  @media (min-width: 992px) {
    .button_container {
      display:none
    }
  }

  .button_container.active .top {
    transform: translateY(9px) translateX(0) rotate(45deg);
    background: #000
  }

  .button_container.active .middle {
    opacity: 0;
    background: #000
  }

  .button_container.active .bottom {
    transform: translateY(-11px) translateX(0) rotate(-45deg);
    background: #000
  }

  .button_container.active .bottom:after {
    border-right: 3px solid transparent;
    border-bottom: 3px solid #262633;
    border-left: 0;
    border-top: 0
  }

  .button_container.active .bottom:before {
    border-right: 3px solid #262633;
    border-bottom: 3px solid transparent;
    border-left: 0;
    border-top: 0
  }

  .button_container span {
    background: #262633;
    border: none;
    height: 3px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: all .35s ease;
    cursor: pointer
  }

  .button_container span:after {
    content: '';
    position: absolute;
    right: -3px;
    top: 0;
    height: 0;
    width: 0;
    border-bottom: 0;
    border-right: 3px solid transparent;
    border-top: 3px solid #262633
  }

  .button_container span:before {
    content: '';
    position: absolute;
    left: -3px;
    top: 0;
    height: 0;
    width: 0;
    border-right: 3px solid #262633;
    border-top: 3px solid transparent
  }

  .button_container span:nth-of-type(2) {
    top: 10px
  }

  .button_container span:nth-of-type(3) {
    top: 20px
  }

  .overlay {
    position: fixed;
    background: #F5F5F5;
    top: 0;
    left: 0;
    width: 100%;
    height: 0%;
    opacity: 0;
    visibility: hidden;
    transition: opacity .35s, visibility .35s, height .35s;
    overflow: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch
  }

  @media (min-width: 992px) {
    .overlay {
      display:none
    }
  }

  .overlay nav {
    font-size: 40px;
    font-family: "Calibre-Thin";
    color: white;
    text-align: center;
    line-height: 50px;
    margin-top: 135px;
    margin-bottom: 40px
  }

  header.fixed .overlay nav,header.detached .overlay nav {
    margin-top: 90px
  }

  .overlay nav ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    display: block;
    position: relative
  }

  .overlay nav ul li {
    display: block;
    min-height: 50px;
    position: relative;
    opacity: 0
  }

  .overlay nav ul li a {
    display: block;
    position: relative;
    color: #000;
    text-decoration: none;
    overflow: hidden
  }

  .overlay nav ul li a:hover,.overlay nav ul li a:focus,.overlay nav ul li a:active {
    color: #ee4920
  }

  .overlay nav ul li a:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0%;
    transform: translateX(-50%);
    height: 3px;
    background: #000;
    transition: .35s
  }

  .overlay .block-text-follow {
    margin-top: 60px;
    opacity: 0
  }

  .overlay .block-text-follow:before {
    top: -45px;
    height: 30px
  }

  .overlay .block-text-follow h4 {
    margin-bottom: 12px
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .overlay {
      padding-left:calc((100vw - 540px + 40px) /2 );
      padding-right: calc((100vw - 540px + 40px) /2 );
      display: flex;
      flex-wrap: wrap
    }

    .overlay nav {
      text-align: left;
      flex: 0 0 50%
    }

    .overlay .block-text-follow {
      flex: 0 0 50%;
      padding-top: 110px
    }

    .overlay .block-text-follow:before {
      display: none
    }
  }

  .overlay.open {
    opacity: 1;
    visibility: visible;
    height: 100vh
  }

  .overlay.open nav ul li {
    animation: fadeInRight .5s ease forwards;
    animation-delay: .35s
  }

  .overlay.open nav ul li:nth-of-type(2) {
    animation-delay: .4s
  }

  .overlay.open nav ul li:nth-of-type(3) {
    animation-delay: .45s
  }

  .overlay.open nav ul li:nth-of-type(4) {
    animation-delay: .50s
  }

  .overlay.open .block-text-follow {
    animation: fadeInRight .5s ease forwards;
    animation-delay: .60s
  }

  .overlay .overlay-footer {
    padding-left: 50px;
    padding-right: 50px;
    border-top: 1px solid #dcddde;
    padding-top: 20px
  }

  .overlay .overlay-footer p {
    line-height: 1.2;
    margin-bottom: 10px
  }

  .overlay .overlay-footer a {
    text-decoration: none
  }

  @keyframes fadeInRight {
    0% {
      opacity: 0;
      left: 20%
    }

    100% {
      opacity: 1;
      left: 0
    }
  }

  ul.nav-expertises {
    list-style: none;
    transition: all .5s ease;
    -webkit-transition-delay: .3s;
    transition-delay: .3s;
    margin-left: 0;
    padding-left: 0;
    min-height: 40vh;
    max-height: 550px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    margin-bottom: 0
  }

  ul.nav-expertises li {
    font-size: 60px;
    font-family: "Calibre-Thin";
    color: #262633;
    line-height: 70px
  }

  @media (max-width: 1239px) {
    ul.nav-expertises li {
      font-size:40px;
      line-height: 50px
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    ul.nav-expertises li {
      font-size:30px;
      line-height: 40px
    }
  }

  ul.nav-expertises li a {
    color: #262633;
    text-decoration: none;
    display: inline-block;
    transition: color .1s ease
  }

  ul.nav-expertises li a:hover {
    color: #ee4920
  }

  ul.nav-expertises li a.active {
    opacity: 0.5;
    pointer-events: none
  }

  .expertises-mask {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    transform: translate(-50%, -50%)
  }

  .expertises-mask svg {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2
  }

  .expertises-mask .svg-mask {
    fill: #f5f5f5;
    transition: fill 0.5s linear;
    transition-delay: .2s
  }

  .expertises-mask.inverse .svg-mask {
    fill: #000
  }

  @media (orientation: portrait) {
    .expertises-mask {
      width:auto;
      height: 100%
    }
  }

  .page-expertises {
    z-index: 0 !important;
    overflow: hidden;
    height: 0px
  }

  .page-expertises.open {
    height: 100vh
  }

  @media (max-width: 991px) {
    .page-expertises {
      height:0
    }
  }

  .nav-expertises-container {
    position: relative;
    z-index: 1
  }

  @media (max-width: 575px) {
    .nav-expertises-container {
      padding:0 45px
    }
  }

  .nav-expertises-images {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    transform: scale3d(1.1, 1.1, 1.1) translate3d(0%, 0%, 0px);
    animation: bannerpanning 120s infinite
  }

  .nav-expertises-images>div {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    z-index: 1;
    transition: opacity .5s ease;
    transition-delay: .2s
  }

  .nav-expertises-images>div.active {
    opacity: 1;
    z-index: 2
  }

  .nav-expertises-images>div img {
    transform: translateZ(0);
    transform-origin: center center;
    width: 100%;
    height: 100%;
    object-fit: cover;
    font-family: "object-fit: cover;"
  }

  @keyframes bannerpanning {
    25% {
      transform: scale3d(1.1, 1.1, 1.1) translate3d(4%, -4%, 0px)
    }

    45% {
      transform: scale3d(1.1, 1.1, 1.1) translate3d(-4%, -4%, 0px)
    }

    75% {
      transform: scale3d(1.1, 1.1, 1.1) translate3d(-4%, 4%, 0px)
    }

    100% {
      transform: scale3d(1.1, 1.1, 1.1) translate3d(4%, 4%, 0%)
    }
  }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f5;
    min-height: 90px;
    color: #999999;
    z-index: 1
  }

  .page-footer-content {
    padding: 26px 0;
    background: #040515;
    min-height: 90px
  }

  .page-footer-content h2 {
    color: white;
    display: inline-block;
    font-family: 'Calibre-Medium';
    letter-spacing: 1px;
    font-size: 14px
  }

  .page-footer-content .justify-content-start p {
    margin-right: 80px
  }

  .page-footer-content .justify-content-start p.order-lg-3 {
    margin-right: 0px
  }

  @media (max-width: 991px) {
    .page-footer-content .justify-content-start p {
      margin-right:0px
    }
  }

  .page-footer-content .justify-content-end p {
    margin-left: 80px
  }

  .page-footer-content .justify-content-end p:first-child {
    margin-left: 0px
  }

  @media (max-width: 991px) {
    .page-footer-content .justify-content-end p {
      margin-left:0px
    }
  }

  .page-footer-content p {
    display: block;
    color: #64656F;
    font-family: "Calibre-Medium";
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0px
  }

  .page-footer-content p a {
    color: #64656F;
    text-decoration: none;
    transition: color 0.4s ease-out
  }

  .page-footer-content p a:hover {
    color: #f5f5f5;
    text-decoration: none
  }

  .page-footer--large {
    height: 100vh
  }

  .page-footer--large .page-footer-content {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%
  }

  .page-footer--large .nav-expertises-container {
    position: relative;
    z-index: 1
  }

  .page-shine {
    padding: 70px 0 130px 0;
    overflow: hidden
  }

  .page-shine .btn-scroll-down {
    margin-top: 22px
  }

  @media (max-width: 767px) {
    .page-shine .order-last-mobile {
      order:1;
      text-align: center;
      margin-bottom: -80px;
      display: flex;
      justify-content: center
    }

    .page-shine .order-last-mobile .btn-scroll-down {
      margin-left: 0
    }
  }

  .page-shine h2 {
    font-size: 35px;
    line-height: 100%;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 90px
  }

  @media (min-width: 992px) {
    .page-shine h2 {
      font-size:50px
    }
  }

  .page-shine h4 {
    font-size: 12px;
    text-transform: uppercase;
    color: #64656f;
    letter-spacing: 0.2em;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 25px
  }

  .page-shine .btn-default {
    padding: 12px 30px
  }

  .page-shine .block-text-contact {
    text-align: center;
    position: relative
  }

  .page-shine .block-text-contact h4 {
    margin-bottom: 34px
  }

  .page-shine .block-text-follow {
    text-align: center;
    position: relative;
    float: right
  }

  .block-text-expertises {
    text-align: center;
    position: relative;
    float: left
  }

  .block-text-expertises h4 {
    font-size: 12px;
    text-transform: uppercase;
    color: #64656f;
    letter-spacing: 0.2em;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 25px;
    text-align: left;
    width: 300px;
    white-space: nowrap;
    padding-left: 15px
  }

  .block-text-expertises svg {
    transform-origin: 50% 50%;
    margin-top: 0px
  }

  .block-text-expertises .line {
    display: block;
    height: 100%;
    width: 1px;
    opacity: 0.1;
    background-color: #040515;
    float: right
  }

  .block-text-follow {
    text-align: center;
    position: relative
  }

  .block-text-follow h4 {
    font-size: 12px;
    text-transform: uppercase;
    color: #64656f;
    letter-spacing: 0.2em;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 25px
  }

  .block-text-follow .social {
    list-style: none;
    padding: 0;
    margin: 0;
    display: inline-block;
    margin: 0 auto
  }

  .block-text-follow .social li {
    display: inline-block
  }

  .block-text-follow .social li a {
    display: inline-block;
    margin-left: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #dcddde;
    text-align: center;
    line-height: 60px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30%
  }

  .block-text-follow .social li:nth-child(1) {
    margin-left: 0
  }

  .block-text-follow .social li:nth-child(1) a {
    margin-left: 0
  }

  .block-text-contact:before,.block-text-follow:before {
    content: " ";
    width: 1px;
    height: 40px;
    background-color: #dcddde;
    display: block;
    position: absolute;
    top: -65px;
    left: 50%
  }

  .block-text-expertises:after {
    content: " ";
    width: 1px;
    height: 120px;
    background-color: #dcddde;
    display: block;
    position: absolute;
    bottom: -135px;
    left: 50%
  }

  .footer-expertises nav {
    min-height: 100vh
  }

  .footer-expertises nav .container {
    position: relative;
    z-index: 10
  }

  .footer-expertises .footer-small {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%
  }

  body.intro-shown {
    overflow: hidden;
    position: fixed;
    width: 100%
  }

  body.intro-shown .slide-expertises {
    display: none !important
  }

  .barba-container[data-namespace='home'] .slide-01 p a {
    color: #f03232;
    text-decoration: none
  }

  .barba-container[data-namespace='home'] .slide-01 p a:hover {
    color: #f03232;
    text-decoration: none
  }

  .barba-container[data-namespace='home'] .slide-expertises {
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .barba-container[data-namespace='home'] section.slide-intro {
    position: relative;
    overflow: hidden;
    z-index: 10;
    background: #f5f5f5
  }

  .barba-container[data-namespace='home'] section.slide-intro #video-intro {
    opacity: 0;
    transition: opacity 2s
  }

  .barba-container[data-namespace='home'] section.slide-intro #video-intro.loaded {
    opacity: 1
  }

  .barba-container[data-namespace='home'] section.slide-intro .intro-bars {
    border-top: 90px solid #f5f5f5;
    border-bottom: 90px solid #f5f5f5;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .barba-container[data-namespace='home'] section.slide-intro .intro-bars {
      border-top-width:40px;
      border-bottom-width: 40px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace='home'] section.slide-intro .intro-bars {
      display:none
    }
  }

  .barba-container[data-namespace='home'] section.slide-intro .intro-video {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%
  }

  .barba-container[data-namespace='home'] section.slide-intro .intro-video video {
    position: absolute;
    background: #f5f5f5;
    z-index: 1;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    height: 100%;
    width: calc(100vh / 2 * 3);
    max-width: 999em
  }

  @media screen and (min-aspect-ratio: 3 / 2) and (orientation: landscape) {
    .barba-container[data-namespace='home'] section.slide-intro .intro-video video {
      top:50%;
      left: 0;
      transform: translate(0, -50%);
      width: 100%;
      height: auto
    }
  }

  .barba-container[data-namespace='home'] section.slide-intro .logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 240px;
    width: 100%;
    max-width: 360px;
    z-index: 3
  }

  .barba-container[data-namespace='home'] section.slide-intro .logo path {
    fill: #262633 !important
  }

  .barba-container[data-namespace='home'] section.slide-intro .btn-scroll-down {
    position: absolute;
    left: 50%;
    bottom: 110px;
    z-index: 3;
    margin-left: -45px;
    opacity: 0
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .barba-container[data-namespace='home'] section.slide-intro .btn-scroll-down {
      bottom:20px
    }
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace='home'] section.slide-intro .btn-scroll-down {
      bottom:40px
    }
  }

  .barba-container[data-namespace='home'] section.slide-01 {
    position: relative;
    background: #f5f5f5;
    z-index: 11;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .barba-container[data-namespace='home'] section.slide-01 .logo-small {
    height: 110px;
    width: 100%;
    margin-top: -31px;
    margin-left: -30px
  }

  body.os-mac .barba-container[data-namespace='home'] section.slide-01 .logo-small {
    margin-top: -36px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace='home'] section.slide-01 .logo-small {
      display:none
    }
  }

  .barba-container[data-namespace='home'] section.slide-01 h1 {
    position: relative
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace='home'] section.slide-01 h1 {
      font-size:40px;
      line-height: 1;
      margin-bottom: 30px
    }
  }

  @media (max-width: 360px) {
    .barba-container[data-namespace='home'] section.slide-01 h1 {
      font-size:35px;
      line-height: 30px;
      margin-bottom: 20px
    }
  }

  .barba-container[data-namespace='home'] section.slide-01 h1>span {
    display: inline-block;
    position: relative
  }

  .barba-container[data-namespace='home'] section.slide-01 h1 .line {
    content: '';
    position: absolute;
    top: 45px;
    border-bottom: 1px solid #dcddde
  }

  body.os-mac .barba-container[data-namespace='home'] section.slide-01 h1 .line {
    top: 41px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace='home'] section.slide-01 h1 .line {
      display:none
    }
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace='home'] section.slide-01 h1 .line {
      width:60px;
      left: -100px
    }
  }

  @media (min-width: 1240px) {
    .barba-container[data-namespace='home'] section.slide-01 h1 .line {
      width:80px;
      left: -120px
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .barba-container[data-namespace='home'] section.slide-01 p {
      font-size:14px;
      line-height: 20px
    }
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace='home'] section.slide-01 p {
      font-size:16px;
      line-height: 26px
    }
  }

  .barba-container[data-namespace='home'] section.slide-01 .container-main {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace='home'] section.slide-01 .container-main {
      top:55%
    }
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace='home'] section.slide-01 .container-main {
      padding-top:120px;
      transform: none;
      top: 0;
      left: 0
    }
  }

  .barba-container[data-namespace='home'] section.slide-01 .container-bottom {
    position: absolute;
    bottom: 80px;
    z-index: 1;
    left: 0;
    width: 100%
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace='home'] section.slide-01 .container-bottom {
      bottom:40px
    }
  }

  .barba-container[data-namespace='home'] section.slide-01 .social {
    float: right;
    list-style: none;
    padding: 0 25px 0 0
  }

  .barba-container[data-namespace='home'] section.slide-01 .social li {
    display: inline-block;
    margin-right: 5px
  }

  .barba-container[data-namespace='home'] section.slide-01 .social li:not(:last-child) {
    margin-right: 40px
  }

  .barba-container[data-namespace='home'] section.slide-01 .social li .icon-part {
    fill: #262633
  }

  .barba-container[data-namespace='home'] section.slide-01 .social li>a {
    padding: 15px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace='home'] section.slide-01 .social {
      display:none
    }
  }

  @media (max-width: 576px) and (max-height: 620px) {
    .barba-container[data-namespace='home'] section.slide-01 .second-paragraph {
      display:none
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace='home'] section.slide-01 .btn-scroll-down {
      position:absolute;
      bottom: 0;
      left: 50%
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .barba-container[data-namespace='home'] section.slide-01 .btn-scroll-down {
      bottom:-50px;
      transform: scale(0.666)
    }
  }

  .barba-container[data-namespace='home'] section.slide-02 {
    position: relative;
    z-index: 5;
    overflow: hidden;
    padding-top: 160px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace='home'] section.slide-02 {
      padding-top:100px
    }
  }

  @media (max-height: 640px) and (min-width: 992px) {
    .barba-container[data-namespace='home'] section.slide-02 {
      padding-top:100px
    }
  }

  .barba-container[data-namespace='home'] section.slide-02 .scroll-trigger-begin {
    position: absolute;
    left: 0;
    top: 0
  }

  .barba-container[data-namespace='home'] section.slide-02 .scroll-trigger-end {
    position: absolute;
    left: 0;
    bottom: 0
  }

  .barba-container[data-namespace='home'] section.slide-02 .container {
    position: relative;
    z-index: 3
  }

  body.video-opening {
    overflow: hidden
  }

  body.video-opening header {
    opacity: 0 !important;
    visibility: hidden !important
  }

  .barba-container[data-namespace="about"] .scroll-down {
    position: absolute;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%)
  }

  .barba-container[data-namespace="about"] .scroll-down svg {
    transform: rotate(90deg)
  }

  .barba-container[data-namespace="about"] .background-video {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    z-index: 1
  }

  .barba-container[data-namespace="about"] .background-video video {
    position: absolute;
    background: #f5f5f5;
    z-index: 1;
    opacity: 0;
    transition: opacity 1s ease;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    width: 100vw;
    height: auto
  }

  @media screen and (min-aspect-ratio: 320 / 131) {
    .barba-container[data-namespace="about"] .background-video video {
      top:0;
      left: 50%;
      transform: translate(-50%, 0);
      height: 100vh;
      width: auto
    }
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace="about"] .background-video video {
      width:150vw
    }
  }

  @media screen and (orientation: landscape) and (max-width: 991px) and (max-height: 500px) {
    .barba-container[data-namespace="about"] .background-video video {
      top:0;
      left: 50%;
      transform: translate(-50%, 0);
      height: 100vh;
      width: auto
    }
  }

  .barba-container[data-namespace="about"] .background-video video.loaded {
    opacity: 1
  }

  @media screen and (orientation: landscape) and (max-width: 991px) and (max-height: 500px) and (min-width: 768px) {
    .barba-container[data-namespace="about"] .col-landscape-large-phone-spacer {
      flex:0 0 60%;
      max-width: 60%
    }
  }

  .barba-container[data-namespace="about"] .display-video-mobile {
    display: none
  }

  @media screen and (orientation: landscape) and (max-width: 991px) and (max-height: 500px), screen and (orientation: portrait) and (max-width: 768px) {
    .barba-container[data-namespace="about"] .display-video-mobile {
      display:block
    }
  }

  .barba-container[data-namespace="about"] .video-mobile {
    position: relative;
    height: 100vw;
    margin-top: 60px;
    margin-bottom: -40px
  }

  @media screen and (orientation: landscape) and (max-width: 991px) and (max-height: 500px) and (min-width: 768px) {
    .barba-container[data-namespace="about"] .video-mobile {
      height:50vw
    }
  }

  .barba-container[data-namespace="about"] .video-mobile .video-play {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 90px;
    width: 90px;
    margin: -45px;
    border-radius: 50%;
    text-align: center;
    line-height: 90px;
    z-index: 22
  }

  .barba-container[data-namespace="about"] .video-mobile .video-play svg {
    width: 100%;
    height: 100%
  }

  .barba-container[data-namespace="about"] .video-mobile .video-play:hover,.barba-container[data-namespace="about"] .video-mobile .video-play:focus {
    text-decoration: none
  }

  .barba-container[data-namespace="about"] .video-mobile video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover
  }

  .barba-container[data-namespace="about"] .video-mobile .video-mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 15;
    background: #040515;
    opacity: 0;
    display: none;
    transition: opacity 0.4s ease-out
  }

  .barba-container[data-namespace="about"] .video-mobile .video-mobile-wrap {
    transition: height 0.4s ease-out;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vh;
    height: 100vw;
    z-index: 21;
    transform: translate(-50%, -50%)
  }

  @media (orientation: landscape) {
    .barba-container[data-namespace="about"] .video-mobile .video-mobile-wrap {
      width:auto;
      height: 80vh
    }
  }

  .barba-container[data-namespace="about"] .video-mobile .video-mobile-wrap2 {
    position: relative;
    z-index: 21;
    transition: transform 0.4s ease-out;
    transform-origin: 50% 50%;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%
  }

  .barba-container[data-namespace="about"] .video-mobile .video-close {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 30px;
    width: 30px;
    overflow: hidden;
    text-indent: -99em;
    background: #f5f5f5 url(/assets/images/close.svg) no-repeat center center;
    background-size: 50% 50%;
    opacity: 1;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    display: none
  }

  .barba-container[data-namespace="about"] .video-mobile.opening .video-mobile-overlay {
    display: block;
    opacity: 1
  }

  .barba-container[data-namespace="about"] .video-mobile.opening .video-mobile-wrap {
    height: 100vw
  }

  .barba-container[data-namespace="about"] .video-mobile.opening .video-play {
    display: none
  }

  .barba-container[data-namespace="about"] .video-mobile.opening .video-close {
    display: block
  }

  @media (orientation: portrait) {
    .barba-container[data-namespace="about"] .video-mobile.opening .video-mobile-wrap {
      position:absolute;
      top: 50%;
      left: 50%;
      width: 100vh;
      height: 100vw;
      transform: translate(-50%, -50%);
      z-index: 21;
      margin: 0
    }

    .barba-container[data-namespace="about"] .video-mobile.opening .video-mobile-wrap2 {
      position: absolute;
      transform: rotate(90deg)
    }
  }

  @media (orientation: landscape) {
    .barba-container[data-namespace="about"] .video-mobile.opening .video-mobile-wrap {
      position:absolute;
      top: 50%;
      left: 50%;
      width: 100vw;
      height: 100vh;
      transform: translate(-50%, -50%)
    }
  }

  .barba-container[data-namespace="about"] .video-mobile.full-screen {
    margin-top: 0;
    margin-bottom: 0
  }

  .barba-container[data-namespace="about"] section.cover {
    padding-top: 210px;
    padding-bottom: 0
  }

  .barba-container[data-namespace="about"] section {
    position: relative;
    background: #f5f5f5
  }

  .barba-container[data-namespace="about"] section:not(.page-expertises) {
    z-index: 9
  }

  .barba-container[data-namespace="about"] .line {
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 1px;
    background-color: #DFDFE1
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] .line {
      display:none
    }
  }

  .barba-container[data-namespace="about"] .circle-text {
    position: relative
  }

  .barba-container[data-namespace="about"] .circle-overlay {
    width: 0px;
    height: 0px;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 10;
    border-radius: 50%;
    transform-origin: center;
    width: 110%;
    height: 0;
    padding-bottom: 110%;
    margin-left: -55%;
    margin-top: -55%;
    background: rgba(253,206,214,0.15)
  }

  .barba-container[data-namespace="about"] .btn-full-screen,.barba-container[data-namespace="about"] .rotate-icon {
    position: fixed;
    top: 50%;
    right: 5px;
    width: 20px;
    height: 20px;
    margin-top: -25px;
    transform: translateY(calc(( 131/320 * 100vw ) / 2 ));
    z-index: 10;
    opacity: 0.8
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace="about"] .btn-full-screen,.barba-container[data-namespace="about"] .rotate-icon {
      transform:translateY(calc(( 131/320 * 150vw ) / 2 ))
    }
  }

  .barba-container[data-namespace="about"] .slide-intro {
    background: transparent;
    overflow: visible;
    z-index: 9;
    height: 100vh;
    max-height: 999em;
    position: relative
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] .slide-intro {
      height:calc(100vh - 74px)
    }
  }

  body.os-ios .barba-container[data-namespace="about"] .slide-intro {
    height: calc(100vh - 74px)
  }

  @media screen and (orientation: landscape) and (max-width: 991px) and (max-height: 500px) {
    .barba-container[data-namespace="about"] .slide-intro {
      height:100vh
    }
  }

  .barba-container[data-namespace="about"] .slide-intro .intro-bars {
    border-top: 190px solid #f5f5f5;
    border-bottom: 120px solid #f5f5f5;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    height: 100%
  }

  @media screen and (orientation: landscape) and (max-width: 991px) and (max-height: 500px) {
    .barba-container[data-namespace="about"] .slide-intro .intro-bars {
      display:none
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] .slide-intro .intro-bars {
      display:none
    }
  }

  .barba-container[data-namespace="about"] .slide-intro .btn-scroll-down {
    position: absolute;
    bottom: 40px;
    left: 50%;
    z-index: 3;
    opacity: 1
  }

  .barba-container[data-namespace="about"] .slide-intro .btn-scroll-down .bottom-line {
    margin-top: 20px
  }

  @media screen and (orientation: landscape) and (max-width: 991px) and (max-height: 500px) {
    .barba-container[data-namespace="about"] .slide-intro .btn-scroll-down {
      display:none
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .barba-container[data-namespace="about"] .slide-intro .btn-scroll-down {
      display:none
    }
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace="about"] .slide-intro .btn-scroll-down {
      bottom:0px
    }
  }

  .barba-container[data-namespace="about"] .section-video-window {
    min-height: 56.2vw;
    height: 60vh;
    background: transparent;
    z-index: 9
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] .section-video-window {
      height:56.2vw;
      min-height: 56.2vw
    }
  }

  .barba-container[data-namespace="about"] section.section-01 {
    overflow: hidden;
    padding-top: 130px;
    padding-bottom: 110px
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] section.section-01 {
      padding-top:40px;
      padding-bottom: 40px
    }
  }

  .barba-container[data-namespace="about"] section.section-01 .line {
    position: absolute;
    top: 120px
  }

  .barba-container[data-namespace="about"] section.section-01 h4 {
    font-family: 'Calibre-Medium';
    font-size: 17px !important;
    margin-bottom: 25px !important
  }

  .barba-container[data-namespace="about"] section.section-01 .block-text-headline {
    text-align: center;
    background-color: #f5f5f5;
    padding: 100px 0px;
    margin-top: 50px;
    margin-bottom: 100px;
    position: relative
  }

  .barba-container[data-namespace="about"] section.section-01 .block-text-headline h4 {
    font-size: 12px;
    text-transform: uppercase;
    color: #64656f;
    letter-spacing: 0.2em;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 15px
  }

  .barba-container[data-namespace="about"] section.section-01 .block-text-headline h2 {
    font-size: 50px;
    line-height: 100%;
    font-family: 'MajestiBanner-Bold'
  }

  .barba-container[data-namespace="about"] section.section-01 .block-text-headline h1 {
    margin-bottom: 0
  }

  .barba-container[data-namespace="about"] section.section-01 .block-text-user {
    margin-top: 140px
  }

  .barba-container[data-namespace="about"] section.section-02 {
    padding-top: 190px;
    padding-bottom: 150px
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] section.section-02 {
      padding-top:40px;
      padding-bottom: 40px
    }
  }

  .barba-container[data-namespace="about"] section.section-02 .block-text-question {
    text-align: center;
    background-color: #f5f5f5;
    padding: 137px 0px
  }

  .barba-container[data-namespace="about"] section.section-02 .block-text-question h4 {
    font-size: 12px;
    text-transform: uppercase;
    color: #64656f;
    letter-spacing: 0.2em;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 15px
  }

  .barba-container[data-namespace="about"] section.section-02 .block-text-question h2 {
    font-size: 50px;
    line-height: 100%;
    font-family: 'MajestiBanner-Bold'
  }

  .barba-container[data-namespace="about"] section.section-02 .block-text-question h1 {
    margin-bottom: 0
  }

  .barba-container[data-namespace="about"] section.section-02 .block-text-of-course h4 {
    font-size: 12px;
    text-transform: uppercase;
    color: #64656f;
    letter-spacing: 0.2em;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 15px
  }

  .barba-container[data-namespace="about"] section.section-02 .block-text-of-course h2 {
    font-size: 25px;
    line-height: 30px;
    font-family: 'MajestiBanner-Bold'
  }

  .barba-container[data-namespace="about"] section.section-02 .block-text-of-course h1 {
    margin-bottom: 0
  }

  .barba-container[data-namespace="about"] section.section-03 {
    padding-top: 145px;
    padding-bottom: 75px
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] section.section-03 {
      padding-top:40px;
      padding-bottom: 40px
    }
  }

  .barba-container[data-namespace="about"] section.section-03 h4 {
    font-family: 'Calibre-Medium';
    font-size: 17px;
    margin-bottom: 25px !important
  }

  .barba-container[data-namespace="about"] section.section-03 .block-text-skills {
    position: relative;
    text-align: center;
    background-color: #f5f5f5;
    padding: 170px 0px
  }

  .barba-container[data-namespace="about"] section.section-03 .block-text-skills h4 {
    font-size: 12px;
    text-transform: uppercase;
    color: #64656f;
    letter-spacing: 0.2em;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 15px
  }

  .barba-container[data-namespace="about"] section.section-03 .block-text-skills h2 {
    font-size: 50px;
    line-height: 100%;
    font-family: 'MajestiBanner-Bold'
  }

  .barba-container[data-namespace="about"] section.section-03 .block-text-skills h1 {
    margin-bottom: 0
  }

  .barba-container[data-namespace="about"] section.section-03 .block-text-teams {
    position: relative;
    text-align: center;
    margin-top: 45px;
    background-color: #f5f5f5;
    padding: 169px 0px
  }

  .barba-container[data-namespace="about"] section.section-03 .block-text-teams h4 {
    font-size: 12px;
    text-transform: uppercase;
    color: #64656f;
    letter-spacing: 0.2em;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 15px
  }

  .barba-container[data-namespace="about"] section.section-03 .block-text-teams h2 {
    font-size: 50px;
    line-height: 100%;
    font-family: 'MajestiBanner-Bold'
  }

  .barba-container[data-namespace="about"] section.section-03 .block-text-teams h1 {
    margin-bottom: 0
  }

  .barba-container[data-namespace="about"] section.section-03 .expertises-tabs {
    padding: 0;
    margin: 0;
    list-style-type: none;
    position: relative
  }

  .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li {
    padding: 0;
    margin: 0;
    position: static;
    display: block;
    clear: both
  }

  .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li>.tab-title {
    position: relative;
    display: block;
    float: left;
    font-family: 'Calibre-Thin';
    font-size: 50px;
    color: #4c4d58;
    line-height: 120%;
    text-decoration: none
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li>.tab-title {
      font-size:40px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li>.tab-title {
      float:none;
      border-bottom: 1px solid #dcddde
    }
  }

  .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li>.tab-pane {
    position: absolute;
    top: 0;
    right: 0;
    width: 360px;
    z-index: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s ease
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li>.tab-pane {
      width:260px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li>.tab-pane {
      position:static;
      width: auto;
      max-height: 0;
      opacity: 1;
      overflow: hidden;
      transition: max-height 0.3s ease-out
    }

    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li>.tab-pane>.wrap {
      padding: 20px 0 40px
    }
  }

  .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-pane {
    z-index: 1;
    pointer-events: auto;
    opacity: 1;
    transition: opacity 0.5s ease 0.1s
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-pane {
      max-height:400px;
      transition: max-height 0.3s ease-in
    }
  }

  .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-title {
    color: #f03232;
    text-decoration: none
  }

  .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-title:hover,.barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-title:focus {
    text-decoration: none
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-title {
      border-bottom:1px solid #f03232
    }
  }

  .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-title:before {
    content: " ";
    width: calc(460px - 100%);
    height: 1px;
    display: block;
    background-color: #f03232;
    position: absolute;
    margin-left: 40px;
    left: 100%;
    top: 30px
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-title:before {
      width:calc(475px - 100%)
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-title:before {
      width:calc(340px - 100%)
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="about"] section.section-03 .expertises-tabs li.active>.tab-title:before {
      display:none
    }
  }

  .barba-container[data-namespace="about"] .highlight-scroll {
    color: #f03232;
    font-family: 'Calibre-Medium';
    background-color: #fef7f7
  }

  .barba-container[data-namespace="about"] .spacer-block-240 {
    display: block;
    height: 240px
  }

  .barba-container[data-namespace="about"] .spacer-block-170 {
    display: block;
    height: 170px
  }

  @supports (mix-blend-mode: screen) {
    .barba-container[data-namespace="about"] .circle-overlay {
      background: #f4193d;
      mix-blend-mode: screen
    }
  }

  [data-namespace="contact"] section.small-footer {
    height: 90px;
    z-index: 9
  }

  @media (max-width: 1239px) {
    [data-namespace="contact"] section.small-footer {
      height:112px
    }
  }

  @media (max-width: 991px) {
    [data-namespace="contact"] section.small-footer {
      height:0
    }
  }

  [data-namespace="contact"] section.section-01 {
    position: relative;
    height: 100vh;
    width: 100%
  }

  body.os-ios [data-namespace="contact"] section.section-01 {
    height: calc(100vh - 74px)
  }

  @media (max-width: 767px) {
    [data-namespace="contact"] section.section-01 {
      height:auto;
      padding-bottom: 40px
    }
  }

  [data-namespace="contact"] section.section-01 .btn-scroll-down {
    top: 66px
  }

  @media (max-width: 767px) {
    [data-namespace="contact"] section.section-01 .btn-scroll-down {
      margin-left:-10px;
      margin-top: 30px
    }
  }

  [data-namespace="contact"] section.section-01 .logo-small {
    height: 110px;
    width: 100%;
    margin-top: -31px;
    margin-left: -30px
  }

  body.os-mac [data-namespace="contact"] section.section-01 .logo-small {
    margin-top: -36px
  }

  @media (max-width: 991px) {
    [data-namespace="contact"] section.section-01 .logo-small {
      display:none
    }
  }

  [data-namespace="contact"] section.section-01 h1 {
    position: relative
  }

  @media (max-width: 767px) {
    [data-namespace="contact"] section.section-01 h1 {
      font-size:40px;
      line-height: 1;
      margin-bottom: 30px
    }
  }

  [data-namespace="contact"] section.section-01 h1>span {
    display: inline-block;
    position: relative
  }

  [data-namespace="contact"] section.section-01 h1:before {
    content: '';
    position: absolute;
    top: 45px;
    border-bottom: 1px solid #dcddde
  }

  body.os-mac [data-namespace="contact"] section.section-01 h1:before {
    top: 41px
  }

  @media (max-width: 991px) {
    [data-namespace="contact"] section.section-01 h1:before {
      display:none
    }
  }

  @media (min-width: 992px) {
    [data-namespace="contact"] section.section-01 h1:before {
      width:60px;
      left: -100px
    }
  }

  @media (min-width: 1240px) {
    [data-namespace="contact"] section.section-01 h1:before {
      width:80px;
      left: -120px
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    [data-namespace="contact"] section.section-01 p {
      font-size:14px;
      line-height: 20px
    }
  }

  [data-namespace="contact"] section.section-01 .container-main {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }

  @media (max-width: 767px) {
    [data-namespace="contact"] section.section-01 .container-main {
      transform:none;
      position: static;
      padding-top: 120px
    }
  }

  [data-namespace="contact"] section.section-01 .container-bottom {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10
  }

  @media (max-width: 767px) {
    [data-namespace="contact"] section.section-01 .container-bottom {
      position:static;
      transform: none
    }
  }

  [data-namespace="contact"] section.section-map {
    position: relative;
    position: relative;
    width: 100%
  }

  [data-namespace="contact"] section.section-map .map-head {
    position: relative;
    z-index: 10;
    -webkit-box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1);
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1)
  }

  [data-namespace="contact"] section.section-map .map-menu-wrap {
    position: absolute;
    display: block;
    z-index: 5;
    background: #f5f5f5;
    left: 0px;
    right: 0px;
    margin-right: calc(50% - 50vw);
    margin-left: calc(50% - 50vw);
    margin-top: 1px;
    padding-top: 14px;
    -webkit-box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1);
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1);
    transition: all 0.6s;
    max-height: 0px;
    pointer-events: none;
    overflow: hidden
  }

  [data-namespace="contact"] section.section-map .map-menu-wrap .map-menu {
    padding-bottom: 40px;
    display: inline-block;
    margin-right: 75px
  }

  [data-namespace="contact"] section.section-map .map-menu-wrap .map-menu h1 {
    line-height: 70px;
    transition: all 0.4s;
    max-height: 70px;
    opacity: 1;
    margin: 0
  }

  [data-namespace="contact"] section.section-map .map-menu-wrap .map-menu h1.active {
    max-height: 0;
    opacity: 0
  }

  [data-namespace="contact"] section.section-map .map-menu-wrap .map-menu h1 a {
    color: #000;
    text-decoration: none;
    transition: all 0.3s
  }

  [data-namespace="contact"] section.section-map .map-menu-wrap .map-menu h1 a:hover {
    color: #f03636
  }

  [data-namespace="contact"] section.section-map h1.custom {
    padding-bottom: 0px;
    padding-top: 20px;
    line-height: 45px;
    margin-bottom: 10px
  }

  @media (max-width: 575px) {
    [data-namespace="contact"] section.section-map h1.custom {
      font-size:30px
    }
  }

  [data-namespace="contact"] section.section-map h1.custom span.walk-link {
    display: inline-block;
    text-decoration: none;
    color: #f03636;
    border-bottom: 1px solid transparent;
    transition: all 0.5s
  }

  [data-namespace="contact"] section.section-map h1.custom span.walk-link .theWord {
    position: relative;
    z-index: 6
  }

  [data-namespace="contact"] section.section-map h1.custom span.walk-link.open {
    border-bottom: 1px solid #ccc
  }

  [data-namespace="contact"] section.section-map h1.custom span.walk-link.open .map-menu-wrap {
    max-height: 360px;
    pointer-events: auto
  }

  [data-namespace="contact"] section.section-map #map {
    height: calc(100vh - 76px - 90px);
    width: 100%
  }

  @media (max-width: 1239px) {
    [data-namespace="contact"] section.section-map #map {
      height:calc(100vh - 76px - 112px)
    }
  }

  @media (max-width: 991px) {
    [data-namespace="contact"] section.section-map #map {
      height:calc(100vh - 76px)
    }
  }

  [data-namespace="contact"] section.section-map .duration-overlay-wrap {
    position: absolute;
    top: 200px;
    left: 200px
  }

  [data-namespace="contact"] section.section-map .duration-overlay-wrap .duration-overlay {
    position: relative;
    background: #fff;
    border: 1px solid #bbb;
    border-radius: 100px;
    opacity: 0;
    padding: 10px;
    font-weight: bold
  }

  [data-namespace="contact"] section.section-map .duration-overlay-wrap .duration-overlay.active {
    opacity: 1
  }

  [data-namespace="contact"] section.section-map .duration-overlay-wrap .duration-overlay:after,[data-namespace="contact"] section.section-map .duration-overlay-wrap .duration-overlay:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none
  }

  [data-namespace="contact"] section.section-map .duration-overlay-wrap .duration-overlay:after {
    border-color: rgba(255,255,255,0);
    border-bottom-color: #fff;
    border-width: 9px;
    margin-left: -9px
  }

  [data-namespace="contact"] section.section-map .duration-overlay-wrap .duration-overlay:before {
    border-color: rgba(187,187,187,0);
    border-bottom-color: #bbb;
    border-width: 10px;
    margin-left: -10px
  }

  [data-namespace="contact"] section a.link-bold {
    font-family: 'Calibre-Medium';
    text-decoration: none
  }

  [data-namespace="contact"] section #mc_embed_signup {
    border-bottom: 1px solid #dcddde;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-top: 30px;
    max-width: 360px;
    color: #040515
  }

  [data-namespace="contact"] section #mc_embed_signup #mce-responses {
    font-size: 12px
  }

  [data-namespace="contact"] section #mc_embed_signup #mce-responses #mce-success-response {
    color: #146314
  }

  [data-namespace="contact"] section #mc_embed_signup #mce-responses #mce-error-response {
    color: #f03232
  }

  [data-namespace="contact"] section #mc_embed_signup label {
    display: block !important;
    font-family: 'MajestiBanner-Bold';
    font-size: 18px;
    clear: both;
    padding-left: 0 !important;
    margin-bottom: 15px
  }

  [data-namespace="contact"] section #mc_embed_signup div.mce_inline_error {
    font-size: 12px;
    background: none;
    color: #f03232;
    padding: 3px 0 0 0;
    position: absolute
  }

  [data-namespace="contact"] section #mc_embed_signup .form-control {
    background-color: transparent;
    padding-left: 0;
    font-family: 'Calibre-Regular';
    font-size: 17px;
    line-height: 100%;
    color: #64656f;
    border-radius: 0;
    border: 0;
    width: 100%;
    padding-top: 15px;
    padding-bottom: 0px
  }

  [data-namespace="contact"] section #mc_embed_signup .form-control:focus {
    background-color: transparent !important
  }

  [data-namespace="contact"] section #mc_embed_signup .btn-form-send {
    background: url("/assets/images/arrow-link-black.png") no-repeat right 20px;
    font-family: 'MajestiBanner-Bold';
    text-transform: uppercase;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0.2em;
    color: #64656f;
    border-radius: 0;
    border: 0;
    padding-top: 19px;
    padding-bottom: 19px;
    padding-right: 20px;
    float: right
  }

  body.os-mac [data-namespace="contact"] section #mc_embed_signup .btn-form-send {
    background-position: right 19px
  }

  [data-namespace="contact"] .infowindow {
    padding: 20px 0 20px 20px
  }

  [data-namespace="contact"] .infowindow-title {
    font-family: 'Calibre-Medium' !important;
    font-size: 16px;
    margin-bottom: 10px
  }

  [data-namespace="contact"] .infowindow-body {
    font-family: 'Calibre-Regular' !important;
    font-size: 16px
  }

  [data-namespace="contact"] .infowindow-body img {
    max-width: 100%;
    height: 200px;
    display: block;
    margin: 0 auto
  }

  [data-namespace="contact"] .infowindow-distance {
    font-family: 'Calibre-Medium' !important;
    font-size: 16px;
    margin-top: 10px
  }

  .barba-container[data-namespace="onesiteunsubscribe"]>section {
    height: 100vh;
    padding-top: 280px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="onesiteunsubscribe"]>section {
      padding-top:120px
    }
  }

  .barba-container[data-namespace="onesiteunsubscribe"] .onesite-form {
    float: none;
    display: block;
    margin: 40px auto
  }

  section#onesite {
    background: #f5f5f5;
    padding-top: 280px;
    padding-bottom: 0
  }

  @media (max-width: 767px) {
    section#onesite {
      padding-top:120px
    }
  }

  section#onesite .tagline {
    padding: 40px 60px 80px 60px;
    clear: both
  }

  @media (max-width: 767px) {
    section#onesite .tagline {
      padding-left:0;
      padding-right: 0
    }

    section#onesite .tagline h1 {
      font-size: 30px
    }
  }

  section#onesite .one-site {
    width: 33.3333%;
    float: left;
    text-align: center;
    font-family: 'MajestiBanner-Bold';
    font-size: 20px;
    transform: translate3d(0, 0, 0)
  }

  @media (max-width: 991px) {
    section#onesite .one-site {
      width:50%
    }
  }

  @media (max-width: 767px) {
    section#onesite .one-site {
      width:100%
    }
  }

  section#onesite .one-site .one-site-img-wrap {
    width: 100%;
    max-width: 204px;
    margin-left: auto;
    margin-right: auto
  }

  section#onesite .one-site .one-site-img {
    position: relative;
    border-radius: 50%;
    height: 0;
    padding-bottom: 100%;
    margin-bottom: 12px;
    border: 1px solid #f5f5f5
  }

  section#onesite .one-site .one-site-date {
    margin-bottom: 60px;
    color: #262633
  }

  .onesite-messages {
    font-size: 12px;
    background: none;
    padding: 3px 0 0 0
  }

  .onesite-messages.error {
    color: #f03232
  }

  .onesite-messages.success {
    color: #146314
  }

  .one-site-img:before {
    background: rgba(244,164,176,0.15);
    content: " ";
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    left: 0px;
    transform: scale(0);
    transition: transform 0.3s ease-in-out 16ms
  }

  .one-site-img:hover:before {
    transform: scale(1)
  }

  @supports (mix-blend-mode: screen) {
    .one-site-img:before {
      mix-blend-mode: screen;
      background: #f4193d
    }
  }

  .years-sticky {
    position: sticky;
    top: 100px
  }

  ul.years-wrap {
    list-style: none;
    padding-left: 46px;
    transition: all 0.5s;
    position: absolute;
    top: 0
  }

  ul.years-wrap:before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 14px;
    height: 100%;
    bottom: 0;
    border-right: 1px solid #dcddde;
    width: 0px
  }

  ul.years-wrap li {
    font-family: 'MajestiBanner-Bold';
    font-size: 12px;
    letter-spacing: 2px;
    position: relative;
    margin-top: 55px;
    color: #64656f
  }

  ul.years-wrap li.active {
    color: #040515
  }

  ul.years-wrap li:before {
    content: " ";
    border-radius: 50%;
    position: absolute;
    opacity: 1;
    background-color: #f5f5f5;
    width: 29px;
    height: 29px;
    left: -46px;
    top: -6px;
    transform: scale(1);
    transition: all 0.5s
  }

  ul.years-wrap li:after {
    content: " ";
    border-radius: 50%;
    position: absolute;
    background-color: #64656f;
    width: 9px;
    height: 9px;
    left: -36px;
    top: 4px;
    transform: scale(0.4);
    transition: all 0.5s
  }

  ul.years-wrap li.active:after {
    transform: scale(1);
    background-color: #FF0006
  }

  ul.years-wrap li.active:before {
    background-color: #fef7f7
  }

  .sites-wrap {
    min-height: 100vh
  }

  body.modal-open {
    padding-right: 0 !important
  }

  #site-modal .modal-dialog {
    max-width: 960px
  }

  #site-modal .modal-content {
    border: none;
    border-radius: 0;
    box-shadow: 0 71px 87px rgba(79,80,91,0.5)
  }

  #site-modal .site-modal-img {
    margin-left: -60px;
    max-width: 100%;
    height: auto
  }

  @media (max-width: 767px) {
    #site-modal .site-modal-img {
      margin:0 auto 40px auto;
      display: block
    }
  }

  #site-modal .modal-body {
    padding: 80px 60px
  }

  @media (max-width: 767px) {
    #site-modal .modal-body {
      padding:60px 20px
    }
  }

  #site-modal .modal-body .close {
    position: absolute;
    top: 20px;
    right: 20px;
    overflow: hidden;
    width: 30px;
    height: 30px;
    text-indent: -99em;
    background: url(/assets/images/close.svg) no-repeat center center;
    background-size: 66% 66%;
    opacity: 1
  }

  @media (min-width: 992px) {
    #site-modal .modal-body .close {
      display:none
    }
  }

  #site-modal .modal-body .body {
    font-family: 'Calibre-Regular';
    color: #4C4D58;
    letter-spacing: 0.5px;
    min-height: 200px;
    font-size: 17px;
    line-height: 1.6
  }

  #site-modal .modal-body .body::first-letter {
    font-family: "MajestiBanner-Bold";
    font-size: 96px;
    float: left;
    line-height: 1;
    display: block;
    padding-right: 10px;
    color: #262633 !important;
    margin-top: -11px;
    margin-bottom: -10px;
    margin-left: -2px
  }

  body.os-mac:not(.firefox) #site-modal .modal-body .body::first-letter {
    margin-top: -2px;
    margin-bottom: -20px
  }

  body.firefox #site-modal .modal-body .body::first-letter {
    margin-top: 11px
  }

  #site-modal .modal-body .date {
    font-family: "MajestiBanner-Bold";
    text-transform: uppercase;
    color: #64656f;
    float: left;
    letter-spacing: 0.25em;
    font-size: 12px;
    margin-top: 5px
  }

  #site-modal .modal-body .site-link {
    float: right;
    color: #262633;
    font-family: 'Calibre-Medium';
    background: url("/assets/images/arrow-link-black.png") no-repeat right center;
    padding-right: 25px
  }

  #site-modal .modal-body .site-link:hover {
    color: #f03232;
    text-decoration: none
  }

  @media (max-width: 575px) {
    #site-modal .modal-body .site-link {
      float:none;
      margin-top: 20px;
      display: inline-block
    }
  }

  .modal-backdrop.show {
    opacity: 0.05
  }

  .onesite-form {
    border-bottom: 1px solid #dcddde;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-top: 0px;
    max-width: 350px;
    float: right
  }

  .onesite-form label {
    display: block !important;
    font-family: 'MajestiBanner-Bold';
    font-size: 18px;
    clear: both;
    padding-left: 0 !important;
    margin-bottom: 15px;
    color: #262633
  }

  .onesite-form .form-control {
    background-color: transparent;
    padding-left: 0;
    font-family: 'Calibre-Regular';
    font-size: 17px;
    line-height: 100%;
    color: #64656f;
    border-radius: 0;
    border: 0;
    width: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-right: 0
  }

  .onesite-form .form-control:focus {
    background-color: transparent !important
  }

  .onesite-form .btn-form-send {
    background: url("/assets/images/arrow-link-black.png") no-repeat right 20px;
    font-family: 'MajestiBanner-Bold';
    text-transform: uppercase;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0.2em;
    color: #64656f;
    border-radius: 0;
    border: 0;
    padding-top: 19px;
    padding-bottom: 19px;
    padding-right: 20px;
    float: right
  }

  body.os-mac .onesite-form .btn-form-send {
    background-position: right 19px
  }

  [data-namespace="404"] section.cover {
    padding: 0;
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center
  }

  [data-namespace="404"] section.cover>.container {
    padding-top: 80px;
    padding-bottom: 80px
  }

  [data-namespace="404"] section.cover h1 {
    margin-bottom: 60px
  }

  [data-namespace="404"] section.cover h4 {
    color: #64656f;
    font-family: 'Calibre-Medium';
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 30px;
    letter-spacing: 0.2em
  }

  [data-namespace="404"] section.cover .spacer-50 {
    display: block;
    height: 50px
  }

  [data-namespace="404"] section.cover .line {
    display: block;
    height: 1px;
    width: 100%;
    max-width: 80px;
    opacity: 0.1;
    background-color: #040515
  }

  [data-namespace="404"] section.cover .btn-visit {
    font-family: 'MajestiBanner-Bold';
    font-size: 12px;
    letter-spacing: 2px;
    color: #040515;
    text-transform: uppercase
  }

  [data-namespace="404"] section.cover .btn-visit .line {
    margin-top: 10px;
    margin-right: 25px
  }

  [data-namespace="404"] section.cover .btn-visit .text {
    opacity: .6
  }

  [data-namespace="404"] section.cover .btn-visit a {
    margin-top: -27px;
    margin-left: 23px
  }

  h1 {
    position: relative;
    font-size: 40px;
    line-height: 1;
    margin-bottom: 25px
  }

  @media (min-width: 992px) {
    h1 {
      font-size:50px;
      line-height: 50px
    }
  }

  .grid .container {
    padding-top: 100px;
    padding-bottom: 100px;
    border: green solid 1px
  }

  .grid .container .col div {
    background-color: hotpink
  }

  h1 num {
    position: absolute;
    top: -15px;
    left: -35px;
    font-family: 'Calibre-Semibold';
    font-size: 12px;
    line-height: 1;
    letter-spacing: 3.5px;
    color: #64656f;
    text-transform: uppercase
  }

  @media (max-width: 1239px) {
    h1 num {
      top:8px;
      left: -25px
    }
  }

  @media (max-width: 991px) {
    h1 num {
      top:0;
      left: -30px
    }
  }

  p.svg-label {
    color: #64656F;
    font-family: 'Calibre-Medium';
    font-size: 12px;
    letter-spacing: 2.5px;
    line-height: 20px;
    text-align: center;
    text-transform: uppercase;
    margin-top: 20px
  }

  .responsive-video {
    max-width: 100%;
    height: auto;
    display: block
  }

  .well {
    padding: 80px 80px 60px 80px;
    background-color: #fff;
    box-shadow: 0 7px 21px 0px rgba(38,38,51,0.1)
  }

  @media (max-width: 1239px) {
    .well {
      padding:60px 65px 40px 65px
    }
  }

  @media (max-width: 991px) {
    .well {
      padding:45px
    }
  }

  .well p.title {
    display: inline-block;
    color: #040515 !important;
    font-family: 'Calibre-Semibold';
    font-size: 15px;
    letter-spacing: 3px;
    text-transform: uppercase;
    line-height: 24px;
    text-align: left;
    margin-bottom: 20px
  }

  .well p {
    color: #64656f
  }

  .well hr {
    margin-top: 34px;
    margin-bottom: 30px
  }

  @media (max-width: 575px) {
    .well .author {
      margin-left:-20px;
      margin-right: -20px
    }
  }

  .well .author .author-img {
    margin-right: 20px
  }

  .well .author .author-img img {
    border-radius: 50%;
    overflow: hidden
  }

  .well .author p {
    margin-bottom: 0
  }

  .well .author p b {
    color: #262633;
    font-family: 'Calibre-Medium';
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    text-transform: initial;
    display: block;
    margin-bottom: 12px
  }

  .well .author p span {
    color: #838387;
    font-family: 'MajestiBanner-Bold';
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 2px;
    line-height: 1;
    text-transform: uppercase;
    display: block
  }

  section.cover {
    padding-top: 270px;
    padding-bottom: 65px
  }

  section.cover h1 {
    margin-bottom: 115px
  }

  .btn {
    font-size: 12px;
    font-family: 'Calibre-Medium'
  }

  .btn-default {
    padding: 12px 30px;
    background-color: #262633;
    text-transform: uppercase !important;
    color: #fff !important;
    letter-spacing: 0.2em;
    background-image: radial-gradient(ellipse at center, #f03232 50%, rgba(38,38,51,0) 50%);
    background-position: center center;
    background-size: 0 0;
    background-repeat: no-repeat;
    transition: background-size .6s ease-in-out 16ms
  }

  .btn-default:hover {
    background-size: 500px 500px
  }

  .btn-visit {
    margin-top: 75px;
    font-family: 'MajestiBanner-Bold';
    font-size: 12px;
    letter-spacing: 2px;
    color: #040515;
    text-transform: uppercase
  }

  .btn-visit .line {
    display: block;
    height: 1px;
    width: 100%;
    max-width: 80px;
    opacity: 0.1;
    background-color: #040515;
    margin-top: 10px;
    margin-right: 25px
  }

  @media (max-width: 767px) {
    .btn-visit .line {
      max-width:40px
    }
  }

  .btn-visit .text {
    opacity: .6
  }

  .btn-visit a {
    margin-top: -27px;
    margin-left: 23px
  }

  @media (max-width: 767px) {
    .btn-visit .mobile-hidden {
      display:none
    }
  }

  [data-namespace="work"] section.section-01 {
    padding-top: 270px;
    padding-bottom: 60px
  }

  @media (max-width: 991px) {
    [data-namespace="work"] section.section-01 {
      padding-top:150px
    }
  }

  [data-namespace="work"] section.section-01 .case-block {
    height: auto;
    width: 100%;
    display: block;
    margin-bottom: 40px;
    border-radius: 50%;
    overflow: hidden;
    position: relative
  }

  [data-namespace="work"] section.section-01 .case-block:after {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: scale(0);
    transition: transform .7s ease 25ms;
    z-index: 1;
    background: rgba(246,60,91,0.3)
  }

  [data-namespace="work"] section.section-01 .case-block img {
    width: 100%;
    height: auto;
    border-radius: 50%
  }

  [data-namespace="work"] section.section-01 .case-block .case-highlight {
    position: absolute;
    background-color: #f5f5f5;
    width: 60%;
    height: 60%;
    text-align: center;
    vertical-align: middle;
    color: #fff;
    opacity: 0;
    z-index: 2;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: all .5s ease
  }

  [data-namespace="work"] section.section-01 .case-block .case-highlight h4 {
    font-size: 12px;
    text-transform: uppercase;
    font-family: 'Calibre-Medium';
    margin-top: 0;
    margin-bottom: 5px;
    letter-spacing: 1.5px;
    color: #4C4D58;
    font-weight: bolder
  }

  [data-namespace="work"] section.section-01 .case-block .case-highlight h2 {
    font-size: 30px;
    font-family: 'MajestiBanner-Bold';
    margin: 0;
    line-height: 100%;
    color: #262633
  }

  @media (max-width: 991px) {
    [data-namespace="work"] section.section-01 .case-block .case-highlight {
      opacity:1;
      transform: translate(-50%, -50%) scale(1)
    }

    [data-namespace="work"] section.section-01 .case-block .case-highlight h2 {
      font-size: 25px
    }
  }

  [data-namespace="work"] section.section-01 .case-block:hover:after {
    transform: scale(1);
    transition: transform .7s ease 16ms
  }

  [data-namespace="work"] section.section-01 .case-block:hover .case-highlight {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    transition: all .5s ease 0.35s
  }

  [data-namespace="work"] section.section-02 {
    background-color: #040515;
    color: #f5f5f5;
    padding-top: 110px;
    padding-bottom: 120px;
    margin-bottom: 90px
  }

  @media (max-width: 1239px) {
    [data-namespace="work"] section.section-02 {
      margin-bottom:112px
    }
  }

  @media (max-width: 991px) {
    [data-namespace="work"] section.section-02 {
      margin-bottom:0
    }
  }

  [data-namespace="work"] section.section-02 h2 {
    font-size: 50px;
    font-family: 'MajestiBanner-Bold';
    margin-bottom: 60px;
    color: #f5f5f5;
    margin-left: 20%
  }

  @media (max-width: 991px) {
    [data-namespace="work"] section.section-02 h2 {
      margin-left:0;
      text-align: center
    }
  }

  [data-namespace="work"] section.section-02 .works-table {
    font-size: 13px;
    font-family: 'Calibre-Regular';
    letter-spacing: 0.2em;
    width: 100%
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>th {
    padding: 0px 45px 20px 0;
    font-size: 50px;
    vertical-align: top;
    font-family: 'MajestiBanner-Bold';
    color: #dcddde;
    line-height: 1;
    width: 20%
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>th>.stickyOnTop {
    margin-top: -8px
  }

  @media (max-width: 767px) {
    [data-namespace="work"] section.section-02 .works-table>tbody>tr>th {
      display:none
    }
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td {
    padding: 20px 10px 20px 20px;
    font-size: 13px;
    border-top: 1px solid #1e1d2c;
    vertical-align: top;
    color: #f5f5f5
  }

  @media (max-width: 767px) {
    [data-namespace="work"] section.section-02 .works-table>tbody>tr>td {
      padding-left:0
    }
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td a {
    text-transform: uppercase;
    color: #f5f5f5;
    position: relative
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td a:after {
    content: " ";
    background: url("/assets/images/arrow-link.png") no-repeat;
    width: 8px;
    height: 10px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 15px;
    margin-top: -2px;
    transition: margin-left 0.2s
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td a:hover {
    text-decoration: none
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td a:hover:after {
    margin-left: 7px
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td span {
    color: #64656f;
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td a.inactive-link {
    text-transform: uppercase;
    margin-left: 0;
    margin-right: 0
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td a.inactive-link:after {
    display: none
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td.case-name {
    font-family: 'Calibre-Medium';
    width: 30%
  }

  @media (max-width: 767px) {
    [data-namespace="work"] section.section-02 .works-table>tbody>tr>td.case-name {
      display:block;
      width: 100%;
      padding-bottom: 5px
    }
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr>td.case-skills {
    font-family: 'Calibre-thin';
    width: 50%;
    letter-spacing: 0.1em
  }

  @media (max-width: 767px) {
    [data-namespace="work"] section.section-02 .works-table>tbody>tr>td.case-skills {
      display:block;
      width: 100%;
      padding-top: 0;
      border-top: 0
    }
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr.inactive-line>td {
    color: #94959e;
    font-family: 'Calibre-regular'
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr.inactive-line>td a {
    color: #94959e
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr.responsive-year {
    display: none
  }

  @media (max-width: 767px) {
    [data-namespace="work"] section.section-02 .works-table>tbody>tr.responsive-year {
      display:table-row;
      width: 100%
    }

    [data-namespace="work"] section.section-02 .works-table>tbody>tr.responsive-year>td {
      font-size: 14px;
      font-family: 'Calibre-Medium';
      color: #64656f
    }
  }

  [data-namespace="work"] section.section-02 .works-table>tbody>tr.responsive-year:first-child>td {
    border-top: 0;
    padding-top: 0
  }

  @supports (mix-blend-mode: screen) {
    [data-namespace="work"] section.section-01 .case-block:after {
      background: #f03232;
      mix-blend-mode: screen
    }
  }

  body,html {
    padding: 0;
    margin: 0;
    position: relative;
    width: 100%;
    height: 100%;
  }

  html {
    overflow-y: auto
  }

  * {
    cursor: url(./assets/cursor.png) 3 3,auto !important;
    cursor: -webkit-image-set(url(./assets/cursor.png) 1x, url(./assets/cursorx2.png) 2x) 3 3,pointer !important
  }

  .light,.shadow,.lightclick {
    position: fixed;
    top: 0;
    left: 0;
    transform: translate3d(var(--x, -150px), var(--y, -150px), 0);
    pointer-events: none;
    height: 0px;
    width: 0px;
    margin-top: 0px;
    margin-left: 0px;
    backface-visibility: hidden;
    z-index: 1100;
    display: none
  }

  @media (max-width: 991px) {
    .light,.shadow {
      /*display:none !important*/
    }
  }

  .light-inner,.shadow-inner,.lightclick-inner {
    opacity: 1;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    margin-top: -25px;
    margin-left: -25px;
    transform: translateZ(0) scale(var(--scale, 1));
    z-index: 1100;
    transition: transform 0.5s ease-out, opacity 0.5s ease-out 0.5s;
    transition: transform 0.5s cubic-bezier(0.07, 0.08, 0.16, 0.99),opacity 0.5s ease-out 0.5s;
    transform-origin: 50% 50%;
    backface-visibility: hidden
  }

  .light-inner.upscaling,.shadow-inner.upscaling,.lightclick-inner.upscaling {
    transition: transform 0.8s ease-out;
    transition: transform 0.8s cubic-bezier(0.07, 0.08, 0.16, 0.99)
  }

  .light-inner.downscaling,.shadow-inner.downscaling,.lightclick-inner.downscaling {
    transition: opacity 1s ease-out;
    transition: opacity 1s cubic-bezier(0.07, 0.08, 0.16, 0.99);
    opacity: 0
  }

  .light-inner {
    background: rgba(253,206,214,0.1)
  }

  @supports (mix-blend-mode: screen) {
    .light {
      mix-blend-mode: screen
    }

    .light-inner {
      background: #424248;
    }
  }

  .shadow-inner {
    background: transparent;
    box-shadow: 0px 5px 20px rgba(0,0,0,0.1)
  }

  .lightclick-inner {
    box-sizing: border-box;
    height: 70px;
    width: 70px;
    margin-top: -35px;
    margin-left: -35px;
    border: 35px solid red;
    transform: scale(0)
  }

  .lightclick-inner.active {
    animation-name: lightclick-anim;
    animation-duration: 1000ms;
    animation-iteration-count: 1
  }

  @keyframes lightclick-anim {
    0% {
      border-width: 35px;
      transform: scale(0);
      opacity: 0.5
    }

    10% {
      border-width: 35px
    }

    50% {
      transform: scale(1);
      opacity: 0.5
    }

    90% {
      border-width: 0px
    }

    100% {
      opacity: 0;
      transform: scale(1)
    }
  }

  .cd-image-container {
    position: relative;
    width: 90%;
    max-width: 768px;
    margin: 0em auto
  }

  .cd-image-container img {
    display: block;
    max-width: 100%
  }

  .cd-image-label {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #ffffff;
    padding: 1em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    opacity: 0;
    -webkit-transform: translateY(20px);
    -moz-transform: translateY(20px);
    -ms-transform: translateY(20px);
    -o-transform: translateY(20px);
    transform: translateY(20px);
    -webkit-transition: -webkit-transform 0.3s 0.7s, opacity 0.3s 0.7s;
    -moz-transition: -moz-transform 0.3s 0.7s, opacity 0.3s 0.7s;
    transition: transform 0.3s 0.7s, opacity 0.3s 0.7s
  }

  .cd-image-label.is-hidden {
    visibility: hidden
  }

  .is-visible .cd-image-label {
    opacity: 1;
    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    -o-transform: translateY(0);
    transform: translateY(0)
  }

  .cd-resize-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    overflow: hidden;
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-right: 2px solid #dcddde
  }

  .cd-resize-img img {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    height: 100%;
    width: auto;
    max-width: none
  }

  .cd-resize-img .cd-image-label {
    right: auto;
    left: 0
  }

  .is-visible .cd-resize-img {
    width: 50%;
    -webkit-animation: cd-bounce-in 0.7s;
    -moz-animation: cd-bounce-in 0.7s;
    animation: cd-bounce-in 0.7s
  }

  @-webkit-keyframes cd-bounce-in {
    0% {
      width: 0
    }

    60% {
      width: 55%
    }

    100% {
      width: 50%
    }
  }

  @-moz-keyframes cd-bounce-in {
    0% {
      width: 0
    }

    60% {
      width: 55%
    }

    100% {
      width: 50%
    }
  }

  @keyframes cd-bounce-in {
    0% {
      width: 0
    }

    60% {
      width: 55%
    }

    100% {
      width: 50%
    }
  }

  .cd-handle {
    position: absolute;
    height: 70px;
    width: 70px;
    left: 50%;
    top: 50%;
    margin-left: -35px;
    margin-top: -35px;
    background: url("/assets/images/work/slider-after-before-handle.svg") no-repeat center center;
    cursor: move;
    opacity: 0;
    -webkit-transform: translate3d(0, 0, 0) scale(0);
    -moz-transform: translate3d(0, 0, 0) scale(0);
    -ms-transform: translate3d(0, 0, 0) scale(0);
    -o-transform: translate3d(0, 0, 0) scale(0);
    transform: translate3d(0, 0, 0) scale(0)
  }

  .is-visible .cd-handle {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0) scale(1);
    -moz-transform: translate3d(0, 0, 0) scale(1);
    -ms-transform: translate3d(0, 0, 0) scale(1);
    -o-transform: translate3d(0, 0, 0) scale(1);
    transform: translate3d(0, 0, 0) scale(1);
    -webkit-transition: -webkit-transform 0.3s 0.7s, opacity 0s 0.7s;
    -moz-transition: -moz-transform 0.3s 0.7s, opacity 0s 0.7s;
    transition: transform 0.3s 0.7s, opacity 0s 0.7s
  }

  h1 {
    position: relative;
    font-size: 40px;
    line-height: 1;
    margin-bottom: 25px
  }

  @media (min-width: 992px) {
    h1 {
      font-size:50px;
      line-height: 50px
    }
  }

  .grid .container {
    padding-top: 100px;
    padding-bottom: 100px;
    border: green solid 1px
  }

  .grid .container .col div {
    background-color: hotpink
  }

  h1 num {
    position: absolute;
    top: -15px;
    left: -35px;
    font-family: 'Calibre-Semibold';
    font-size: 12px;
    line-height: 1;
    letter-spacing: 3.5px;
    color: #64656f;
    text-transform: uppercase
  }

  @media (max-width: 1239px) {
    h1 num {
      top:8px;
      left: -25px
    }
  }

  @media (max-width: 991px) {
    h1 num {
      top:0;
      left: -30px
    }
  }

  p.svg-label {
    color: #64656F;
    font-family: 'Calibre-Medium';
    font-size: 12px;
    letter-spacing: 2.5px;
    line-height: 20px;
    text-align: center;
    text-transform: uppercase;
    margin-top: 20px
  }

  .responsive-video {
    max-width: 100%;
    height: auto;
    display: block
  }

  .well {
    padding: 80px 80px 60px 80px;
    background-color: #fff;
    box-shadow: 0 7px 21px 0px rgba(38,38,51,0.1)
  }

  @media (max-width: 1239px) {
    .well {
      padding:60px 65px 40px 65px
    }
  }

  @media (max-width: 991px) {
    .well {
      padding:45px
    }
  }

  .well p.title {
    display: inline-block;
    color: #040515 !important;
    font-family: 'Calibre-Semibold';
    font-size: 15px;
    letter-spacing: 3px;
    text-transform: uppercase;
    line-height: 24px;
    text-align: left;
    margin-bottom: 20px
  }

  .well p {
    color: #64656f
  }

  .well hr {
    margin-top: 34px;
    margin-bottom: 30px
  }

  @media (max-width: 575px) {
    .well .author {
      margin-left:-20px;
      margin-right: -20px
    }
  }

  .well .author .author-img {
    margin-right: 20px
  }

  .well .author .author-img img {
    border-radius: 50%;
    overflow: hidden
  }

  .well .author p {
    margin-bottom: 0
  }

  .well .author p b {
    color: #262633;
    font-family: 'Calibre-Medium';
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    text-transform: initial;
    display: block;
    margin-bottom: 12px
  }

  .well .author p span {
    color: #838387;
    font-family: 'MajestiBanner-Bold';
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 2px;
    line-height: 1;
    text-transform: uppercase;
    display: block
  }

  section.cover {
    padding-top: 270px;
    padding-bottom: 65px
  }

  section.cover h1 {
    margin-bottom: 115px
  }

  .btn {
    font-size: 12px;
    font-family: 'Calibre-Medium'
  }

  .btn-default {
    padding: 12px 30px;
    background-color: #262633;
    text-transform: uppercase !important;
    color: #fff !important;
    letter-spacing: 0.2em;
    background-image: radial-gradient(ellipse at center, #f03232 50%, rgba(38,38,51,0) 50%);
    background-position: center center;
    background-size: 0 0;
    background-repeat: no-repeat;
    transition: background-size .6s ease-in-out 16ms
  }

  .btn-default:hover {
    background-size: 500px 500px
  }

  .btn-visit {
    margin-top: 75px;
    font-family: 'MajestiBanner-Bold';
    font-size: 12px;
    letter-spacing: 2px;
    color: #040515;
    text-transform: uppercase
  }

  .btn-visit .line {
    display: block;
    height: 1px;
    width: 100%;
    max-width: 80px;
    opacity: 0.1;
    background-color: #040515;
    margin-top: 10px;
    margin-right: 25px
  }

  @media (max-width: 767px) {
    .btn-visit .line {
      max-width:40px
    }
  }

  .btn-visit .text {
    opacity: .6
  }

  .btn-visit a {
    margin-top: -27px;
    margin-left: 23px
  }

  @media (max-width: 767px) {
    .btn-visit .mobile-hidden {
      display:none
    }
  }

  .barba-container[data-namespace="icon"] {
    background-color: #f5f5f5
  }

  .barba-container[data-namespace="icon"] #icon-animation-icons rect {
    fill: #f5f5f5
  }

  .barba-container[data-namespace="icon"] section.cover {
    background-color: #f5f5f5 !important;
    padding-top: 120px;
    padding-bottom: 65px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="icon"] section.cover {
      padding-top:270px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="icon"] section.cover .mobile-hidden {
      display:none
    }
  }

  .barba-container[data-namespace="icon"] section.cover h1 {
    margin-bottom: 50px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="icon"] section.cover h1 {
      margin-bottom:115px
    }
  }

  .barba-container[data-namespace="icon"] section.cover p.title {
    font-family: "Calibre-Medium";
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 3px;
    line-height: 20px;
    margin-top: 8px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="icon"] section.cover p.title {
    margin-top: 0
  }

  body.os-mac.firefox .barba-container[data-namespace="icon"] section.cover p.title {
    margin-top: 5px
  }

  .barba-container[data-namespace="icon"] section.cover p.title b {
    display: block
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="icon"] section.cover p.title {
      margin-bottom:20px
    }
  }

  .barba-container[data-namespace="icon"] section.cover .p-line {
    display: block;
    height: 100%;
    width: 1px;
    opacity: 0.1;
    background-color: #040515;
    float: right
  }

  .barba-container[data-namespace="icon"] section.cover p {
    margin-bottom: 0
  }

  .barba-container[data-namespace="icon"] section.cover p.first::first-letter {
    font-family: "MajestiBanner-Bold";
    font-size: 96px;
    float: left;
    line-height: 1;
    display: block;
    padding-right: 10px;
    color: #262633 !important;
    margin-top: -11px;
    margin-bottom: -10px;
    margin-left: -2px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="icon"] section.cover p.first::first-letter {
    margin-top: -2px;
    margin-bottom: -20px
  }

  body.firefox .barba-container[data-namespace="icon"] section.cover p.first::first-letter {
    margin-top: 11px
  }

  .barba-container[data-namespace="icon"] section.cover .img-cover {
    background-color: #FFFFFF;
    box-shadow: 0 7px 21px 0px rgba(38,38,51,0.1);
    margin-bottom: 40px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="icon"] section.cover .img-cover {
      margin-bottom:90px
    }
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="icon"] section.cover .img-cover {
      margin-left:-50px;
      margin-right: -50px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] section.cover .img-cover {
      margin-left:-20px;
      margin-right: -20px
    }
  }

  .barba-container[data-namespace="icon"] .section-01 {
    background-color: #ffffff !important;
    padding-top: 350px;
    padding-bottom: 350px
  }

  .barba-container[data-namespace="icon"] .section-01 .switch-first {
    padding-top: 100px
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="icon"] .section-01 {
      padding-top:150px;
      padding-bottom: 150px
    }

    .barba-container[data-namespace="icon"] .section-01 svg {
      width: 80%;
      text-align: center
    }
  }

  .barba-container[data-namespace="icon"] .section-02 {
    background-color: #f5f5f5 !important;
    padding-top: 100px;
    padding-bottom: 200px;
    background-position: 800px 0
  }

  .barba-container[data-namespace="icon"] .section-02 .switch-first .visu-shoes {
    margin-top: -100px;
    text-align: right
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="icon"] .section-02 .switch-first .visu-shoes img {
      width:90%
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] .section-02 .switch-first .visu-shoes img {
      width:50%
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="icon"] .section-02 .switch-first .visu-shoes img {
      width:80%
    }
  }

  .barba-container[data-namespace="icon"] .section-02 h3 {
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px 0;
    position: relative;
    font-family: "Calibre-Medium"
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] .section-02 {
      padding-bottom:60px
    }

    .barba-container[data-namespace="icon"] .section-02 .switch-last {
      order: 10;
      margin-top: -70px;
      z-index: 500
    }

    .barba-container[data-namespace="icon"] .section-02 .switch-first {
      order: 1;
      z-index: 0
    }

    .barba-container[data-namespace="icon"] .section-02 .switch-first .visu-shoes {
      text-align: center
    }
  }

  .barba-container[data-namespace="icon"] .section-03 {
    background-color: #ffffff !important;
    padding-top: 100px;
    padding-bottom: 100px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] .section-03 {
      padding-top:60px;
      padding-bottom: 40px
    }
  }

  .barba-container[data-namespace="icon"] .section-04 {
    background-color: #f5f5f5 !important;
    padding-top: 140px;
    padding-bottom: 60px
  }

  .barba-container[data-namespace="icon"] .section-04 img {
    max-width: 100%
  }

  .barba-container[data-namespace="icon"] .section-04 h3 {
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px 0;
    position: relative;
    font-family: "Calibre-Medium"
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="icon"] .section-04 {
      padding-top:80px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] .section-04 {
      padding-top:50px;
      padding-bottom: 80px
    }

    .barba-container[data-namespace="icon"] .section-04 .switch-last {
      order: 10
    }

    .barba-container[data-namespace="icon"] .section-04 .switch-first {
      order: 1;
      padding-bottom: 50px
    }
  }

  .barba-container[data-namespace="icon"] .section-carousel {
    background-color: #f5f5f5 !important;
    position: relative;
    border-top: 0px;
    padding-bottom: 0px;
    border-top: 20px solid #f5f5f5;
    padding-bottom: 40px
  }

  @media (min-width: 576px) {
    .barba-container[data-namespace="icon"] .section-carousel {
      border-top:120px solid #f5f5f5;
      padding-bottom: 150px
    }
  }

  .barba-container[data-namespace="icon"] .section-carousel .carousel-phone {
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    position: relative
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="icon"] .section-carousel .carousel-phone {
      transform:scale(0.8)
    }
  }

  .barba-container[data-namespace="icon"] .section-carousel .carousel-phone:before {
    content: '';
    width: 375px;
    height: 734px;
    display: block;
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    background-image: url(/assets/images/work/carousel-iphone.png);
    z-index: 10;
    pointer-events: none
  }

  .barba-container[data-namespace="icon"] .section-carousel .carousel-phone:after {
    content: '';
    display: block;
    clear: both
  }

  .barba-container[data-namespace="icon"] .section-carousel .carousel-phone .carousel-cell {
    position: relative;
    display: inline-block;
    width: 100%;
    text-align: center
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="icon"] .section-carousel .carousel-phone .carousel-cell {
      width:50%
    }
  }

  @media (min-width: 1240px) {
    .barba-container[data-namespace="icon"] .section-carousel .carousel-phone .carousel-cell {
      width:33%
    }
  }

  .barba-container[data-namespace="icon"] .section-carousel .carousel-phone .carousel-cell img {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    filter: grayscale(100%);
    opacity: .6;
    transition: all .3s ease
  }

  .barba-container[data-namespace="icon"] .section-carousel .carousel-phone .carousel-cell.is-selected img {
    opacity: 1;
    -webkit-filter: grayscale(0%);
    -moz-filter: grayscale(0%);
    filter: grayscale(0%)
  }

  .barba-container[data-namespace="icon"] .section-05 {
    padding-top: 70px;
    padding-bottom: 120px;
    background-color: #f5f5f5
  }

  .barba-container[data-namespace="icon"] .section-05 p.shopify-icon {
    position: relative
  }

  .barba-container[data-namespace="icon"] .section-05 p.shopify-icon::before {
    content: '';
    display: block;
    background: url("/assets/images/work/icon/logo-shopify.png") no-repeat;
    width: 80px;
    height: 100px;
    position: absolute;
    top: 5px;
    left: -130px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] .section-05 p.shopify-icon::before {
      position:relative;
      top: 0;
      left: 0;
      margin-bottom: 20px
    }
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="icon"] .section-05 .switch-first .image-resize {
      width:100%
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] .section-05 {
      padding-top:20px;
      padding-bottom: 80px
    }

    .barba-container[data-namespace="icon"] .section-05 .switch-last {
      order: 10
    }

    .barba-container[data-namespace="icon"] .section-05 .switch-first {
      order: 1;
      padding-bottom: 60px
    }

    .barba-container[data-namespace="icon"] .section-05 .switch-first .image-resize {
      width: auto
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="icon"] .section-05 .switch-first .image-resize {
      width:100%
    }
  }

  .barba-container[data-namespace="icon"] .section-06 {
    text-align: center;
    display: block
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="icon"] .section-06 img {
      width:100%
    }
  }

  .barba-container[data-namespace="icon"] .section-07 {
    background-color: #f5f5f5 !important;
    padding-top: 140px;
    padding-bottom: 120px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] .section-07 {
      padding-top:60px;
      padding-bottom: 60px
    }
  }

  .barba-container[data-namespace="icon"] .section-07 img {
    max-width: 100%
  }

  .barba-container[data-namespace="icon"] .section-08 {
    text-align: center;
    display: block;
    background-color: #f5f5f5
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="icon"] .section-08 img {
      width:100%
    }
  }

  .barba-container[data-namespace="icon"] .section-testimonial {
    background: #f5f5f5 url("/assets/images/work/icon/illu-testimonial.jpg") no-repeat bottom center;
    padding-top: 100px;
    padding-bottom: 100px;
    position: relative;
    min-height: 800px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="icon"] .section-testimonial {
      background:url("/assets/images/work/icon/illu-testimonial-mobile-1.jpg") no-repeat center 50px;
      padding-top: 220px;
      padding-bottom: 0
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="icon"] .section-testimonial {
      background-size:80%;
      background: none;
      padding-top: 40px
    }
  }

  .barba-container[data-namespace="icon"] .section-testimonial .well {
    z-index: 500;
    position: relative
  }

  .barba-container[data-namespace="icon"] .section-testimonial .well p.title {
    font-family: 'Calibre-Semibold'
  }

  .barba-container[data-namespace="sibos"] {
    overflow: hidden;
    background-color: #f5f5f5
  }

  .barba-container[data-namespace="sibos"] .brand-dots .dot {
    transform-origin: center
  }

  .barba-container[data-namespace="sibos"] .brand-shapes {
    overflow: visible
  }

  .barba-container[data-namespace="sibos"] #sibos-animation-story {
    margin-top: -60px
  }

  .barba-container[data-namespace="sibos"] section.cover {
    background-color: #f5f5f5 !important;
    padding-top: 120px;
    padding-bottom: 65px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="sibos"] section.cover {
      padding-top:270px
    }
  }

  .barba-container[data-namespace="sibos"] section.cover h1 {
    margin-bottom: 50px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="sibos"] section.cover h1 {
      margin-bottom:115px
    }
  }

  .barba-container[data-namespace="sibos"] section.cover p.title {
    font-family: "Calibre-medium";
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 3px;
    line-height: 20px;
    margin-top: 8px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="sibos"] section.cover p.title {
    margin-top: 0
  }

  body.os-mac.firefox .barba-container[data-namespace="sibos"] section.cover p.title {
    margin-top: 5px
  }

  .barba-container[data-namespace="sibos"] section.cover p.title b {
    display: block
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="sibos"] section.cover p.title {
      margin-bottom:20px
    }
  }

  .barba-container[data-namespace="sibos"] section.cover .p-line {
    display: block;
    height: 100%;
    width: 1px;
    opacity: 0.1;
    background-color: #040515;
    float: right
  }

  .barba-container[data-namespace="sibos"] section.cover p {
    margin-bottom: 0
  }

  .barba-container[data-namespace="sibos"] section.cover p.first::first-letter {
    font-family: "MajestiBanner-Bold";
    font-size: 96px;
    float: left;
    line-height: 1;
    display: block;
    padding-right: 10px;
    color: #262633 !important;
    margin-top: -11px;
    margin-bottom: -10px;
    margin-left: -2px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="sibos"] section.cover p.first::first-letter {
    margin-top: -2px;
    margin-bottom: -20px
  }

  body.firefox .barba-container[data-namespace="sibos"] section.cover p.first::first-letter {
    margin-top: 11px
  }

  .barba-container[data-namespace="sibos"] section.cover .img-cover {
    background-color: #FFFFFF;
    box-shadow: 0 7px 21px 0px rgba(38,38,51,0.1);
    margin-bottom: 40px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="sibos"] section.cover .img-cover {
      margin-bottom:90px
    }
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="sibos"] section.cover .img-cover {
      margin-left:-50px;
      margin-right: -50px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="sibos"] section.cover .img-cover {
      margin-left:-20px;
      margin-right: -20px
    }
  }

  .barba-container[data-namespace="sibos"] .section-01 {
    background-color: #ffffff !important;
    padding-top: 60px;
    padding-bottom: 50px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="sibos"] .section-01 {
      padding-top:100px;
      padding-bottom: 80px
    }
  }

  .barba-container[data-namespace="sibos"] .section-01 .switch-first {
    padding-top: 40px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="sibos"] .section-01 {
      padding-top:45px
    }

    .barba-container[data-namespace="sibos"] .section-01 .svg-label {
      margin-top: 0
    }

    .barba-container[data-namespace="sibos"] .section-01 .switch-last {
      order: 10
    }

    .barba-container[data-namespace="sibos"] .section-01 .switch-first {
      order: 1;
      padding-top: 0;
      padding-bottom: 60px;
      text-align: center
    }

    .barba-container[data-namespace="sibos"] .section-01 .switch-first svg {
      width: 70%
    }
  }

  .barba-container[data-namespace="sibos"] .section-02 {
    position: relative;
    background-repeat: no-repeat;
    background-color: #000;
    background-position: 37% 50%;
    box-shadow: inset 0 13px 166px 32px #040515;
    max-width: 100%;
    margin: 0 auto;
    z-index: 11;
    padding-top: 60px;
    padding-bottom: 60px;
    min-height: auto;
    background-position: 53% 50%;
    border-bottom: 100px solid #f5f5f5
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="sibos"] .section-02 {
      background-image:url("/assets/images/work/sibos/section-02-bg.jpg")
    }
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="sibos"] .section-02 {
      padding-top:100px;
      padding-bottom: 100px;
      background-position: 35% 62%;
      border-bottom: 150px solid #f5f5f5
    }
  }

  @media (min-width: 1240px) {
    .barba-container[data-namespace="sibos"] .section-02 {
      background-position:center top;
      min-height: 770px;
      background-size: auto 100%
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="sibos"] .section-02 {
      border-bottom:60px solid #f5f5f5
    }
  }

  .barba-container[data-namespace="sibos"] .section-02 h1 {
    color: white;
    width: 100%;
    max-width: 440px
  }

  .barba-container[data-namespace="sibos"] .section-02 p {
    width: 100%;
    max-width: 440px;
    color: #868e96;
    font-size: 18px;
    line-height: 30px
  }

  .barba-container[data-namespace="sibos"] .section-02 .line {
    position: absolute;
    right: 20%;
    top: 5%;
    display: block;
    height: 1px;
    width: 100%;
    max-width: 80px;
    background-color: #ee5222
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="sibos"] .section-02 .line {
      right:-20%;
      top: 15%
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="sibos"] .section-02 .line {
      display:none
    }
  }

  .barba-container[data-namespace="sibos"] .section-02 .cover {
    display: inline-block;
    margin-top: 86px;
    margin-bottom: -180px;
    box-shadow: 0px 50px 87px 0px rgba(38,38,51,0.32)
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="sibos"] .section-02 .cover {
      margin-top:30px
    }
  }

  .barba-container[data-namespace="sibos"] .section-02 .toronto {
    display: none
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="sibos"] .section-02 .toronto {
      display:block
    }
  }

  .barba-container[data-namespace="sibos"] .section-02 .toronto svg {
    position: absolute;
    top: 250px;
    left: 55%;
    opacity: .7
  }

  .barba-container[data-namespace="sibos"] .section-03 {
    background-color: #f5f5f5 !important;
    padding-top: 70px;
    padding-bottom: 100px
  }

  .barba-container[data-namespace="sibos"] .section-03 .row:nth-child(2) {
    margin-top: 50px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="sibos"] .section-03 {
      padding-bottom:20px
    }
  }

  .barba-container[data-namespace="sibos"] .section-03 h1 {
    margin-top: 35px
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="sibos"] .section-03 h1 {
      margin-top:0px
    }
  }

  .barba-container[data-namespace="sibos"] .section-03 h3 {
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px 0;
    position: relative;
    font-family: "Calibre-Medium"
  }

  .barba-container[data-namespace="sibos"] .section-03-carousel {
    background-color: #f5f5f5 !important;
    padding: 60px 0 0 0;
    width: 100%
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="sibos"] .section-03-carousel {
      padding:60px 20px 0 20px
    }
  }

  .barba-container[data-namespace="sibos"] .section-03-carousel:after {
    content: '';
    display: block;
    clear: both
  }

  .barba-container[data-namespace="sibos"] .section-03-carousel .carousel-layouts {
    position: relative;
    max-width: 1200px;
    padding-bottom: 0px;
    margin: 0 auto
  }

  .barba-container[data-namespace="sibos"] .section-03-carousel .carousel-layouts .carousel-cell {
    position: relative;
    display: inline-block;
    width: 33%;
    margin-right: 40px;
    text-align: center
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="sibos"] .section-03-carousel .carousel-layouts .carousel-cell {
      width:calc( (20%) - (40px * (5 - 1) / (5)))
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="sibos"] .section-03-carousel .carousel-layouts .carousel-cell svg {
      -webkit-filter:grayscale(100%);
      -moz-filter: grayscale(100%);
      filter: grayscale(100%);
      opacity: .6;
      transition: all .3s ease
    }

    .barba-container[data-namespace="sibos"] .section-03-carousel .carousel-layouts .carousel-cell.is-selected svg {
      opacity: 1;
      -webkit-filter: grayscale(0%);
      -moz-filter: grayscale(0%);
      filter: grayscale(0%)
    }
  }

  .barba-container[data-namespace="sibos"] .section-03-overpass {
    padding: 60px 0 60px 0;
    background-color: #f5f5f5 !important
  }

  @media (min-width: 576px) {
    .barba-container[data-namespace="sibos"] .section-03-overpass {
      padding:140px 0 100px 0
    }
  }

  .barba-container[data-namespace="sibos"] .section-03-overpass .cd-image-container {
    max-width: 570px;
    margin: 0 auto
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="sibos"] .section-03-overpass .cd-image-container {
      margin-top:60px
    }
  }

  .barba-container[data-namespace="sibos"] .section-03-overpass .cd-image-container .cd-image-label {
    font-family: "Calibre-Medium";
    font-size: 11px;
    color: #64656f;
    text-transform: uppercase;
    letter-spacing: 2px;
    white-space: nowrap
  }

  .barba-container[data-namespace="sibos"] .section-03-overpass .cd-image-container .cd-handle {
    top: 80%
  }

  .barba-container[data-namespace="sibos"] .section-carousel {
    background-color: #f5f5f5 !important;
    position: relative;
    border-top: 0px;
    padding-bottom: 0px;
    border-top: 20px solid #f5f5f5;
    padding-bottom: 40px
  }

  @media (min-width: 576px) {
    .barba-container[data-namespace="sibos"] .section-carousel {
      border-top:120px solid #f5f5f5;
      padding-bottom: 150px
    }
  }

  .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone {
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    position: relative
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone {
      transform:scale(0.8)
    }
  }

  .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone:before {
    content: '';
    width: 375px;
    height: 734px;
    display: block;
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    background-image: url(/assets/images/work/carousel-iphone.png);
    z-index: 10;
    pointer-events: none
  }

  .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone:after {
    content: '';
    display: block;
    clear: both
  }

  .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone .carousel-cell {
    position: relative;
    display: inline-block;
    width: 100%;
    text-align: center
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone .carousel-cell {
      width:50%
    }
  }

  @media (min-width: 1240px) {
    .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone .carousel-cell {
      width:33%
    }
  }

  .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone .carousel-cell img {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    filter: grayscale(100%);
    opacity: .6;
    transition: all .3s ease
  }

  .barba-container[data-namespace="sibos"] .section-carousel .carousel-phone .carousel-cell.is-selected img {
    opacity: 1;
    -webkit-filter: grayscale(0%);
    -moz-filter: grayscale(0%);
    filter: grayscale(0%)
  }

  .barba-container[data-namespace="sibos"] .section-04 {
    padding-top: 100px;
    background-color: #f5f5f5 !important
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) {
    margin-top: 145px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) {
      margin-top:60px
    }
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul {
    list-style: none;
    padding: 0;
    max-width: 920px;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 30px
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li {
    display: inline-block;
    width: 25%;
    color: #B4B4B8;
    font-family: "Calibre-Medium";
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 3px;
    line-height: 24px;
    text-transform: uppercase;
    border-bottom: 2px solid #E9E9E9
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li br {
    display: none
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li {
      text-align:center !important;
      letter-spacing: 1px;
      font-size: 10px;
      line-height: 1.3
    }

    .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li br {
      display: inline-block
    }
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li span {
    position: relative;
    display: inline-block;
    padding: 10px 0;
    cursor: pointer
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li.active {
    color: #262633
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li.active span:after {
    content: "";
    width: 100%;
    height: 2px;
    background-color: #262633;
    display: inline-block;
    position: absolute;
    bottom: -2px;
    left: 0
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li:nth-child(2),.barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li:nth-child(3) {
    text-align: center
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) ul li:last-child {
    text-align: right
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) .cover {
    overflow-y: hidden;
    width: 100%;
    position: relative
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) .cover {
      max-height:989px
    }
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) .cover img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    opacity: 0;
    transition: opacity .5s ease;
    transition-delay: .5s;
    z-index: 0
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) .cover img {
      box-shadow:0px 50px 87px 0px rgba(38,38,51,0.32)
    }
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) .cover img.active {
    opacity: 1;
    transition-delay: 0s;
    z-index: 1
  }

  .barba-container[data-namespace="sibos"] .section-04 .row:nth-child(2) .cover img.img-relative {
    opacity: 0;
    z-index: -1;
    position: relative;
    top: initial;
    left: initial;
    transform: initial;
    width: 100%;
    height: auto
  }

  .barba-container[data-namespace="sibos"] .section-06 {
    overflow: hidden
  }

  .barba-container[data-namespace="sibos"] .section-cta {
    background-color: #f5f5f5 !important;
    padding-top: 215px;
    padding-bottom: 155px
  }

  .barba-container[data-namespace="epc"] {
    background-color: #f5f5f5
  }

  .barba-container[data-namespace="epc"] section.cover {
    background-color: #f5f5f5 !important;
    padding-top: 120px;
    padding-bottom: 65px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="epc"] section.cover {
      padding-top:270px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="epc"] section.cover .mobile-hidden {
      display:none
    }
  }

  .barba-container[data-namespace="epc"] section.cover h1 {
    margin-bottom: 50px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="epc"] section.cover h1 {
      margin-bottom:115px
    }
  }

  .barba-container[data-namespace="epc"] section.cover p.title {
    font-family: "Calibre-Medium";
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 3px;
    line-height: 20px;
    margin-top: 8px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="epc"] section.cover p.title {
    margin-top: 0
  }

  body.os-mac.firefox .barba-container[data-namespace="epc"] section.cover p.title {
    margin-top: 5px
  }

  .barba-container[data-namespace="epc"] section.cover p.title b {
    display: block
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="epc"] section.cover p.title {
      margin-bottom:20px
    }
  }

  .barba-container[data-namespace="epc"] section.cover .p-line {
    display: block;
    height: 100%;
    width: 1px;
    opacity: 0.1;
    background-color: #040515;
    float: right
  }

  .barba-container[data-namespace="epc"] section.cover p {
    margin-bottom: 0
  }

  .barba-container[data-namespace="epc"] section.cover p.first::first-letter {
    font-family: "MajestiBanner-Bold";
    font-size: 96px;
    float: left;
    line-height: 1;
    display: block;
    padding-right: 10px;
    color: #262633 !important;
    margin-top: -11px;
    margin-bottom: -10px;
    margin-left: -2px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="epc"] section.cover p.first::first-letter {
    margin-top: -2px;
    margin-bottom: -20px
  }

  body.firefox .barba-container[data-namespace="epc"] section.cover p.first::first-letter {
    margin-top: 11px
  }

  .barba-container[data-namespace="epc"] section.cover .img-cover {
    background-color: #FFFFFF;
    box-shadow: 0 7px 21px 0px rgba(38,38,51,0.1);
    margin-bottom: 40px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="epc"] section.cover .img-cover {
      margin-bottom:90px
    }
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="epc"] section.cover .img-cover {
      margin-left:-50px;
      margin-right: -50px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] section.cover .img-cover {
      margin-left:-20px;
      margin-right: -20px
    }
  }

  .barba-container[data-namespace="epc"] .section-01 {
    background-color: #f5f5f5 !important;
    padding-top: 65px;
    padding-bottom: 65px
  }

  .barba-container[data-namespace="epc"] .section-01 .switch-first {
    padding-top: 100px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-01 {
      padding-top:45px
    }

    .barba-container[data-namespace="epc"] .section-01 .switch-last {
      order: 10
    }

    .barba-container[data-namespace="epc"] .section-01 .switch-first {
      order: 1;
      padding-top: 0;
      padding-bottom: 60px;
      text-align: center
    }

    .barba-container[data-namespace="epc"] .section-01 .switch-first svg {
      width: 70%
    }
  }

  .barba-container[data-namespace="epc"] .section-02 {
    background-color: #f5f5f5 !important;
    padding-top: 70px;
    padding-bottom: 150px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-02 {
      padding-top:0;
      padding-bottom: 80px
    }
  }

  .barba-container[data-namespace="epc"] .section-02 img {
    max-width: 100%;
    border: 1px solid #dededf
  }

  .barba-container[data-namespace="epc"] .section-02 h3 {
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px 0;
    position: relative;
    font-family: "Calibre-Medium"
  }

  .barba-container[data-namespace="epc"] .section-02 h3::before {
    content: '';
    display: block;
    background: url("/assets/images/work/epc/logo-drupal.png") no-repeat;
    width: 80px;
    height: 65px;
    position: absolute;
    top: -10px;
    left: -110px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-02 h3::before {
      position:relative;
      top: 0;
      left: 0;
      margin-bottom: 30px
    }
  }

  .barba-container[data-namespace="epc"] .section-testimonial {
    background: #3b5e96 url("/assets/images/work/epc/illu-testimonial.png") no-repeat center bottom;
    padding-top: 100px;
    padding-bottom: 100px;
    position: relative;
    min-height: 800px
  }

  .barba-container[data-namespace="epc"] .section-testimonial .well p.title {
    font-family: 'Calibre-Semibold'
  }

  .barba-container[data-namespace="epc"] .section-testimonial .illu-bottom-mobile {
    display: none
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-testimonial .illu-bottom-mobile {
      display:block;
      width: 100%;
      background: #3b5e96 url("/assets/images/work/epc/illu-testimonial-mobile-2.png") no-repeat center bottom;
      background-size: 80%;
      width: 400px;
      height: 300px;
      margin-top: 20px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="epc"] .section-testimonial .illu-bottom-mobile {
      width:100%;
      background-size: 70%;
      margin-top: 20px;
      height: 260px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-testimonial {
      background:#3b5e96 url("/assets/images/work/epc/illu-testimonial-mobile-1.png") no-repeat center 20px;
      padding-top: 220px;
      padding-bottom: 0
    }
  }

  .barba-container[data-namespace="epc"] .section-testimonial .illu-calendar {
    background: url("/assets/images/work/epc/illu-testimonial-calendar.png") no-repeat;
    width: 131px;
    height: 114px;
    display: block;
    position: absolute;
    right: -90px;
    top: 320px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-testimonial .illu-calendar {
      top:-100px;
      left: 50px
    }
  }

  .barba-container[data-namespace="epc"] .section-03 {
    background-color: #f5f5f5 !important;
    padding-top: 130px;
    padding-bottom: 70px
  }

  .barba-container[data-namespace="epc"] .section-03 h1 {
    margin-top: 35px
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="epc"] .section-03 h1 {
      margin-top:0px
    }
  }

  .barba-container[data-namespace="epc"] .section-03 .switch-first img {
    max-width: 100%
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-03 {
      padding-top:80px;
      padding-bottom: 40px
    }

    .barba-container[data-namespace="epc"] .section-03 .switch-last {
      order: 10
    }

    .barba-container[data-namespace="epc"] .section-03 .switch-first {
      order: 1;
      padding-top: 0;
      padding-bottom: 40px;
      text-align: center
    }

    .barba-container[data-namespace="epc"] .section-03 .switch-first svg {
      width: 70%
    }
  }

  .barba-container[data-namespace="epc"] .section-03bis {
    background-color: #f5f5f5 !important;
    padding-top: 40px;
    padding-bottom: 100px
  }

  .barba-container[data-namespace="epc"] .section-03bis img {
    max-width: 100%;
    border: 1px solid #dededf;
    z-index: 200
  }

  .barba-container[data-namespace="epc"] .section-03bis .commented-screen {
    position: relative
  }

  .barba-container[data-namespace="epc"] .section-03bis .commented-screen .well {
    z-index: 500;
    width: 450px;
    position: absolute;
    top: 200px;
    right: 0
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-03bis .commented-screen .well {
      position:relative;
      width: 100%;
      top: 0;
      bottom: 0;
      margin-top: 50px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="epc"] .section-03bis {
      padding-bottom:20px
    }
  }

  .barba-container[data-namespace="epc"] .section-04 {
    background-color: #f5f5f5 !important;
    padding-top: 60px;
    padding-bottom: 20px
  }

  .barba-container[data-namespace="epc"] .section-04 img {
    max-width: 100%
  }

  .barba-container[data-namespace="epc"] .section-04 h3 {
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0 20px 0;
    position: relative;
    font-family: "Calibre-Medium"
  }

  .barba-container[data-namespace="epc"] .section-carousel {
    background-color: #f5f5f5 !important;
    position: relative;
    border-top: 0px;
    padding-bottom: 0px;
    border-top: 20px solid #f5f5f5;
    padding-bottom: 40px
  }

  @media (min-width: 576px) {
    .barba-container[data-namespace="epc"] .section-carousel {
      border-top:120px solid #f5f5f5;
      padding-bottom: 150px
    }
  }

  .barba-container[data-namespace="epc"] .section-carousel .carousel-phone {
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    position: relative
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="epc"] .section-carousel .carousel-phone {
      transform:scale(0.8)
    }
  }

  .barba-container[data-namespace="epc"] .section-carousel .carousel-phone:before {
    content: '';
    width: 375px;
    height: 734px;
    display: block;
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    background-image: url(/assets/images/work/carousel-iphone.png);
    z-index: 10;
    pointer-events: none
  }

  .barba-container[data-namespace="epc"] .section-carousel .carousel-phone:after {
    content: '';
    display: block;
    clear: both
  }

  .barba-container[data-namespace="epc"] .section-carousel .carousel-phone .carousel-cell {
    position: relative;
    display: inline-block;
    width: 100%;
    text-align: center
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="epc"] .section-carousel .carousel-phone .carousel-cell {
      width:50%
    }
  }

  @media (min-width: 1240px) {
    .barba-container[data-namespace="epc"] .section-carousel .carousel-phone .carousel-cell {
      width:33%
    }
  }

  .barba-container[data-namespace="epc"] .section-carousel .carousel-phone .carousel-cell img {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    filter: grayscale(100%);
    opacity: .6;
    transition: all .3s ease
  }

  .barba-container[data-namespace="epc"] .section-carousel .carousel-phone .carousel-cell.is-selected img {
    opacity: 1;
    -webkit-filter: grayscale(0%);
    -moz-filter: grayscale(0%);
    filter: grayscale(0%)
  }

  .barba-container[data-namespace="epc"] .section-cta {
    background-color: #f5f5f5 !important;
    padding-top: 215px;
    padding-bottom: 155px
  }

  .barba-container[data-namespace="epc"] h1 num {
    color: #ff7d00
  }

  .barba-container[data-namespace="epc"] .shadowed-image {
    box-shadow: 0 7px 21px 0px rgba(38,38,51,0.1)
  }

  .barba-container[data-namespace="orange"] {
    background-color: #f5f5f5
  }

  .barba-container[data-namespace="orange"] h1 num {
    color: #ff6d00
  }

  .barba-container[data-namespace="orange"] section.cover {
    background-color: #f5f5f5 !important;
    padding-top: 120px;
    padding-bottom: 65px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="orange"] section.cover {
      padding-top:270px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="orange"] section.cover .mobile-hidden {
      display:none
    }
  }

  .barba-container[data-namespace="orange"] section.cover h1 {
    margin-bottom: 50px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="orange"] section.cover h1 {
      margin-bottom:115px
    }
  }

  .barba-container[data-namespace="orange"] section.cover p.title {
    font-family: "Calibre-Medium";
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 3px;
    line-height: 20px;
    margin-top: 8px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="orange"] section.cover p.title {
    margin-top: 0
  }

  body.os-mac.firefox .barba-container[data-namespace="orange"] section.cover p.title {
    margin-top: 5px
  }

  .barba-container[data-namespace="orange"] section.cover p.title b {
    display: block
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="orange"] section.cover p.title {
      margin-bottom:20px
    }
  }

  .barba-container[data-namespace="orange"] section.cover .p-line {
    display: block;
    height: 100%;
    width: 1px;
    opacity: 0.1;
    background-color: #040515;
    float: right
  }

  .barba-container[data-namespace="orange"] section.cover p {
    margin-bottom: 0
  }

  .barba-container[data-namespace="orange"] section.cover p.first::first-letter {
    font-family: "MajestiBanner-Bold";
    font-size: 96px;
    float: left;
    line-height: 1;
    display: block;
    padding-right: 10px;
    color: #262633 !important;
    margin-top: -11px;
    margin-bottom: -10px;
    margin-left: -2px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="orange"] section.cover p.first::first-letter {
    margin-top: -2px;
    margin-bottom: -20px
  }

  body.firefox .barba-container[data-namespace="orange"] section.cover p.first::first-letter {
    margin-top: 11px
  }

  .barba-container[data-namespace="orange"] section.cover .img-cover {
    background-color: #FFFFFF;
    box-shadow: 0 7px 21px 0px rgba(38,38,51,0.1);
    margin-bottom: 40px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="orange"] section.cover .img-cover {
      margin-bottom:90px
    }
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="orange"] section.cover .img-cover {
      margin-left:-50px;
      margin-right: -50px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] section.cover .img-cover {
      margin-left:-20px;
      margin-right: -20px
    }
  }

  .barba-container[data-namespace="orange"] .section-01-overpass {
    padding: 60px 0 60px 0;
    background-color: #ffffff !important
  }

  @media (min-width: 576px) {
    .barba-container[data-namespace="orange"] .section-01-overpass {
      padding:140px 0 100px 0
    }
  }

  .barba-container[data-namespace="orange"] .section-01-overpass .cd-image-container {
    max-width: 570px;
    margin: 0 auto
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="orange"] .section-01-overpass .cd-image-container {
      margin-top:60px
    }
  }

  .barba-container[data-namespace="orange"] .section-01-overpass .cd-image-container .cd-image-label {
    font-family: "Calibre-Medium";
    font-size: 11px;
    color: #64656f;
    text-transform: uppercase;
    letter-spacing: 2px;
    white-space: nowrap
  }

  .barba-container[data-namespace="orange"] .section-01-overpass .cd-image-container .cd-handle {
    top: 80%
  }

  .barba-container[data-namespace="orange"] .section-02 {
    padding-top: 120px;
    padding-bottom: 50px;
    background: #040515;
    background: -moz-linear-gradient(top, #040515 0%, #090a19 100%);
    background: -webkit-linear-gradient(top, #040515 0%, #090a19 100%);
    background: linear-gradient(to bottom, #040515 0%, #090a19 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#040515', endColorstr='#090a19',GradientType=0 )
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] .section-02 {
      padding-top:60px;
      padding-bottom: 30px
    }
  }

  .barba-container[data-namespace="orange"] .section-02 img {
    max-width: 100%
  }

  .barba-container[data-namespace="orange"] .section-02 p {
    color: #868e96
  }

  .barba-container[data-namespace="orange"] .section-02 h1 {
    color: #fff
  }

  .barba-container[data-namespace="orange"] .section-02 h3 {
    color: #fff;
    font-size: 20px;
    margin: 40px 0 20px 0;
    position: relative;
    font-family: "Calibre-Medium"
  }

  .barba-container[data-namespace="orange"] .section-03 {
    padding-top: 50px;
    padding-bottom: 120px;
    position: relative;
    background: #090a19;
    background: -moz-linear-gradient(top, #090a19 0%, #262633 100%);
    background: -webkit-linear-gradient(top, #090a19 0%, #262633 100%);
    background: linear-gradient(to bottom, #090a19 0%, #262633 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#090a19', endColorstr='#262633',GradientType=0 )
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] .section-03 {
      padding-top:30px;
      padding-bottom: 50px
    }
  }

  .barba-container[data-namespace="orange"] .section-03 img {
    max-width: 100%
  }

  .barba-container[data-namespace="orange"] .section-03 p {
    color: #868e96
  }

  .barba-container[data-namespace="orange"] .section-03 h1 {
    color: #fff
  }

  .barba-container[data-namespace="orange"] .section-03 h3 {
    color: #fff;
    font-size: 20px;
    margin: 40px 0 20px 0;
    position: relative;
    font-family: "Calibre-Medium"
  }

  .barba-container[data-namespace="orange"] .section-03 .illu-03-bg-black {
    display: none
  }

  @supports (mix-blend-mode: multiply) {
    .barba-container[data-namespace="orange"] .section-03 .illu-03-bg-black {
      display: block;
      mix-blend-mode: multiply;
      position: absolute;
      bottom: 100px;
      left: 0;
      z-index: 0;
      width: auto
    }

    @media (max-width: 1239px) {
      .barba-container[data-namespace="orange"] .section-03 .illu-03-bg-black {
        display:none
      }
    }
  }

  .barba-container[data-namespace="orange"] .section-04 {
    padding-top: 140px;
    background-color: #f5f5f5
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] .section-04 {
      padding-top:60px
    }

    .barba-container[data-namespace="orange"] .section-04 svg {
      width: 80%
    }
  }

  .barba-container[data-namespace="orange"] .section-04 .text-size-40 {
    font-size: 40px
  }

  .barba-container[data-namespace="orange"] .section-04 .text-size-34 {
    font-size: 34px
  }

  .barba-container[data-namespace="orange"] .section-04 .text-size-30 {
    font-size: 30px
  }

  .barba-container[data-namespace="orange"] .section-04 .text-size-24 {
    font-size: 24px
  }

  .barba-container[data-namespace="orange"] .section-04 .text-size-20 {
    font-size: 20px
  }

  .barba-container[data-namespace="orange"] .section-04 .text-orange {
    color: #ff7900
  }

  .barba-container[data-namespace="orange"] .section-04 .orange-font-size {
    width: 100%
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] .section-04 .orange-font-size {
      margin-bottom:40px
    }
  }

  .barba-container[data-namespace="orange"] .section-04 .orange-font-size tr th {
    color: #7a7a7a;
    font-size: 10px;
    padding: 0 10px 80px 0;
    line-height: 120%;
    vertical-align: bottom
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="orange"] .section-04 .orange-font-size tr th {
      padding-bottom:40px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="orange"] .section-04 .orange-font-size tr th {
      padding-bottom:0;
      width: 100%;
      display: block
    }
  }

  .barba-container[data-namespace="orange"] .section-04 .orange-font-size tr td {
    color: #000;
    font-weight: bold;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding: 0 10px 80px 0;
    line-height: 120%;
    vertical-align: bottom
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="orange"] .section-04 .orange-font-size tr td {
      padding-bottom:40px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="orange"] .section-04 .orange-font-size tr td {
      padding-bottom:0;
      width: 100%;
      display: block
    }
  }

  .barba-container[data-namespace="orange"] .section-05 {
    padding-top: 250px;
    padding-bottom: 0;
    z-index: 11;
    background-color: #f5f5f5
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="orange"] .section-05 {
      padding-top:200px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] .section-05 {
      padding-top:250px
    }
  }

  .barba-container[data-namespace="orange"] .section-05 .switch-last img {
    width: 100%
  }

  .barba-container[data-namespace="orange"] .section-05 .switch-first {
    position: relative
  }

  .barba-container[data-namespace="orange"] .section-05 .switch-first .well {
    z-index: 500;
    position: relative
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] .section-05 .switch-first .well {
      margin-bottom:80px
    }
  }

  .barba-container[data-namespace="orange"] .section-05 .switch-first .well::before,.barba-container[data-namespace="orange"] .section-05 .switch-first .well::after {
    content: '';
    display: block;
    background: url("/assets/images/work/orange/pink-balloon.png") no-repeat;
    width: 113px;
    height: 144px;
    position: absolute;
    top: -65px;
    left: 0
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="orange"] .section-05 .switch-first .well::before,.barba-container[data-namespace="orange"] .section-05 .switch-first .well::after {
      top:-85px;
      left: -30px
    }
  }

  .barba-container[data-namespace="orange"] .section-05 .switch-first .well::after {
    top: auto;
    bottom: -90px;
    right: 30px;
    left: auto
  }

  .barba-container[data-namespace="orange"] .section-05 .switch-first .img-balloon {
    width: 337px;
    height: 591px;
    position: absolute;
    z-index: 0;
    top: -330px;
    left: -148px
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="orange"] .section-05 .switch-first .img-balloon {
      top:-200px;
      left: -90px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] .section-05 .switch-last {
      order:10
    }

    .barba-container[data-namespace="orange"] .section-05 .switch-last img {
      width: 80%
    }

    .barba-container[data-namespace="orange"] .section-05 .switch-first {
      order: 1;
      padding-top: 0;
      padding-bottom: 60px
    }
  }

  .barba-container[data-namespace="orange"] .section-06 {
    padding-top: 20px;
    padding-bottom: 50px;
    background-color: #f5f5f5
  }

  .barba-container[data-namespace="orange"] .section-06 .purple-balloon {
    width: 113px;
    height: 144px
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="orange"] .section-06 {
      padding-top:60px
    }
  }

  .barba-container[data-namespace="orange"] .section-carousel {
    background-color: #f5f5f5 !important;
    position: relative;
    border-top: 0px;
    padding-bottom: 0px;
    border-top: 20px solid #f5f5f5;
    padding-bottom: 40px
  }

  @media (min-width: 576px) {
    .barba-container[data-namespace="orange"] .section-carousel {
      border-top:120px solid #f5f5f5;
      padding-bottom: 150px
    }
  }

  .barba-container[data-namespace="orange"] .section-carousel .carousel-phone {
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    position: relative
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="orange"] .section-carousel .carousel-phone {
      transform:scale(0.8)
    }
  }

  .barba-container[data-namespace="orange"] .section-carousel .carousel-phone:before {
    content: '';
    width: 375px;
    height: 734px;
    display: block;
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    background-image: url(/assets/images/work/carousel-iphone.png);
    z-index: 10;
    pointer-events: none
  }

  .barba-container[data-namespace="orange"] .section-carousel .carousel-phone:after {
    content: '';
    display: block;
    clear: both
  }

  .barba-container[data-namespace="orange"] .section-carousel .carousel-phone .carousel-cell {
    position: relative;
    display: inline-block;
    width: 100%;
    text-align: center
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="orange"] .section-carousel .carousel-phone .carousel-cell {
      width:50%
    }
  }

  @media (min-width: 1240px) {
    .barba-container[data-namespace="orange"] .section-carousel .carousel-phone .carousel-cell {
      width:33%
    }
  }

  .barba-container[data-namespace="orange"] .section-carousel .carousel-phone .carousel-cell img {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    filter: grayscale(100%);
    opacity: .6;
    transition: all .3s ease
  }

  .barba-container[data-namespace="orange"] .section-carousel .carousel-phone .carousel-cell.is-selected img {
    opacity: 1;
    -webkit-filter: grayscale(0%);
    -moz-filter: grayscale(0%);
    filter: grayscale(0%)
  }

  .barba-container[data-namespace="orange"] .orange-circles .outer-circle,.barba-container[data-namespace="orange"] .orange-circles .inner-circle {
    transform-origin: center
  }

  .barba-container[data-namespace="orange"] .scroll-reveal {
    position: relative
  }

  .barba-container[data-namespace="orange"] .scroll-reveal>img {
    display: block
  }

  .barba-container[data-namespace="orange"] .scroll-reveal-mask {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%
  }

  .barba-container[data-namespace="orange"] .scroll-reveal-mask>img {
    display: block
  }

  .barba-container[data-namespace="contentcreation"] {
    background-color: #f5f5f5
  }

  @media (min-width: 768px) {
    .barba-container[data-namespace="contentcreation"] h1 {
      font-size:50px
    }
  }

  .barba-container[data-namespace="contentcreation"] h1 num {
    color: #ff6d00
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="contentcreation"] .mobile-no-padding {
      padding-left:0;
      padding-right: 0
    }
  }

  .barba-container[data-namespace="contentcreation"] section.cover {
    background-color: #f5f5f5 !important;
    padding-top: 120px;
    padding-bottom: 65px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="contentcreation"] section.cover {
      padding-top:270px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="contentcreation"] section.cover .mobile-hidden {
      display:none
    }
  }

  .barba-container[data-namespace="contentcreation"] section.cover h1 {
    margin-bottom: 50px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="contentcreation"] section.cover h1 {
      margin-bottom:115px
    }
  }

  .barba-container[data-namespace="contentcreation"] section.cover p.title {
    font-family: "Calibre-Medium";
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 3px;
    line-height: 20px;
    margin-top: 8px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="contentcreation"] section.cover p.title {
    margin-top: 0
  }

  body.os-mac.firefox .barba-container[data-namespace="contentcreation"] section.cover p.title {
    margin-top: 5px
  }

  .barba-container[data-namespace="contentcreation"] section.cover p.title b {
    display: block
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="contentcreation"] section.cover p.title {
      margin-bottom:20px
    }
  }

  .barba-container[data-namespace="contentcreation"] section.cover .p-line {
    display: block;
    height: 100%;
    width: 1px;
    opacity: 0.1;
    background-color: #040515;
    float: right
  }

  .barba-container[data-namespace="contentcreation"] section.cover p {
    margin-bottom: 0
  }

  .barba-container[data-namespace="contentcreation"] section.cover p.first::first-letter {
    font-family: "MajestiBanner-Bold";
    font-size: 96px;
    float: left;
    line-height: 1;
    display: block;
    padding-right: 10px;
    color: #262633 !important;
    margin-top: -11px;
    margin-bottom: -10px;
    margin-left: -2px
  }

  body.os-mac:not(.firefox) .barba-container[data-namespace="contentcreation"] section.cover p.first::first-letter {
    margin-top: -2px;
    margin-bottom: -20px
  }

  body.firefox .barba-container[data-namespace="contentcreation"] section.cover p.first::first-letter {
    margin-top: 11px
  }

  .barba-container[data-namespace="contentcreation"] section.cover .img-cover {
    background-color: #FFFFFF;
    box-shadow: 0 7px 21px 0px rgba(38,38,51,0.1);
    margin-bottom: 40px
  }

  @media (min-width: 992px) {
    .barba-container[data-namespace="contentcreation"] section.cover .img-cover {
      margin-bottom:90px
    }
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="contentcreation"] section.cover .img-cover {
      margin-left:-50px;
      margin-right: -50px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="contentcreation"] section.cover .img-cover {
      margin-left:-20px;
      margin-right: -20px
    }
  }

  .barba-container[data-namespace="contentcreation"] .section-01-overpass {
    padding: 60px 0 60px 0;
    background-color: #f5f5f5
  }

  .barba-container[data-namespace="contentcreation"] .section-01-overpass .doubledouble {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    position: relative
  }

  .barba-container[data-namespace="contentcreation"] .section-01-overpass .doubledouble img {
    position: absolute;
    top: 25%;
    left: 25%;
    width: 50%;
    height: 50%
  }

  .barba-container[data-namespace="contentcreation"] .section-01-overpass .doubledouble .ball {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 50%
  }

  .barba-container[data-namespace="contentcreation"] .section-02 {
    padding-top: 120px;
    padding-bottom: 120px;
    background-color: #f5f5f5;
    background: #000
  }

  .barba-container[data-namespace="contentcreation"] .section-02 .orange-love-img {
    margin-left: -120px;
    margin-top: -120px;
    margin-right: -60px
  }

  .barba-container[data-namespace="contentcreation"] .section-02 .orange-love-img img {
    display: block
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="contentcreation"] .section-02 .orange-love-img {
      margin-left:-320px;
      margin-top: -60px;
      margin-right: -120px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="contentcreation"] .section-02 {
      padding-top:60px;
      padding-bottom: 120px
    }
  }

  .barba-container[data-namespace="contentcreation"] .section-02 img {
    max-width: 100%
  }

  .barba-container[data-namespace="contentcreation"] .section-02 p {
    color: #868e96
  }

  .barba-container[data-namespace="contentcreation"] .section-02 h1 {
    color: #fff
  }

  .barba-container[data-namespace="contentcreation"] .section-02 h3 {
    color: #fff;
    font-size: 20px;
    margin: 40px 0 20px 0;
    position: relative;
    font-family: "Calibre-Medium"
  }

  .barba-container[data-namespace="contentcreation"] .section-03 {
    padding-bottom: 420px;
    position: relative;
    background: #f5f5f5 url(/assets/images/work/content-creation/demo-icon.jpg) no-repeat center top;
    background-size: 1920px auto;
    padding-top: 120px;
    overflow: hidden
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="contentcreation"] .section-03 {
      background-position:-470px top
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="contentcreation"] .section-03 {
      background-size:1500px auto;
      background-position: -440px top;
      padding-bottom: 240px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="contentcreation"] .section-03 {
      background-size:768px auto;
      background-position: center top;
      padding-top: 60px
    }
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace="contentcreation"] .section-03 {
      background-size:800px auto;
      background-position: center top
    }

    .barba-container[data-namespace="contentcreation"] .section-03 .col-mobile-padding {
      padding-top: 40px
    }
  }

  .barba-container[data-namespace="contentcreation"] .section-03 img {
    max-width: 100%
  }

  .barba-container[data-namespace="contentcreation"] .section-03 p {
    color: #868e96
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 {
    margin: 145px 0 0 70px
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-01:after {
    content: '';
    display: table;
    clear: both
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 .phone {
    position: relative;
    float: left
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 video {
    position: absolute;
    top: 16%;
    left: 8.5%;
    right: 8.5%;
    width: 83%;
    height: auto
  }

  @media (max-width: 1239px) {
    .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 {
      margin:145px 0 0 -40px
    }
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 {
      width:288px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 {
      width:auto;
      margin-bottom: 60px;
      margin-top: 0;
      margin-right: -20px;
      margin-left: 0
    }

    .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 .phone {
      float: right;
      width: 288px;
      margin-left: auto;
      margin-right: auto
    }
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 {
      margin-right:0;
      margin-left: 0
    }

    .barba-container[data-namespace="contentcreation"] .section-03 .icon-01 .phone {
      float: none
    }
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 {
    margin: 25px 0 0 0;
    position: relative;
    width: 350px
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-02:after {
    content: '';
    display: table;
    clear: both
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 .phone {
    position: relative;
    float: left
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 .icon-star {
    position: absolute;
    width: 190%;
    left: -57%;
    top: -5%
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 .icon-small-stars {
    position: absolute;
    bottom: -100px;
    right: -40px
  }

  .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 video {
    position: absolute;
    top: 17%;
    left: 8.5%;
    right: 8.5%;
    width: 83%;
    height: auto
  }

  @media (max-width: 991px) {
    .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 {
      width:288px
    }
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 {
      margin:25px auto 0 auto
    }
  }

  @media (max-width: 575px) {
    .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 {
      margin-left:-25px;
      margin-right: -25px;
      width: auto
    }

    .barba-container[data-namespace="contentcreation"] .section-03 .icon-02 .phone {
      float: none;
      width: 288px;
      margin-left: auto;
      margin-right: auto
    }
  }

  .barba-container[data-namespace="contentcreation"] .section-04 {
    padding-top: 120px;
    background: #010115;
    overflow: hidden
  }

  .barba-container[data-namespace="contentcreation"] .section-04 .logo-nielsen {
    margin-top: -100px
  }

  @media (max-width: 767px) {
    .barba-container[data-namespace="contentcreation"] .section-04 .logo-nielsen {
      margin-top:-60px;
      text-align: right;
      margin-bottom: -100px
    }

    .barba-container[data-namespace="contentcreation"] .section-04 .logo-nielsen img {
      height: 220px;
      width: auto
    }
  }

  .barba-container[data-namespace="contentcreation"] .section-04 p {
    color: #868e96
  }

  .barba-container[data-namespace="contentcreation"] .section-04 h1 {
    color: #fff
  }

  /*# sourceMappingURL=main.css.map */



</style>
