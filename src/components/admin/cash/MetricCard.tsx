interface IMetricCardProps {
	label: string;
	value: string;
	accent: string;
}

export const MetricCard = ({ label, value, accent }: IMetricCardProps) => {
	return (
		<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
			<p className='text-[12px] font-mono text-[#555] mb-1'>{label}</p>
			<p className={`text-[18px] font-mono font-semibold ${accent}`}>{value}</p>
		</div>
	);
};
