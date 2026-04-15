# VaidikEssence – Setup & Run Guide

## 1. Prerequisites

Make sure you have installed:

* Node.js (>= 18)
* Java (>= 17)
* Maven (or use wrapper)
* Python (>= 3.10)
* Git

---

## 2. Create Project Root

```bash
mkdir VaidikEssence
cd VaidikEssence
```

---

## 3. Create Folder Structure

```bash
mkdir backend mobile ai-service
touch docker-compose.yml README.md
```

---

## 4. Setup Spring Boot Backend

### Step 1: Generate Project

Go to: https://start.spring.io/

Select:

* Project: Maven
* Language: Java
* Dependencies:

  * Spring Web
  * Lombok
  * Spring Boot DevTools

Download and unzip.

---

### Step 2: Move into backend/

```bash
mv ~/Downloads/<your-downloaded-folder> backend
cd backend
```

---

### Step 3: Run Backend

```bash
./mvnw spring-boot:run
```


Runs on:
http://localhost:8080

---

## 5. Setup React Native (Expo)

```bash
cd ../mobile
npx create-expo-app@latest .
```

Run app:

```bash
npx expo start
```

---

## 6. Setup Python AI Service

```bash
cd ../ai-service
python3 -m venv venv
```

Activate:

Mac/Linux:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

---

### Install Dependencies

```bash
pip install fastapi uvicorn openai langchain faiss-cpu pypdf
```

---

### Create Basic App

```bash
mkdir app
touch app/main.py
```

Add this code to `app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Service Running"}
```

---

### Run AI Service

```bash
uvicorn app.main:app --reload
```

Runs on:
http://localhost:8000

---

## 7. Verify All Services

| Service       | URL                   |
| ------------- | --------------------- |
| Backend       | http://localhost:8080 |
| AI Service    | http://localhost:8000 |
| Mobile (Expo) | Expo Dev Tools UI     |

---

## 8. Basic Architecture Flow

```
Mobile App (Expo)
        ↓
Spring Boot Backend (8080)
        ↓
Python AI Service (8000)
        ↓
LLM API (OpenAI)
```

---

## 9. Development Order

1. Run all services independently
2. Connect Spring Boot → AI Service
3. Implement `/ask` endpoint
4. Add RAG pipeline (PDF → embeddings → search)
5. Connect mobile app

---

## 10. Notes

* Keep RAG logic inside `ai-service`
* Backend acts as API gateway
* Do not mix Python logic into Java
* Use FAISS locally for vector search (initially)

---