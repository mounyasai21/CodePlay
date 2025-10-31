
import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import type { AppUser, KidData, ParentData, Level } from './types';
import { UserType } from './types';
import { authService } from './services/api';
import { Header, Button, LevelCard, Tutorial, Quiz, BlocklyGame, PuzzleGame } from './components';
import { LEVELS, LEVEL1_QUESTIONS, LEVEL2_PROBLEMS, LEVEL3_PUZZLES } from './constants';

// --- Auth Context ---
interface AuthContextType {
    user: AppUser;
    login: (username: string, userType: UserType) => boolean;
    signup: (parentData: ParentData, kidData: Omit<KidData, 'lastLogin' | 'sessionStartTime'>) => boolean;
    logout: () => void;
    updateKidData: (data: KidData) => void;
    getKidDataForParent: () => KidData | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AppUser>(authService.getCurrentUser());

    const login = (username: string, userType: UserType): boolean => {
        const loggedInUser = authService.login(username, userType);
        if (loggedInUser) {
            setUser(loggedInUser);
            return true;
        }
        return false;
    };

    const signup = (parentData: ParentData, kidData: Omit<KidData, 'lastLogin' | 'sessionStartTime'>): boolean => {
        const signedUpUser = authService.signup(parentData, kidData);
        if (signedUpUser) {
            setUser(signedUpUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateKidData = (data: KidData) => {
        authService.updateKidData(data);
        if(user?.username === data.username) {
            setUser(data);
        }
    };
    
    const getKidDataForParent = (): KidData | null => {
        if(user && user.type === UserType.Parent) {
            const parent = user as ParentData;
            return authService.getKidData(parent.kidUsername);
        }
        return null;
    }

    const value = useMemo(() => ({ user, login, signup, logout, updateKidData, getKidDataForParent }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// --- Page Components ---

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white text-center px-4 pt-20">
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-md p-10 md:p-16 rounded-3xl shadow-2xl shadow-cyan-500/10 border border-gray-700/50">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
                    <span className="text-cyan-400">Code</span>Play
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-gray-300">School level coding game</p>
                <div className="mt-10">
                    <Button onClick={() => navigate('/auth')} className="px-10 py-4 text-xl">
                        Play Now
                    </Button>
                </div>
            </div>

            <div className="mt-20 max-w-5xl w-full">
                <h2 className="text-4xl font-bold mb-8">An Adventure in Every Level</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    {LEVELS.map(level => (
                        <div key={level.id} className="bg-gray-800 bg-opacity-60 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg w-full sm:w-64">
                            <div className={`p-4 rounded-full bg-gray-700 ${level.color}`}>
                                <level.icon className="w-12 h-12" />
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-white">{level.title}</h3>
                            <p className="mt-2 text-gray-400 text-sm">{level.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup } = useAuth();
    const queryParams = new URLSearchParams(location.search);
    const initialMode = queryParams.get('mode') === 'signup' ? 'signup' : 'login';
    
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [userType, setUserType] = useState<UserType>(UserType.Kid);
    
    // Login form state
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup form state
    const [parentUsername, setParentUsername] = useState('');
    const [parentPassword, setParentPassword] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [kidUsername, setKidUsername] = useState('');
    const [kidPassword, setKidPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(loginUsername, userType);
        if (success) {
            navigate(userType === UserType.Kid ? '/kid-dashboard' : '/parent-dashboard');
        } else {
            alert('Login failed! User not found or incorrect user type.');
        }
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        const parentData: ParentData = { username: parentUsername, type: UserType.Parent, kidUsername: kidUsername, email: parentEmail };
        const kidData: Omit<KidData, 'lastLogin' | 'sessionStartTime'> = { username: kidUsername, type: UserType.Kid, scores: {}, screenTimeLimit: 0 };
        const success = signup(parentData, kidData);
        if (success) {
            navigate('/parent-dashboard');
        } else {
            alert('Signup failed!');
        }
    };

    const renderLoginForm = () => (
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex bg-gray-700 rounded-full p-1">
                <button type="button" onClick={() => setUserType(UserType.Kid)} className={`w-1/2 p-2 rounded-full transition-colors ${userType === UserType.Kid ? 'bg-cyan-500 text-white' : 'text-gray-300'}`}>I'm a Kid</button>
                <button type="button" onClick={() => setUserType(UserType.Parent)} className={`w-1/2 p-2 rounded-full transition-colors ${userType === UserType.Parent ? 'bg-cyan-500 text-white' : 'text-gray-300'}`}>I'm a Parent</button>
            </div>
            <input type="text" placeholder="Username" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            <Button type="submit" className="w-full">Login</Button>
        </form>
    );

    const renderSignupForm = () => (
         <form onSubmit={handleSignup} className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-teal-300">Parent's Account</h3>
            <input type="text" placeholder="Parent's Username" value={parentUsername} onChange={e => setParentUsername(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg" required />
            <input type="password" placeholder="Parent's Password" value={parentPassword} onChange={e => setParentPassword(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg" required />
            <input type="email" placeholder="Parent's Email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg" required />
             <h3 className="text-lg font-semibold text-center text-teal-300 pt-4">Kid's Account</h3>
            <input type="text" placeholder="Kid's Username" value={kidUsername} onChange={e => setKidUsername(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg" required />
            <input type="password" placeholder="Kid's Password" value={kidPassword} onChange={e => setKidPassword(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg" required />
            <Button type="submit" className="w-full">Create Account</Button>
        </form>
    );

    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl text-white">
                <div className="flex border-b border-gray-700 mb-6">
                    <button onClick={() => setMode('login')} className={`w-1/2 py-3 font-bold ${mode === 'login' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>Login</button>
                    <button onClick={() => setMode('signup')} className={`w-1/2 py-3 font-bold ${mode === 'signup' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>Sign Up</button>
                </div>
                {mode === 'login' ? renderLoginForm() : renderSignupForm()}
            </div>
        </div>
    );
};

const KidDashboard = () => {
    const { user, logout } = useAuth();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const kidUser = user as KidData;

    useEffect(() => {
        if (kidUser && kidUser.screenTimeLimit > 0) {
            const timeElapsed = (Date.now() - kidUser.sessionStartTime) / 1000 / 60; // in minutes
            const remaining = kidUser.screenTimeLimit - timeElapsed;
            if (remaining <= 0) {
                setTimeLeft(0);
            } else {
                setTimeLeft(remaining * 60); // in seconds
                const timer = setInterval(() => {
                    setTimeLeft(prev => {
                        if (prev !== null && prev > 1) {
                            return prev - 1;
                        } else {
                            clearInterval(timer);
                            return 0;
                        }
                    });
                }, 1000);
                return () => clearInterval(timer);
            }
        }
    }, [kidUser]);

    if (timeLeft === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white text-center pt-20">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Time's Up!</h1>
                <p className="text-xl mb-8">Your screen time limit has been reached. Come back later!</p>
                <Button onClick={logout}>Logout</Button>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white pt-24 px-4">
            {timeLeft !== null && (
                 <div className="fixed top-20 right-4 bg-yellow-500 text-black p-2 rounded-lg font-bold">
                    Time Left: {Math.floor(timeLeft / 60)}m {Math.floor(timeLeft % 60)}s
                 </div>
            )}
            <h1 className="text-5xl font-bold mb-12">Choose Your Adventure!</h1>
            <div className="flex flex-col md:flex-row gap-8">
                {LEVELS.map(level => <LevelCard key={level.id} level={level} />)}
            </div>
        </div>
    );
};

const ParentDashboard = () => {
    const { getKidDataForParent, updateKidData } = useAuth();
    const [kidData, setKidData] = useState<KidData | null>(null);
    const [screenTime, setScreenTime] = useState('');

    useEffect(() => {
        const data = getKidDataForParent();
        setKidData(data);
        if(data?.screenTimeLimit) {
            setScreenTime(String(data.screenTimeLimit));
        }
    }, [getKidDataForParent]);
    
    const handleSetLimit = () => {
        if(kidData && screenTime) {
            const newLimit = parseInt(screenTime, 10);
            if(!isNaN(newLimit) && newLimit >= 0) {
                const updatedKidData = { ...kidData, screenTimeLimit: newLimit };
                updateKidData(updatedKidData);
                setKidData(updatedKidData);
                alert("Screen time limit updated!");
            }
        }
    };

    if(!kidData) return <div className="min-h-screen flex items-center justify-center text-white pt-20">Loading kid's data...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center text-white pt-24 px-4">
            <h1 className="text-5xl font-bold mb-8">Parent Dashboard</h1>
            <h2 className="text-3xl font-semibold text-cyan-400 mb-12">Monitoring: {kidData.username}</h2>
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-4">Kid's Activity</h3>
                    <p><strong>Last Login:</strong> {new Date(kidData.lastLogin).toLocaleString()}</p>
                    <h4 className="font-bold mt-4">Scores:</h4>
                    <ul className="list-disc list-inside">
                        {LEVELS.map(level => (
                            <li key={level.id}>{level.title}: {kidData.scores[level.id] || 0} / {level.points}</li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-gray-800 p-6 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-4">Set Screen Time Limit</h3>
                    <div className="flex items-center space-x-4">
                         <input type="number" value={screenTime} onChange={e => setScreenTime(e.target.value)} placeholder="Minutes (0 for unlimited)" className="flex-grow bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                         <Button onClick={handleSetLimit}>Set Limit</Button>
                    </div>
                     <p className="text-sm text-gray-400 mt-2">Current limit: {kidData.screenTimeLimit > 0 ? `${kidData.screenTimeLimit} minutes` : 'Unlimited'}. The timer starts when the kid logs in.</p>
                </div>
            </div>
        </div>
    );
};

const LevelPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, updateKidData } = useAuth();
    const levelId = parseInt(id || '1', 10);
    const level = LEVELS.find(l => l.id === levelId);

    const [view, setView] = useState<'tutorial' | 'game' | 'completed'>('tutorial');
    const [finalScore, setFinalScore] = useState(0);

    if (!level) {
        return <Navigate to="/kid-dashboard" />;
    }
    
    const handleGameComplete = (score: number) => {
        setFinalScore(score);
        setView('completed');
        if (user && user.type === UserType.Kid) {
            const kidUser = user as KidData;
            const newScores = { ...kidUser.scores, [level.id]: Math.max(kidUser.scores[level.id] || 0, score) };
            updateKidData({ ...kidUser, scores: newScores });
        }
    };
    
    const renderGame = () => {
        switch (levelId) {
            case 1: return <Quiz questions={LEVEL1_QUESTIONS} levelId={levelId} onComplete={handleGameComplete} />;
            case 2: return <BlocklyGame problems={LEVEL2_PROBLEMS} levelId={levelId} onComplete={handleGameComplete} />;
            case 3: return <PuzzleGame puzzle={LEVEL3_PUZZLES[0]} levelId={levelId} onComplete={handleGameComplete} />;
            default: return null;
        }
    };

    if (view === 'completed') {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-center pt-20">
                <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl">
                    <h2 className="text-4xl font-bold text-teal-400 mb-4">Level {level.id} Complete!</h2>
                    <p className="text-2xl mb-8">You scored {finalScore} points!</p>
                    <div className="flex justify-center space-x-4">
                        <Button onClick={() => setView('game')} variant="secondary">Play Again</Button>
                        <Button onClick={() => navigate('/kid-dashboard')}>Back to Dashboard</Button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-8 px-4">
           {view === 'tutorial' ? (
                <Tutorial level={level} onStart={() => setView('game')} />
           ) : (
                renderGame()
           )}
        </div>
    );
};


// --- App Structure and Routing ---

const ProtectedRoute = ({ children, allowedType }: { children: React.ReactNode, allowedType: UserType }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/auth" />;
    }
    if (user.type !== allowedType) {
        return <Navigate to="/" />;
    }
    return <>{children}</>;
};

function App() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    return (
        <div className="bg-gray-900 min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/40 to-gray-900">
            <Header user={user} onLogout={handleLogout} />
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/kid-dashboard" element={<ProtectedRoute allowedType={UserType.Kid}><KidDashboard /></ProtectedRoute>} />
                    <Route path="/parent-dashboard" element={<ProtectedRoute allowedType={UserType.Parent}><ParentDashboard /></ProtectedRoute>} />
                    <Route path="/level/:id" element={<ProtectedRoute allowedType={UserType.Kid}><LevelPage /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
}

// Wrapper component to use hooks from react-router-dom
const AppWrapper = () => (
    <HashRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </HashRouter>
);

export default AppWrapper;
