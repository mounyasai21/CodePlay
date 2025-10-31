
import React from 'react';
import type { Level, QuizQuestion, BlocklyProblem, Puzzle, Block } from './types';

const CodeIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
);

const BlocksIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

const PuzzleIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a16.5 16.5 0 01-2.084 5.25l-2.766-2.767a6.002 6.002 0 012.805-5.841 16.507 16.507 0 015.25-2.084m-5.841 2.805a16.5 16.5 0 01-5.25 2.084m2.805-5.841a6 6 0 017.38-5.84m-7.38 5.84L5.63 5.63m14.14 0L12 12m-3.37 1.41a6 6 0 015.84-7.38m-5.84 7.38a16.5 16.5 0 01-5.25-2.084m5.84 2.805a6 6 0 01-7.38 5.84m7.38-5.84L18.37 5.63m-5.841 2.805a16.5 16.5 0 012.084-5.25m-2.084 5.25L12 12" />
    </svg>
);


export const LEVELS: Level[] = [
    {
        id: 1,
        title: 'Coding Basics',
        description: 'Learn the fundamental concepts of coding with a fun quiz.',
        icon: CodeIcon,
        color: 'text-blue-400',
        points: 50,
        tutorialContent: {
            title: "Welcome to Coding Basics!",
            introduction: "Let's start our adventure into the world of code! Coding is like giving instructions to a computer to make it do amazing things, like building games, websites, and apps.",
            lessons: [
                { title: "What is Coding?", content: "Coding, or programming, is how we communicate with computers. We use special languages that computers understand to tell them what to do step-by-step." },
                { title: "Why is it useful?", content: "Coding is a superpower! It helps you solve problems, be creative, and build anything you can imagine. It's used in almost every industry, from movies to medicine." },
                { title: "What are 'if' statements?", content: "An 'if' statement is like a decision-maker. It tells the computer: IF something is true, THEN do a specific action. For example, IF the player has a key, THEN open the door." }
            ],
            conclusion: "You've learned the very basics! Now, are you ready to test your knowledge in a quick quiz? Let's go!"
        }
    },
    {
        id: 2,
        title: 'Block Builder',
        description: 'Drag and drop blocks to build programs and solve challenges.',
        icon: BlocksIcon,
        color: 'text-green-400',
        points: 100,
        tutorialContent: {
            title: "Welcome to Block Builder!",
            introduction: "In this level, you'll be a code builder! Instead of typing, you'll use blocks to create programs. It's like building with digital LEGOs.",
            lessons: [
                { title: "How it works", content: "Drag blocks from the toolbox on the left and snap them together in the workspace on the right. Each block is a command for the computer." },
                { title: "Printing Statements", content: "A 'print' block tells the computer to show a message. If you use a print block with the word 'Hello', the computer will display 'Hello'." },
                { title: "Loops", content: "A 'loop' or 'repeat' block is for doing things over and over again without writing the same code multiple times. If you want to say 'Hi' three times, you can use a loop!" }
            ],
            conclusion: "You're all set to become a master block builder. Let's solve some block puzzles!"
        }
    },
    {
        id: 3,
        title: 'Puzzle Quest',
        description: 'Use logic and commands to guide a character through a maze.',
        icon: PuzzleIcon,
        color: 'text-yellow-400',
        points: 150,
        tutorialContent: {
            title: "Welcome to Puzzle Quest!",
            introduction: "Time to use your problem-solving skills! In this level, you need to give a sequence of commands to help our friend reach their goal.",
            lessons: [
                { title: "The Goal", content: "Your goal is to guide the character from the start to the finish. You need to create a path using command blocks." },
                { title: "The Commands", content: "You have four basic commands: move forward, move backward, turn left, and turn right. Your character will follow these commands in the exact order you set them." },
                { title: "Planning Your Path", content: "Think about the path before you add commands. Count the steps and figure out where to turn. If you make a mistake, you can always reset and try again!" }
            ],
            conclusion: "Your quest awaits! Plan your moves carefully and lead your character to victory."
        }
    },
];

export const LEVEL1_QUESTIONS: QuizQuestion[] = [
    {
        question: "What is coding?",
        options: ["Talking to plants", "Giving instructions to a computer", "Reading a book", "Drawing a picture"],
        correctAnswer: "Giving instructions to a computer"
    },
    {
        question: "An 'if' statement helps a computer to...",
        options: ["Sing a song", "Make a decision", "Count to ten", "Change color"],
        correctAnswer: "Make a decision"
    },
    {
        question: "Which of these can be built using code?",
        options: ["A sandwich", "A video game", "A bicycle", "A treehouse"],
        correctAnswer: "A video game"
    },
    {
        question: "What does a 'loop' do in coding?",
        options: ["Stops the program", "Makes a circle shape", "Repeats an action", "Adds two numbers"],
        correctAnswer: "Repeats an action"
    },
    {
        question: "Why is coding considered a useful skill?",
        options: ["It helps you run faster", "It helps you solve problems and be creative", "It's only for scientists", "It's not useful at all"],
        correctAnswer: "It helps you solve problems and be creative"
    }
];

export const LEVEL2_TOOLBOX: Block[] = [
    { id: 'print_hello', text: 'Print "Hello Coder!"', type: 'action' },
    { id: 'print_play', text: 'Print "Let\'s play!"', type: 'action' },
    { id: 'loop_3', text: 'Repeat 3 times', type: 'loop' },
];

export const LEVEL2_PROBLEMS: BlocklyProblem[] = [
    {
        id: 1,
        goal: 'Make the computer say "Hello Coder!"',
        toolbox: LEVEL2_TOOLBOX,
        solution: ['print_hello']
    },
    {
        id: 2,
        goal: 'Make the computer say "Let\'s play!" three times.',
        toolbox: LEVEL2_TOOLBOX,
        solution: ['loop_3', 'print_play'] // A simplified check: loop must contain the print
    }
];

export const LEVEL3_PUZZLES: Puzzle[] = [
    {
        id: 1,
        gridSize: 5,
        start: { x: 0, y: 0 },
        end: { x: 4, y: 4 },
        obstacles: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }]
    }
];
