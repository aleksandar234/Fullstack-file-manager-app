function prikazSlika() {
    const imageContainer = document.getElementById('image-container');
    console.log(imageContainer);

    if (!imageContainer) {
        console.error("Element sa ID 'image-container' nije pronadjen.");
        return;
    }

    //Pozivamo API za dobijanje svih slika
    fetch('http://localhost:3000/documents')
        .then(response =>{
                console.log("Response  iz /documents:", response);
                return response.json();
            }
        )
        .then(files => {
            files.forEach(file => {
                // pretvaranje binarnih podataka u sliku
                const byteArray = file.fileData.data;
                const base64Data = arrayBufferToBase64(byteArray);
                const imageUrl = `data:${file.fileType};base64,${base64Data}`;

                // kreiramo element za sliku
                const imageItem = document.createElement('div');
                imageItem.classList.add('image-item');
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = file.fileName;

                // Dodavanje slike u container
                imageItem.appendChild(img);
                imageContainer.appendChild(imageItem);

            })
        })
        .catch(error => {
            console.error('Doslo je do greske pri ucitavanju slike:', error)
        })
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM je ucitan");
    const intervalId = setInterval(function () {
        const imageContainer = document.getElementById('image-container');

        if (imageContainer) {
            console.log("Element sa ID 'image-container' je pronađen");
            prikazSlika(); // Pokrećemo funkciju za prikazivanje slika
            clearInterval(intervalId); // Zaustavljamo interval
        }
    }, 100); // Proveravaćemo svakih 100 milisekundi
})

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
