const form = document.querySelector(".contact-form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector('input[placeholder="Your Name"]').value;
    const phone = form.querySelector('input[placeholder="Phone Number"]').value;
    const service = form.querySelector("select").value;
    const message = form.querySelector("textarea").value;

    const whatsappNumber = "918003929804";

    const text = `Hello RK Digital Solutions,%0A%0AName: ${name}%0APhone: ${phone}%0AService: ${service}%0AMessage: ${message}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
});