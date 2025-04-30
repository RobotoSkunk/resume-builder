
declare global
{
	namespace RobotoSkunk
	{
		namespace IPC
		{
			export type CallbackListener<TEvent, TArg> =  (event: TEvent, ...args: TArg[]) => void;
		}
	}
}

export { };
