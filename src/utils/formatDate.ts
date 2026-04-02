export const formatDate = (iso: string) => {
	const date = iso.endsWith('Z') ? iso : iso + 'Z';
	return new Date(date).toLocaleString('es-AR', {
		timeZone: 'America/Argentina/Buenos_Aires',
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const formatDateShort = (iso: string) => {
	const date = iso.endsWith('Z') ? iso : iso + 'Z';
	return new Date(date).toLocaleDateString('es-AR', {
		timeZone: 'America/Argentina/Buenos_Aires',
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
	});
};
