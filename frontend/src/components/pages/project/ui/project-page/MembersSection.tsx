import { motion } from "framer-motion";
import { Users, UserRoundPen, UserMinus, MoreHorizontal, Handshake } from "lucide-react";
import { ProjectMember, ProjectWithDetails } from "@/types/interfaces/interfaces";
import { Role } from "@/types/enums/enums";
import Image from "next/image";
import { getRandomColor } from "@/helpers/get-random-color";

interface MembersSectionProps {
  project: ProjectWithDetails;
  currentUser: { id: string } | undefined;
  handleChangeRole: (member: ProjectMember) => void;
  handleRemoveMember: (userId? : string) => void;
}

const MembersSection = ({
  project,
  currentUser,
  handleChangeRole,
  handleRemoveMember,
}: MembersSectionProps) => {
  const adminMembers = project.members.filter(
    (member) => member.role === Role.ADMIN
  );

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case Role.OWNER: return "bg-amber-500/20 text-amber-600 border-amber-500/30";
      case Role.ADMIN: return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case Role.MEMBER: return "bg-green-500/20 text-green-600 border-green-500/30";
      case Role.VIEWER: return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      default: return "bg-base-300 text-base-content border-base-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
          <Users size={24} className="text-primary" />
          Team Members
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {project.members.map((member, index) => (
          <motion.div
            key={member.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-base-200 rounded-2xl p-4 border border-base-300 hover:border-base-content/20 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {member.user.avatarUrl ? (
                  <Image
                    src={member.user.avatarUrl}
                    width={48}
                    height={48}
                    alt={member.user.name}
                    className="rounded-full border-2 border-base-100"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 border-base-100 ${getRandomColor(
                      member.userId
                    )}`}
                  >
                    {getUserInitials(member.user.name)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-base-content">
                    {member.user.name}
                  </h3>
                  <p className="text-base-content/60 text-sm">
                    {member.user.email}
                  </p>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getRoleColor(
                      member.role
                    )}`}
                  >
                    <span className="capitalize">{member.role.toLowerCase()}</span>
                    {member.role === Role.OWNER && <Handshake size={12} />}
                  </div>
                </div>
              </div>
              {(project.ownerId === currentUser?.id ||
                adminMembers.some((admin) => admin.user.id === currentUser?.id)) &&
                member.role !== Role.OWNER && (
                  <div className="dropdown dropdown-end z-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      tabIndex={0}
                      className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-base-content"
                    >
                      <MoreHorizontal size={16} />
                    </motion.button>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 mt-2 border border-base-300"
                    >
                      <li>
                        <button
                          onClick={() => handleChangeRole(member)}
                          className="flex items-center gap-2 text-info hover:bg-info/10"
                        >
                          <UserRoundPen size={16} />
                          Change Role
                        </button>
                      </li>
                      <li className="border-t border-base-300">
                        <button
                          onClick={()=>handleRemoveMember(member.userId)}
                          className="flex items-center gap-2 text-error hover:bg-error/10"
                        >
                          <UserMinus size={16} />
                          Remove Member
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MembersSection;