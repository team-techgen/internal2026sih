fetch("../../footer/footer.html?v=3")
    .then(response => {

        if (!response.ok) {
            throw new Error("Footer file not found");
        }

        return response.text();

    })
    .then(data => {

        const footer =
            document.getElementById("footer");

        if (footer) {
            footer.innerHTML = data;
        }

    })
    .catch(error => {

        console.error(
            "Footer Error:",
            error
        );

    });