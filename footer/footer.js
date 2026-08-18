document.addEventListener("DOMContentLoaded", function () {

    const footerContainer = document.createElement("div");

    footerContainer.id = "footer-container";

    document.body.appendChild(footerContainer);


    fetch("../Footer/footer.html")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Footer HTML not found: " + response.status
                );
            }

            return response.text();

        })

        .then(data => {

            footerContainer.innerHTML = data;

        })

        .catch(error => {

            console.error("FOOTER ERROR:", error);

        });

});