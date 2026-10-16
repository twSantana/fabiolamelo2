const telefoneWhatsApp = "5541991651904";
const linkInstagram = "https://www.instagram.com/fabiolafmelo/?hl=en";
const enderecoEspaco = "Rua Santa Bertila Boscardin, 222 - Santa Felicidade";
const coordenadasEspaco = "-25.401127182177312,-49.32908172586066";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox.querySelector("img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxStatus = lightbox.querySelector(".lightbox-status");
  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  let activeGalleryIndex = -1;
  let returnFocus = null;

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      if (lightbox.open) {
        event.preventDefault();
        lightbox.close();
      }
    }

    if (lightbox.open && event.key === "ArrowLeft") {
      event.preventDefault();
      showGalleryImage(activeGalleryIndex - 1);
    } else if (lightbox.open && event.key === "ArrowRight") {
      event.preventDefault();
      showGalleryImage(activeGalleryIndex + 1);
    }
  });

  const showGalleryImage = (index) => {
    activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeGalleryIndex];
    const image = item.querySelector("img");
    lightboxImage.src = item.dataset.fullImage;
    lightboxImage.alt = image.alt;
    lightboxStatus.textContent = `${activeGalleryIndex + 1} / ${galleryItems.length}`;
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      returnFocus = item;
      showGalleryImage(index);
      lightbox.showModal();
      lightboxClose.focus();
    });
  });

  lightbox.querySelector(".lightbox-previous").addEventListener("click", () => {
    showGalleryImage(activeGalleryIndex - 1);
  });

  lightbox.querySelector(".lightbox-next").addEventListener("click", () => {
    showGalleryImage(activeGalleryIndex + 1);
  });

  lightboxClose.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  lightbox.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
    lightboxStatus.textContent = "";
    returnFocus?.focus();
  });

  document.getElementById("current-year").textContent = new Date().getFullYear();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });
    document.documentElement.classList.add("motion-ready");
  }
});

function abrirWhatsApp(servico) {
  const mensagem = servico
    ? `Olá! Gostaria de agendar ${servico}.`
    : "Olá! Vi seu catálogo e gostaria de agendar um horário.";
  window.open(`https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener,noreferrer");
}

function abrirInstagram() {
  window.open(linkInstagram, "_blank", "noopener,noreferrer");
}

function abrirGoogleMaps() {
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoEspaco)}`;
  window.open(link, "_blank", "noopener,noreferrer");
}

function abrirWaze() {
  window.open(`https://waze.com/ul?ll=${coordenadasEspaco}&navigate=yes`, "_blank", "noopener,noreferrer");
}

function smoothScrollTo(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  }
}

function formatarTelefone(telefone) {
  const cleaned = telefone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : telefone;
}
