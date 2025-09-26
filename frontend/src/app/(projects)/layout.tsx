import Navbar from "@/components/common/navbar/Navbar";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}
