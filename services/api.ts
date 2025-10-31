
import { GoogleGenAI } from "@google/genai";
import type { AppUser, KidData, ParentData, UserType } from '../types';
import { UserType as UType } from '../types';

// Gemini API Service
const getApiKey = () => {
    const key = process.env.API_KEY;
    if (!key) {
        // In a real app, you'd want to handle this more gracefully.
        // For this example, we'll alert the user and proceed,
        // which will cause the API call to fail with a clear error.
        alert("API_KEY environment variable not set. Hint feature will not work.");
    }
    return key;
};


export const geminiService = {
  getHint: async (level: number, question: string): Promise<string> => {
    try {
      const apiKey = getApiKey();
      if (!apiKey) return "Hint feature is unavailable: API Key is not configured.";

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a helpful and friendly assistant for a kids coding game called CodePlay.
      A child is playing Level ${level} and is stuck on the following problem: "${question}".
      Provide a simple, encouraging, and kid-friendly hint.
      Do NOT give the direct answer. Guide them to think about the solution.
      For example, if the question is "What does a loop do?", a good hint would be "Think about something you do every day, over and over again... like brushing your teeth!".
      Keep the hint to one or two short sentences.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error("Error fetching hint from Gemini API:", error);
      return "Oops! I couldn't think of a hint right now. Please try again in a moment.";
    }
  },
};


// Mock Authentication Service
const USER_KEY = 'codeplay_user';

export const authService = {
  getCurrentUser: (): AppUser => {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  login: (username: string, userType: UserType): AppUser => {
    // This is a mock login. In a real app, you'd verify password.
    // For this app, we'll create a user if they don't exist.
    const existingUsers = JSON.parse(localStorage.getItem('codeplay_users') || '{}');
    const userData = existingUsers[username];

    if (userData && userData.type === userType) {
        if(userType === UType.Kid) {
            userData.sessionStartTime = Date.now();
        }
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        return userData;
    }
    
    return null;
  },

  signup: (parentData: ParentData, kidData: Omit<KidData, 'lastLogin' | 'sessionStartTime'>): AppUser => {
    const users = JSON.parse(localStorage.getItem('codeplay_users') || '{}');
    if (users[parentData.username] || users[kidData.username]) {
        alert("Username already exists!");
        return null;
    }
    
    const newKidData: KidData = {
        ...kidData,
        lastLogin: new Date().toISOString(),
        sessionStartTime: 0,
    };

    const newParentData: ParentData = {
        ...parentData,
        kidUsername: kidData.username,
    };
    
    users[newKidData.username] = newKidData;
    users[newParentData.username] = newParentData;
    
    localStorage.setItem('codeplay_users', JSON.stringify(users));
    
    // Log in parent after signup
    localStorage.setItem(USER_KEY, JSON.stringify(newParentData));
    return newParentData;
  },
  
  logout: () => {
    localStorage.removeItem(USER_KEY);
  },

  getKidData: (kidUsername: string): KidData | null => {
    const users = JSON.parse(localStorage.getItem('codeplay_users') || '{}');
    return users[kidUsername] || null;
  },

  updateKidData: (kidData: KidData): void => {
      const users = JSON.parse(localStorage.getItem('codeplay_users') || '{}');
      users[kidData.username] = kidData;
      localStorage.setItem('codeplay_users', JSON.stringify(users));

      // also update current user if it's the kid
      const currentUser = authService.getCurrentUser();
      if(currentUser && currentUser.type === UType.Kid && currentUser.username === kidData.username) {
          localStorage.setItem(USER_KEY, JSON.stringify(kidData));
      }
  }
};
