// Provera privilegija ADMIN prilikom pristupanja ruta
// Ovo mi je ustvari middleware koji mi sluzi da blokira ako neko oce preko URL-a 
// da pristupi toj ruti i da kaze da nisam autorizovan za to
function requireAdmin(req, res, next) {
    console.log("Session data:", req.session.user);
    if (req.session && req.session.user && (req.session.user.role === "USER" || req.session.user.role === "ADMIN")) {
        console.log("User or Admin is loged in");
        next();
    } else {
        // Ako nije admin, možeš i da pošalješ HTML s alertom, ili JSON poruku
        res.status(403).send(`<script>alert('Nemate pristup ovoj stranici'); window.location.href='/loginPage.html';</script>`);
    }
}

module.exports = { requireAdmin };