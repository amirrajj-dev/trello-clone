import React from "react";
import Home from "@/components/pages/home/Home";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Trello Clone",
  description: "A powerful Trello-inspired app to manage your projects, tasks, and teams with ease. Create boards, assign tasks, and collaborate in real-time."
};

const HomePage = () => {

  return <Home/>
}

export default HomePage;
