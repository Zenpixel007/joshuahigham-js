// Include external libraries (or load them via HTML <script> tags)
// Your custom code for animations, cursor, and Barba transitions:

//This is a test to see if it is conected to the webflow project
console.log("checking if connected");

// Initialize Rive animation
async function initRive() {
  try {
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
      // Set canvas size to viewport dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Update container size to match viewport
      container.style.width = '100vw';
      container.style.height = '100vh';
    };
    
    // Initial size setup
    updateCanvasSize();

    const riveURL = 'https://cdn.prod.website-files.com/67a1da359110aff234167390/67c6ef7fbe4810c35443a3f8_Test.riv';
    
    // Create new Rive instance using the current API
    const riveInstance = new rive.Rive({
      src: riveURL,
      canvas: canvas,
      stateMachines: ['BlobFollow'],
      autoplay: true,
      layout: new rive.Layout({
        fit: rive.Fit.cover,
        alignment: rive.Alignment.center
      }),
      onLoad: () => {
        console.log('Rive animation loaded successfully');
        adjustCanvasScale();
      },
      onError: (err) => {
        console.error('Error loading Rive animation:', err);
      }
    });

    // Function to adjust canvas scale based on viewport
    const adjustCanvasScale = () => {
      if (!riveInstance || !riveInstance.activeArtboard) return;

      const artboard = riveInstance.activeArtboard;
      const bounds = artboard.bounds;
      const viewportAspect = window.innerWidth / window.innerHeight;
      const artboardAspect = bounds.width / bounds.height;
      
      let scale;
      if (viewportAspect > artboardAspect) {
        // Viewport is wider than artboard
        scale = (window.innerWidth / bounds.width) * 1.1; // Add 10% extra scale
      } else {
        // Viewport is taller than artboard
        scale = (window.innerHeight / bounds.height) * 1.1; // Add 10% extra scale
      }

      riveInstance.layout = new rive.Layout({
        fit: rive.Fit.cover,
        alignment: rive.Alignment.center,
        scale: scale
      });
    };

    // Handle window resize
    window.addEventListener('resize', () => {
      updateCanvasSize();
      adjustCanvasScale();
    });

    console.log('Rive instance created successfully');
    return riveInstance;
  } catch (error) {
    console.error('Failed to initialize Rive:', error);
  }
}

// When the DOM is ready, initialize Rive
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing Rive...");
  setTimeout(initRive, 100); // Small delay to ensure everything is ready
});

// Function to reinitialize Calendly
function initCalendly() {
  // Remove existing Calendly script if it exists
  const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Create and append new Calendly script
  const script = document.createElement('script');
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  document.body.appendChild(script);
}

// 1. Register the ScrollTrigger plugin (only needs to be done once in your script).
gsap.registerPlugin(ScrollTrigger);

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

function initGsapAnimations() {
  // Kill all ScrollTrigger instances before creating new ones
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

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
        // markers: true, // Uncomment for debugging
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

  // Hero Animation
  if (document.querySelector('.hero-animation_wrapper')) {
    // Set initial states
    gsap.set('.circle_hero.is-1', {
      x: '-50vw',
      opacity: 1
    });
    
    gsap.set('.circle_hero.is-2', {
      x: '50vw',
      opacity: 1
    });
    
    gsap.set('.circle_hero.is-3', {
      scale: 0,
      opacity: 0
    });
    
    gsap.set('.hero-animation_text', {
      opacity: 0,
      y: 20
    });

    gsap.set('.section_hero-animation', {
      opacity: 100
    });

    gsap.set('.hero-background', {
      opacity: 0
    });


    // Create main timeline
    const heroTl = gsap.timeline({
      defaults: {
        ease: "power2.inOut"
      }
    });

    heroTl
      // Move circles to center
      .to(['.circle_hero.is-1', '.circle_hero.is-2'], {
        x: '0vw',
        duration: 1.5
      })
      // Hide initial circles and show center circle
      .to(['.circle_hero.is-1', '.circle_hero.is-2'], {
        opacity: 0,
        duration: 0.1
      })
      .to('.circle_hero.is-3', {
        opacity: 1,
        scale: 1,
        duration: 0.75
      }, '-=0.75')
      // Scale up center circle to fill viewport
      .to('.circle_hero.is-3', {
        scale: 20,
        duration: 1,
        delay: 0.5
      })
      // Animate in text
      .to('.hero-animation_text', {
        opacity: 1,
        y: 0,
        duration: 0.8
      },'-=0.5')
      // Hold for a moment
      .to({}, {
        duration: 0.5
      })
      // Scale down center circle
      .to('.circle_hero.is-3', {
        scale: 0,
        duration: 1
      })
      // Fade out text
      .to('.hero-animation_text', {
        opacity: 0,
        y: -20,
        duration: 1
      },'-=1')  
      //Fade out Hero Animation Wrapper
      .to('.section_hero-animation', {
        autoAlpha: 0,
        duration: .5
      },'-=.5')
      //Fade in Hero Background Image
      .to('.hero-background', {
        opacity: 1,
        duration: 1
      }, '-=.5')
      // Slide in new elements with stagger
      .from('.hero-slide-in', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: {
          amount: 0.5,    // Total amount of time to stagger over
          ease: "power2.out"
        },
        ease: "power2.out"
      }, '-=0.25');
  }

  // Hero Scroll Animation
  const heroScrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_hero",
      start: "top top",
      end: "+=100%",
      pin: true,           // Pin the section during animation
      pinSpacing: true,    // Maintains the space in the document
      scrub: 1,
      anticipatePin: 1,    // Improves pin performance
      invalidateOnRefresh: true,
      // markers: true     // Uncomment for debugging
    }
  });

  heroScrollTl
    .to(".hero_layout-centered", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut"
    })
    .to(".hero-background", {
      opacity: 0,
      scale: 1.1,
      duration: 0.3,
      ease: "power2.inOut"
    }, "-=0.2");

  // CTA Scroll Animation
  const ctaScrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_cta-centered",
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  // Set initial states
  gsap.set(".cta-background", {
    opacity: 0,
    scale: 0.9
  });
  
  gsap.set(".cta-slide-in", {
    opacity: 0,
    y: 30
  });

  ctaScrollTl
    // Fade in and scale up the background
    .to(".cta-background", {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.inOut"
    })
    // Animate in CTA elements with stagger
    .to(".cta-slide-in", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: {
        amount: 0.3,
        ease: "power2.out"
      },
      ease: "power2.out"
    });

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

  // 1B. ScrollTrigger "Slide-In" Animation
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

  // 1C. Work Items Animation
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

  // 3. Button Hover (to Dark)
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

  // 4. Button Hover (to Light)
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

document.addEventListener("DOMContentLoaded", function () {
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

  // Initialize GSAP animations for the first page load
  initGsapAnimations();
  initCustomCursor();

  // Initialize Barba
  barba.init({
    debug: true, // Helps with debugging
    preventRunning: true,
    transitions: [
      {
        name: "contact-transition",
        to: {
          namespace: ["contact"]
        },
        priority: 2,
        async leave(data) {
          // Create and append the transition circle if it doesn't exist
          let transitionCircle = document.querySelector('.transition-circle');
          if (!transitionCircle) {
            transitionCircle = document.createElement('div');
            transitionCircle.className = 'transition-circle';
            document.body.appendChild(transitionCircle);
            
            // Add styles to the circle
            gsap.set(transitionCircle, {
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#FF0000',
              transform: 'translate(-50%, -50%) scale(0)',
              zIndex: 9999
            });
          }

          // Store current scroll position and fix the container
          const scrollPos = window.scrollY;
          gsap.set(data.current.container, {
            position: 'fixed',
            width: '100%',
            top: -scrollPos,
            left: 0
          });

          // Prevent scroll during transition
          document.body.style.overflow = 'hidden';

          // Create the leave animation timeline
          const tl = gsap.timeline();
          
          // Scale up the circle to cover the screen
          await tl.to(transitionCircle, {
            scale: 100,
            duration: 1,
            ease: "power2.inOut"
          });
        },
        async enter(data) {
          const transitionCircle = document.querySelector('.transition-circle');
          
          // Prepare new page
          gsap.set(data.next.container, {
            position: 'fixed',
            top: '0',
            left: 0,
            width: '100%',
            opacity: 0,
            zIndex: 1
          });

          // Create enter animation timeline
          const tl = gsap.timeline();

          // Fade in the new content
          tl.to(data.next.container, {
            opacity: 1,
            duration: 0.5
          });

          // Clean up the transition
          tl.to(transitionCircle, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              // Remove the transition circle
              transitionCircle.remove();
              
              // Reset container properties
              gsap.set([data.current.container, data.next.container], {
                clearProps: 'all'
              });
              
              // Re-enable scrolling
              document.body.style.overflow = '';
              
              // Ensure we're at top of new page
              window.scrollTo(0, 0);
              
              // Refresh ScrollTrigger and reinitialize animations
              ScrollTrigger.refresh();
              initGsapAnimations();
              initCalendly();
              initCustomCursor();
            }
          });
        }
      },
      {
        name: "work-to-project",
        from: {
          namespace: ["home", "work"]
        },
        to: {
          namespace: ["project"]
        },
        custom: ({ trigger }) => {
          return trigger && trigger.classList && trigger.classList.contains('work_item');
        },
        async leave(data) {
          const clickedItem = data.trigger;
          const allWorkItems = document.querySelectorAll('.work_item');
          
          // Get the clicked item's position and dimensions
          const rect = clickedItem.getBoundingClientRect();
          const viewportCenter = {
            x: window.innerWidth / 2 - rect.width / 2,
            y: window.innerHeight / 2 - rect.height / 2
          };
          
          // Calculate the transform needed to center the clicked item
          const moveX = viewportCenter.x - rect.left;
          const moveY = viewportCenter.y - rect.top;
          
          // Create timeline for the transition
          const tl = gsap.timeline();
          
          // Fade out all other work items
          tl.to([...allWorkItems].filter(item => item !== clickedItem), {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
          });
          
          // Move clicked item to center and scale it up
          tl.to(clickedItem, {
            x: moveX,
            y: moveY,
            scale: 1.2,
            duration: 0.8,
            ease: "power2.inOut"
          }, "-=0.3");
          
          // Fade out the centered item
          tl.to(clickedItem, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut"
          });
          
          await tl;
          
          // Set up for slide-over transition
          gsap.set(data.current.container, {
            position: 'fixed',
            width: '100%',
            top: -window.scrollY,
            left: 0
          });
          
          document.body.style.overflow = 'hidden';
        },
        async enter(data) {
          // Prepare new page to slide in from bottom
          gsap.set(data.next.container, {
            position: 'fixed',
            top: '100%',
            left: 0,
            width: '100%',
            zIndex: 10,
            visibility: 'visible'
          });
          
          // Slide new page up
          await gsap.to(data.next.container, {
            duration: 0.8,
            top: '0%',
            ease: "power3.inOut"
          });
          
          // Reset container properties
          gsap.set([data.current.container, data.next.container], {
            clearProps: 'all'
          });
          
          // Re-enable scrolling
          document.body.style.overflow = '';
          
          // Ensure we're at top of new page
          window.scrollTo(0, 0);
          
          ScrollTrigger.refresh();
          initGsapAnimations();
          initCalendly();
          initCustomCursor();
        }
      },
      {
        name: "slide-over",
        priority: 1,
        from: {
          namespace: ["home", "work", "project", "contact"]
        },
        to: {
          namespace: ["slide-over"]
        },
        async leave(data) {
          // Store current scroll position
          const scrollPos = window.scrollY;
          
          // Keep current page fixed in place
          gsap.set(data.current.container, {
            position: 'fixed',
            width: '100%',
            top: -scrollPos,
            left: 0
          });
          
          // Prevent scroll during transition
          document.body.style.overflow = 'hidden';
          
          return gsap.to(data.current.container, {
            duration: 0,
            opacity: 1
          });
        },
        async enter(data) {
          // Force the next container to start at top
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          
          // Set initial states for hero elements in the new page
          gsap.set([".hero-box", ".fade-in"], {
            opacity: 0,
            y: 50
          });
          
          // Prepare new page to slide in from bottom
          gsap.set(data.next.container, {
            position: 'fixed',
            top: '100%',
            left: 0,
            width: '100%',
            zIndex: 10,
            visibility: 'visible'
          });
          
          // Slide new page up
          await gsap.to(data.next.container, {
            duration: 0.8,
            top: '0%',
            ease: "power3.inOut"
          });

          // Reset container properties and scroll behavior
          gsap.set([data.current.container, data.next.container], {
            clearProps: 'all'
          });
          
          // Re-enable scrolling
          document.body.style.overflow = '';
          
          // Ensure we stay at top of new page
          window.scrollTo(0, 0);
          
          ScrollTrigger.refresh();
          initGsapAnimations();
          initCalendly();
          initCustomCursor();
        },
        async once(data) {
          // Simplified once animation for homepage
          ScrollTrigger.refresh();
          initGsapAnimations();
          initCalendly();
          initCustomCursor();
        }
      }
    ],
    views: [
      {
        namespace: '*',
        beforeEnter(data) {
          // Kill all existing ScrollTrigger instances
          ScrollTrigger.getAll().forEach(st => st.kill());
          
          // Kill all GSAP animations
          gsap.killTweensOf("*");
          
          // Initialize new animations
          initGsapAnimations();
          initCustomCursor();
          
          // Scroll to top
          window.scrollTo(0, 0);
        }
      }
    ]
  });

  // Additional Barba hooks for proper cleanup and initialization
  barba.hooks.beforeLeave(() => {
    // Kill all ScrollTrigger instances before leaving
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.killTweensOf("*");
  });

  barba.hooks.after(() => {
    // Re-enable scrolling
    document.body.style.overflow = '';
    
    // Ensure we're at top of page
    window.scrollTo(0, 0);
    
    // Refresh ScrollTrigger and reinitialize animations
    ScrollTrigger.refresh(true);
    initGsapAnimations();
    initCalendly();
    initCustomCursor();
    initRive();
  });

  // Remove individual reinitializations from transition enter functions
  const transitions = barba.transitions;
  transitions.forEach(transition => {
    if (transition.enter) {
      const originalEnter = transition.enter;
      transition.enter = async function(data) {
        await originalEnter.call(this, data);
        // Don't reinitialize here as it's handled by hooks
      };
    }
  });

  // Initialize Rive after a short delay to ensure DOM is ready
  setTimeout(initRive, 100);
});