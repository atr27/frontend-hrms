# HR Management System - Frontend

A modern, responsive frontend for the HR Management System built with React and Tailwind CSS.

## Features

- **Modern UI**: Clean and intuitive interface built with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Live data synchronization with backend
- **Role-based Access**: Different views based on user roles
- **State Management**: Efficient state management with Zustand
- **Form Validation**: Client-side validation for better UX

## Tech Stack

- **React 18**: Latest React features with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Zustand**: Lightweight state management
- **React Hook Form**: Performant form handling
- **React Hot Toast**: Beautiful notifications
- **Lucide React**: Modern icon library
- **date-fns**: Date formatting and manipulation
- **Vite**: Fast build tool and dev server

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd hr-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
hr-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── employees/
│   │   └── leaves/
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Employees.jsx
│   │   ├── Attendance.jsx
│   │   ├── Leaves.jsx
│   │   ├── Payroll.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── employeeService.js
│   │   ├── attendanceService.js
│   │   ├── leaveService.js
│   │   ├── payrollService.js
│   │   └── departmentService.js
│   ├── store/
│   │   └── authStore.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Key Features

### Authentication
- Secure login with JWT tokens
- Token refresh mechanism
- Protected routes
- Role-based access control

### Dashboard
- Overview metrics (total employees, attendance stats)
- Quick action buttons
- System status indicators

### Employee Management
- List all employees with pagination
- Search and filter functionality
- Add/Edit/Delete employees
- Department assignment

### Attendance Tracking
- Clock in/out interface
- Monthly attendance view
- Attendance reports
- Working hours calculation

### Leave Management
- Apply for leave
- View leave history
- Approve/reject leave requests
- Leave balance tracking

### Payroll
- View payroll records
- Generate monthly payroll
- Process payments
- Payroll summary dashboard

## Customization

### Tailwind Configuration
Edit `tailwind.config.js` to customize colors, fonts, and other design tokens:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### API Configuration
Update API endpoints in service files or modify the base URL in `.env`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
