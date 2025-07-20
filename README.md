# Voicruit – AI Voice Recruiter

Voicruit is an AI-powered voice-based interview platform that streamlines the hiring process by conducting automated voice interviews tailored to different interview types. Built using React, Spring Boot, and integrated with the Vapi AI API for voice interaction.

---

## 🚀 Features

- 🎙️ AI-driven voice interviews (Technical, Behavioral, Experience-based, etc.)
- 🧠 Custom interview generation with OpenAI prompts
- 📞 Web interview calls via Vapi AI integration
- 👤 Candidate name input and interview flow
- ✅ Interview completion and feedback generation
- 🔐 Google OAuth login 
- 🧾 PostgreSQL DB

---

## 🛠️ Tech Stack

| Frontend           | Backend               | AI/Voice APIs       | Storage & Infra  |
|--------------------|------------------------|----------------------|------------------|
| React + Vite       | Spring Boot (Java)     | Vapi AI, OpenAI      | PostgreSQL       |
| Tailwind CSS       | Spring Security + JWT  |                      |                  |

---

## 📂 Project Structure

### Frontend (`/userpanel`)
```
src/
├── components/         # InterviewCards, InterviewForm, Logo, etc.
├── pages/              # InterviewRoom, InterviewForm, InterviewCompleted, etc.
├── assets/             # Images and static assets
├── App.jsx             # Main routing logic
└── main.jsx            # Vite entry point
```

### Backend (`/backend`)
```
src/main/java/com/voicruit/
├── config/             # SecurityConfig, CorsConfig, OAuth2 config
├── controller/         # AuthController, InterviewController
├── filters/            # JWT filters
├── service/            # VapiService, InterviewService, UserDetailsService
├── model/              # Interview, Auth DTOs
├── entity/             # InterviewEntity, UserEntity
└── repository/         # PostgreSQL interfaces
```

---

## 🔧 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/harshittagaram/Voicruiter.git
cd Voicruiter
```

### 2. Frontend Setup (`/userpanel`)
```bash
cd userpanel
npm install
npm run dev
```

### 3. Backend Setup (`/backend`)
```bash
cd backend
# Add your API keys and DB credentials in `src/main/resources/application.properties`
./mvnw spring-boot:run
```

---

## 🔑 API Keys & Configuration

Add the following in `backend/src/main/resources/application.properties`:

```properties
# VAPI & OpenAI API keys
vapi.api.key=YOUR_VAPI_API_KEY
openrouter.api.key=YOUR_OPENAI_API_KEY

# Google OAuth
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET

# DB Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/voicruit
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
```

---

## 📸 Screenshots

> Add UI screenshots or demo GIFs here
<img width="1896" height="870" alt="Screenshot 2025-07-21 011511" src="https://github.com/user-attachments/assets/5b4b01f6-210b-4d36-8a97-dcdc0c39a538" />
<img width="1899" height="823" alt="Screenshot 2025-07-21 011537" src="https://github.com/user-attachments/assets/77769e12-4be5-45f8-ae67-c4247a15e62b" />
<img width="1912" height="871" alt="Screenshot 2025-07-21 011556" src="https://github.com/user-attachments/assets/6c3fd27b-7530-4566-9c14-378d2fee61ef" />
<img width="1146" height="859" alt="Screenshot 2025-07-21 011611" src="https://github.com/user-attachments/assets/a818774e-ac3e-48ba-ba62-636a79a24640" />
<img width="1919" height="848" alt="Screenshot 2025-07-21 011633" src="https://github.com/user-attachments/assets/ca02affc-83e2-4783-b9c5-7c6fb38db84c" />
<img width="1895" height="872" alt="Screenshot 2025-07-21 011649" src="https://github.com/user-attachments/assets/9e9d8a4c-5fc9-482b-83c0-1e5b8edbc3fe" />
<img width="1900" height="872" alt="Screenshot 2025-07-21 011703" src="https://github.com/user-attachments/assets/e7b14a3d-2384-42cc-94ff-da4e9c9a00a9" />
<img width="1898" height="873" alt="Screenshot 2025-07-21 011319" src="https://github.com/user-attachments/assets/ef10cb06-3e1f-4bc7-9a40-26e94a302fc2" />

---

## 📬 Contact

[Harshit Tagaram](https://github.com/harshittagaram)
