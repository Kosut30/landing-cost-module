from app import db


class Import(db.Model):
    __tablename__ = "imports"
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    supplier_name = db.Column(db.String(100), nullable=False)
    purchase_price = db.Column(db.Float, nullable=False)
    shipping_cost = db.Column(db.Float, nullable=False)
    import_duties = db.Column(db.Float, nullable=False)
    total_landing_cost = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    import_date = db.Column(db.DateTime, nullable=False)
