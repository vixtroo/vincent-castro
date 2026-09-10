type SplashScreenProps = {
	isVisible: boolean;
};

export function SplashScreen({ isVisible }: SplashScreenProps) {
	return (
		<div
			className={`splash-screen fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden bg-slate-50 text-slate-950 transition-opacity duration-500 ease-out dark:bg-slate-950 dark:text-slate-100 ${
				isVisible ? "opacity-100" : "pointer-events-none opacity-0"
			}`}
			aria-hidden={!isVisible}
		>
			<div className="splash-shape splash-shape-one" aria-hidden="true" />
			<div className="splash-shape splash-shape-two" aria-hidden="true" />
			<div className="splash-content relative z-10 flex flex-col items-center">
				<div className="splash-logo text-7xl font-bold text-slate-950 dark:text-slate-100">
					V<span className="text-blue-500 dark:text-blue-600">C.</span>
				</div>
				<p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
					Loading portfolio...
				</p>
				<div className="mt-5 flex items-center gap-2" aria-label="Loading">
					<span className="splash-dot bg-blue-500 dark:bg-blue-600" />
					<span className="splash-dot bg-blue-500 dark:bg-blue-600" />
					<span className="splash-dot bg-blue-500 dark:bg-blue-600" />
				</div>
			</div>
		</div>
	);
}
