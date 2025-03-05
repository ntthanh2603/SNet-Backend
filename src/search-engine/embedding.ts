import { pipeline } from '@xenova/transformers';

export async function generateEmbedding(text: string): Promise<number[]> {
  const embedder = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2',
  );
  return (await embedder(text, { pooling: 'mean', normalize: true }))[0];
}

generateEmbedding('Hello world!').then(console.log);
