# **📸 Camagru - Instagram-like Photo Sharing App**

Welcome to **Camagru**, a photo-sharing application that lets you capture, edit, and share images, similar to Instagram! 🎉  
This app is built with **Next.js** for both the front-end and back-end, **Prisma** for database management, and **PostgreSQL** for data storage. It allows users to sign up, manage their accounts, upload images, and create photo montages with webcam images. 🎨📸

## 🛠️ **Features**
- **User Authentication**: Secure user login system using **credentials** (email and password). 🔐
- **Account Management**: Users can manage their account settings, such as updating email and password. ✏️
- **Image Upload**: Upload images to your account, which can be used as posts. 🖼️
- **Photo Montage**: Capture images via webcam, and create photo montages with features like adjusting the position, size, and rotation of the images. 📷
- **Image Storage**: Images are stored and managed in the database, ensuring each user’s posts are secure and easily accessible. 💾
- **Post Management**: Users can view their uploaded photos, and in future commits, features like **liking posts**, **commenting**, and **email verification** will be added. 👍💬
- **Responsive Design**: The app is fully responsive, ensuring a great user experience across different devices. 📱💻

## 🚀 **Technologies Used**
- **Next.js**: For full-stack rendering (React on the front-end and Node.js for API routes).
- **Prisma**: For managing the database and handling data migrations.
- **SQLite**: For local storing user data, images, and posts securely.
- **Authentication (NextAuth.js)**: Custom credentials-based authentication for secure user login and registration.
- **File Upload**: Secure handling and storage of image files for posts.
- **Webcam Integration (react-webcam)**: Capture images using the webcam with real-time manipulation (position, size, and rotation) for photo montages.

## 🧑‍💻 **What’s Coming Next**
In future commits, I plan to implement additional features such as:
- **Like System**: Users will be able to like posts they enjoy. ❤️
- **Commenting on Posts**: Users can comment on posts to share their thoughts. 💬
- **Email Verification**: An email verification system to ensure secure sign-ups. 📧
- **Forgot Password**: A system to recover passwords in case a user forgets them. 🔑
