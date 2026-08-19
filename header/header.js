fetch("../header/header.html")
    .then(response => {

        if (!response.ok) {
            throw new Error("Header file not found");
        }

        return response.text();
    })
    .then(data => {

        document.getElementById("header").innerHTML = data;

        document.dispatchEvent(
            new Event("headerLoaded")
        );

    })
    .catch(error => {

        console.error("Header Error:", error);

    });