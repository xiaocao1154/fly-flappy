import { cachedFetch } from './BrainCache'; import type { BrainManifest } from '../types';
export interface LoadProgress { value: number; label: string; cached: boolean; }
export async function loadManifest(report: (p: LoadProgress) => void): Promise<BrainManifest> {
  let network = false; report({value: .04, label: '正在定位连接组清单…', cached: true});
    const raw = await (await cachedFetch('/brain/brain.json', () => network = true)).json() as Record<string, unknown>;
    const manifest = raw as unknown as BrainManifest;
    if (manifest.neurons !== 166700 || manifest.connections < 25_000_000 || !manifest.parts?.length) throw new Error(`连接组完整性校验失败：实际收到 ${manifest.neurons?.toLocaleString()} 个神经元 / ${manifest.connections?.toLocaleString()} 条连接。`);
    report({value: .1, label: network ? '连接组清单校验通过…' : '正在唤醒缓存中的大脑…', cached: !network}); return manifest;
}
