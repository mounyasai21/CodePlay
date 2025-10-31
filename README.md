

# 🎮 **CodePlay - School Level Coding Game**

An **interactive and fun school-level coding game** designed to teach the fundamentals of programming through engaging levels, puzzles, and quizzes.

---

## 🚀 **About The Project**

**CodePlay** is a web-based educational game created to make learning to code an exciting adventure for kids.
It simplifies programming concepts by turning them into interactive challenges.
The platform features separate experiences for **kids and parents**, allowing children to learn at their own pace while parents can monitor their progress and set healthy screen time limits.

---

## 🧩 **Core Features**

### 👨‍👩‍👧 Dual User Roles

* Separate, secure accounts for **kids** and **parents**.

### 🖥️ Dashboards

* **Kid's Dashboard:** A colorful, engaging hub to access all coding levels.
* **Parent's Dashboard:** A control center to view a child’s scores, last login time, and set daily screen time limits.

### 🧠 Three Engaging Levels

1. **Coding Basics:** A fun quiz to introduce simple concepts like syntax, loops, and conditionals.
2. **Block Builder:** A drag-and-drop, block-based interface (inspired by Blockly/Scratch) to teach logic without typing code.
3. **Puzzle Quest:** A maze-based game where kids guide a character (like a Pokémon) to its goal using commands — teaching sequential thinking and problem-solving.

### 🤖 AI-Powered Hints

* Integrated with the **Google Gemini API** to provide smart, encouraging hints that guide kids toward the right answer without revealing it completely.

---

## 🧏 **Accessibility**

* 🔊 **Text-to-Speech:** Tutorials for each level can be read aloud for better comprehension.
* 📱 **Responsive Design:** Fully playable on desktop, tablet, and mobile screens.
* 🔒 **Mock Authentication:** Uses local storage for user signup and login simulation for easy demo access.

---

## 🛠️ **Built With**

* **Frontend:** React & TypeScript
* **Styling:** Tailwind CSS
* **Routing:** React Router
* **AI Integration:** Google Gemini API
* **Web APIs:** Web Speech API (for Text-to-Speech), LocalStorage
* **Backend (for extended version):** Python Flask (for real database integration)

---

## 🏁 **Getting Started**

To get a local copy up and running, follow these simple steps:

### **Prerequisites**

* Install **Node.js** and **npm (or yarn)**
* Obtain a **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### **Installation & Setup**

#### 1️⃣ Clone the repository:

```bash
git clone https://github.com/your-username/codeplay.git
cd codeplay
```

#### 2️⃣ Install dependencies:

```bash
npm install
```

#### 3️⃣ Set up environment variables:

Create a `.env` file in your project root and add your Gemini API key:

```
API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
```

*(Ensure your setup allows environment variables to be accessed by the client-side app.)*

#### 4️⃣ Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in your browser.

---

## 🕹️ **How to Play**

1. **Sign Up:** A parent first creates an account, which also generates a linked kid account.
2. **Parent’s View:** The parent dashboard displays child progress, scores, and allows setting a screen-time limit (e.g., 1 hour per day).
3. **Kid’s View:** The kid logs in and accesses their dashboard with three levels.
4. **Play a Level:** Each level begins with a **voice-guided tutorial** before starting the actual challenge.

   * If stuck, the kid can click **“Get a Hint”** to get help from the AI assistant.
5. **Time’s Up:** When the set screen time is exceeded, the system logs out the child with a message — *“Your playtime is over, come back tomorrow!”*

---

## 🌍 **Future Enhancements**

* Add multiplayer quiz competitions for kids.
* Introduce progress badges and certifications.
* Enable cloud-based parental dashboards with analytics.
* Support for multiple languages for inclusivity.

---

## 💡 **License**

This project is open-source and available under the **MIT License**.

---

## 👩‍💻 **Developed By**

**Ch. Mounya Sai**
Department of Computer Science
Project: *CodePlay - School Level Coding Game*

---

## Ouput Screens



## Video

