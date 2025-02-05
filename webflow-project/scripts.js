// Include external libraries (or load them via HTML <script> tags)
// Your custom code for animations, cursor, and Barba transitions:

// Hero Animations GSAP
let tl = gsap.timeline();
tl.from(".hero-box", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  stagger: 0.3
});

let tl2 = gsap.timeline();
tl2.from(".fade-in", {
  y: 25,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  stagger: 0.1
});

// Custom Cursor
document.addEventListener("DOMContentLoaded", function() {
  const customCursor = document.querySelector('.custom-cursor');
  if (!customCursor) {
    console.error('Custom cursor element not found!');
    return;
  }

  const quickX = gsap.quickTo(customCursor, "x", { duration: 0.2, ease: "power3.out" });
  const quickY = gsap.quickTo(customCursor, "y", { duration: 0.2, ease: "power3.out" });

  document.addEventListener('mousemove', function(e) {
    quickX(e.clientX);
    quickY(e.clientY);
  });

  function createRings() {
    const ringCount = 3;
    const delayBetween = 0.2;
    const duration = 1.5;
    const targetScale = 4;

    for (let i = 0; i < ringCount; i++) {
      const ring = document.createElement('div');
      ring.classList.add('cursor-ring');
      customCursor.appendChild(ring);

      gsap.to(ring, {
        duration: duration,
        scale: targetScale,
        opacity: 0,
        delay: i * delayBetween,
        ease: "power1.out",
        onComplete: () => {
          ring.remove();
        }
      });
    }
  }

  document.querySelectorAll('.cursor-animation').forEach((element) => {
    element.addEventListener('mouseenter', function() {
      createRings();
      gsap.to(customCursor, {
        duration: 0.2,
        scale: 0.5,
        ease: "power3.out"
      });
    });
    element.addEventListener('mouseleave', function() {
      gsap.to(customCursor, {
        duration: 0.2,
        scale: 1,
        ease: "power3.out"
      });
    });
  });
});

// Barba Transitions
document.addEventListener('DOMContentLoaded', function () {
  barba.init({
    transitions: [
      {
        name: 'shrink-and-fade',
        async leave(data) {
          await new Promise(resolve => {
            gsap.to(data.current.container, {
              duration: 0.5,
              scale: 0.8,
              opacity: 0,
              ease: "power3.in",
              onComplete: resolve
            });
          });
        },
        enter(data) {
          gsap.from(data.next.container, {
            duration: 0.5,
            scale: 0.8,
            opacity: 0,
            ease: "power3.out"
          });
        },
        once(data) {
          gsap.from(data.next.container, {
            duration: 0.5,
            scale: 0.8,
            opacity: 0,
            ease: "power3.out"
          });
        }
      }
    ]
  });
});
