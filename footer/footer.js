document.addEventListener("DOMContentLoaded", function () {

    const footerContainer = document.createElement("div");

    footerContainer.id = "footer-container";

    document.body.appendChild(footerContainer);


    fetch("../Footer/footer.html")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Footer could not be loaded: " + response.status
                );
            }

            return response.text();

        })

        .then(data => {

            footerContainer.innerHTML = data;

        })

        .catch(error => {

            console.error("Footer Error:", error);

        });

});