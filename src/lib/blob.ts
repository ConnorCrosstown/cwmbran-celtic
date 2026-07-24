import { put } from '@vercel/blob';

export type PutFn = (
  path: string,
  data: Buffer | Blob,
  opts: { access: 'public'; token?: string; contentType?: string },
) => Promise<{ url: string }>;

export async function uploadImage(
  filename: string,
  data: Buffer | Blob,
  putFn: PutFn = put as unknown as PutFn,
): Promise<string> {
  const { url } = await putFn(filename, data, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}
