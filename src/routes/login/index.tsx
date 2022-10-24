import { Show } from "solid-js";
import { Title } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { z } from "zod";
import { parseForm } from "~/lib/parsers";
import { createUserSession, getUser } from "~/lib/session.server";

const LoginSchema = z
	.object({
		email: z.string().trim().min(1),
		password: z.string().trim().min(10),
	})
	.strict();

export function routeData() {
	return createServerData$(async (_, event) => {
		const user = await getUser(event.request);
		if (user) throw redirect("/");
	});
}

export default function LoginRoute() {
	const [submission, { Form }] = createServerAction$(async (formData: FormData, { request, env }) => {
		const formParsed = await parseForm(formData, LoginSchema);

		if (!formParsed.success) {
			const flattenedErrors = formParsed.error.flatten();
			return { errors: flattenedErrors.fieldErrors };
		}

		const { email, password } = formParsed.data;

		console.log(import.meta.env.VITE_EMAIL, import.meta.env.VITE_PASSWORD);
		if (email === import.meta.env.VITE_EMAIL && password === import.meta.env.VITE_PASSWORD) {
			return await createUserSession(`${email}::${import.meta.env.COOKIE}`, "/");
		}

		return { success: true };
	}, {});

	// @NOTE: submission.input is FormData of what's being submitted

	return (
		<main>
			<Title>Login</Title>
			<h1>Login</h1>

			<Show when={submission.result}>
				<>{console.log("Show when", submission.result)}</>
			</Show>

			<Form class="space-y-4">
				<div>
					<div>
						<label for="email">Email:</label>
					</div>
					<div>
						<input id="email" type="email" name="email" required />
					</div>
					<Show when={submission.result?.errors?.email}>
						<div class="color-red-500">{submission.result.errors.email}</div>
					</Show>
				</div>
				<div>
					<div>
						<label for="password">Password:</label>
					</div>
					<div>
						<input id="password" type="password" name="password" required />
					</div>
					<Show when={submission.result?.errors?.password}>
						<div class="color-red-500">{submission.result.errors.password}</div>
					</Show>
				</div>
				<div>
					<button type="submit" disabled={submission.pending}>
						Login
					</button>
				</div>
			</Form>
		</main>
	);
}
