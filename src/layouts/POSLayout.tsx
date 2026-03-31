import { Outlet } from 'react-router-dom';

export const POSLayout = () => {
	return (
		<div className='h-screen'>
			<Outlet />
		</div>
	);
};
