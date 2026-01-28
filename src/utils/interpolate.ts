type Primitive = string | number | boolean | null | undefined;

function getByPath<T extends object>(obj: T, path: string): Primitive {
	return path
		.replace(/\[(\d+)\]/g, ".$1") // roles[0] → roles.0
		.split(".")
		.reduce<any>((acc, key) => {
			if (acc == null) return undefined;
			return acc[key];
		}, obj);
}

function extractExpressions(template: string): string[] {
	return [...template.matchAll(/\$\{([^}]+)\}/g)].map((match) => match[1]);
}

type InterpolatedResult = Record<string, Primitive>;

export function interpolate<T extends object>(
	template: string,
	vars: T
): InterpolatedResult {
	const expressions = extractExpressions(template);
	const result: InterpolatedResult = {};

	for (const expr of expressions) {
		const value = getByPath(vars, expr);

		if (value === undefined) continue;

		const lastKey = expr.split(".").pop()!;
		result[lastKey] = value;
	}

	return result;
}
