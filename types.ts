
export enum UserType {
    Kid = 'kid',
    Parent = 'parent'
}

export interface User {
    username: string;
    type: UserType;
    email?: string; // For parents
    kidUsername?: string; // For parents
}

export interface KidData extends User {
    type: UserType.Kid;
    scores: { [levelId: number]: number };
    lastLogin: string;
    screenTimeLimit: number; // in minutes
    sessionStartTime: number; // timestamp
}

export interface ParentData extends User {
    type: UserType.Parent;
    kidUsername: string;
}

export type AppUser = KidData | ParentData | null;

export interface Level {
    id: number;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    points: number;
    tutorialContent: {
        title: string;
        introduction: string;
        lessons: { title: string; content: string }[];
        conclusion: string;
    }
}

// Level 1: Quiz
export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

// Level 2: Blockly
export interface BlocklyProblem {
    id: number;
    goal: string;
    toolbox: Block[];
    solution: string[]; // sequence of block ids
}
export interface Block {
    id: string;
    text: string;
    type: 'action' | 'loop' | 'value';
}

// Level 3: Puzzle
export interface Puzzle {
    id: number;
    gridSize: number;
    start: { x: number; y: number };
    end: { x: number; y: number };
    obstacles: { x: number; y: number }[];
}

export type MoveCommand = 'forward' | 'backward' | 'left' | 'right';
