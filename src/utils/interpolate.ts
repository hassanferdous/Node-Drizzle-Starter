import ejs from "ejs";

export const interpolate = (template: string, data: any) => {
	if (!template) return null;
	try {
		const result = ejs.render(template, data);
		return JSON.parse(result);
	} catch (error) {
		console.log(error);
		return null;
	}
};
