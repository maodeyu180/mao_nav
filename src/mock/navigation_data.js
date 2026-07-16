import { mockData as defaultMockData } from './mock_data.js'

function normalizePathSegment(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '-')
}

const owner = normalizePathSegment(import.meta.env.VITE_GITHUB_OWNER || '')
const repo = normalizePathSegment(import.meta.env.VITE_GITHUB_REPO || '')
const scopedDataPath = owner && repo ? `./user_data/${owner}__${repo}.js` : ''

// 完整版使用“所有者 + 仓库名”的专属文件；静态版可以使用 user_data.js。
// Vite 构建时如果都找不到，会自动回退到上游默认数据。
const userDataModules = import.meta.glob(['./user_data.js', './user_data/*.js'], { eager: true })
const userDataModule = userDataModules[scopedDataPath] ?? userDataModules['./user_data.js']

export const mockData = userDataModule?.mockData ?? defaultMockData
export const isUsingUserData = Boolean(userDataModule?.mockData)
