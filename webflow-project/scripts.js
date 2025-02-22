// Include external libraries (or load them via HTML <script> tags)
// Your custom code for animations, cursor, and Barba transitions:

//This is a test to see if it is conected to the webflow project
console.log("checking connection hsdsad");

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

  // // 1. Home Hero Animations
  // // Set initial states immediately
  // gsap.set(".hero-box", {
  //   opacity: 0,
  //   y: 50
  // });
  
  // gsap.set(".fade-in", {
  //   opacity: 0,
  //   y: 25
  // });

  // // Delay the start of animations slightly to ensure initial states are applied
  // setTimeout(() => {
  //   let tl = gsap.timeline();
  //   tl.to(".hero-box", {
  //     y: 0,
  //     opacity: 1,
  //     duration: 1,
  //     ease: "power2.out",
  //     stagger: 0.3,
  //   });

  //   let tl2 = gsap.timeline();
  //   tl2.to(".fade-in", {
  //     y: 0,
  //     opacity: 0.999, // Using 0.999 instead of 1 to prevent GSAP rounding issues
  //     duration: 1,
  //     ease: "power2.out",
  //     stagger: 0.1,
  //   });
  // }, 50);

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
        name: "work-item-transition",
        from: {
          namespace: "home"
        },
        to: {
          namespace: "project"
        },
        async beforeLeave(data) {
          // Kill all GSAP animations and ScrollTriggers
          ScrollTrigger.getAll().forEach(st => st.kill());
          gsap.killTweensOf("*");

          const trigger = data.trigger;
          if (!trigger) return;
          
          const isWorkItem = trigger.classList.contains('work_item-img') || 
                            trigger.closest('.work_item-img');
          const isWorkButton = trigger.classList.contains('button') && 
                             trigger.classList.contains('is-secondary') && 
                             trigger.classList.contains('_is-work');
          
          if (!isWorkItem && !isWorkButton) return;

          const workItem = isWorkItem ? trigger.closest('.work_item') : 
                          trigger.closest('.work_item');
          const sourceImg = workItem.querySelector('.work_item-img_img');
          if (!sourceImg) return;

          const rect = sourceImg.getBoundingClientRect();
          data.sourceRect = rect;
          data.sourceImage = sourceImg.src;

          const leaveTl = gsap.timeline();
          
          leaveTl.to('.work_item', {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            stagger: 0.1,
            filter: el => el !== workItem
          });

          await leaveTl.play();
        },
        async leave(data) {
          // Clear any remaining animations
          gsap.killTweensOf("*");
        },
        async enter(data) {
          // Kill any existing ScrollTriggers
          ScrollTrigger.getAll().forEach(st => st.kill());
          
          const targetImg = document.querySelector('.project_main-img .work_item-img_img');
          if (!targetImg || !data.sourceRect) return;

          const enterTl = gsap.timeline();

          gsap.set('.section_project-hero', {
            opacity: 0
          });

          gsap.set(targetImg, {
            position: 'fixed',
            top: data.sourceRect.top + 'px',
            left: data.sourceRect.left + 'px',
            width: data.sourceRect.width + 'px',
            height: data.sourceRect.height + 'px',
            zIndex: 100
          });

          enterTl
            .to(targetImg, {
              duration: 1,
              top: 'auto',
              bottom: '0',
              left: '0',
              width: '100%',
              height: 'auto',
              ease: "power2.inOut"
            })
            .to('.section_project-hero', {
              opacity: 1,
              duration: 0.5
            }, "-=0.3");

          await enterTl.play();

          gsap.set(targetImg, {
            clearProps: "all"
          });

          // Initialize new animations after transition
          ScrollTrigger.refresh(true);
          initGsapAnimations();
        },
        async afterEnter() {
          // Final refresh of ScrollTrigger
          ScrollTrigger.refresh(true);
        }
      },
      {
        name: "slide-over",
        from: {
          custom: ({ trigger }) => {
            return !(window.location.pathname === '/' && !trigger);
          }
        },
        async beforeLeave() {
          // Kill all GSAP animations and ScrollTriggers
          ScrollTrigger.getAll().forEach(st => st.kill());
          gsap.killTweensOf("*");
        },
        async leave(data) {
          const scrollPos = window.scrollY;
          
          gsap.set(data.current.container, {
            position: 'fixed',
            width: '100%',
            top: -scrollPos,
            left: 0
          });
          
          document.body.style.overflow = 'hidden';
          
          return gsap.to(data.current.container, {
            duration: 0,
            opacity: 1
          });
        },
        async enter(data) {
          // Kill any existing ScrollTriggers
          ScrollTrigger.getAll().forEach(st => st.kill());
          
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          
          gsap.set([".hero-box", ".fade-in"], {
            opacity: 0,
            y: 50
          });
          
          gsap.set(data.next.container, {
            position: 'fixed',
            top: '100%',
            left: 0,
            width: '100%',
            zIndex: 10,
            visibility: 'visible'
          });
          
          await gsap.to(data.next.container, {
            duration: 0.8,
            top: '0%',
            ease: "power3.inOut"
          });

          gsap.set([data.current.container, data.next.container], {
            clearProps: 'all'
          });
          
          document.body.style.overflow = '';
          window.scrollTo(0, 0);
          
          // Initialize new animations after transition
          ScrollTrigger.refresh(true);
          initGsapAnimations();
          initCalendly();
          initCustomCursor();
        },
        async afterEnter() {
          // Final refresh of ScrollTrigger
          ScrollTrigger.refresh(true);
        }
      }
    ],
    preventScroll: true,
    views: [
      {
        namespace: 'home',
        beforeEnter() {
          ScrollTrigger.refresh(true);
          initGsapAnimations();
        },
        afterEnter() {
          ScrollTrigger.refresh(true);
        }
      },
      {
        namespace: 'project',
        beforeEnter() {
          ScrollTrigger.refresh(true);
          initGsapAnimations();
        },
        afterEnter() {
          ScrollTrigger.refresh(true);
        }
      },
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
    gsap.killTweensOf("*");
  });

  barba.hooks.after(() => {
    document.body.style.overflow = '';
    ScrollTrigger.refresh(true);
  });
});