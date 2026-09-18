import { NavLink } from 'react-router-dom';
import type { INavItem } from './AdminSidebar';

export const SidebarNavItem = ({ item }: { item: INavItem }) => {
	return (
		<NavLink
			to={item.path}
			end
			className={({ isActive }) =>
				`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors group ${
					isActive
						? 'bg-[#111f14] text-green-400'
						: 'text-[#666] hover:text-[#ccc] hover:bg-[#161616]'
				}`
			}
		>
			{({ isActive }) => (
				<>
					<span
						className={`shrink-0 transition-colors ${isActive ? 'text-green-500' : 'text-[#444] group-hover:text-[#888]'}`}
					>
						{item.icon}
					</span>
					<span>{item.label}</span>
				</>
			)}
		</NavLink>
	);
};
