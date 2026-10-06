# Banking Transaction Management System

A full-stack, enterprise-grade banking application designed to handle account management and transactions with ACID compliance. 

The project features a **clean-architecture Java Spring Boot backend** seamlessly communicating with a **dynamic React frontend**, ensuring strong theoretical foundations backed by a highly polished, responsive user interface.

## 🚀 Features

- **Account Management**: Create and manage bank accounts effortlessly.
- **Transactions**: Secure processing for deposit and withdrawal operations.
- **Fund Transfers**: P2P transfers between accounts with ACID compliance guarantees.
- **Transaction History**: View historical transactions instantly.
- **Zero-Config Database**: Utilizes an in-memory H2 Database so that no external database installations are required. Just plug and play!
- **Modern User Interface**: A fast, responsive frontend built taking advantage of the latest React 19 methodologies and bundled utilizing Vite.

---

## 🛠️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.1.5**
- **Spring Data JPA** (Hibernate)
- **H2 Database** (In-memory, transient storage to simplify setup)
- **Maven** (Dependency management)
- **JUnit & Mockito** (Comprehensive unit testing)

### Frontend
- **React 19**
- **Vite** (Next-generation lightning-fast build tool)
- **Axios** (API requests)
- **Lucide React** (Modern iconography system)

---

## ⚙️ How to Run the Application Locally

Follow these instructions to run the application on your local machine.

### 1. Starting the Backend (Spring Boot)

The backend runs on `http://localhost:8080`.

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application using Maven:
   ```bash
   mvnw spring-boot:run
   ```
   *Note: If you have a standalone Maven installation configured on your system, you can also use `mvn spring-boot:run`.*

### 2. Starting the Frontend (React + Vite)

The frontend runs typically on `http://localhost:5173`.

1. Open a separate terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies (only needed the first time):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Accessing the App
Open your web browser and navigate to the URL provided by your Vite terminal (e.g., `http://localhost:5173`).

---

## 🏗️ Architecture & Concepts

- **ACID Transactions**: Transactional boundaries (`@Transactional`) guarantee database data integrity even if unexpected failures occur during logical multi-step operations like transferring funds.
- **Clean Architecture**: Follows best practices in separating concerns horizontally across `Controllers`, `Services`, `Repositories` and `Entities`.

## 📝 License
This project is for educational and demonstrative purposes. Feel free to use it as a learning reference for integrating Spring Boot architectures with modern React frontends!
