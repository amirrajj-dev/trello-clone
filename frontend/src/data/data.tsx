import { Crown, Eye, Shield, User } from "lucide-react";

type Theme = "light" | "dark" | "night" | "forest" | "dracula" | "coffee";

export const themeItems: {
  value: Theme;
}[] = [
  { value: "light" },
  { value: "dark" },
  { value: "night" },
  { value: "forest" },
  { value: "dracula" },
  { value: "coffee" },
];

export const roleStyles = {
  OWNER: <Crown size={12} className="text-amber-500" />,
  ADMIN: <Shield size={12} className="text-blue-500" />,
  MEMBER: <User size={12} className="text-green-500" />,
  VIEWER: <Eye size={12} className="text-gray-500" />,
};

export const motivationalQuotes = [
  "Great things are done by a series of small things brought together. – Vincent Van Gogh",
  "The secret of getting ahead is getting started. – Mark Twain",
  "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "Teamwork makes the dream work. – John C. Maxwell",
  "The best way to predict the future is to create it. – Peter Drucker",
  "Done is better than perfect. – Sheryl Sandberg",
  "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort. – Paul J. Meyer",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. – Steve Jobs",
  "The future depends on what you do today. – Mahatma Gandhi",
  "Don't count the days, make the days count. – Muhammad Ali",
  "Efficiency is doing things right; effectiveness is doing the right things. – Peter Drucker",
  "The only limit to our realization of tomorrow will be our doubts of today. – Franklin D. Roosevelt",
  "The harder I work, the more luck I seem to have. – Thomas Jefferson",
  "Setting goals is the first step in turning the invisible into the visible. – Tony Robbins",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities. – Stephen Covey",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work. – Stephen King",
  "The most effective way to do it, is to do it. – Amelia Earhart",
  "Don't be afraid to give up the good to go for the great. – John D. Rockefeller",
  "The only place where success comes before work is in the dictionary. – Vidal Sassoon",
  "Your time is limited, don't waste it living someone else's life. – Steve Jobs",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "It's not about having time, it's about making time. – Unknown",
  "The secret to getting ahead is getting started. – Mark Twain",
  "Small daily improvements are the key to staggering long-term results. – Unknown",
  "The distance between your dreams and reality is called action. – Unknown",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
  "The man who moves a mountain begins by carrying away small stones. – Confucius",
  "The best time to plant a tree was 20 years ago. The second best time is now. – Chinese Proverb",
  "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
  "The only person you are destined to become is the person you decide to be. – Ralph Waldo Emerson",
  "Don't let yesterday take up too much of today. – Will Rogers",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "Our greatest glory is not in never falling, but in rising every time we fall. – Confucius",
  "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
  "Act as if what you do makes a difference. It does. – William James",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
  "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. – Roy T. Bennett",
  "The only limit to our realization of tomorrow will be our doubts of today. – Franklin D. Roosevelt",
  "The harder the conflict, the more glorious the triumph. – Thomas Paine",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. – Zig Ziglar",
  "The best revenge is massive success. – Frank Sinatra",
  "The only way to achieve the impossible is to believe it is possible. – Charles Kingsleigh",
  "Don't wait for opportunity. Create it. – Unknown",
  "The man who has confidence in himself gains the confidence of others. – Hasidic Proverb",
];
