/**
	bnnuy - A fast and simple framework for Bun's HTTP API.
	Copyright (C) 2023 Edgar Alexis Lima <contact@robotoskunk.com>
	
	Licensed under LGPLv3 <https://www.gnu.org/licenses/lgpl-3.0.txt>
*/

class RSBodyConsumer
{
	private raw: Request;

	constructor(req: Request)
	{
		this.raw = req;
	}


	public stream(): ReadableStream<any> | null
	{
		return this.raw.body;
	}

	public async text(): Promise<string>
	{
		return await this.raw.text();
	}

	public async json(): Promise<any>
	{
		return await this.raw.json();
	}

	public async formData(): Promise<FormData>
	{
		return await this.raw.formData();
	}

	public async arrayBuffer(): Promise<ArrayBuffer>
	{
		return await this.raw.arrayBuffer();
	}

	public async blob(): Promise<Blob>
	{
		return await this.raw.blob();
	}

	public async buffer(): Promise<Buffer>
	{
		return Buffer.from(await this.raw.arrayBuffer());
	}
}


export type Route = string;

export interface ParamsDictionary
{
	[key: string]: string;
}


class RSRequest<TBody>
{
	private __body?: TBody;
	private __params: ParamsDictionary;


	constructor(body: TBody)
	{
		this.__body = body;
		this.__params = {};
	}


	public get body(): TBody
	{
		return this.__body;
	}

	public get params(): ParamsDictionary
	{
		return this.__params;
	}


	public setParams(params: ParamsDictionary): void
	{
		this.__params = params;
	}

}

export default RSRequest;
