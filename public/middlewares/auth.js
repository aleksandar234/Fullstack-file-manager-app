// Provera privilegija ADMIN prilikom pristupanja ruta
// Ovo mi je ustvari middleware koji mi sluzi da blokira ako neko oce preko URL-a 
// da pristupi toj ruti i da kaze da nisam autorizovan za to
function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === "ADMIN") {
        next();
    } else {
        // Ako nije admin, možeš i da pošalješ HTML s alertom, ili JSON poruku
        res.status(403).send(`<script>alert('Nemate pristup ovoj stranici'); window.location.href='/loginPage.html';</script>`);
    }
}

module.exports = { requireAdmin };