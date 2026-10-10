from flask import Flask, request, render_template, abort, make_response
import requests
import logging

app = Flask(__name__)

# Activer les logs pour voir les requêtes
logging.basicConfig(level=logging.DEBUG)


# ✅ "Visualizer" qui permet de voir les sites sans y aller (SSRF exploit possible)
@app.route("/visualizer", methods=["GET", "POST"])
def visualizer():
    if request.method == "POST":
        url = request.form.get("url")  # L'utilisateur entre une URL

        try:
            if not url.startswith(("http://", "https://")):
                url = "http://" + url  # Ajouter http:// par défaut

            headers = {"User-Agent": "IntraCorp-Visualizer-Bot"}  # Identification SSRF
            response = requests.get(url, timeout=5, headers=headers)  

            logging.debug(f"Visualizer a demandé {url} | Réponse HTTP: {response.status_code}")

            # ✅ Si la requête cible un service interne (localhost), on affiche le HTML brut
            if "localhost:5050" in url or "127.0.0.1:5050" or "host.docker.internal:5050" in url:
                return f"<h3>Résultat de {url} :</h3><pre>{response.text}</pre>"

            # Vérifier si on peut charger l'iframe
            if "X-Frame-Options" in response.headers or "frame-ancestors" in response.headers:
                return render_template("preview.html", iframe_url=None, html_content=response.text, error=None)

            return render_template("preview.html", iframe_url=url, html_content=None, error=None)

        except Exception as e:
            return render_template("preview.html", iframe_url=None, html_content=None, error=str(e))

    return render_template("visualizer.html")

# ✅ Fonction dynamique pour créer les routes protégées
def create_protected_route(route_name):
    def protected_page():
        client_ip = request.remote_addr  
        user_agent = request.headers.get("User-Agent")

        logging.debug(f"Accès à /{route_name} | IP: {client_ip} | User-Agent: {user_agent}")

        # 🔥 Si la requête vient du Visualizer (SSRF), on affiche la page correspondante
        if user_agent == "IntraCorp-Visualizer-Bot" or client_ip == "127.0.0.1":
            response = make_response(render_template(f"{route_name}.html", page_name=route_name))
            response.headers["Content-Type"] = "text/html"
            return response

        # ❌ Accès direct interdit (403)
        return make_response(render_template("403.html"), 403)

    protected_page.__name__ = f"protected_{route_name}"  # Nom unique pour chaque fonction
    return protected_page

# ✅ Ajout des routes protégées dynamiquement
protected_routes = ["dashboard", "news", "settings", "marketing", "finance", "backup", "api"]
for route in protected_routes:
    app.route(f"/{route}")(create_protected_route(route))

# ✅ Route /private (Protégée mais trouvable via SSRF)
@app.route("/private")
def private():
    client_ip = request.remote_addr  
    user_agent = request.headers.get("User-Agent")

    logging.debug(f"Accès à /private | IP: {client_ip} | User-Agent: {user_agent}")

    # 🔥 Si la requête vient du Visualizer (SSRF), on affiche secret.html
    if user_agent == "IntraCorp-Visualizer-Bot" or client_ip == "127.0.0.1":
        response = make_response(render_template("secret.html"))
        response.headers["Content-Type"] = "text/html"
        return response

    # ❌ Accès direct interdit (403)
    return make_response(render_template("403.html"), 403)

# ✅ Gestion personnalisée des erreurs 403
@app.errorhandler(403)
def forbidden_page(error):
    return make_response(render_template("403.html"), 403)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)  # Active debug pour voir les logs
