// Include external libraries (or load them via HTML <script> tags)
// Your custom code for animations, cursor, and Barba transitions:

//This is a test to see if it is conected to the webflow project
console.log("This site is automatically updating");

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

  // Hero Animation
  if (document.querySelector('.hero-animation_wrapper')) {
    // Set initial states
    gsap.set('.circle_hero.is-1', {
      xPercent: -100,
      opacity: 1
    });
    
    gsap.set('.circle_hero.is-2', {
      xPercent: 100,
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

    // Create main timeline
    const heroTl = gsap.timeline({
      defaults: {
        ease: "power2.inOut"
      }
    });

    heroTl
      // Move circles to center
      .to(['.circle_hero.is-1', '.circle_hero.is-2'], {
        xPercent: 0,
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
        duration: 0.5
      }, '-=1')
      // Scale up center circle to fill viewport
      .to('.circle_hero.is-3', {
        scale: 20,
        duration: 1
      })
      // Animate in text
      .to('.hero-animation_text', {
        opacity: 1,
        y: 0,
        duration: 0.8
      })
      // Hold for a moment
      .to({}, {
        duration: 0.5
      })
      // Fade out text
      .to('.hero-animation_text', {
        opacity: 0,
        y: -20,
        duration: 0.8
      })
      // Scale down center circle
      .to('.circle_hero.is-3', {
        scale: 1,
        duration: 1
      });
  }

  // Footer Animation
  gsap.to(".main-wrapper", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top bottom",
      end: "top center",
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true, // Uncomment for debugging
    },
    scale: 0.85,
    ease: "none"
  });

  gsap.to(".footer", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top bottom",
      end: "top center",
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true, // Uncomment for debugging
    },
    yPercent: -20,
    ease: "none"
  });

  // 1. Home Hero Animations
  // Set initial states immediately
  gsap.set(".hero-box", {
    opacity: 0,
    y: 50
  });
  
  gsap.set(".fade-in", {
    opacity: 0,
    y: 25
  });

  // Delay the start of animations slightly to ensure initial states are applied
  setTimeout(() => {
    let tl = gsap.timeline();
    tl.to(".hero-box", {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      stagger: 0.3,
    });

    let tl2 = gsap.timeline();
    tl2.to(".fade-in", {
      y: 0,
      opacity: 0.999, // Using 0.999 instead of 1 to prevent GSAP rounding issues
      duration: 1,
      ease: "power2.out",
      stagger: 0.1,
    });
  }, 50);

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
      // markers: true,
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

  // Initialize cursor immediately on first page load
  initCustomCursor();

  // Initialize Barba
  barba.init({
    transitions: [
      {
        name: "slide-over",
        from: {
          custom: ({ trigger }) => {
            return !(window.location.pathname === '/' && !trigger);
          }
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
    preventScroll: true,
    views: [
      {
        namespace: '*',
        beforeEnter() {
          window.scrollTo(0, 0);
        }
      }
    ]
  });

  // Additional hooks for cleanup and scroll management
  barba.hooks.before(() => {
    document.body.style.overflow = 'hidden';
  });

  barba.hooks.beforeLeave(() => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  });

  barba.hooks.after(() => {
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
    ScrollTrigger.refresh(true);
  });
});
