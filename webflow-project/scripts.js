// Include external libraries (or load them via HTML <script> tags)
// Your custom code for animations, cursor, and transitions:

//This is a test to see if it is conected to the webflow project
console.log("checking if connected");

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Function to load Swiper CSS
function loadSwiperCSS() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('link[href*="swiper-bundle.min.css"]')) {
      resolve();
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// Function to load Swiper JS
function loadSwiperJS() {
  return new Promise((resolve, reject) => {
    if (window.Swiper) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Function to animate counter
function animateCounter(element, targetValue, duration = 1) {
  const startValue = 0;
  const redBlur = document.getElementById('red-blur');
  
  // Create a timeline for the counter animation
  const tl = gsap.timeline();
  
  // Animate the counter
  tl.fromTo(element, 
    { innerHTML: startValue + '%' },
    {
      innerHTML: targetValue + '%',
      duration: duration,
      snap: { innerHTML: 1 },
      ease: "power2.out"
    }
  );

  // If red-blur element exists and Swiper instance exists, add scaling animations
  if (redBlur && window.swiperInstance) {
    // Get the Swiper's autoplay delay (in seconds)
    const swiperDelay = window.swiperInstance.params.autoplay.delay / 1000;
    
    // Calculate the timing for the scaling animations based on Swiper delay
    const firstScaleTime = swiperDelay * 0.4875; // 48.75% of Swiper delay
    const secondScaleTime = swiperDelay * 0.8175; // 81.75% of Swiper delay
    
    // First scale at 48.75% of Swiper delay
    tl.to(redBlur, {
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out"
    }, firstScaleTime)
    .to(redBlur, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    })
    // Second scale at 81.75% of Swiper delay
    .to(redBlur, {
      scale: 1.15,
      duration: 0.2,
      ease: "power2.out"
    }, secondScaleTime)
    .to(redBlur, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
  }
}

// Function to handle slide animations
function handleSlideAnimations(swiper) {
  // Get all slides
  const slides = swiper.slides;
  
  // Set initial states for all slides
  slides.forEach(slide => {
    const show = slide.querySelector('#swiper-show');
    const clientName = slide.querySelector('#swiper-client-name');
    const percent = slide.querySelector('#swiper-percent');
    const stat = slide.querySelector('#swiper-stat');
    const button = slide.querySelector('#swiper-button');
    
    if (show) {
      // Force layout properties with !important
      show.style.cssText = `
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        height: 100% !important;
        min-height: 100% !important;
        opacity: 0;
        visibility: hidden;
      `;
    }
    
    // Set initial states for elements
    gsap.set([clientName, stat, button], {
      opacity: 0,
      y: 20
    });

    // Add hover animation for active slide
    if (slide.classList.contains('swiper-slide-active')) {
      const redBlurHover = document.getElementById('red-blur-hover');
      if (redBlurHover) {
        // Set initial state of hover element
        gsap.set(redBlurHover, {
          scale: 0,
          opacity: 0
        });

        // Create hover timeline
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl
          .to(redBlurHover, {
            scale: 1.25,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          });

        // Add event listeners
        slide.addEventListener('mouseenter', () => {
          hoverTl.play();
        });
        slide.addEventListener('mouseleave', () => {
          hoverTl.reverse();
        });
      }
    }
  });

  // Create timeline for active slide
  const activeSlide = swiper.slides[swiper.activeIndex];
  const show = activeSlide.querySelector('#swiper-show');
  const clientName = activeSlide.querySelector('#swiper-client-name');
  const percent = activeSlide.querySelector('#swiper-percent');
  const stat = activeSlide.querySelector('#swiper-stat');
  const button = activeSlide.querySelector('#swiper-button');

  // Create timeline
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" }
  });

  // Show content first
  if (show) {
    // Force layout properties for active slide
    show.style.cssText = `
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      height: 100% !important;
      min-height: 100% !important;
      visibility: visible;
      opacity: 0;
    `;

    tl.to(show, {
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        // Ensure layout is maintained after animation
        show.style.cssText = `
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          height: 100% !important;
          min-height: 100% !important;
          visibility: visible;
          opacity: 1;
        `;
      }
    });
  }

  // Animate other elements with stagger
  tl.to([clientName, stat, button], {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1
  }, "-=0.3");

  // Animate counter if element exists
  if (percent) {
    const targetValue = parseInt(percent.getAttribute('data-target') || '0');
    animateCounter(percent, targetValue, 1);
  }
}

// Add Swiper styles
const swiperStyles = `
.wb-swiper {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
}

.wb-swiper.is-ready {
  opacity: 1;
  visibility: visible;
}

.wb-swiper_slide {
  opacity: 0.2;
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  height: 100%;
}

.wb-swiper_slide.swiper-slide-active {  
  opacity: 1 !important;
}

/* Hide swiper-show elements for non-active slides */
.wb-swiper_slide:not(.swiper-slide-active) #swiper-show {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Show swiper-show elements only for active slide */
.wb-swiper_slide.swiper-slide-active #swiper-show {
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  height: 100% !important;
  min-height: 100% !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
`;

// Create and append style element
const styleSheet = document.createElement("style");
styleSheet.textContent = swiperStyles;
document.head.appendChild(styleSheet);

// Initialize Swiper
async function initSwiper() {
  try {
    // Load Swiper CSS and JS
    await Promise.all([
      loadSwiperCSS(),
      loadSwiperJS()
    ]);

    // Wait a short moment to ensure Swiper is fully loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create Swiper instance
    const swiper = new Swiper(".wb-swiper", {
      slideClass: "wb-swiper_slide",
      wrapperClass: "wb-swiper_wrapper",
      centeredSlides: true,
      loop: true,
      loopAdditionalSlides: 2,
      autoplay: {
        delay: 4000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true
      },
      speed: 500,
      pagination: {
        el: ".wb-swiper_pagination",
        bulletClass: "wb-swiper_bullet",
        bulletActiveClass: "is-active",
        clickable: true,
      },
      navigation: {
        nextEl: `[wb-swiper="next"]`,
        prevEl: `[wb-swiper="previous"]`,
      },
      simulateTouch: true,
      grabCursor: true,
      breakpoints: {
        480: {
          slidesPerView: "auto",
          spaceBetween: 36,
        },
        320: {
          slidesPerView: "auto",
          spaceBetween: 12,
        },
      },
      on: {
        init: function() {
          // Set initial states
          handleSlideAnimations(this);
          
          // After a short delay, show the Swiper and trigger first slide animations
          setTimeout(() => {
            const swiperElement = document.querySelector('.wb-swiper');
            if (swiperElement) {
              swiperElement.classList.add('is-ready');
              
              // Add hover animation for initial active slide
              const activeSlide = this.slides[this.activeIndex];
              const redBlurHover = document.getElementById('red-blur-hover');
              if (activeSlide && redBlurHover) {
                // Set initial state of hover element
                gsap.set(redBlurHover, {
                  scale: 0,
                  opacity: 0
                });

                // Create hover timeline
                const hoverTl = gsap.timeline({ paused: true });
                hoverTl
                  .to(redBlurHover, {
                    scale: 1.25,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                  });

                activeSlide.addEventListener('mouseenter', () => {
                  hoverTl.play();
                });
                activeSlide.addEventListener('mouseleave', () => {
                  hoverTl.reverse();
                });

                // Trigger the automatic red-blur animation (original element)
                const redBlur = document.getElementById('red-blur');
                if (redBlur) {
                  const swiperDelay = this.params.autoplay.delay / 1000;
                  const firstScaleTime = swiperDelay * 0.4875;
                  const secondScaleTime = swiperDelay * 0.8175;
                  
                  gsap.timeline()
                    .to(redBlur, {
                      scale: 1.1,
                      duration: 0.2,
                      ease: "power2.out"
                    }, firstScaleTime)
                    .to(redBlur, {
                      scale: 1,
                      duration: 0.2,
                      ease: "power2.out"
                    })
                    .to(redBlur, {
                      scale: 1.15,
                      duration: 0.2,
                      ease: "power2.out"
                    }, secondScaleTime)
                    .to(redBlur, {
                      scale: 1,
                      duration: 0.2,
                      ease: "power2.out"
                    });
                }
              }
            }
          }, 100);
        },
        slideChange: function() {
          handleSlideAnimations(this);
          
          // Update hover animation for new active slide
          const activeSlide = this.slides[this.activeIndex];
          const redBlurHover = document.getElementById('red-blur-hover');
          if (activeSlide && redBlurHover) {
            // Reset hover element state
            gsap.set(redBlurHover, {
              scale: 0,
              opacity: 0
            });

            // Create hover timeline
            const hoverTl = gsap.timeline({ paused: true });
            hoverTl
              .to(redBlurHover, {
                scale: 1.25,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
              });

            activeSlide.addEventListener('mouseenter', () => {
              hoverTl.play();
            });
            activeSlide.addEventListener('mouseleave', () => {
              hoverTl.reverse();
            });
          }
        },
        slideChangeTransitionStart: function() {
          // Hide all slides content
          this.slides.forEach(slide => {
            const show = slide.querySelector('#swiper-show');
            if (show) {
              gsap.set(show, {
                opacity: 0,
                visibility: 'hidden',
                display: 'flex', // Keep flex display
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                pointerEvents: 'none'
              });
            }
          });
        },
        observerUpdate: function() {
          handleSlideAnimations(this);
        }
      }
    });

    // Store the swiper instance globally for Rive to access
    window.swiperInstance = swiper;
    
    console.log("Swiper initialized successfully");
    return swiper;
  } catch (error) {
    console.error("Failed to initialize Swiper:", error);
  }
}

// Function to load Rive script
function loadRiveScript() {
  return new Promise((resolve, reject) => {
    if (window.rive) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@rive-app/webgl2@latest';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Initialize Rive animation
async function initRive() {
  try {
    // Load Rive script first
    await loadRiveScript();
    
    console.log("Attempting to initialize Rive...");
    const canvas = document.getElementById('rive-canvas');
    
    if (!canvas) {
      console.warn('Rive canvas element not found');
      return;
    }
    console.log("Canvas found, setting up dimensions...");

    // Set canvas size to match container
    const container = canvas.parentElement;
    
    // Function to update canvas size
    const updateCanvasSize = () => {
      // Set canvas size to match container dimensions
      canvas.width = 2000;
      canvas.height = 237;
      
      // Update container size to match and center it
      container.style.width = '100%';
      container.style.height = '237px';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.overflow = 'hidden';
    };
    
    // Initial size setup
    updateCanvasSize();

    const riveURL = 'https://cdn.prod.website-files.com/67a1da359110aff234167390/67dbf8c5ba7b3233ad825130_fuckingwork.riv';
    
    // Create new Rive instance using the current API
    let riveInstance = new rive.Rive({
      src: riveURL,
      canvas: canvas,
      artboard: 'Desktop',
      stateMachines: ['State Machine 1'],
      autoplay: true, // Enable autoplay
      layout: new rive.Layout({
        fit: rive.Fit.contain,
        alignment: rive.Alignment.center,
      }),
      onLoad: () => {
        console.log('Rive animation loaded successfully');
        updateCanvasSize(); // Ensure correct size after loading
        
        // Ensure animation starts playing
        if (riveInstance) {
          // Get the state machine
          const stateMachine = riveInstance.stateMachineInputs('State Machine 1');
          if (stateMachine) {
            // Start the state machine
            stateMachine.forEach(input => {
              if (input.type === rive.StateMachineInputType.Trigger) {
                input.fire();
              }
            });
          }
          
          // Start the animation and sync with Swiper
          if (window.swiperInstance) {
            // Function to restart Rive animation
            const restartRiveAnimation = () => {
              console.log('Restarting Rive animation');
              riveInstance.stop();
              // Small delay to ensure clean restart
              setTimeout(() => {
                // Reset the animation to the beginning
                riveInstance.reset();
                // Start playing
                riveInstance.play();
                // Fire the state machine trigger again
                if (stateMachine) {
                  stateMachine.forEach(input => {
                    if (input.type === rive.StateMachineInputType.Trigger) {
                      input.fire();
                    }
                  });
                }
              }, 50);
            };

            // Start initial animation
            restartRiveAnimation();
            
            // Set up event listeners for Swiper
            window.swiperInstance.on('slideChange', restartRiveAnimation);
            window.swiperInstance.on('slideChangeTransitionStart', restartRiveAnimation);
            window.swiperInstance.on('autoplayStart', restartRiveAnimation);
            window.swiperInstance.on('autoplayStop', () => {
              console.log('Stopping Rive animation');
              riveInstance.stop();
            });
          }
        }
      },
      onError: (err) => {
        console.error('Error loading Rive animation:', err);
      }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      updateCanvasSize();
      
      // Debounce the resize event
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (riveInstance) {
          // Update layout
          riveInstance.layout = new rive.Layout({
            fit: rive.Fit.contain,
            alignment: rive.Alignment.center,
          });
          
          // Ensure animation is playing after resize
          const stateMachine = riveInstance.stateMachineInputs('State Machine 1');
          if (stateMachine) {
            stateMachine.forEach(input => {
              if (input.type === rive.StateMachineInputType.Trigger) {
                input.fire();
              }
            });
          }
          riveInstance.play();
        }
      }, 250); // Wait for 250ms after last resize event
    });

    console.log('Rive instance created successfully');
    return riveInstance;
  } catch (error) {
    console.error('Failed to initialize Rive:', error);
  }
}

// Extract cursor initialization into separate function
function initCustomCursor() {
  const customCursor = document.querySelector(".custom-cursor");
  if (customCursor) {
    const quickX = gsap.quickTo(customCursor, "x", {
      duration: 0.2,
      ease: "power3.out",
    });
    const quickY = gsap.quickTo(customCursor, "y", {
      duration: 0.2,
      ease: "power3.out",
    });

    document.addEventListener("mousemove", function (e) {
      quickX(e.clientX);
      quickY(e.clientY);
    });

    // Shrink cursor on all links
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("mouseenter", function () {
        gsap.to(customCursor, {
          duration: 0.2,
          scale: 0.5,
          ease: "power3.out",
        });
      });
      link.addEventListener("mouseleave", function () {
        gsap.to(customCursor, {
          duration: 0.2,
          scale: 1,
          ease: "power3.out",
        });
      });
    });
  } else {
    console.error("Custom cursor element not found!");
  }
}

// Function to load SplitType
function loadSplitType() {
  return new Promise((resolve, reject) => {
    if (window.SplitType) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/split-type';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function initGsapAnimations() {
  // Kill all ScrollTrigger instances before creating new ones
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Text Animation with SplitType
  const textElement = document.querySelector('#text-animate');
  if (textElement) {
    loadSplitType().then(() => {
      // Split the text into characters
      const splitText = new SplitType(textElement, { types: 'chars' });
      const chars = splitText.chars;
      
      // Set initial state
      gsap.set(chars, {
        opacity: 0.2,
        y: 20
      });
      
      // Create the scroll-triggered animation
      gsap.to(chars, {
        scrollTrigger: {
          trigger: textElement,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        stagger: {
          amount: 0.5,
          from: 'start'
        },
        ease: 'power2.out'
      });
    }).catch(error => console.error('Failed to load SplitType:', error));
  }

  // Homepage Hero Animation
  if (document.querySelector('.greeting-wrapper')) {
    // Set initial states
    gsap.set('.greeting-wrapper', {
      opacity: 0,
      y: 30
    });
    
    gsap.set('.hero_h1-wrapper', {
      opacity: 0,
      y: 30
    });
    
    gsap.set('.hero_button-wrapper', {
      opacity: 0,
      y: 30
    });
    
    gsap.set('.rive', {
      opacity: 0
    });
    
    gsap.set('.hero_projects', {
      opacity: 0
    });

    // Create the animation timeline
    const heroTl = gsap.timeline({
      defaults: { ease: "power2.out" }
    });

    // First sequence (immediate)
    heroTl
      .to('.greeting-wrapper', {
        opacity: 1,
        y: 0,
        duration: 0.8
      })
      .to('.hero_h1-wrapper', {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.4")
      .to('.hero_button-wrapper', {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.4");

    // Second sequence (delayed)
    setTimeout(() => {
      gsap.to('.rive', {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
      
      gsap.to('.hero_projects', {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    }, 2000); // 2 second delay
  }

  // Project Hero Image Scale Animation
  if (document.querySelector('.project_hero-lower')) {
    // Set initial state
    gsap.set('.project_main-img', {
      width: '50%',
      maxWidth: '50%'
    });

    const projectHeroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.project_hero-lower',
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    projectHeroTl
      .to('.project_main-img', {
        width: '100%',
        maxWidth: '100%',
        duration: 1,
        ease: 'none'
      });
  }

  // Footer Animation - Simple slide-up reveal
  const footer = document.querySelector(".footer");
  
  if (footer) {
    // Set initial state
    gsap.set(footer, {
      yPercent: 30,
      opacity: 0
    });

    // Create a timeline for footer animation
    gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top bottom",
        end: "top center",
        scrub: 0.5,
        invalidateOnRefresh: true,
        toggleActions: "play none none reverse"
      }
    })
    .to(footer, {
      yPercent: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 1
    });
  }

  // ScrollTrigger "Slide-In" Animation
  gsap.utils.toArray(".slide-in").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  });

  // Work Items Animation
  gsap.from(".work_item", {
    scrollTrigger: {
      trigger: ".work_layout",
      start: "top 50%",
      toggleActions: "play none none none",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,
  });

  // Mobile Navigation Animation System
  const hamburgerBtn = document.querySelector('.hamburger-icon');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let isMenuOpen = false;

  // Create hamburger icon structure
  if (hamburgerBtn) {
    hamburgerBtn.innerHTML = `
      <div class="hamburger-line line-1"></div>
      <div class="hamburger-line line-2"></div>
      <div class="hamburger-line line-3"></div>
    `;

    // Style the lines
    const lines = hamburgerBtn.querySelectorAll('.hamburger-line');
    lines.forEach(line => {
      gsap.set(line, {
        width: '24px',
        height: '2px',
        backgroundColor: '#ffffff', // Initial white color
        marginBottom: '6px',
        transformOrigin: 'center',
        position: 'relative'
      });
    });
    
    // Remove margin from last line
    gsap.set('.line-3', {
      marginBottom: 0
    });
  }

  // Clean up existing event listeners if any
  if (hamburgerBtn) {
    const oldClickListener = hamburgerBtn._clickListener;
    if (oldClickListener) {
      hamburgerBtn.removeEventListener('click', oldClickListener);
    }
  }

  if (mobileLinks) {
    mobileLinks.forEach(link => {
      const oldClickListener = link._clickListener;
      if (oldClickListener) {
        link.removeEventListener('click', oldClickListener);
      }
    });
  }

  // Remove existing resize listener if any
  if (window._resizeListener) {
    window.removeEventListener('resize', window._resizeListener);
  }

  // Set initial states
  if (mobileMenu) {
    // Force immediate update to prevent flicker
    gsap.set(mobileMenu, {
      x: '100%',
      visibility: 'hidden',
      immediateRender: true
    });

    // Ensure menu is ready for animations
    requestAnimationFrame(() => {
      mobileMenu.style.transform = 'translateX(100%)';
      mobileMenu.style.visibility = 'hidden';
    });
  }

  gsap.set(mobileLinks, {
    opacity: 0,
    x: 20,
    immediateRender: true
  });

  // Create hamburger animation timeline
  const hamburgerTl = gsap.timeline({ paused: true });
  
  hamburgerTl
    .to('.line-1', {
      y: 8,
      duration: 0.2,
      ease: "power2.inOut"
    })
    .to('.line-3', {
      y: -8,
      duration: 0.2,
      ease: "power2.inOut"
    }, "<")
    .to('.line-2', {
      opacity: 0,
      duration: 0.2,
      ease: "power2.inOut"
    }, "<")
    .to(['.line-1', '.line-2', '.line-3'], {
      duration: 0.2
    }, "<")
    .to('.line-1', {
      rotation: 45,
      duration: 0.2,
      ease: "power2.inOut"
    })
    .to('.line-3', {
      rotation: -45,
      duration: 0.2,
      ease: "power2.inOut"
    }, "<");

  // Create menu animation timeline
  const menuTl = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
      gsap.set(mobileMenu, { visibility: 'hidden' });
    }
  });

  // Build the timeline
  menuTl
    // Make menu visible and slide in from right
    .set(mobileMenu, {
      visibility: 'visible',
      x: '100%'
    })
    .to(mobileMenu, {
      x: '0%',
      duration: 0.6,
      ease: "power3.out"
    })
    // Animate in links with stagger
    .to(mobileLinks, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: {
        amount: 0.3,
        ease: "power2.out"
      },
      ease: "power2.out"
    });

  // Handle menu toggle
  if (hamburgerBtn) {
    const clickHandler = () => {
      isMenuOpen = !isMenuOpen;
      
      if (isMenuOpen) {
        // Play forward
        menuTl.play();
        hamburgerTl.play();
      } else {
        // Reverse animations
        menuTl.reverse();
        hamburgerTl.reverse();
      }
    };

    // Store the listener for future cleanup
    hamburgerBtn._clickListener = clickHandler;
    hamburgerBtn.addEventListener('click', clickHandler);

    // Handle mobile link clicks (close menu when a link is clicked)
    mobileLinks.forEach(link => {
      const linkClickHandler = () => {
        if (isMenuOpen) {
          isMenuOpen = false;
          menuTl.reverse();
          hamburgerTl.reverse();
        }
      };

      // Store the listener for future cleanup
      link._clickListener = linkClickHandler;
      link.addEventListener('click', linkClickHandler);
    });
  }

  // Close menu on window resize (if open)
  const resizeHandler = () => {
    if (isMenuOpen && window.innerWidth > 768) { // Adjust breakpoint as needed
      isMenuOpen = false;
      menuTl.reverse();
      hamburgerTl.reverse();
    }
  };

  // Store the listener for future cleanup
  window._resizeListener = resizeHandler;
  window.addEventListener('resize', resizeHandler);

  // Button Hover (to Dark)
  const buttonsSecondary = document.querySelectorAll(".button.is-secondary");
  buttonsSecondary.forEach((button) => {
    const computedStyles = getComputedStyle(button);
    const originalBg = computedStyles.backgroundColor;
    const originalBorder = computedStyles.borderColor;
    const originalColor = computedStyles.color;

    gsap.set(button, {
      backgroundColor: originalBg,
      borderColor: originalBorder,
      color: originalColor,
    });

    const targetBg = getComputedStyle(document.documentElement)
      .getPropertyValue("--background-color--background-primary")
      .trim();
    const targetBorder = getComputedStyle(document.documentElement)
      .getPropertyValue("--border-color--border-primary")
      .trim();
    const targetText = getComputedStyle(document.documentElement)
      .getPropertyValue("--text-color--text-primary")
      .trim();

    let hoverTimeline = gsap.timeline({ paused: true });
    hoverTimeline.to(button, {
      duration: 0.3,
      backgroundColor: targetBg,
      borderColor: targetBorder,
      color: targetText,
      ease: "power3.out",
    });

    button.addEventListener("mouseenter", () => hoverTimeline.play());
    button.addEventListener("mouseleave", () => hoverTimeline.reverse());
  });

  // Button Hover (to Light)
  const buttonsDark = document.querySelectorAll(".button.is-alternate");
  buttonsDark.forEach((button) => {
    const computedStyles = getComputedStyle(button);
    const originalBg = computedStyles.backgroundColor;
    const originalBorder = computedStyles.borderColor;
    const originalColor = computedStyles.color;

    gsap.set(button, {
      backgroundColor: originalBg,
      borderColor: originalBorder,
      color: originalColor,
    });

    const targetBg = getComputedStyle(document.documentElement)
      .getPropertyValue("--background-color--background-secondary")
      .trim();
    const targetBorder = getComputedStyle(document.documentElement)
      .getPropertyValue("--border-color--border-primary")
      .trim();
    const targetText = getComputedStyle(document.documentElement)
      .getPropertyValue("--text-color--text-secondary")
      .trim();

    let hoverTimeline = gsap.timeline({ paused: true });
    hoverTimeline.to(button, {
      duration: 0.3,
      backgroundColor: targetBg,
      borderColor: targetBorder,
      color: targetText,
      ease: "power3.out",
    });

    button.addEventListener("mouseenter", () => hoverTimeline.play());
    button.addEventListener("mouseleave", () => hoverTimeline.reverse());
  });
}

// Function to reinitialize Webflow interactions
function reinitializeWebflowInteractions() {
  // Check if Webflow is loaded
  if (window.Webflow) {
    // Reinitialize all interactions
    window.Webflow.ready();
    window.Webflow.require('ix2').init();
    
    // Reinitialize any custom interactions
    if (window.Webflow.require) {
      window.Webflow.require('ix2').init();
    }
  }
}

// When the DOM is ready, initialize everything
document.addEventListener("DOMContentLoaded", function () {
  // Initialize GSAP animations first
  initGsapAnimations();
  initCustomCursor();

  // Initialize Swiper and Rive with proper timing
  if (document.querySelector('.wb-swiper')) {
    // Small delay to ensure DOM is fully ready
    setTimeout(async () => {
      try {
        // Initialize Swiper first
        const swiper = await initSwiper();
        
        // Only initialize Rive after Swiper is ready
        if (swiper) {
          await initRive();
          
          // Refresh ScrollTrigger after both are initialized
          ScrollTrigger.refresh(true);
        }
      } catch (error) {
        console.error('Error initializing components:', error);
      }
    }, 100);
  }

  // Function to handle email link copying
  const emailLink = document.getElementById('email-link');
  if (emailLink) {
    emailLink.addEventListener('click', function(e) {
      e.preventDefault();
      const emailAddress = this.href.replace('mailto:', '');
      
      // Copy email to clipboard
      navigator.clipboard.writeText(emailAddress).then(() => {
        // Store original text
        const originalText = this.textContent;
        
        // Change text to indicate success
        this.textContent = 'Email Copied!';
        
        // Reset text after 2 seconds
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy email:', err);
      });
    });
  }

  // Function to reset scroll position
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
});