import jsPDF from 'jspdf';
import type { IDailySummary } from '../types/cash.type';

export const generateCashCountPdf = (summary: IDailySummary) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	// Título
	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	doc.text('CORTE Z', pageWidth / 2, 20, { align: 'center' });
	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.text('Resumen Diario', pageWidth / 2, 27, { align: 'center' });

	let y = 40;

	// Función auxiliar para agregar secciones
	const addSection = (
		title: string,
		items: { label: string; value: string }[],
	) => {
		doc.setFontSize(11);
		doc.setFont('helvetica', 'bold');
		doc.text(title, 20, y);
		y += 7;

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');
		items.forEach((item) => {
			doc.text(item.label, 25, y);
			doc.text(item.value, 120, y);
			y += 6;
		});
		y += 5;
	};

	// Info general
	addSection('Información General', [
		{ label: 'Caja:', value: summary.register_name },
		{ label: 'Cajero:', value: summary.cashier_name },
		{ label: 'Apertura:', value: formatDate(summary.opened_at) },
		{
			label: 'Cierre:',
			value: summary.closed_at ? formatDate(summary.closed_at) : 'Abierta',
		},
	]);

	// Resumen
	addSection('Resumen', [
		{ label: 'Ventas:', value: formatPrice(summary.total_sales) },
		{ label: 'Devoluciones:', value: `-${formatPrice(summary.total_refunds)}` },
		{ label: 'Neto:', value: formatPrice(summary.net_sales) },
		{ label: 'Ingresos efectivo:', value: formatPrice(summary.total_cash_in) },
		{ label: 'Egresos efectivo:', value: formatPrice(summary.total_cash_out) },
	]);

	// Métodos de pago
	doc.setFontSize(11);
	doc.setFont('helvetica', 'bold');
	doc.text('Métodos de Pago', 20, y);
	y += 7;

	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	doc.text('Método', 25, y);
	doc.text('Operaciones', 100, y);
	doc.text('Total', 140, y);
	y += 6;

	doc.setFont('helvetica', 'normal');
	summary.payment_methods.forEach((pm) => {
		doc.text(pm.label, 25, y);
		doc.text(pm.count.toString(), 100, y);
		doc.text(formatPrice(pm.total), 140, y);
		y += 6;
	});
	y += 5;

	// Saldos
	addSection('Saldos', [
		{ label: 'Saldo apertura:', value: formatPrice(summary.opening_balance) },
		{
			label: 'Saldo teórico:',
			value: formatPrice(summary.expected_cash_balance),
		},
		...(summary.closing_balance !== null
			? [
					{
						label: 'Saldo real cierre:',
						value: formatPrice(summary.closing_balance),
					},
					{
						label: 'Diferencia efectivo:',
						value: formatPrice(summary.cash_difference ?? 0),
					},
				]
			: []),
	]);

	// Guardar
	doc.save(`corte_z_${summary.session_id}.pdf`);
};

// Funciones auxiliares locales
function formatDate(iso: string): string {
	const date = iso.endsWith('Z') ? iso : iso + 'Z';
	return new Date(date).toLocaleString('es-AR', {
		timeZone: 'America/Argentina/Buenos_Aires',
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
}

function formatPrice(n: number): string {
	return new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		maximumFractionDigits: 0,
	}).format(n);
}
