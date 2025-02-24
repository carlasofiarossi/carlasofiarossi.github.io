document.addEventListener("DOMContentLoaded", function () { 
    emailjs.init("quGq_nf2AS8NFB_bB");

    document.getElementById("contactForm").addEventListener("submit", function (event) {  
        event.preventDefault();
        console.log("Formulario enviado");  // <-- Verifica si este mensaje aparece

        let templateParams = {
            from_name: document.getElementById("nombre").value,
            from_mail: document.getElementById("email2").value,
            message: document.getElementById("mensaje").value,
        };

        emailjs.send("service_m3vglk5", "template_hwe21cb", templateParams)
            .then(function (response) {
                console.log("Email enviado:", response);
                Swal.fire("¡Éxito!", "Tu mensaje ha sido enviado.", "success");
                document.getElementById("contactForm").reset();
            })
            .catch(function (error) {
                console.error("Error al enviar el email:", error);
                Swal.fire("Error", "Hubo un problema al enviar el mensaje.", "error");
            });
    });
});
