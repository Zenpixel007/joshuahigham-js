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

function initGsapAnimations() {
  // Kill all ScrollTrigger instances before creating new ones
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Footer Animation
  gsap.to(".main-wrapper", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top bottom",
      end: "top center",
      scrub: true,
      // markers: true, // Uncomment for debugging
    },
    scale: 0.85,
    ease: "none"
  });

  // gsap.to(".footer", {
  //   scrollTrigger: {
  //     trigger: ".footer",
  //     start: "top bottom",
  //     end: "top center",
  //     scrub: true,
  //     // markers: true, // Uncomment for debugging
  //   },
  //   yPercent: -20,
  //   ease: "none"
  // });

  // 1. Hero Animations
  let tl = gsap.timeline();
  tl.from(".hero-box", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,
  });

  let tl2 = gsap.timeline();
  tl2.from(".fade-in", {
    y: 25,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.1,
  });

  // 1B. ScrollTrigger "Slide-In" Animation
  // Add .slide-in to elements you want to animate on scroll
  gsap.utils.toArray(".slide-in").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 50%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  });

  // 1C. ScrollTrigger "Slide-In" Animation
  // Add .slide-in to elements you want to animate on scroll
  gsap.from(".work_item", {
    scrollTrigger: {
      trigger: ".work_layout", // can be a container or each element
      start: "top 50%", // adjust as needed
      // markers: true,      // uncomment for debugging
      toggleActions: "play none none none",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,
  });

  // 2. Custom Cursor
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
      behavior: 'auto'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  // Initialize Barba
  barba.init({
    transitions: [
      {
        name: "shrink-and-fade",
        async leave(data) {
          // Cleanup footer animations before transition
          if (window.cleanupFooterAnimations) {
            window.cleanupFooterAnimations();
          }
          ScrollTrigger.getAll().forEach(st => st.kill());
          
          await new Promise((resolve) => {
            gsap.to(data.current.container, {
              duration: 0.5,
              scale: 0.8,
              opacity: 0,
              ease: "power3.in",
              onComplete: resolve,
            });
          });
        },
        async enter(data) {
          scrollToTop();
          
          // Clear any existing ScrollTrigger instances
          ScrollTrigger.getAll().forEach(st => st.kill());
          
          gsap.from(data.next.container, {
            duration: 0.5,
            scale: 0.8,
            opacity: 0,
            ease: "power3.out",
          });

          // Wait for the entrance animation to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Refresh ScrollTrigger and reinitialize animations
          ScrollTrigger.refresh();
          initGsapAnimations();
          initCalendly(); // Initialize Calendly after page transition
          
          // Reset scroll position again after everything is initialized
          scrollToTop();

          // Store cleanup function for next transition
          window.cleanupFooterAnimations = initGsapAnimations();
        },
        async once(data) {
          gsap.from(data.next.container, {
            duration: 0.5,
            scale: 0.8,
            opacity: 0,
            ease: "power3.out",
          });
          
          // Wait for initial animation to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Initialize animations on first load
          ScrollTrigger.refresh();
          initGsapAnimations();
          initCalendly(); // Initialize Calendly on first load

          // Store cleanup function on initial load
          window.cleanupFooterAnimations = initGsapAnimations();
        },
      },
    ],
    preventScroll: true,
    views: [
      {
        namespace: '*',
        beforeEnter() {
          scrollToTop();
        }
      }
    ]
  });

  // Additional hooks for cleanup and scroll reset
  barba.hooks.beforeLeave(() => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  });

  barba.hooks.after(() => {
    ScrollTrigger.refresh(true);
    scrollToTop();
  });

  barba.hooks.enter(() => {
    scrollToTop();
  });
});
