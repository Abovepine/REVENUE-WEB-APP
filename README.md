# Web App Dark Mode

This project is a simple web application that features a dark mode UI with a table displaying sample data. The application allows users to select multiple rows using Shift + Click and navigate through the rows using the arrow keys. Each row includes a revenue tab for easy access to financial information.

## Project Structure

```
web-app-dark-mode
├── src
│   ├── assets
│   │   ├── styles.css        # Contains CSS styles for dark mode and table layout
│   │   └── script.js         # JavaScript functionality for row selection and navigation
│   ├── components
│   │   └── table.html        # HTML structure for the table with sample data
│   └── index.html            # Main entry point linking CSS and JS files
├── package.json               # Configuration file for npm
└── README.md                  # Documentation for the project
```

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies by running:
   ```
   npm install
   ```
4. Open `src/index.html` in your web browser to view the application.

## Usage

- Use Shift + Click to select multiple rows in the table.
- Navigate through the selected rows using the Up and Down arrow keys.
- Each row displays a revenue tab that can be updated as needed.

## License

This project is licensed under the MIT License.