
# Landing Cost Tracker

A web and mobile application to track the landing costs of imported products, built with **Flask** for the backend, **MySQL** for the database, and **Expo React Native** for the frontend. This application allows you to manage imports, analyze landing cost trends, and compare suppliers and product categories.

## Features

- **Imports Management**: Add new imports, view all imports.
- **Landing Cost Trends**: Track and visualize landing cost trends over time.
- **Analytics**: Compare suppliers, analyze product categories by total imports and average cost.
- **Floating Menu**: Quick access to app features on mobile and web.

## Tech Stack

- **Frontend**: Expo React Native, React Navigation
- **Backend**: Python Flask
- **Database**: MySQL
- **API**: RESTful API with Flask

---

## Backend Setup

### Prerequisites

- Python 3.11 
- MySQL 5.7 or higher

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Kosut30/landing-cost-module.git
   cd landing-cost-tracker
   ```

2. Create and activate a virtual environment (optional but recommended):

   ```bash
   py -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required Python dependencies:

   ```bash
   cd backend
   ```

   ```bash
   pip install -r requirements.txt
   ```

4. Configure the MySQL database:
   - Create a database named `landing_costs_db`.
   - Update the MySQL connection details in `app.py` if necessary.

5. Run the Flask application:

   ```bash
   py app.py
   ```

   The app will be available at `http://localhost:5000`.

---

## Frontend Setup

### Prerequisites

- Node.js (LTS version)
- Expo CLI

### Installation

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npx expo start
   ```

   The app will open in your default web browser or Expo app.

---

## API Endpoints

### Imports

- **GET /api/imports/**: Fetch all imports.
- **POST /api/imports/add**: Add a new import.
  - Required fields: `product_name`, `supplier_name`, `purchase_price`, `shipping_cost`, `import_duties`, `category`.
- **GET /api/imports/landing-cost-trend**: Get trends for total landing costs over time.

### Analytics

- **GET /api/supplier-comparison**: Compare suppliers by the total cost and number of imports.
- **GET /api/product-category-analysis**: Analyze product categories by the number of imports and average cost.

---

## Database Schema

### `imports` Table

| Column              | Type    |
|---------------------|---------|
| id                  | INT     |
| product_name        | VARCHAR |
| supplier_name       | VARCHAR |
| purchase_price      | DECIMAL |
| shipping_cost       | DECIMAL |
| import_duties       | DECIMAL |
| total_landing_cost  | DECIMAL |
| category            | VARCHAR |
| import_date         | DATE    |

---

## SQL Query for Imports Table

To create the `imports` table in your MySQL database, use the following SQL query:

```sql
CREATE TABLE `imports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) DEFAULT NULL,
  `supplier_name` varchar(100) DEFAULT NULL,
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `shipping_cost` decimal(10,2) DEFAULT NULL,
  `import_duties` decimal(10,2) DEFAULT NULL,
  `total_landing_cost` decimal(10,2) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `import_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

This table stores information about imports, including product details, costs, and the date of import.

---

## Frontend Components

### Components

- **Dashboard**: Displays the overall stats and navigation options.
- **Imports Management**: Manages imports (view and add).
- **Analytics**: Displays analytics on suppliers and product categories.
- **FloatingMenu**: Provides quick access to different sections of the app.

### Navigation

- `Dashboard` → View summary and navigate to other sections.
- `Imports Management` → Add and view imports.
- `Analytics` → View supplier and product category analytics.

---

## Authors
 
- **Ali** – Backend Developer and Deployment Specialist  
  Led the setup and maintenance of the Flask backend, ensuring reliable API functionality and handling staging deployments.
 
- **Chandra** – Database Architect and Deployment Lead  
  Designed the MySQL database schema and managed production deployment to ensure data integrity and performance.
 
- **Kenneth** – Full-Stack Developer  
  Developed backend APIs and integrated them with the frontend, bridging data processing and user interface.
 
- **Brenda** – Project Manager and QA Lead  
  Coordinated the project timeline in JIRA, organized sprint tasks, and led quality assurance efforts for system reliability.
 
- **Evans** – Frontend Integration Lead and UX Designer  
  Integrated backend APIs with the React Native frontend, ensuring a seamless user experience.
 
- **Jain** – UI/UX Designer  
  Designed a user-friendly, mobile-responsive interface for smooth interaction.
 
- **Lhap** – End-to-End Testing Specialist  
  Managed end-to-end testing to verify functionality across backend and frontend, ensuring system components worked harmoniously.

## Notes

- The backend uses **Flask** and **MySQL**. It handles CRUD operations for the imports and provides analytics for suppliers and product categories.
- The frontend uses **Expo React Native** for building a cross-platform mobile app, with **React Navigation** for routing.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
