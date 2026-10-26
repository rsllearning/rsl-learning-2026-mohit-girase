import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/projects';

interface ProjectTeamPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectTeamPage({ params }: ProjectTeamPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-4 pt-2" id="project-team-tab">
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-zinc-400 bg-zinc-900/80">
            <tr>
              <th className="py-2.5 px-3 font-medium">Name</th>
              <th className="py-2.5 px-3 font-medium">Role</th>
              <th className="py-2.5 px-3 font-medium">Department</th>
              <th className="py-2.5 px-3 font-medium">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {project.team.map((member) => (
              <tr key={member.id} className="hover:bg-zinc-900/60">
                <td className="py-2.5 px-3 font-medium text-zinc-200">
                  {member.name}
                  {member.id === project.lead.id && (
                    <span className="ml-1.5 text-[10px] text-zinc-500">(Lead)</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-zinc-400">{member.role}</td>
                <td className="py-2.5 px-3 text-zinc-500">{member.department}</td>
                <td className="py-2.5 px-3 text-zinc-400">{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
