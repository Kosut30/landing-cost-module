from flask import Blueprint, jsonify
from app import mysql

analytics_blueprint = Blueprint("analytics", __name__)


# Supplier Comparison Endpoint
@analytics_blueprint.route("/supplier-comparison", methods=["GET"])
def supplier_comparison():
    try:
        cur = mysql.connection.cursor()

        # Query to get total cost and number of imports by supplier
        query = """
            SELECT supplier_name, COUNT(*) AS number_of_imports, SUM(total_landing_cost) AS total_cost
            FROM imports
            GROUP BY supplier_name
        """
        cur.execute(query)
        result = cur.fetchall()

        # Check if the result is empty
        if not result:
            return jsonify({"error": "No data found"}), 404

        cur.close()

        # Return the result as JSON
        return jsonify(result), 200

    except Exception as e:
        # Print the error for debugging
        print(f"Error fetching supplier comparison: {e}")
        return jsonify({"error": "Internal server error"}), 500


# Product Category Analysis Endpoint
@analytics_blueprint.route("/product-category-analysis", methods=["GET"])
def product_category_analysis():
    try:
        cur = mysql.connection.cursor()

        # Query to get the average cost and total imports by category
        query = """
            SELECT category, COUNT(*) AS total_imports, AVG(total_landing_cost) AS average_cost
            FROM imports
            GROUP BY category
        """
        cur.execute(query)
        result = cur.fetchall()

        # Check if the result is empty
        if not result:
            return jsonify({"error": "No data found"}), 404

        cur.close()

        # Return the result as JSON
        return jsonify(result), 200

    except Exception as e:
        # Print the error for debugging
        print(f"Error fetching product category analysis: {e}")
        return jsonify({"error": "Internal server error"}), 500
