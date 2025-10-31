CodePlay - School Level Coding Game
🎮 An interactive and fun school-level coding game designed to teach the fundamentals of programming through engaging levels, puzzles, and quizzes.
<!-- It's highly recommended to replace this with an actual screenshot of your app! -->
🚀 About The Project
CodePlay is a web-based educational game created to make learning to code an exciting adventure for kids. It demystifies programming concepts by turning them into interactive challenges. The platform features separate experiences for kids and parents, allowing children to learn at their own pace while parents can monitor their progress and set healthy screen time limits.
Core Features
👨‍👩‍👧 Dual User Roles: Separate, secure accounts for kids and parents.
** dashboards:**
Kid's Dashboard: A vibrant hub to access all the coding levels.
Parent's Dashboard: A control center to view a child's scores, last login time, and set screen time limits.
🧠 Three Engaging Levels: A carefully curated learning path:
Coding Basics: A fun quiz to introduce fundamental concepts like loops and conditional statements.
Block Builder: A drag-and-drop, block-based interface (inspired by Blockly/Scratch) to teach programming logic without complex syntax.
Puzzle Quest: A maze-based game where kids use command sequences to guide a character, teaching sequential logic and problem-solving.
🤖 AI-Powered Hints: Integrated with the Google Gemini API to provide smart, encouraging hints that guide kids toward the solution without giving it away.
Accessibility:
🔊 Text-to-Speech: Tutorials for each level can be read aloud, catering to different learning styles.
📱 Responsive Design: Fully playable on desktops, tablets, and mobile devices.
🔒 Mock Authentication: Uses localStorage to simulate a full user signup and login experience for easy demonstration.
🛠️ Built With
Frontend: React & TypeScript
Styling: Tailwind CSS
Routing: React Router
AI Integration: Google Gemini API
Web APIs: Web Speech API (for Text-to-Speech), LocalStorage
🏁 Getting Started
To get a local copy up and running, follow these simple steps.
Prerequisites
Node.js and npm (or yarn) installed on your machine.
A Google Gemini API key. You can get one from Google AI Studio.
Installation & Setup
Clone the repo:
code
Sh
git clone https://github.com/your-username/codeplay.git
cd codeplay
Install NPM packages:
code
Sh
npm install
Set up environment variables:
The hint feature relies on the Google Gemini API. You need to provide your API key. Create a .env file in the root of your project and add your key:
code
.env
API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
Note: The project is set up to read this key via process.env.API_KEY. If you are using a bundler like Vite, it will handle this automatically. Ensure your setup exposes environment variables to the client-side correctly.
Run the development server:
code
Sh
npm run dev
Open http://localhost:5173 (or the port specified in your terminal) to view it in the browser.
🕹️ How to Play
Sign Up: A parent must first create an account, which simultaneously creates a linked account for their child.
Parent's View: After signing up, the parent is directed to their dashboard. Here they can see their child's scores and set a daily screen time limit in minutes.
Kid's View: The child can then log in using their own username. They will land on their dashboard where they can choose any level to play.
Play a Level: Each level begins with a tutorial. After the tutorial, the game starts. If the child gets stuck, they can click the "Get a Hint" button for a little help from our AI assistant!
Time's Up: If a screen time limit is set, the child will be logged out automatically when their time is up.
