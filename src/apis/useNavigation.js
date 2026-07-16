import { ref } from 'vue'
import { mockData } from '../mock/navigation_data.js'

export function useNavigation() {
  const categories = ref([])
  const title = ref('')
  const icpNumber = ref('')
  const defaultSearchEngine = ref('bing')
  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      // 开发环境模拟网络延迟
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // 默认使用本地mock数据
      categories.value = mockData.categories
      title.value = mockData.title
      icpNumber.value = typeof mockData.icp === 'string' ? mockData.icp.trim() : ''

      // 设置默认搜索引擎，如果未指定或不存在则使用bing
      const searchEngines = ['google', 'baidu', 'bing', 'duckduckgo']
      if (mockData.search && searchEngines.includes(mockData.search)) {
        defaultSearchEngine.value = mockData.search
      } else {
        defaultSearchEngine.value = 'bing'
      }

      // 动态设置页面标题
      document.title = title.value


    } catch (err) {
      error.value = err.message
      console.error('Error fetching categories:', err)
      // 兜底：始终返回 mock 数据
      categories.value = mockData.categories
      title.value = mockData.title
      icpNumber.value = typeof mockData.icp === 'string' ? mockData.icp.trim() : ''

      // 设置默认搜索引擎
      const searchEngines = ['google', 'baidu', 'bing', 'duckduckgo']
      if (mockData.search && searchEngines.includes(mockData.search)) {
        defaultSearchEngine.value = mockData.search
      } else {
        defaultSearchEngine.value = 'bing'
      }

      document.title = title.value
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    title,
    icpNumber,
    defaultSearchEngine,
    loading,
    error,
    fetchCategories
  }
}
