
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AppUser, Level, QuizQuestion, BlocklyProblem, Block, Puzzle, MoveCommand } from './types';
import { geminiService } from './services/api';
import { authService } from './services/api';

// --- Reusable Hooks ---
export const useTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        synthRef.current = window.speechSynthesis;
        const voices = synthRef.current.getVoices(); // Ensure voices are loaded
        
        const onVoicesChanged = () => {
            // Sometimes voices load asynchronously
        };
        synthRef.current.addEventListener('voiceschanged', onVoicesChanged);

        return () => {
            if (synthRef.current) {
                synthRef.current.cancel();
                synthRef.current.removeEventListener('voiceschanged', onVoicesChanged);
            }
        };
    }, []);

    const speak = useCallback((text: string) => {
        if (synthRef.current) {
            if (synthRef.current.speaking) {
                synthRef.current.cancel();
            }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            synthRef.current.speak(utterance);
        }
    }, []);

    const stop = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, stop, isSpeaking };
};

// --- SVG Icons ---

const PlayIcon = ({ className = "w-6 h-6" } : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>;
const StopIcon = ({ className = "w-6 h-6" } : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.563C9.252 14.437 9 14.185 9 13.874V9.563z" /></svg>;
const HintIcon = ({ className = "w-6 h-6" } : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 19.64 2.25 15.184 2.25 10.5 2.25 5.816 6.316 2 11.25 2c5.065 0 9.24 3.963 9.24 8.824 0 4.636-2.206 9.043-5.464 11.59z" /></svg>;
const PokemonIcon = () => <span className="text-2xl">🐹</span>;
const PokeballIcon = () => <span className="text-2xl">🎯</span>;

// --- Basic UI Components ---

// FIX: Added `type` and `disabled` props to the Button component to allow for form submission and disabling the button.
export const Button = ({ onClick, children, className = '', variant = 'primary', type, disabled }: {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}) => {
    const baseClasses = "font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg";
    const variantClasses = {
        primary: 'bg-teal-400 hover:bg-teal-300 text-gray-900',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    };
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    return <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabledClasses}`}>{children}</button>;
};

export const Header = ({ user, onLogout }: { user: AppUser, onLogout: () => void }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-black bg-opacity-30 backdrop-blur-sm z-50">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-white tracking-wider">
                    <span className="text-cyan-400">Code</span>Play
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-white hidden sm:block">Welcome, {user.username}!</span>
                            <Button onClick={onLogout} variant="secondary">Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="text-white hover:text-cyan-400 transition-colors">Login</Link>
                            <Link to="/auth?mode=signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export const LevelCard = ({ level }: { level: Level }) => {
    return (
        <Link to={`/level/${level.id}`} className="bg-gray-800 bg-opacity-60 rounded-2xl p-6 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/20 w-full sm:w-64">
            <div className={`p-4 rounded-full bg-gray-700 ${level.color}`}>
                <level.icon className="w-12 h-12" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-white">{level.title}</h3>
            <p className="mt-2 text-gray-400 text-sm">{level.description}</p>
        </Link>
    );
};

// --- Game Logic Components ---

export const Tutorial = ({ level, onStart }: { level: Level, onStart: () => void }) => {
    const { speak, stop, isSpeaking } = useTTS();
    const fullText = `${level.tutorialContent.title}. ${level.tutorialContent.introduction}. ${level.tutorialContent.lessons.map(l => `${l.title}. ${l.content}`).join(' ')}. ${level.tutorialContent.conclusion}`;

    useEffect(() => {
        // Cleanup speech synthesis on component unmount
        return () => stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSpeak = () => {
        if (isSpeaking) stop();
        else speak(fullText);
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl text-white animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold text-cyan-400">{level.tutorialContent.title}</h2>
                <button onClick={handleSpeak} className="p-3 rounded-full bg-gray-700 hover:bg-cyan-500 transition-colors">
                    {isSpeaking ? <StopIcon/> : <PlayIcon/>}
                </button>
            </div>
            <p className="mb-6 text-gray-300">{level.tutorialContent.introduction}</p>
            <div className="space-y-4 mb-8">
                {level.tutorialContent.lessons.map((lesson, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-teal-300">{lesson.title}</h3>
                        <p className="text-gray-300 mt-1">{lesson.content}</p>
                    </div>
                ))}
            </div>
            <p className="text-center text-lg mb-8 text-teal-300">{level.tutorialContent.conclusion}</p>
            <div className="text-center">
                <Button onClick={onStart} className="px-10 py-4 text-xl">
                    Ready? Let's Start Level {level.id}!
                </Button>
            </div>
        </div>
    );
};

export const Quiz = ({ questions, levelId, onComplete }: { questions: QuizQuestion[], levelId: number, onComplete: (score: number) => void }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [hint, setHint] = useState('');
    const [isLoadingHint, setIsLoadingHint] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerClick = (answer: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);
        if (answer === currentQuestion.correctAnswer) {
            setIsCorrect(true);
            setScore(prev => prev + 10);
        } else {
            setIsCorrect(false);
        }
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setHint('');
            } else {
                onComplete(score + (answer === currentQuestion.correctAnswer ? 10 : 0));
            }
        }, 1500);
    };

    const getHint = async () => {
        setIsLoadingHint(true);
        setHint('');
        const newHint = await geminiService.getHint(levelId, currentQuestion.question);
        setHint(newHint);
        setIsLoadingHint(false);
    };
    
    const getButtonClass = (option: string) => {
        if (selectedAnswer) {
            if (option === currentQuestion.correctAnswer) return 'bg-green-500/80';
            if (option === selectedAnswer) return 'bg-red-500/80';
        }
        return 'bg-gray-700 hover:bg-cyan-600';
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl text-white animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Question {currentQuestionIndex + 1}/{questions.length}</h2>
                <div className="text-2xl font-bold text-yellow-400">Score: {score}</div>
            </div>
            <p className="text-xl h-20 mb-6">{currentQuestion.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map(option => (
                    <button key={option} onClick={() => handleAnswerClick(option)}
                        className={`p-4 rounded-lg text-left transition-colors duration-300 ${getButtonClass(option)} disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={!!selectedAnswer}>
                        {option}
                    </button>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={getHint} disabled={isLoadingHint} className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 disabled:opacity-50">
                    <HintIcon />
                    <span>{isLoadingHint ? "Thinking..." : "Get a Hint"}</span>
                </button>
            </div>
            {hint && <div className="mt-4 p-3 bg-yellow-900/50 text-yellow-200 rounded-lg">{hint}</div>}
        </div>
    );
};

export const BlocklyGame = ({ problems, levelId, onComplete }: { problems: BlocklyProblem[], levelId: number, onComplete: (score: number) => void }) => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [workspaceBlocks, setWorkspaceBlocks] = useState<Block[]>([]);
    const [output, setOutput] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(0);
    const [hint, setHint] = useState('');
    const [isLoadingHint, setIsLoadingHint] = useState(false);

    const currentProblem = problems[currentProblemIndex];

    const handleDragStart = (e: React.DragEvent, block: Block) => {
        e.dataTransfer.setData("block", JSON.stringify(block));
    };

    const handleDrop = (e: React.DragEvent) => {
        const blockJson = e.dataTransfer.getData("block");
        if (blockJson) {
            const block = JSON.parse(blockJson);
            setWorkspaceBlocks([...workspaceBlocks, block]);
        }
    };

    const runCode = () => {
        let newOutput: string[] = [];
        let isCorrect = true;
        let tempWorkspace = [...workspaceBlocks];

        if(currentProblem.id === 1) {
            isCorrect = workspaceBlocks.length === 1 && workspaceBlocks[0].id === 'print_hello';
            if(isCorrect) newOutput.push("Hello Coder!");
        } else if(currentProblem.id === 2) {
            const hasLoop = workspaceBlocks.some(b => b.id === 'loop_3');
            const hasPrint = workspaceBlocks.some(b => b.id === 'print_play');
            isCorrect = hasLoop && hasPrint;
            if(isCorrect) {
                for(let i=0; i<3; i++) newOutput.push("Let's play!");
            }
        }

        setOutput(newOutput);
        
        if (isCorrect) {
            setMessage('Success! Great job!');
            const points = 20;
            const newScore = score + points;
            setScore(newScore);
            setTimeout(() => {
                if (currentProblemIndex < problems.length - 1) {
                    setCurrentProblemIndex(currentProblemIndex + 1);
                    resetWorkspace();
                } else {
                    onComplete(newScore);
                }
            }, 2000);
        } else {
            setMessage('Not quite, try rearranging your blocks!');
        }
    };
    
    const resetWorkspace = () => {
        setWorkspaceBlocks([]);
        setOutput([]);
        setMessage('');
        setHint('');
    };

    const getHint = async () => {
        setIsLoadingHint(true);
        setHint('');
        const newHint = await geminiService.getHint(levelId, currentProblem.goal);
        setHint(newHint);
        setIsLoadingHint(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl text-white animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Challenge: {currentProblem.goal}</h2>
                <div className="text-2xl font-bold text-yellow-400">Score: {score}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Toolbox */}
                <div className="md:col-span-1 bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Toolbox</h3>
                    <div className="space-y-2">
                        {currentProblem.toolbox.map(block => (
                            <div key={block.id} draggable onDragStart={(e) => handleDragStart(e, block)}
                                className="p-3 bg-cyan-600 rounded cursor-grab">
                                {block.text}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Workspace */}
                <div className="md:col-span-2 bg-gray-900/50 p-4 rounded-lg min-h-[200px]"
                    onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                    <h3 className="font-bold mb-4">Workspace</h3>
                    <div className="space-y-2">
                        {workspaceBlocks.map((block, index) => (
                            <div key={index} className="p-3 bg-cyan-800 rounded">
                                {block.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="mt-6 flex justify-between items-start">
                <div>
                     <button onClick={getHint} disabled={isLoadingHint} className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 disabled:opacity-50">
                        <HintIcon />
                        <span>{isLoadingHint ? "Thinking..." : "Get a Hint"}</span>
                    </button>
                    {hint && <div className="mt-4 p-3 bg-yellow-900/50 text-yellow-200 rounded-lg max-w-md">{hint}</div>}
                </div>
                <div className="flex space-x-4">
                    <Button onClick={resetWorkspace} variant="secondary">Reset</Button>
                    <Button onClick={runCode}>Run Code</Button>
                </div>
            </div>
             {/* Output Console */}
            <div className="mt-6 bg-black p-4 rounded-lg font-mono text-green-400 min-h-[100px]">
                <p>&gt; {message}</p>
                {output.map((line, i) => <p key={i}>{line}</p>)}
            </div>
        </div>
    );
};

export const PuzzleGame = ({ puzzle, levelId, onComplete }: { puzzle: Puzzle, levelId: number, onComplete: (score: number) => void }) => {
    const [characterPos, setCharacterPos] = useState(puzzle.start);
    const [commands, setCommands] = useState<MoveCommand[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState('Add commands and press Run!');
    const [hint, setHint] = useState('');
    const [isLoadingHint, setIsLoadingHint] = useState(false);

    const addCommand = (cmd: MoveCommand) => setCommands(prev => [...prev, cmd]);
    const reset = () => {
        setCommands([]);
        setCharacterPos(puzzle.start);
        setIsRunning(false);
        setMessage('Add commands and press Run!');
        setHint('');
    };

    const runCommands = () => {
        setIsRunning(true);
        setMessage('Executing commands...');
        let currentPos = { ...puzzle.start };
        let step = 0;

        const intervalId = setInterval(() => {
            if (step >= commands.length) {
                clearInterval(intervalId);
                checkResult(currentPos);
                return;
            }

            const command = commands[step];
            switch (command) {
                case 'forward': currentPos.y--; break;
                case 'backward': currentPos.y++; break;
                case 'left': currentPos.x--; break;
                case 'right': currentPos.x++; break;
            }

            if(currentPos.x < 0 || currentPos.x >= puzzle.gridSize || currentPos.y < 0 || currentPos.y >= puzzle.gridSize || puzzle.obstacles.some(o => o.x === currentPos.x && o.y === currentPos.y)) {
                setMessage("Oops! You hit an obstacle or went off the grid. Try again!");
                clearInterval(intervalId);
                setTimeout(reset, 2000);
                return;
            }

            setCharacterPos({ ...currentPos });
            step++;
        }, 500);
    };

    const checkResult = (finalPos: { x: number; y: number }) => {
        if (finalPos.x === puzzle.end.x && finalPos.y === puzzle.end.y) {
            setMessage('Success! You reached the goal!');
            setTimeout(() => onComplete(50), 1500);
        } else {
            setMessage('Not quite at the goal. Re-think your path and try again!');
            setTimeout(reset, 2000);
        }
    };

    const getHint = async () => {
        setIsLoadingHint(true);
        setHint('');
        const newHint = await geminiService.getHint(levelId, "The character needs to get from start to the target, avoiding obstacles.");
        setHint(newHint);
        setIsLoadingHint(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl text-white animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Guide the character to the target!</h2>
                <p className={`text-lg font-semibold ${message.includes('Success') ? 'text-green-400' : 'text-yellow-400'}`}>{message}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="grid gap-1 bg-gray-900/50 p-2 rounded-lg" style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}>
                        {Array.from({ length: puzzle.gridSize * puzzle.gridSize }).map((_, i) => {
                            const x = i % puzzle.gridSize;
                            const y = Math.floor(i / puzzle.gridSize);
                            const isCharacter = characterPos.x === x && characterPos.y === y;
                            const isEnd = puzzle.end.x === x && puzzle.end.y === y;
                            const isObstacle = puzzle.obstacles.some(o => o.x === x && o.y === y);
                            return (
                                <div key={i} className={`aspect-square rounded flex items-center justify-center ${isObstacle ? 'bg-gray-700' : 'bg-gray-800'}`}>
                                    {isCharacter && <PokemonIcon />}
                                    {isEnd && !isCharacter && <PokeballIcon />}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="md:col-span-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold mb-2">Commands</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {(['forward', 'backward', 'left', 'right'] as MoveCommand[]).map(cmd => (
                                <Button key={cmd} onClick={() => addCommand(cmd)} variant="secondary" className="capitalize" disabled={isRunning}>{cmd}</Button>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold mb-2">Your Plan:</h3>
                            <div className="bg-gray-900/50 p-2 rounded-lg min-h-[100px] flex flex-wrap gap-1">
                                {commands.map((cmd, i) => <span key={i} className="bg-cyan-700 px-2 py-1 rounded text-sm capitalize">{cmd}</span>)}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col space-y-2">
                        <Button onClick={runCommands} disabled={isRunning}>{isRunning ? 'Running...' : 'Run'}</Button>
                        <Button onClick={reset} variant="secondary" disabled={isRunning}>Reset</Button>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <button onClick={getHint} disabled={isLoadingHint} className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 disabled:opacity-50">
                    <HintIcon />
                    <span>{isLoadingHint ? "Thinking..." : "Get a Hint"}</span>
                </button>
                {hint && <div className="mt-4 p-3 bg-yellow-900/50 text-yellow-200 rounded-lg max-w-md">{hint}</div>}
            </div>
        </div>
    );
};
