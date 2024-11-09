from flask import Blueprint, request, jsonify
from app import mysql

# Create a blueprint for imports-related routes
imports_blueprint = Blueprint("imports", __name__)


# Route to get all imports
@imports_blueprint.route("/", methods=["GET"])
def get_imports():
    try:
        # Open a cursor
        cur = mysql.connection.cursor()

        # Execute the query
        cur.execute("SELECT * FROM imports")
        data = cur.fetchall()

        # Close the cursor
        cur.close()

        # Check if data exists
        if not data:
            return jsonify({"message": "No imports found"}), 404

        return jsonify(data), 200

    except Exception as e:
        # Print the specific error to the Flask log
        print(f"Error fetching imports: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


# Route to get the 5 most recent imports sorted by import_date (Descending)
@imports_blueprint.route("/recent", methods=["GET"])
def get_recent_imports():
    try:
        # Open a cursor
        cur = mysql.connection.cursor()

        # Execute the query to fetch the 5 most recent imports sorted by import_date in descending order
        cur.execute(
            """
            SELECT * FROM imports
            ORDER BY import_date DESC
            LIMIT 10
        """
        )
        data = cur.fetchall()

        # Close the cursor
        cur.close()

        # Check if data exists
        if not data:
            return jsonify({"message": "No recent imports found"}), 404

        return jsonify(data), 200

    except Exception as e:
        # Print the specific error to the Flask log
        print(f"Error fetching recent imports: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


# Route to add a new import
@imports_blueprint.route("/add", methods=["POST"])
def add_import():
    try:
        # Get JSON data from request
        data = request.get_json()

        # Validate required fields
        required_fields = [
            "product_name",
            "supplier_name",
            "purchase_price",
            "shipping_cost",
            "import_duties",
            "category",
        ]
        for field in required_fields:
            if field not in data or data[field] == "":
                return jsonify({"error": f"Missing or empty field: {field}"}), 400

        # Extract fields
        product_name = data["product_name"]
        supplier_name = data["supplier_name"]
        purchase_price = float(data["purchase_price"])
        shipping_cost = float(data["shipping_cost"])
        import_duties = float(data["import_duties"])
        total_landing_cost = purchase_price + shipping_cost + import_duties
        category = data["category"]

        # Insert into the database
        cur = mysql.connection.cursor()
        cur.execute(
            """
            INSERT INTO imports (product_name, supplier_name, purchase_price, shipping_cost, import_duties, total_landing_cost, category)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                product_name,
                supplier_name,
                purchase_price,
                shipping_cost,
                import_duties,
                total_landing_cost,
                category,
            ),
        )

        # Commit the transaction and close the cursor
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Import added successfully!"}), 201

    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400

    except ValueError:
        return (
            jsonify(
                {
                    "error": "Invalid input. Numeric values expected for price, shipping cost, and import duties."
                }
            ),
            400,
        )

    except Exception as e:
        print(f"Error adding import: {e}")
        return jsonify({"error": "Internal server error"}), 500


# Route to get landing cost trends
@imports_blueprint.route("/landing-cost-trend", methods=["GET"])
def get_landing_cost_trend():
    try:
        # Open a cursor
        cur = mysql.connection.cursor()

        # Query to get total landing costs grouped by import date
        cur.execute(
            """
            SELECT DATE(import_date) as date, SUM(total_landing_cost) as total_cost 
            FROM imports 
            GROUP BY DATE(import_date) 
            ORDER BY DATE(import_date)
        """
        )
        data = cur.fetchall()

        # Close the cursor
        cur.close()

        # Check if data exists
        if not data:
            return jsonify({"message": "No landing cost trends found"}), 404

        return jsonify(data), 200

    except Exception as e:
        print(f"Error fetching landing cost trends: {e}")
        return jsonify({"error": "Internal server error"}), 500


@imports_blueprint.route("/test-db", methods=["GET"])
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT DATABASE();")
        result = cur.fetchone()
        return jsonify({"database": result}), 200
    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({"error": f"Database connection error: {str(e)}"}), 500
