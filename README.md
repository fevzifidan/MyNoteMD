# MyNoteMD

MyNoteMD is a feature-rich Markdown note management system that allows users to save notes in an extended Markdown format and organize those notes by creating collections.

## 🛠 Backend Tech Stack

*   **Runtime:** .NET 10
*   **Database:** PostgreSQL (Entity Framework Core)
*   **Session Management:** Redis (Opaque Tokens)
*   **Security:** Identity Core, HttpOnly Cookies, Antiforgery Tokens (CSRF Protection)
*   **Logging:** Serilog
*   **API Design and Documentation:** OpenAPI
*   **ID Preference:** UUIDv7

## 🛠 Frontend Tech Stack
- **Framework:** [React.js](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Yup](https://github.com/jquense/yup)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

## ✨ Key Features

### 🔐 Session Management and Session Security
-   **Opaque Token & Redis:** **Opaque Tokens** are used for main session management. All sessions are managed on Redis, allowing for instant session termination.
-   **HttpOnly Cookies:** Tokens are stored in `HttpOnly, Secure, SameSite=Strict` cookies that are inaccessible to JavaScript, instead of `localStorage`. This provides protection against **XSS** attacks.
-   **CSRF Protection:** **Antiforgery Tokens** are used to counter the risks associated with cookie-based authentication.
-   **Audit Logging:** Various transactions are recorded in the database.

### 🚀 Data Management
-   **Cursor-Based Pagination:** Base64 encrypted cursor-based pagination is used for database performance and transaction speed.
-   **Soft Delete & Cascading Trash:** Everything that is deleted first goes to the Recycle Bin. When a collection is deleted, all notes within it are automatically moved to the Recycle Bin, and the goal is to improve the user experience by considering deletion times during the restore process.

>[!Note]
>Detailed instructions for the frontend are available in the `client/MyNoteMD-Web/README.md` file.

---

### 🛠️ Installation Steps

#### 1. Clone the Project
```bash
git clone https://github.com/fevzifidan/MyNoteMD.git
cd MyNoteMD
```

#### 2. Configure Environment Variables
Create a `.env` file in the project's root directory and paste the following template (you can change the passwords as you wish):

```env
# PostgreSQL Settings
POSTGRES_USER=mynotemd_user
POSTGRES_PASSWORD=mynotemd_password_123
POSTGRES_DB=mynotemd_db

# Redis Settings
REDIS_PASSWORD=redis_password_123

# .NET Environment
ASPNETCORE_ENVIRONMENT=Development
```

#### 3. Start the System
Build and run all services (PostgreSQL, Redis, .NET 10 API, React) at once using Docker Compose:

```bash
docker compose -f docker-compose.dev.yml up
```

---

*This project was developed to learn and apply the technologies outlined in the tech stack to full-stack web development practice.*
