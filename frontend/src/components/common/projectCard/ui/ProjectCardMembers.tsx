"use client"
import { motion } from "framer-motion";
import { Project } from "@/types/interfaces/interfaces";
import Image from "next/image";
import { Users } from "lucide-react";

const ProjectCardMembers = ({
  members,
}: {
  members: Project["members"];
}) => {
  const maxMembersToShow = 3;
  const displayedMembers = members.slice(0, maxMembersToShow);
  const extraMembers = members.length > maxMembersToShow ? members.length - maxMembersToShow : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {displayedMembers.map((member, index) =>
          member.user.avatarUrl ? (
            <motion.div
              key={index + 1}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="tooltip tooltip-primary shadow-sm"
              data-tip={member.user.name}
            >
              <Image
                src={member.user.avatarUrl}
                width={32}
                height={32}
                className="rounded-full border-2 border-base-100"
                alt={`${member.user.name.split(" ")[0]} Avatar`}
              />
            </motion.div>
          ) : (
            <motion.div
              key={index + 1}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-8 h-8 bg-gradient-to-br tooltip tooltip-primary from-primary to-secondary rounded-full border-2 border-base-100 flex items-center justify-center text-primary-content text-xs font-bold shadow-sm"
              data-tip={member.user.name}
            >
              {member.user.name?.charAt(0).toUpperCase() || "U"}
            </motion.div>
          )
        )}
        {extraMembers > 0 && (
          <div className="w-8 h-8 bg-base-300 rounded-full border-2 border-base-100 flex items-center justify-center text-base-content text-xs font-bold shadow-sm">
            +{extraMembers}
          </div>
        )}
      </div>

      {members.length === 0 && (
        <div className="flex items-center gap-2 text-base-content/40">
          <Users size={16} />
          <span className="text-sm">No members yet</span>
        </div>
      )}
    </div>
  );
};

export default ProjectCardMembers