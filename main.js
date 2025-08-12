// sampmain.js (replace your existing file with this)

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const switchBtns = Array.from(document.querySelectorAll(".switch-section"));
  const sections = Array.from(document.querySelectorAll(".section"));
  const navbarToggle = document.getElementById("navbarToggle");
  const navbarContent = document.getElementById("navbarContent");

  // small helper
  const log = (...args) => {
    // comment out the next line to silence logs after debugging
    // console.log(...args);
  };

  function hideAllInstant() {
    sections.forEach(s => {
      s.classList.remove("active-section");
      s.style.display = "none";
      s.style.opacity = "";
      s.style.transition = "";
    });
  }

  // Show section with a tiny fade-in. updateHistory = whether to push hash into address bar
  function showSection(id, updateHistory = true) {
    const target = document.getElementById(id);
    if (!target) {
      console.warn(`[sampmain.js] showSection: no section with id="${id}"`);
      return;
    }

    log("showSection:", id);
    // hide others smoothly
    sections.forEach(s => {
      if (s === target) return;
      // if visible -> fade out then hide
      if (getComputedStyle(s).display !== "none") {
        s.style.transition = "opacity 180ms ease";
        s.style.opacity = "0";
        // after fade, hide completely
        setTimeout(() => {
          s.style.display = "none";
          s.classList.remove("active-section");
          s.style.transition = "";
          s.style.opacity = "";
        }, 200);
      } else {
        s.style.display = "none";
        s.classList.remove("active-section");
      }
    });

    // show target
    target.style.display = "block";
    // prepare for fade-in
    target.style.opacity = "0";
    // ensure repaint before changing opacity
    requestAnimationFrame(() => {
      target.style.transition = "opacity 260ms ease";
      target.style.opacity = "1";
    });
    target.classList.add("active-section");

    // update URL hash without causing a scroll jump
    if (updateHistory) {
      try {
        history.pushState(null, "", "#" + id);
      } catch (err) {
        // fallback if pushState fails
        location.hash = "#" + id;
      }
    }

    // if mobile menu is open, close it
    if (navbarContent && navbarContent.classList.contains("show")) {
      navbarContent.classList.remove("show");
      navbarToggle && navbarToggle.setAttribute("aria-expanded", "false");
    }
  }

  // Initial: show section based on URL hash (if valid) otherwise welcome
  const initialHash = (location.hash || "").replace("#", "");
  if (initialHash && document.getElementById(initialHash)) {
    // don't push history for initial load
    hideAllInstant();
    showSection(initialHash, false);
    // avoid anchor auto-scroll weirdness
    window.scrollTo(0, 0);
  } else {
    hideAllInstant();
    showSection("welcome", false);
    window.scrollTo(0, 0);
  }

  // nav links handler
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // protect against links that are external (just in case)
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      e.preventDefault();
      const id = href.replace("#", "");
      showSection(id);
    });
  });

  // buttons inside content that switch sections (Explore / Submit Request)
  switchBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.target;
      if (!id) {
        console.warn("[sampmain.js] switch-section missing data-target");
        return;
      }
      showSection(id);
    });
  });

  // Mobile toggle (your HTML uses id="navbarToggle" and id="navbarContent")
  if (navbarToggle && navbarContent) {
    navbarToggle.addEventListener("click", () => {
      navbarContent.classList.toggle("show");
      const expanded = navbarContent.classList.contains("show");
      navbarToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  // support browser back/forward (popstate)
  window.addEventListener("popstate", () => {
    const h = (location.hash || "").replace("#", "") || "welcome";
    if (document.getElementById(h)) {
      showSection(h, false);
    } else {
      showSection("welcome", false);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const videoCards = document.querySelectorAll("#samples .sample-card video");
  const lightbox = document.getElementById("videoLightbox");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const closeBtn = document.getElementById("closeLightbox");
  let savedTime = 0;

  // Helper: pause all preview videos
  function pauseAllPreviews() {
    videoCards.forEach(v => v.pause());
  }

  // When clicking a preview video
  videoCards.forEach(video => {
    video.addEventListener("click", () => {
      pauseAllPreviews(); // stop other previews
      savedTime = video.currentTime;

      lightbox.classList.add("active");
      lightboxVideo.src = video.src;

      // Wait until video is ready before playing
      lightboxVideo.addEventListener("loadedmetadata", function onMeta() {
        lightboxVideo.currentTime = savedTime;

        // Pause any other playing videos (including itself if reopened)
        lightboxVideo.pause();

        lightboxVideo.play().catch(() => {
          lightboxVideo.muted = true;
          lightboxVideo.play();
        });

        lightboxVideo.removeEventListener("loadedmetadata", onMeta);
      });
    });

    // Also pause other previews when one starts playing
    video.addEventListener("play", () => {
      videoCards.forEach(v => {
        if (v !== video) v.pause();
      });
    });
  });

  // Close lightbox
  closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("active");
    lightboxVideo.pause();
    lightboxVideo.src = "";
  });

  // Close when clicking background
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
      lightboxVideo.pause();
      lightboxVideo.src = "";
    }
  });

  // Pause previews when lightbox is opened
  lightboxVideo.addEventListener("play", () => {
    pauseAllPreviews();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const flipCardInner = document.querySelector(".flip-card-inner");
  const flipCard = document.querySelector(".flip-card");

  flipCard.addEventListener("click", (event) => {
    // Prevent flipping if the click is on a button or inside a button
    if (event.target.tagName.toLowerCase() === "button" || event.target.closest("button")) {
      return;
    }

    // Toggle the flip
    flipCardInner.classList.toggle("is-flipped");
  });
});


