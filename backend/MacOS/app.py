from flask import Flask, g
from flask_cors import CORS
import sqlite3

DATABASE = "landing_costs.db"


def get_db():
    """
    Opens a new database connection if there is none yet for the current application context.
    """
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row  # Enables dictionary-like access to rows
    return db


def close_db(error=None):
    """
    Closes the database connection at the end of the request.
    """
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Use SQLite as the database
    app.teardown_appcontext(close_db)

    # Import and register routes
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
    app.run(host="0.0.0.0", port=5050, debug=True)
