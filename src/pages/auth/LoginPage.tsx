import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
	useEffect,
	useState,
	type ChangeEvent,
	type SyntheticEvent,
} from 'react';
import { type ILoginCredentials } from '../../types/auth.type';
import { useLogin } from '../../queries/auth.queries';
import { useGetCashRegisters } from '../../queries/cash.queries';
import type { ICashRegister } from '../../types/cash.type';
import { useCashStore } from '../../store/useCashStore.';

export const LoginPage = () => {
	const navigate = useNavigate();
	const { user, setAuth } = useAuthStore();
	const { setCashRegister } = useCashStore();

	const [credentials, setCredentials] = useState<ILoginCredentials>({
		username: '',
		password: '',
	});
	const login = useLogin();
	const [error, setError] = useState<string | null>(null);

	const { data: cashRegisters = [] } = useGetCashRegisters();
	const [selectedCashReg, setSelectedCashReg] = useState<ICashRegister>(
		cashRegisters[0],
	);

	useEffect(() => {
		if (cashRegisters && cashRegisters.length > 0)
			setSelectedCashReg(cashRegisters[0]);
	}, [cashRegisters]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setError(null);
		setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSelectCashRegister = (registerId: string) => {
		const cashRegister = cashRegisters.find((cr) => cr._id === registerId);
		if (cashRegister) setSelectedCashReg(cashRegister);
	};

	const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!credentials.username || !credentials.password) {
			setError('Debe ingresar usuario y contraseña');
			return;
		}
		if (!selectedCashReg) {
			setError('Debe seleccionar una caja registradora');
			return;
		}
		setError(null);

		try {
			login.mutate(credentials, {
				onSuccess: (data) => {
					setAuth(data);
					setCashRegister(selectedCashReg);
				},
			});
		} catch {
			setError('Credenciales incorrectas. Intentá de nuevo.');
		}
	};

	useEffect(() => {
		if (!user) return;
		const redirectTo = user.role === 'admin' ? '/products' : '/pos';
		navigate(redirectTo, { replace: true });
	}, [user]);

	return (
		<div
			className='min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4'
			style={{
				backgroundImage: 'linear-gradient(0deg, #bd4cef, #bdb8fa, #e751fa)',
			}}
		>
			<div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 border border-[#222] rounded-xl overflow-hidden'>
				{/* Panel izquierdo — branding */}
				<div className='relative bg-[#111] flex flex-col justify-between p-10 border-r border-[#1e1e1e]'>
					{/* Grid de fondo */}
					<div
						className='absolute inset-0 opacity-60'
						style={{
							backgroundImage:
								'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
							backgroundSize: '40px 40px',
						}}
					/>

					{/* Branding */}
					<div className='relative z-10'>
						<div className='inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-1.5 mb-6'>
							<span className='w-2 h-2 rounded-full bg-green-500' />
							<span className='text-[11px] text-[#555] font-mono uppercase tracking-widest'>
								Sistema activo
							</span>
						</div>

						<h1 className='text-5xl font-black text-white leading-none tracking-tight mb-2'>
							Punto
							<br />
							de <span className='text-green-500'>Venta</span>
						</h1>
						<p className='text-sm text-[#555] leading-relaxed'>
							Gestión rápida,
							<br />
							operación confiable.
						</p>
					</div>
				</div>

				{/* Panel derecho — formulario */}
				<div className='bg-[#0d0d0d] flex flex-col justify-center p-10'>
					<div className='mb-8'>
						<h2 className='text-lg font-medium text-[#e5e5e5] mb-1'>
							Iniciar sesión
						</h2>
						<p className='text-sm text-[#555]'>
							Ingresá tus credenciales para acceder
						</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						{/* Campo usuario */}
						<div>
							<label className='block text-[11px] font-mono uppercase tracking-widest text-[#555] mb-1.5'>
								Usuario
							</label>
							<input
								type='text'
								name='username'
								value={credentials.username}
								onChange={handleChange}
								placeholder='nombre de usuario'
								autoComplete='username'
								className='w-full bg-[#141414] border border-[#2a2a2a] rounded-md px-3.5 py-2.5 text-sm text-[#e5e5e5] placeholder-[#333] outline-none focus:border-green-500 transition-colors'
							/>
						</div>

						{/* Campo contraseña */}
						<div>
							<label className='block text-[11px] font-mono uppercase tracking-widest text-[#555] mb-1.5'>
								Contraseña
							</label>
							<input
								type='password'
								name='password'
								value={credentials.password}
								onChange={handleChange}
								placeholder='••••••••'
								autoComplete='current-password'
								className='w-full bg-[#141414] border border-[#2a2a2a] rounded-md px-3.5 py-2.5 text-sm text-[#e5e5e5] placeholder-[#333] outline-none focus:border-green-500 transition-colors'
							/>
						</div>

						{/* Error */}
						{error && (
							<p className='text-[12px] text-red-400 font-mono'>{error}</p>
						)}

						{/* Submit */}
						<button
							type='submit'
							disabled={login.isPending}
							className='w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-md py-2.5 transition-colors mt-1'
						>
							{login.isPending ? 'Ingresando...' : 'Ingresar al sistema'}
						</button>
					</form>

					{/* Seleccion de cajas */}
					<div className='mt-6 pt-5 border-t border-[#1e1e1e]'>
						<p className='text-[11px] font-mono text-[#444] mb-2'>
							Seleccion de cajas
						</p>
						<div className='grid grid-cols-2 gap-2'>
							{cashRegisters.map((register) => (
								<button
									key={register._id}
									type='button'
									onClick={() => handleSelectCashRegister(register._id)}
									className={`py-2 rounded-md border text-center transition-all ${
										selectedCashReg?._id === register._id
											? 'border-green-500 bg-[#0f1f12]'
											: 'border-[#252525] bg-[#141414] hover:border-[#444]'
									}`}
								>
									<span className='block text-white mb-0.5'>
										{register.name
											.split(' ')
											.map((el) => el.slice(0, 2))
											.join('')
											.toUpperCase()}
									</span>
									<span
										className={`text-[11px] font-mono ${
											selectedCashReg?._id === register._id
												? 'text-green-500'
												: 'text-[#666]'
										}`}
									>
										{register.name}
									</span>
								</button>
							))}
						</div>
					</div>

					<p className='text-[11px] text-[#2e2e2e] font-mono text-center mt-6'>
						v1.0.0 · POS System
					</p>
				</div>
			</div>
		</div>
	);
};
