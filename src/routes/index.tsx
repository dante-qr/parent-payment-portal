import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
`;

function HomeComponent() {
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());
	const debugEnv = useQuery({
		queryKey: ["debug-env"],
		queryFn: async () => {
			const res = await fetch("/api/debug-env");
			return res.json();
		},
	});

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
			<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">API Status</h2>
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
						/>
						<span className="text-muted-foreground text-sm">
							{healthCheck.isLoading
								? "Checking..."
								: healthCheck.data
									? "Connected"
									: "Disconnected"}
						</span>
					</div>
				</section>

				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">DEBUG: Environment Variables</h2>
					<p className="mb-2 text-muted-foreground text-xs">
						Also check server logs (stdout) for vite.config.ts and env/server.ts
						output
					</p>
					{debugEnv.isLoading ? (
						<p className="text-sm">Loading debug info...</p>
					) : debugEnv.error ? (
						<div className="text-red-500 text-sm">
							Error fetching debug info: {String(debugEnv.error)}
							<br />
							<span className="text-gray-500 text-xs">
								If you see this, the server-side code might be crashing. Check
								CloudWatch logs.
							</span>
						</div>
					) : (
						<pre className="overflow-x-auto rounded bg-gray-900 p-3 text-green-400 text-xs">
							{JSON.stringify(debugEnv.data, null, 2)}
						</pre>
					)}
				</section>
			</div>
		</div>
	);
}
