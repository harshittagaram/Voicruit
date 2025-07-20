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

---

## 📬 Contact

Made with 💼 by [Harshit Tagaram](https://github.com/harshittagaram)
