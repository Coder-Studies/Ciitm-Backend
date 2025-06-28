# CIITM Backend 🏫

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

**Central Institute of Information Technology and Management (CIITM) Backend API** - A comprehensive educational institute management system built with modern web technologies.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Google OAuth2 Integration** - Seamless login with Google accounts
- **JWT Token Authentication** - Secure token-based authentication
- **Role-based Access Control** - Admin, Teacher, and Student roles
- **Password Reset & Recovery** - Forgot password functionality

### 👥 User Management
- **Student Management** - Complete student profile and academic records
- **Teacher Management** - Faculty profiles and course assignments
- **Admin Dashboard** - Administrative controls and system management
- **Profile Management** - User profile updates and customization

### 📚 Academic Features
- **Course Management** - Create, update, and manage courses
- **Student Admissions** - Online admission process and tracking
- **Fee Management** - Student fee tracking and payment processing
- **Notice Board** - Announcements and important notifications

### 💳 Payment Integration
- **Razorpay Integration** - Secure online payment processing
- **Fee Payment Tracking** - Comprehensive payment history
- **Order Management** - Payment order creation and verification

### 📱 Real-time Features
- **Socket.io Integration** - Real-time notifications and updates
- **Live Chat Support** - Instant communication system
- **Real-time Dashboard** - Live data updates without refresh

### 🖼️ Media Management
- **Cloudinary Integration** - Cloud-based image and file storage
- **Album Management** - Photo galleries and media collections
- **File Upload System** - Secure file upload with validation
- **Image Optimization** - Automatic image compression and optimization

### 📧 Communication
- **Email System** - Automated email notifications
- **Contact Forms** - Student and visitor inquiry management
- **Newsletter System** - Bulk email communication
- **Social Media Integration** - Social platform connections

### 🛡️ Security & Performance
- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin resource sharing security
- **Input Validation** - Joi schema validation
- **Error Handling** - Comprehensive error management
- **Logging System** - Request and error logging with Pino

## 🛠️ Tech Stack

### Backend Framework
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **ES6 Modules** - Modern JavaScript module system

### Database
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling

### Authentication
- **JWT** - JSON Web Tokens
- **Google OAuth2** - Third-party authentication
- **bcryptjs** - Password hashing

### Real-time Communication
- **Socket.io** - WebSocket implementation
- **HTTP/HTTPS Server** - Dual protocol support

### Payment Processing
- **Razorpay** - Indian payment gateway
- **Stripe Ready** - International payment support

### File Storage
- **Cloudinary** - Cloud media management
- **Multer** - File upload middleware

### Email Services
- **Nodemailer** - Email sending capability
- **Gmail Integration** - SMTP configuration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Nodemon** - Development auto-restart
- **Babel** - JavaScript compiler

### Additional Features
- **TailwindCSS** - Utility-first CSS framework
- **Swagger** - API documentation
- **CRON Jobs** - Scheduled task execution
- **Pino Logger** - High-performance logging

## 📁 Project Structure

```
src/
├── api/v1/                    # API version 1 endpoints
│   ├── Admission/            # Student admission management
│   ├── Album/                # Photo album functionality
│   ├── Auth/                 # Authentication endpoints
│   ├── Contact/              # Contact form handling
│   ├── Course/               # Course management
│   ├── Dashboard/            # Dashboard data endpoints
│   ├── Email/                # Email templates and sending
│   ├── Fee/                  # Fee management system
│   ├── Image/                # Image upload and management
│   ├── Notice/               # Notice board system
│   ├── Role/                 # User role management
│   ├── Student/              # Student profile management
│   ├── Teacher/              # Teacher management
│   └── frontend/             # Frontend data endpoints
├── config/                   # Configuration files
│   ├── Db.config.mjs         # Database configuration
│   └── Socket/               # Socket.io configuration
├── constant/                 # Application constants
├── controllers/              # Business logic controllers
├── middleware/               # Custom middleware functions
├── models/                   # Database models
├── OAuth2Client/             # OAuth2 configuration
├── routes/                   # API route definitions
├── script/                   # Utility scripts
├── Service/                  # Business service layer
├── template/                 # Email templates
├── utils/                    # Utility functions
└── validation/               # Input validation schemas
```

## ⚙️ Requirements

- **Node.js** (version 18.x or higher)
- **npm** or **pnpm** (package manager)
- **MongoDB** (version 6.x or higher)
- **VS Code** (recommended IDE)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Ciitm-Backend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm (recommended):
```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development
isDevelopment=true
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URL=mongodb://localhost:27017/ciitm_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Configuration
GMAIL_User=your_email@gmail.com
GMAIL_Password=your_app_password

# Cloudinary Configuration
Cloudinary_Cloud_Name=your_cloud_name
Cloudinary_API_Key=your_api_key
Cloudinary_API_Secret=your_api_secret

# Payment Gateway
Razorpay_key=your_razorpay_key_id
Razorpay_secret=your_razorpay_secret
```

### 4. Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**Linux/macOS:**
```bash
sudo service mongod start
# or
brew services start mongodb-community
```

### 5. Generate SSL Certificates (Optional)

```bash
npm run genKey
```

### 6. Run the Application

**Development Mode:**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm start
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm start` | Start the production server |
| `pnpm run start:dev` | Start development server with auto-reload |
| `pnpm run lint` | Run ESLint for code quality |
| `pnpm run format` | Format code with Prettier |
| `pnpm run format:check` | Check code formatting |
| `pnpm run genKey` | Generate SSL certificates |
| `pnpm run tailwind:build` | Build Tailwind CSS |
| `pnpm test` | Run Jest tests |
| `pnpm run test:watch` | Run tests in watch mode |

## 🔧 API Endpoints

### 🔐 Authentication & Authorization
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/Admin/SignUp` - Admin registration
- `GET /api/auth/google/failure` - Google OAuth failure handler
- `POST /api/forgot/password` - Password reset request
- `POST /api/reset/password` - Password reset confirmation

### 👥 Role & Status Management
- `POST /api/v1/role/create` - Create admin role (Admin only)
- `GET /api/v1/status/find` - Find student status
- `PUT /api/v1/status/update/:uniqueId` - Update student status (Admin only)

### 🎓 Student Management
- `GET /api/find/StudentBy` - Find students by course and semester
- `POST /api/v1/online/admission` - Online student admission (with avatar upload)

### 📚 Course Management
- `POST /api/v1/admin/course/create` - Create new course (Admin only)
- `GET /api/v1/user/findAllCourse` - Get all courses
- `GET /api/v1/user/findCourseById/:id` - Get course by ID

### 👨‍🏫 Teacher Management
- `POST /api/v1/admin/teacher/create` - Create new teacher (Admin only)
- `GET /api/v1/user/findAllTeachers` - Get all teachers

### 📢 Notice Board
- `POST /api/v1/notice/create` - Create notice (Admin only, with document upload)
- `GET /api/v1/notice/find` - Get all notices

### 📞 Contact Management
- `POST /api/v1/contact/create` - Submit contact form
- `GET /api/v1/contact/admin/getContact` - Get contact submissions (Admin only)
- `DELETE /api/v1/contact/admin/deleteContact/:id` - Delete contact submission (Admin only)

### 📸 Album Management
- `POST /api/v1/admin/create/album` - Create photo album (Admin only, with image upload)
- `GET /api/v1/user/get/album` - Get all albums
- `DELETE /api/v1/admin/delete/album/:albumId` - Delete album (Admin only)

### 🖼️ Image Management
- `POST /api/v1/admin/create/image` - Upload image to album (Admin only)
- `GET /api/v1/user/get/Album/Image/:Album__Name` - Get images by album name
- `GET /api/v1/user/get/All/Image` - Get all images

### 🌐 Frontend Data
- `GET /api/v1/frontend` - Get frontend configuration data

### 🔗 Social Media & Testimonials
- `GET /api/link` - Get social media links
- `POST /api/create/testimonial` - Create testimonial (with image upload)
- `GET /api/find/testimonial` - Get all testimonials
- `DELETE /api/delete/testimonial/:id` - Delete testimonial

### 📋 API Structure Notes
- **Base URL**: All API endpoints are prefixed with `/api`
- **Version**: Most endpoints use `/v1/` versioning
- **Authentication**: Admin-only endpoints require JWT token authentication
- **File Uploads**: Many endpoints support file uploads using multipart/form-data
- **CORS**: Configured for specific frontend origins

### 🔒 Authentication Requirements
- **Admin Only**: Endpoints marked with "(Admin only)" require admin authentication
- **Public**: Endpoints without authentication markers are publicly accessible
- **Token**: JWT tokens can be passed via cookies or Authorization header

*Note: Some payment and fee management endpoints may be commented out in the current version. Check the codebase for the latest payment integration status.*

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm run test:watch
```

## 🔒 Security Features

- **CORS Protection** - Configured for specific origins
- **Rate Limiting** - Prevents API abuse
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Joi schema validation
- **Password Hashing** - bcryptjs encryption
- **HTTPS Ready** - SSL certificate generation

## 📊 Monitoring & Logging

- **Pino Logger** - High-performance logging
- **Request Logging** - All API requests logged
- **Error Tracking** - Comprehensive error logging
- **Performance Monitoring** - Response time tracking

## 🌐 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up Cloudinary for file storage
4. Configure email service
5. Set up payment gateway credentials

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection established
- [ ] SSL certificates generated
- [ ] Payment gateway tested
- [ ] Email service configured
- [ ] Cloudinary storage setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💝 Support

If you find this project helpful, please consider supporting it:

- ⭐ Star this repository
- 🐛 Report bugs and issues
- 💡 Suggest new features
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/abhishek96z)

## 📞 Contact

For any queries or support, please mail **abhishek.nexgen.dev@gmail.com**

This project is maintained by [abhishek-nexgen-dev](https://github.com/abhishek-nexgen-dev)

You can also:
- 📧 Send direct email for technical support
- 🐛 Create an issue in this repository for bug reports
- 💡 Submit feature requests via GitHub issues
- 📝 Reach out through the contact form on our website

---

**Built with ❤️ for the future of education technology in India**
