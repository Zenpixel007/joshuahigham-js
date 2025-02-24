// Include external libraries (or load them via HTML <script> tags)
// Your custom code for animations, cursor, and Barba transitions:

//This is a test to see if it is conected to the webflow project
console.log("checking Barba");

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

  // Footer Animation - Modified to be transition-friendly
  const footer = document.querySelector(".footer");
  const mainWrapper = document.querySelector(".main-wrapper");
  
  if (footer && mainWrapper) {
    // Create a timeline for footer animations
    const footerTl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top bottom",
        end: "top center",
        scrub: 1,
        invalidateOnRefresh: true,
        onLeave: () => {
          // Reset transforms when leaving view
          gsap.set([mainWrapper, footer], { clearProps: "all" });
        },
        onEnterBack: () => {
          // Re-enable the animation when scrolling back
          ScrollTrigger.refresh();
        }
      }
    });

    footerTl
      .to(mainWrapper, {
        scale: 0.85,
        ease: "none",
      })
      .to(footer, {
        yPercent: -20,
        ease: "none",
      }, "<");
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
          // Store current scroll position
          const scrollPos = window.scrollY;
          
          // Get click position from the trigger element
          const trigger = data.trigger;
          const clickRect = trigger.getBoundingClientRect();
          const clickX = clickRect.left + (clickRect.width / 2);
          const clickY = clickRect.top + (clickRect.height / 2);
          
          // Create and append the transition circle if it doesn't exist
          let transitionCircle = document.querySelector('.transition-circle');
          if (!transitionCircle) {
            transitionCircle = document.createElement('div');
            transitionCircle.className = 'transition-circle';
            document.body.appendChild(transitionCircle);
            
            // Add styles to the circle, positioning it at the click position
            gsap.set(transitionCircle, {
              position: 'fixed',
              top: clickY + 'px',
              left: clickX + 'px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#ef0107',
              transform: 'translate(-50%, -50%) scale(0)',
              zIndex: 9999,
              pointerEvents: 'none'
            });
          }

          // Fix both the current container and body at current scroll
          document.documentElement.style.position = 'fixed';
          document.documentElement.style.top = -scrollPos + 'px';
          document.documentElement.style.width = '100%';
          document.documentElement.style.overflowY = 'scroll';
          
          // Create the leave animation timeline
          const tl = gsap.timeline();
          
          // Scale up the circle to cover the screen
          await tl.to(transitionCircle, {
            scale: 100,
            duration: 1,
            ease: "power2.inOut"
          });

          // Prepare the next container before the transition completes
          gsap.set(data.next.container, {
            position: 'fixed',
            top: '0',
            left: 0,
            width: '100%',
            opacity: 1,
            zIndex: 1,
            y: 0
          });
        },
        async enter(data) {
          const transitionCircle = document.querySelector('.transition-circle');
          
          // Create enter animation timeline
          const tl = gsap.timeline();

          // Fade out the circle with a slight delay
          await tl.to(transitionCircle, {
            opacity: 0,
            duration: 0.2,
            delay: 0.1,
            onComplete: () => {
              // Remove the transition circle
              transitionCircle.remove();
              
              // Reset container properties
              gsap.set([data.current.container, data.next.container], {
                clearProps: 'all'
              });
              
              // Reset document position and scroll
              document.documentElement.style.position = '';
              document.documentElement.style.top = '';
              document.documentElement.style.width = '';
              document.documentElement.style.overflowY = '';
              
              // Force scroll to top for the contact page
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
              
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
          // Only handle scroll reset for non-contact transitions
          if (!data.next.namespace.includes('contact')) {
            window.scrollTo(0, 0);
          }
          
          // Kill all existing ScrollTrigger instances
          ScrollTrigger.getAll().forEach(st => st.kill());
          
          // Kill all GSAP animations
          gsap.killTweensOf("*");
          
          // Initialize new animations
          initGsapAnimations();
          initCustomCursor();
        }
      }
    ]
  });

  // Additional Barba hooks for proper cleanup and initialization
  barba.hooks.beforeLeave(() => {
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.killTweensOf("*");
  });

  barba.hooks.after((data) => {
    // Only handle scroll reset for non-contact transitions
    if (!data.next.namespace.includes('contact')) {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }
    
    ScrollTrigger.refresh(true);
    initGsapAnimations();
    initCalendly();
    initCustomCursor();
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
});