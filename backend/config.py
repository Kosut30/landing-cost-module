import os


class Config:
    MYSQL_USER = os.getenv("MYSQL_USER", "your_mysql_user")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "your_mysql_password")
    MYSQL_DB = os.getenv("MYSQL_DB", "landing_costs_db")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_CURSORCLASS = "DictCursor"
