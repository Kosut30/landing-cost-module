from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS

# Initialize MySQL at the top
mysql = MySQL()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # MySQL configuration
    app.config["MYSQL_USER"] = "evans"
    app.config["MYSQL_PASSWORD"] = "evans"
    app.config["MYSQL_DB"] = "landing_costs_db"
    app.config["MYSQL_HOST"] = "localhost"
    app.config["MYSQL_CURSORCLASS"] = "DictCursor"

    # Initialize MySQL with the app context
    mysql.init_app(app)

    # Import and register routes after MySQL is initialized
    from routes.imports import imports_blueprint
    from routes.analytics import analytics_blueprint

    app.register_blueprint(imports_blueprint, url_prefix="/api/imports")
    app.register_blueprint(analytics_blueprint, url_prefix="/api")

    # Route for serving the dashboard HTML
    @app.route("/")
    def index():
        return app.send_static_file("dashboard.html")

    @app.route("/analytics")
    def analytics():
        return app.send_static_file("analytics.html")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
