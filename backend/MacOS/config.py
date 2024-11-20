from app import create_app, db
from sqlalchemy.sql import text


def load_data_from_file(sql_file_path):
    """
    Function to execute SQL statements from a file.
    """
    with open(sql_file_path, "r") as file:
        sql_statements = file.read()

    with app.app_context():
        for statement in sql_statements.split(";"):
            # Ignore empty or whitespace-only statements
            if statement.strip():
                try:
                    print(
                        f"Executing SQL: {statement.strip()[:100]}..."
                    )  # Log first 100 chars of each statement
                    db.session.execute(
                        text(statement.strip())
                    )  # Use text() for raw SQL
                except Exception as e:
                    print(f"Error executing statement: {statement.strip()[:100]}...")
                    print(f"Error: {e}")
                    raise e  # Re-raise the exception after logging
        db.session.commit()
        print("Data from INSERT.sql loaded successfully!")


if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        # Create all tables
        db.create_all()
        print("Tables created successfully!")

        # Load data from INSERT.sql (one directory back)
        load_data_from_file("../INSERT.sql")
