import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
			<Toaster
				position='bottom-center'
				toastOptions={{
					duration: 3000,
					style: {
						background: '#707070AA',
						color: '#e5e5e5',
						border: '1px solid #252525',
						fontFamily: 'monospace',
						fontSize: '13px',
					},
					success: {
						iconTheme: { primary: '#22c55e', secondary: '#111' }, // green-500
					},
					error: {
						iconTheme: { primary: '#ef4444', secondary: '#111' }, // red-500
					},
				}}
			/>
		</QueryClientProvider>
	</StrictMode>,
);
