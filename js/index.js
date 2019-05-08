document.addEventListener("DOMContentLoaded", function() {
  animateAnchorClicks();
  setUpContactOverlay();
  trapContactFormSubmit();
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

    const closeButton = overlay.querySelector(".form-submit-success__button");
    if (closeButton) {
      closeButton.addEventListener("click", function(e) {
        e.preventDefault();
        hideOverlay();
      });
    }

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
