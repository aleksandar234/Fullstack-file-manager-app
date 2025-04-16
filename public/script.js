// const { response } = require("express");

function showTab(tab_id) {
    // Ovo selektuje sve HTML elemente koji imaju klasu .tab-content (document.querySelectorAll(".tab-content"))
    // skida CSS klasu active sa tog elementa ((element.classList.remove("active")) efekat ovoga je da se taj CSS sadrzaj sakrije jer u CSS-u imam nesto nalik ovome (.tab-content.active{display: block})
    document.querySelectorAll(".tab-content").forEach((element) => element.classList.remove("active"));

    // Znaci u susutini sta se desava je sledece: posto vidimo da u nasem secondPage.html imamo ove klase
    // .tab i .tab-content i imamo koji su nam aktivni i koji ne, ono sto radimo ovde i gore je sledece
    // uzimamo sve klase koje su oznacene sa .tab i tab-content (to su i one koje imaju active na kraju)
    // i kazemo za sve njih da nam uklone active da nam se nista ne prikazuje, ovim putem mi mozemo da odredimo
    // sta ce prvo da nam se prikaze
    document.querySelectorAll(".tab").forEach((element) => element.classList.remove("active"));

    //sad zelimo da prikazemo izabrani tab sadrzaj
    document.getElementById(tab_id).classList.add("active");

    // sad treba da nadjemo koje tab dugme sadrzi text koji odgovara id-ju i njega aktivirati
    const tabButton = Array.from(document.querySelectorAll(".tab")).find((tab) =>
        tab.textContent.toLowerCase().includes(tab_id)
    );

    // sad kad smo nasli trazeno dugme kazemo da mu aktiviramo content tj. da bude vidljivo
    tabButton.classList.add("active");

}


// Kada korisnik izabere fajl, prikazujemo ga kao preview
document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const previewButton = document.getElementById("previewButton");
    const submitButton = document.getElementById("submitButton");
    const selectedFileName = document.getElementById("selected-file-name");

    if (file) {
        previewButton.disabled = false;
        submitButton.disabled = false;
        // console.log(file.display)
        const reader = new FileReader();
        selectedFileName.textContent = `Choosen file: ${file.fileName}`

        // Ako je fajl slika, prikazacemo njen preview
        // reader.onload = function (event) {
        //     const previewImage = document.getElementById("previewImage");
        //     previewImage.src = event.target.result; // prikazuje sliku kao preview
        //     previewImage.style.display = "block";// prikazuje element
        //     console.log("Ovde ja kao prikazujem sliku")
        // }

        reader.readAsDataURL(file);

        // Ako fajl nije slika onda prikazujemo samo ime fajla
        document.getElementById("previewImage").style.display = "none";
        previewButton.textContent = `Preview: ${file.name}`; // Prikazuje ime fajla
    } else {
        previewButton.disabled = true;
        submitButton.disabled = true;
    }

})

// Kada korisnik klikne na dugme "Pregledaj", otvorimo fajl (ako je slika)
document.getElementById("previewButton").addEventListener("click", function () {
    const file = document.getElementById("fileInput").files[0];

    if (file) {
        const reader = new FileReader();
        const newTab = window.open();

        // Kada zavrsi citanje fajla
        reader.onload = function (event) {
            const fileUrl = event.target.result;
            // Proveri da li je slika
            if (file.type.startsWith("image/")) {
                const imgElement = document.createElement("img");
                imgElement.src = fileUrl;
                imgElement.style.maxWidth = "100%";
                imgElement.style.height = "auto";
                newTab.document.body.appendChild(imgElement);
                // Ovo je alternativa ali je zastarelo i losa je i nebezbedno, na primer ako pozovemo
                // document.write() nakon ucitavanja stranice, cela stranica moze biti resetovana i sadrzaj moze nestati,
                // jer document.write() ponovo ucitava dokument.
                // newTab.document.write('<html><body><img src="' + fileUrl + '" alt="Preview"style="max-width:100%; height:auto;"></body></html>');

                // Ovo je ako je PDF
            } else if (file.type === "application/pdf") {
                const embedElement = document.createElement("embed");
                embedElement.src = fileUrl;
                embedElement.type = "application/pdf";
                embedElement.width = "100%";
                embedElement.height = "100%";
                newTab.document.body.appendChild(embedElement);
            } else {
                alert(`Fajl ${file.name} nije slika jer nema extenziju .jpg`)
            }
        }

        reader.readAsDataURL(file);

    } else {
        alert("Nijedan fajl nije izabran");
    }
})

document.addEventListener("DOMContentLoaded", () => {
    showAllAvailableFiles();
})

// Dohvata mi sve fajlove u bazi podataka i prikazuje mi delu "Available files"
function showAllAvailableFiles() {
    fetch('http://localhost:3000/documents')
        .then(response => response.json())
        .then(files => {
            const container = document.getElementById("file-list");
            container.innerHTML = ""; // ciscenje prethodnog  sadrzaja

            files.forEach(file => {
                const fileName = file.fileName;
                const fileElement = document.createElement("li");
                fileElement.textContent = fileName;
                const previewFileButton = document.getElementById("showFileButton")
                fileElement.addEventListener("click", () => {
                    document.getElementById("selected-file-name").textContent = `Choosen file: ${fileName}`;
                    // Omogucivanje dugmica
                    document.getElementById("showFileButton").disabled = false;
                    document.getElementById("downlaodFileButton").disabled = false;
                    previewFileButton.textContent = `Preview: ${fileName}`;
                })


                container.appendChild(fileElement);
            })
        })
        .catch(err => {
            console.error("Greska pri dohvatanju fajlova:", err);
        })
}

// Ovo je preview za Download deo
document.getElementById("showFileButton").addEventListener("click", () => {

    fetch('http://localhost:3000/documents')
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                if (file.fileName === document.getElementById("showFileButton").textContent.replace("Preview: ", "")) {
                    const arrayBuffer = new Uint8Array(file.fileData.data);
                    const blob = new Blob([arrayBuffer], { type: file.fileType });

                    // Kreiraj URL za Blob
                    const fileUrl = URL.createObjectURL(blob);

                    const newTab = window.open();

                    if (newTab.document.body.children.length > 0) {
                        newTab.document.body.innerHTML = ''; // Očisti postojeći sadržaj
                    }

                    console.log(newTab);

                    if (file.fileType.startsWith("image/")) {
                        const imgElement = newTab.document.createElement("img");
                        imgElement.src = fileUrl;
                        imgElement.style.maxWidth = "100%";
                        imgElement.style.height = "auto";
                        newTab.document.body.appendChild(imgElement);
                    } else if (file.fileType === "application/pdf") {
                        const embedElement = newTab.document.createElement("embed");
                        embedElement.src = fileUrl;
                        embedElement.type = "application/pdf";
                        embedElement.width = "100%";
                        embedElement.height = "100%";
                        newTab.document.body.appendChild(embedElement);
                    } else {
                        newTab.document.body.innerHTML = `<p>Preview za ovaj tip fajla nije podržan.</p>`;
                    }
                }
            })
        })
        .catch(err => {
            console.error("Greska pri dohvatanju fajla:", err);
        })
})


// Za Upload deo nakon sto kliknem submit zelim da mi se pozove funkcija za dohvatanje svih fajlove iz baze
document.getElementById("uploadForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
    })
    .then(res => {
        if(res.ok) {
            alert("Fajl successfully uplaoded");
            showAllAvailableFiles();
        } else {
            res.text().then(msg => alert("Error:" + msg));
        }
    })
    .catch(err => {
        console.error("Error per sending file:", err);
    })
})
