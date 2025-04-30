
declare global
{
	namespace RobotoSkunk
	{
		namespace IPC
		{
			export type CallbackListener<T> =  (event: Electron.IpcRendererEvent, ...args: T[]) => void;
		}
	}
}

export { };
