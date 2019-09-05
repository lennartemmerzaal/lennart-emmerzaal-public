document.addEventListener("DOMContentLoaded", function() {
  animateAnchorClicks();
  setUpContactOverlay();
  trapContactFormSubmit();
  animateHeroBackdrop(
    document.querySelector(".hero__backdrop-container"),
    9,
    1
  );

  // Set up cookie consent
  if (typeof window.CookieConsent !== "undefined") {
    setTimeout(
      () =>
        new CookieConsent({
          palette: {
            popup: {
              background: "#272838",
              text: "#fff",
            },
            button: {
              background: "rgba(255, 255, 255, .08)",
              text: "#fff",
            },
          },
          theme: "edgeless",
          position: "top",
          static: true,
        }),
      2000
    );
  }
});

function animateAnchorClicks() {
  document.querySelectorAll("a").forEach(function(link) {
    var href = link.getAttribute("href");

    if (href[0] === "#") {
      var target = document.querySelector(link.getAttribute("href"));

      link.addEventListener("click", function(e) {
        e.preventDefault();

        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });
}

function setUpContactOverlay() {
  var INTAKE_PAGE_PATH = "/intake.html";

  loadContactForm(INTAKE_PAGE_PATH, function(formDocument) {
    const overlay = document.createElement("div");

    overlay.classList.add("overlay");
    overlay.appendChild(formDocument.querySelector("#intake-form"));

    const closeButtons = overlay.querySelectorAll(
      ".form-submit-success__button, .intake-form__cancel-button"
    );

    closeButtons.forEach(function(closeButton) {
      closeButton.addEventListener("click", function(e) {
        e.preventDefault();
        hideOverlay();
      });
    });

    hideOverlay();

    document.body.appendChild(overlay);

    trapContactFormSubmit();

    document
      .querySelectorAll("a[href='" + INTAKE_PAGE_PATH + "']")
      .forEach(function(link) {
        link.addEventListener("click", function(e) {
          e.preventDefault();
          overlay.style.display = null;
        });
      });

    function hideOverlay() {
      overlay.style.display = "none";
    }
  });
}

function loadContactForm(path, callback) {
  var xhr = new XMLHttpRequest();

  xhr.addEventListener("load", function() {
    callback(this.responseXML);
  });

  xhr.open("GET", path);
  xhr.responseType = "document";
  xhr.send();
}

function trapContactFormSubmit() {
  var trap = document.querySelector("#form-submit-trap-iframe");
  var form = document.querySelector("#contact-form");
  var title = document.querySelector(".intake-form__title");
  var successMessage = document.querySelector(".form-submit-success");

  var hideOnFormSuccess = document.querySelectorAll(
    ".js__hide-on-form-success"
  );

  var contactFormSubmitted = false;

  if (form && trap) {
    form.target = "form-submit-trap-iframe";

    trap.onload = function() {
      if (contactFormSubmitted && successMessage) {
        hideOnFormSuccess.forEach(function(el) {
          el.style.display = "none";
        });

        successMessage.classList.remove("form-submit-success--hidden");
      }
    };

    form.onsubmit = function(e) {
      contactFormSubmitted = true;
    };
  }
}

function animateHeroBackdrop(
  container,
  totalBackgrounds,
  currentBackgroundNumber
) {
  var nextBackgroundNumber = (currentBackgroundNumber % totalBackgrounds) + 1;

  // Remove the (now invisible) exiting backdrop

  var invisibleBackdrop = container.querySelector(
    ".hero__backdrop.hero__backdrop--exiting"
  );

  if (invisibleBackdrop) {
    invisibleBackdrop.parentNode.removeChild(invisibleBackdrop);
  }

  // Add the exiting class to the visible backdrop so that it will animate and disappear after a while

  var visibleBackdrop = container.querySelector(
    ".hero__backdrop:not(.hero__backdrop--exiting)"
  );

  visibleBackdrop.classList.add("hero__backdrop--exiting");

  visibleBackdrop.addEventListener("animationend", function() {
    // Once the animation is done, we run the same function again and increase the background number so that it keeps repeating with different images
    animateHeroBackdrop(container, totalBackgrounds, nextBackgroundNumber);
  });

  // We create the new backdrop that will become visible once the exiting one has disappeared

  var newBackdrop = document.createElement("div");

  newBackdrop.classList.add("hero__backdrop");
  newBackdrop.style.backgroundImage =
    'url("/images/photography/hero desktop/' + nextBackgroundNumber + '.jpg")';

  container.appendChild(newBackdrop);
}
