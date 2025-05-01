
import Database from '../database/connection';


declare global
{
	namespace RobotoSkunk
	{
		namespace IPC
		{
			export type CallbackListener<T> =  (event: Electron.IpcRendererEvent, ...args: T[]) => void;
		}
	}

	namespace Electron
	{
		interface App
		{
			database: Database;
		}
	}
}

export { };
