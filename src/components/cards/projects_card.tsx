import Image from "next/image";

export interface ProjectsCardProps {
	image_url?: string;
	project_name: string;
	description: string;
	tech_stack?: readonly string[];
	features: readonly string[];
	is_currently_building: boolean;
	updated_at?: string;
}

export function ProjectsCard({
	image_url,
	project_name,
	description,
	tech_stack = [],
	features,
	is_currently_building,
}: ProjectsCardProps) {
	return (
		<article className="group flex h-full min-h-[450px] w-[364px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900">
			<div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
				{is_currently_building && (
					<span className="absolute left-3 top-3 z-10 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
						Currently Building
					</span>
				)}
				{image_url ? (
					<Image
						src={image_url}
						alt={`${project_name} preview`}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover transition duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-sm font-medium text-slate-400 dark:text-slate-500">
						Project preview unavailable
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="space-y-2">
					<h2 className="line-clamp-2 text-xl font-bold text-slate-950 dark:text-slate-100">
						{project_name}
					</h2>
					<p className="line-clamp-4 min-h-[4.5rem] text-sm leading-6 text-slate-600 dark:text-slate-400">
						{description}
					</p>
				</div>

				{tech_stack.length > 0 && (
					<ul className="mt-auto flex flex-wrap gap-2" aria-label="Technologies used">
						{tech_stack.map((technology) => (
							<li
								key={technology}
								className="flex bg-slate-100 px-3 py-2 rounded-2xl text-xs w-fit mb-1 dark:bg-slate-600"
							>
								{technology}
							</li>
						))}
					</ul>
				)}

				{features.length > 0 && (
					<ul className="flex flex-wrap gap-2" aria-label="Project features">
						{features.map((feature) => (
							<li key={feature} className="rounded-md bg-blue-50 px-2.5 py-1 text-xs text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
								{feature}
							</li>
						))}
					</ul>
				)}
			</div>
		</article>
	);
}

export default ProjectsCard;
