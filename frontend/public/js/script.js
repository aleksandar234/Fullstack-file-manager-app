// // const { response } = require("express");



// function showTab(tab_id) {
//     // Ovo selektuje sve HTML elemente koji imaju klasu .tab-content (document.querySelectorAll(".tab-content"))
//     // skida CSS klasu active sa tog elementa ((element.classList.remove("active")) efekat ovoga je da se taj CSS sadrzaj sakrije jer u CSS-u imam nesto nalik ovome (.tab-content.active{display: block})
//     document.querySelectorAll(".tab-content").forEach((element) => element.classList.remove("active"));

//     // Znaci u susutini sta se desava je sledece: posto vidimo da u nasem secondPage.html imamo ove klase
//     // .tab i .tab-content i imamo koji su nam aktivni i koji ne, ono sto radimo ovde i gore je sledece
//     // uzimamo sve klase koje su oznacene sa .tab i tab-content (to su i one koje imaju active na kraju)
//     // i kazemo za sve njih da nam uklone active da nam se nista ne prikazuje, ovim putem mi mozemo da odredimo
//     // sta ce prvo da nam se prikaze
//     document.querySelectorAll(".tab").forEach((element) => element.classList.remove("active"));

//     //sad zelimo da prikazemo izabrani tab sadrzaj
//     document.getElementById(tab_id).classList.add("active");

//     // sad treba da nadjemo koje tab dugme sadrzi text koji odgovara id-ju i njega aktivirati
//     const tabButton = Array.from(document.querySelectorAll(".tab")).find((tab) =>
//         tab.textContent.toLowerCase().includes(tab_id)
//     );

//     // sad kad smo nasli trazeno dugme kazemo da mu aktiviramo content tj. da bude vidljivo
//     tabButton.classList.add("active");

// }




// // Kada korisnik izabere fajl, prikazujemo ga kao preview
// document.getElementById("fileInput").addEventListener("change", function (e) {
//     const file = e.target.files[0];
//     const previewButton = document.getElementById("previewButton");
//     const submitButton = document.getElementById("submitButton");
//     const selectedFileName = document.getElementById("selected-file-name");
//     // const downloadButton = document.getElementById("downlaodFileButton");

//     if (file) {
//         previewButton.disabled = false;
//         submitButton.disabled = false;
//         // console.log(file.display)
//         const reader = new FileReader();
//         selectedFileName.textContent = `Choosen file: ${file.fileName}`

//         // Ako fajl postoji, sto znaci da je korisnik kliknuo na neki fajl
//         // onda moram da dohvatim njegovu rolu i da pitam koja je rola
//         // na osnovu toga cu da mu dam da disable-uje download dugme ili ne


//         reader.readAsDataURL(file);

//         // Ako fajl nije slika onda prikazujemo samo ime fajla
//         document.getElementById("previewImage").style.display = "none";
//         previewButton.textContent = `Preview: ${file.name}`; // Prikazuje ime fajla


//     } else {
//         previewButton.disabled = true;
//         submitButton.disabled = true;
//         // downloadButton.disabled = true;
//     }

// })

// // Kada korisnik klikne na dugme "Pregledaj", otvorimo fajl (ako je slika)
// document.getElementById("previewButton").addEventListener("click", function () {
//     const file = document.getElementById("fileInput").files[0];

//     if (file) {
//         const reader = new FileReader();
//         const newTab = window.open();

//         // Kada zavrsi citanje fajla
//         reader.onload = function (event) {
//             const fileUrl = event.target.result;
//             // Proveri da li je slika
//             if (file.type.startsWith("image/")) {
//                 const imgElement = document.createElement("img");
//                 imgElement.src = fileUrl;
//                 imgElement.style.maxWidth = "100%";
//                 imgElement.style.height = "auto";
//                 newTab.document.body.appendChild(imgElement);
//                 // Ovo je alternativa ali je zastarelo i losa je i nebezbedno, na primer ako pozovemo
//                 // document.write() nakon ucitavanja stranice, cela stranica moze biti resetovana i sadrzaj moze nestati,
//                 // jer document.write() ponovo ucitava dokument.
//                 // newTab.document.write('<html><body><img src="' + fileUrl + '" alt="Preview"style="max-width:100%; height:auto;"></body></html>');

//                 // Ovo je ako je PDF
//             } else if (file.type === "application/pdf") {
//                 const embedElement = document.createElement("embed");
//                 embedElement.src = fileUrl;
//                 embedElement.type = "application/pdf";
//                 embedElement.width = "100%";
//                 embedElement.height = "100%";
//                 newTab.document.body.appendChild(embedElement);
//             } else {
//                 alert(`Fajl ${file.name} nije slika jer nema extenziju .jpg`)
//             }
//         }

//         reader.readAsDataURL(file);

//     } else {
//         alert("Nijedan fajl nije izabran");
//     }
// })



// document.addEventListener("DOMContentLoaded", () => {
//     showAllAvailableFiles();
// })

// document.addEventListener("DOMContentLoaded", function () {
//     const logoutButton = document.getElementById("logoutButton");
//     const downloadTab = document.getElementById("downloadTab");
//     const uploadTab = document.getElementById("uploadTab");

//     // Logout dugme
//     // "logout"
//     if (logoutButton) {
//         logoutButton.addEventListener("click", function () {
//             fetch("http://localhost:3000/logout", { method: "POST" })
//                 .then(() => {
//                     window.location.href = "/views/loginPage.html";
//                 })
//                 .catch(err => console.error("Logout failed:", err));
//         });
//     }

//     // Tab za Download
//     if (downloadTab) {
//         downloadTab.addEventListener("click", function () {
//             showTab('download');
//         });
//     }

//     // Tab za Upload
//     if (uploadTab) {
//         uploadTab.addEventListener("click", function () {
//             showTab('upload');
//         });
//     }
// });




// // Dohvata mi sve fajlove u bazi podataka i prikazuje mi delu "Available files"
// //"http://localhost:3000/documents"
// function showAllAvailableFiles() {
//     fetch('http://localhost:3000/documents')
//         .then(response => response.json())
//         .then(files => {
//             const container = document.getElementById("file-list");
//             container.innerHTML = ""; // ciscenje prethodnog  sadrzaja

//             files.forEach(file => {
//                 const fileName = file.fileName;
//                 const fileElement = document.createElement("li");
//                 fileElement.textContent = fileName;
//                 const previewFileButton = document.getElementById("showFileButton")
//                 fileElement.addEventListener("click", async () => {
//                     document.getElementById("selected-file-name").textContent = `Choosen file: ${fileName}`;
//                     // Omogucivanje dugmica
//                     const previewButton = document.getElementById("showFileButton");
//                     const downloadButton = document.getElementById("downlaodFileButton");
//                     previewFileButton.textContent = `Preview: ${fileName}`;

//                     if (file) {
//                         previewButton.disabled = false;
//                         downloadButton.disabled = false;
//                         try {
//                             // /session
//                             const response = await fetch("http://localhost:3000/session");
//                             if (!response.ok) {
//                                 throw new Error("Not authenticated");
//                             }
//                             const user = await response.json();
//                             const role = user.role;

//                             // const fileType = file.type;
//                             const extension = fileName.split('.').pop().toLowerCase();

//                             let fileType = '';
//                             if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
//                                 fileType = 'image';
//                             } else if (extension === 'pdf') {
//                                 fileType = 'application/pdf';
//                             } else {
//                                 fileType = 'other';
//                             }
//                             // console.log("FT: ", fileType);
//                             // console.log("ROLE:", role);
//                             if (role === "ADMIN") {
//                                 downloadButton.disabled = false;
//                             } else if (role === "USER") {
//                                 if (fileType === "image") {
//                                     downloadButton.disabled = false;
//                                 } else if (fileType === "application/pdf") {
//                                     downloadButton.disabled = true;
//                                 } else {
//                                     downloadButton.disabled = true;
//                                 }
//                             } else {
//                                 downloadButton.disabled = true;
//                             }
//                         } catch (err) {
//                             console.error("Error fetching user role: ", err);
//                             downloadButton.disabled = true;
//                         }
//                     }

//                 })


//                 container.appendChild(fileElement);
//             })
//         })
//         .catch(err => {
//             console.error("Greska pri dohvatanju fajlova:", err);
//         })
// }

// // Ovo je deo za download file-a sa servera na moj lokalni uredjaj (telefon, racunar)
// // Kratak opis ove funkcije:
// // Klik na dugme -> dohvatanje svih fajlova sa servera -> pronalazenje fajla koji je korisnik izabrao
// // -> Od bajtova napravim Blob (pravi fajl u memoriji) -> kreiram privremeni URL do tog fajla
// // -> napravim tag <a> i kliknem na njega (Browser preuzi fajl) -> ocistimo privremeni URL iz memorije
// document.getElementById("downlaodFileButton").addEventListener("click", () => {
//     const selectedFileName = document.getElementById("selected-file-name").textContent.replace("Choosen file: ", "");
//     console.log(selectedFileName);

//     //http://localhost:3000/documents
//     fetch('http://localhost:3000/documents')
//         .then(response => response.json())
//         .then(files => {
//             const file = files.find(f => f.fileName === selectedFileName);

//             if (!file) {
//                 alert("File not found");
//                 return;
//             }

//             const arrayBuffer = new Uint8Array(file.fileData.data);
//             const blob = new Blob([arrayBuffer], { type: file.fileType });

//             const downloadUrl = URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = downloadUrl;
//             a.download = file.fileName; // ovde postavljamo da kada kliknem download dugme, da se fajl isto zove kao i u bazi
//             // Ovaj deo smo stavili jer <a> mora da bude deo DOM-a inace u nekim browserima klik nece imati efekta
//             // ovim document.body.appendChild ja njega stavljam da on bude deo DOM-a i samim tim i klik na dugme je uspesan
//             document.body.appendChild(a); // ubacim a u DOM
//             a.click(); // simuliram klik na njega (browser pokrece download)
//             document.body.removeChild(a); // odmah ga brisem (cistim DOM)

//             URL.revokeObjectURL(downloadUrl); // Cisti memoriju
//         })
//         .catch(err => {
//             console.error("Error per getting file for download: ", err);
//         })
// })

// // Ovo je preview za Download deo
// document.getElementById("showFileButton").addEventListener("click", () => {

//     //http://localhost:3000/documents
//     fetch('http://localhost:3000/documents')
//         .then(response => response.json())
//         .then(files => {
//             files.forEach(file => {
//                 if (file.fileName === document.getElementById("showFileButton").textContent.replace("Preview: ", "")) {
//                     console.log(file.fileData);
//                     const arrayBuffer = new Uint8Array(file.fileData.data);
//                     const blob = new Blob([arrayBuffer], { type: file.fileType });

//                     // Kreiraj URL za Blob
//                     const fileUrl = URL.createObjectURL(blob);

//                     const newTab = window.open();
//                     if (!newTab) {
//                         alert("Popup blokiran! Dozvoli popupe.");
//                         return;
//                     }

//                     console.log(newTab);

//                     if (file.fileType.startsWith("image/")) {
//                         const imgElement = newTab.document.createElement("img");
//                         imgElement.src = fileUrl;
//                         imgElement.style.maxWidth = "100%";
//                         imgElement.style.height = "auto";
//                         newTab.document.body.appendChild(imgElement);
//                     } else if (file.fileType === "application/pdf") {
//                         const embedElement = newTab.document.createElement("embed");
//                         embedElement.src = fileUrl;
//                         embedElement.type = "application/pdf";
//                         embedElement.width = "100%";
//                         embedElement.height = "100%";
//                         newTab.document.body.appendChild(embedElement);
//                     } else {
//                         newTab.document.body.innerHTML = `<p>Preview za ovaj tip fajla nije podržan.</p>`;
//                     }
//                 }
//             })
//         })
//         .catch(err => {
//             console.error("Greska pri dohvatanju fajla:", err);
//         })
// })


// // Za Upload deo nakon sto kliknem submit zelim da mi se pozove funkcija za dohvatanje svih fajlove iz baze
// // radi za lokal: https://fullstack-file-manager-app-production.up.railway.app/upload
// //http://localhost:3000/upload
// document.getElementById("uploadForm").addEventListener("submit", (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     //http://localhost:3000/upload
//     //https://fullstack-file-manager-app.onrender.com
//     fetch("http://localhost:3000/upload", {
//         method: "POST",
//         body: formData,
//     })
//         .then(res => {
//             if (res.ok) {
//                 alert("Fajl successfully uplaoded");
//                 showAllAvailableFiles();
//             } else {
//                 res.text().then(msg => alert("Error:" + msg));
//             }
//         })
//         .catch(err => {
//             console.error("Error per sending file:", err);
//         })
// })

// "/logout"
// function logout() {
//     fetch('http://localhost:3000/logout', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     })
//         .then(response => {
//             if (response.ok) {
//                 window.location.href = '/views/loginPage.html';
//             } else {
//                 alert("Error logging in");
//             }
//         })
//         .catch(error => {
//             console.error("Error: ", error);
//         })
// }

const API_BASE =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? `http://${window.location.hostname}:3000`
        : `http://${window.location.hostname}:3001`;

function showTab(tab_id) {
    document.querySelectorAll(".tab-content").forEach((element) => element.classList.remove("active"));
    document.querySelectorAll(".tab").forEach((element) => element.classList.remove("active"));

    document.getElementById(tab_id).classList.add("active");

    const tabButton = Array.from(document.querySelectorAll(".tab")).find((tab) =>
        tab.textContent.toLowerCase().includes(tab_id)
    );

    if (tabButton) {
        tabButton.classList.add("active");
    }
}

async function checkSession() {
    try {
        const response = await fetch(`${API_BASE}/session`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            alert("Morate prvo da se ulogujete");
            window.location.href = "/views/loginPage.html";
            return;
        }

        const user = await response.json();
        console.log("Ulogovan korisnik:", user);
    } catch (error) {
        console.error("Greska pri proveri sesije:", error);
        window.location.href = "/views/loginPage.html";
    }
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

        selectedFileName.textContent = `Choosen file: ${file.name}`;

        document.getElementById("previewImage").style.display = "none";
        previewButton.textContent = `Preview: ${file.name}`;
    } else {
        previewButton.disabled = true;
        submitButton.disabled = true;
    }
});

// Kada korisnik klikne na dugme "Pregledaj", otvorimo fajl (ako je slika)
document.getElementById("previewButton").addEventListener("click", function () {
    const file = document.getElementById("fileInput").files[0];

    if (file) {
        const reader = new FileReader();
        const newTab = window.open();

        if (!newTab) {
            alert("Popup blokiran! Dozvoli popupe.");
            return;
        }

        reader.onload = function (event) {
            const fileUrl = event.target.result;

            if (file.type.startsWith("image/")) {
                const imgElement = document.createElement("img");
                imgElement.src = fileUrl;
                imgElement.style.maxWidth = "100%";
                imgElement.style.height = "auto";
                newTab.document.body.appendChild(imgElement);
            } else if (file.type === "application/pdf") {
                const embedElement = document.createElement("embed");
                embedElement.src = fileUrl;
                embedElement.type = "application/pdf";
                embedElement.width = "100%";
                embedElement.height = "100%";
                newTab.document.body.appendChild(embedElement);
            } else {
                alert(`Fajl ${file.name} nije podrzan za preview`);
            }
        };

        reader.readAsDataURL(file);
    } else {
        alert("Nijedan fajl nije izabran");
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    await checkSession();
    showAllAvailableFiles();

    const logoutButton = document.getElementById("logoutButton");
    const downloadTab = document.getElementById("downloadTab");
    const uploadTab = document.getElementById("uploadTab");

    if (logoutButton) {
        logoutButton.addEventListener("click", async function () {
            try {
                const response = await fetch(`${API_BASE}/logout`, {
                    method: "POST",
                    credentials: "include"
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = "/views/loginPage.html";
                } else {
                    alert(data.message || "Logout failed");
                }
            } catch (err) {
                console.error("Logout failed:", err);
            }
        });
    }

    if (downloadTab) {
        downloadTab.addEventListener("click", function () {
            showTab("download");
        });
    }

    if (uploadTab) {
        uploadTab.addEventListener("click", function () {
            showTab("upload");
        });
    }
});

// Dohvata mi sve fajlove u bazi podataka i prikazuje mi delu "Available files"
function showAllAvailableFiles() {
    fetch(`${API_BASE}/documents`, {
        credentials: "include"
    })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Greska pri dohvatanju fajlova");
            }
            return response.json();
        })
        .then(files => {
            const container = document.getElementById("file-list");
            container.innerHTML = "";

            files.forEach(file => {
                const fileName = file.fileName;
                const fileElement = document.createElement("li");
                fileElement.textContent = fileName;
                const previewFileButton = document.getElementById("showFileButton");

                fileElement.addEventListener("click", async () => {
                    document.getElementById("selected-file-name").textContent = `Choosen file: ${fileName}`;

                    const previewButton = document.getElementById("showFileButton");
                    const downloadButton = document.getElementById("downlaodFileButton");
                    previewFileButton.textContent = `Preview: ${fileName}`;

                    if (file) {
                        previewButton.disabled = false;
                        downloadButton.disabled = false;

                        try {
                            const response = await fetch(`${API_BASE}/session`, {
                                credentials: "include"
                            });

                            if (!response.ok) {
                                throw new Error("Not authenticated");
                            }

                            const user = await response.json();
                            const role = user.role;

                            const extension = fileName.split(".").pop().toLowerCase();

                            let fileType = "";
                            if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
                                fileType = "image";
                            } else if (extension === "pdf") {
                                fileType = "application/pdf";
                            } else {
                                fileType = "other";
                            }

                            if (role === "ADMIN") {
                                downloadButton.disabled = false;
                            } else if (role === "USER") {
                                if (fileType === "image") {
                                    downloadButton.disabled = false;
                                } else {
                                    downloadButton.disabled = true;
                                }
                            } else {
                                downloadButton.disabled = true;
                            }
                        } catch (err) {
                            console.error("Error fetching user role: ", err);
                            downloadButton.disabled = true;
                        }
                    }
                });

                container.appendChild(fileElement);
            });
        })
        .catch(err => {
            console.error("Greska pri dohvatanju fajlova:", err);
        });
}

// Download fajla
document.getElementById("downlaodFileButton").addEventListener("click", () => {
    const selectedFileName = document.getElementById("selected-file-name").textContent.replace("Choosen file: ", "");
    console.log(selectedFileName);

    fetch(`${API_BASE}/documents`, {
        credentials: "include"
    })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Greska pri dohvatanju fajlova");
            }
            return response.json();
        })
        .then(files => {
            const file = files.find(f => f.fileName === selectedFileName);

            if (!file) {
                alert("File not found");
                return;
            }

            const arrayBuffer = new Uint8Array(file.fileData.data);
            const blob = new Blob([arrayBuffer], { type: file.fileType });

            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = file.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(downloadUrl);
        })
        .catch(err => {
            console.error("Error per getting file for download: ", err);
        });
});

// Preview za Download deo
document.getElementById("showFileButton").addEventListener("click", () => {
    fetch(`${API_BASE}/documents`, {
        credentials: "include"
    })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Greska pri dohvatanju fajlova");
            }
            return response.json();
        })
        .then(files => {
            files.forEach(file => {
                if (file.fileName === document.getElementById("showFileButton").textContent.replace("Preview: ", "")) {
                    const arrayBuffer = new Uint8Array(file.fileData.data);
                    const blob = new Blob([arrayBuffer], { type: file.fileType });

                    const fileUrl = URL.createObjectURL(blob);

                    const newTab = window.open();
                    if (!newTab) {
                        alert("Popup blokiran! Dozvoli popupe.");
                        return;
                    }

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
            });
        })
        .catch(err => {
            console.error("Greska pri dohvatanju fajla:", err);
        });
});

// Upload fajla
document.getElementById("uploadForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch(`${API_BASE}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
    })
        .then(async res => {
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                alert(data.message || "Fajl successfully uploaded");
                showAllAvailableFiles();
            } else {
                alert(data.message || "Error while uploading file");
            }
        })
        .catch(err => {
            console.error("Error per sending file:", err);
        });
});