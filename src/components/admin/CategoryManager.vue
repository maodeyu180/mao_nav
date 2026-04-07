<template>
  <div class="category-manager">
    <div class="manager-header">
      <h2>📁 分类管理</h2>
      <div class="header-actions">
        <button @click="showAddModal = true" class="add-btn">
          ➕ 添加分类
        </button>
        <button @click="$emit('save')" :disabled="loading" class="save-btn">
          {{ loading ? '保存中...' : '💾 保存到GitHub' }}
        </button>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="drag-tip">
      💡 拖拽左侧 <span class="tip-handle">⋮⋮</span> 手柄可调整分类排序，点击分类卡片可进入站点管理
    </div>

    <!-- 分类列表 -->
    <div class="categories-list">
      <draggable
        v-model="localCategories"
        v-bind="dragOptions"
        @end="onDragEnd"
        item-key="id"
        tag="div"
        class="draggable-list"
      >
        <template #item="{ element: category }">
          <div
            class="category-item clickable draggable-item"
            @click="$emit('viewSites', category.id)"
          >
            <div class="category-header">
              <div class="category-info">
                <div class="drag-handle" title="拖拽排序" @click.stop>
                  ⋮⋮
                </div>
                <span class="category-icon" @click.stop="editCategory(category)">
                  {{ category.icon }}
                </span>
                <div class="category-details">
                  <h3 @click.stop="editCategory(category)">{{ category.name }}</h3>
                  <p>{{ category.sites?.length || 0 }} 个站点 → 点击查看站点管理</p>
                </div>
              </div>
              <div class="category-actions">
                <span class="order-badge">排序: {{ category.order }}</span>
                <button @click.stop="editCategory(category)" class="edit-btn">
                  ✏️ 编辑
                </button>
                <button @click.stop="deleteCategory(category.id)" class="delete-btn">
                  🗑️ 删除
                </button>
              </div>
            </div>

            <!-- 站点预览 -->
            <div class="sites-preview" v-if="category.sites && category.sites.length > 0">
              <div class="sites-grid">
                <div
                  v-for="site in category.sites.slice(0, 6)"
                  :key="site.id"
                  class="site-preview"
                >
                  <img :src="site.icon" :alt="site.name" @error="handleImageError">
                  <span>{{ site.name }}</span>
                </div>
                <div v-if="category.sites.length > 6" class="more-sites">
                  +{{ category.sites.length - 6 }} 更多
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- 添加/编辑分类弹窗 -->
    <div v-if="showAddModal || editingCategory" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingCategory ? '编辑分类' : '添加分类' }}</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>

        <form @submit.prevent="saveCategory" class="category-form">
          <div class="form-group">
            <label>分类图标:</label>
            <div class="icon-input">
              <input
                v-model="formData.icon"
                placeholder="输入emoji图标"
                class="form-input icon-preview"
              >
              <div class="emoji-suggestions">
                <span
                  v-for="emoji in emojiSuggestions"
                  :key="emoji"
                  @click="formData.icon = emoji"
                  class="emoji-item"
                >
                  {{ emoji }}
                </span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>分类名称:</label>
            <input
              v-model="formData.name"
              required
              placeholder="请输入分类名称"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label>排序顺序:</label>
            <input
              v-model.number="formData.order"
              type="number"
              required
              placeholder="数字越小排序越靠前"
              class="form-input"
            >
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">取消</button>
            <button type="submit" class="submit-btn">
              {{ editingCategory ? '更新' : '添加' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'save', 'viewSites'])

// 本地分类数据
const localCategories = ref([])

// 弹窗状态
const showAddModal = ref(false)
const editingCategory = ref(null)

// 表单数据
const formData = ref({
  icon: '📁',
  name: '',
  order: 0
})

// Emoji建议
const emojiSuggestions = [
  '📁', '🛠️', '🎨', '📚', '👥', '⚙️', '🎮', '💼',
  '☁️', '🔧', '📊', '🎵', '📱', '💻', '🌐', '🔍'
]

// 监听props变化
watch(() => props.categories, (newCategories) => {
  localCategories.value = JSON.parse(JSON.stringify(newCategories))
}, { immediate: true, deep: true })

// 手动同步到父组件的函数，避免无限循环
const syncToParent = () => {
  emit('update', localCategories.value)
}

// 拖拽排序配置
const dragOptions = {
  animation: 200,
  handle: '.drag-handle',
  ghostClass: 'sortable-ghost',
  chosenClass: 'sortable-chosen',
  scroll: true,
  forceAutoScrollFallback: true,
  scrollSensitivity: 100,
  scrollSpeed: 15
}

// 拖拽结束
const onDragEnd = () => {
  // 重新排序
  localCategories.value.forEach((category, idx) => {
    category.order = idx
  })
  syncToParent()
}

// 编辑分类
const editCategory = (category) => {
  editingCategory.value = category
  formData.value = {
    icon: category.icon,
    name: category.name,
    order: category.order
  }
}

// 删除分类
const deleteCategory = (categoryId) => {
  if (confirm('确定要删除这个分类吗？这将同时删除分类下的所有站点。')) {
    localCategories.value = localCategories.value.filter(cat => cat.id !== categoryId)
    syncToParent()
  }
}

// 保存分类
const saveCategory = () => {
  if (editingCategory.value) {
    // 更新现有分类
    const index = localCategories.value.findIndex(cat => cat.id === editingCategory.value.id)
    if (index !== -1) {
      localCategories.value[index] = {
        ...localCategories.value[index],
        ...formData.value
      }
    }
  } else {
    // 添加新分类
    const newCategory = {
      id: `category-${Date.now()}`,
      ...formData.value,
      sites: []
    }
    localCategories.value.push(newCategory)
  }

  syncToParent()
  closeModal()
}

// 关闭弹窗
const closeModal = () => {
  showAddModal.value = false
  editingCategory.value = null
  formData.value = {
    icon: '📁',
    name: '',
    order: localCategories.value.length
  }
}

// 处理图片错误
const handleImageError = (event) => {
  // 设置默认的 favicon.ico 作为 fallback 图片
  event.target.src = '/favicon.ico'
  event.target.onerror = null // 防止无限循环
}
</script>

<style scoped>
.category-manager {
  padding: 20px 0;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.manager-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 24px;
}

.drag-tip {
  background: #ebf5fb;
  border: 1px solid #aed6f1;
  border-radius: 6px;
  padding: 10px 16px;
  margin-bottom: 20px;
  color: #2980b9;
  font-size: 14px;
}

.tip-handle {
  display: inline-block;
  background: #d5e8f5;
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: bold;
  letter-spacing: 1px;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.add-btn, .save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn {
  background: #27ae60;
  color: white;
}

.add-btn:hover {
  background: #219a52;
}

.save-btn {
  background: #3498db;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #2980b9;
}

.save-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.category-item.clickable {
  cursor: pointer;
}

.category-item.clickable:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f1f3f4;
  border-color: #3498db;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.category-icon {
  font-size: 32px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.category-icon:hover {
  background: rgba(52, 152, 219, 0.1);
}

.category-details h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  cursor: pointer;
  transition: color 0.3s ease;
}

.category-details h3:hover {
  color: #3498db;
}

.category-details p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.order-badge {
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.edit-btn, .delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.drag-handle {
  cursor: grab;
  font-size: 18px;
  color: #95a5a6;
  user-select: none;
  padding: 5px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  line-height: 1;
}

.drag-handle:hover {
  color: #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.drag-handle:active {
  cursor: grabbing;
}

.sortable-ghost {
  opacity: 0.4;
  border: 2px dashed #3498db !important;
  background: #ebf5fb !important;
}

.sortable-chosen {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: rotate(1deg);
}

.edit-btn {
  background: #f39c12;
  color: white;
}

.edit-btn:hover {
  background: #e67e22;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background: #c0392b;
}

.sites-preview {
  margin-top: 15px;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.site-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.site-preview img {
  width: 24px;
  height: 24px;
  margin-bottom: 5px;
  object-fit: contain;
}

.site-preview span {
  font-size: 12px;
  color: #7f8c8d;
  text-align: center;
  line-height: 1.2;
}

.more-sites {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: #ecf0f1;
  border-radius: 6px;
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 500;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #7f8c8d;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
}

.category-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e1e1e1;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.icon-input {
  position: relative;
}

.icon-preview {
  font-size: 20px;
  text-align: center;
}

.emoji-suggestions {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.emoji-item:hover {
  background: #3498db;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.cancel-btn, .submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background: #7f8c8d;
}

.submit-btn {
  background: #27ae60;
  color: white;
}

.submit-btn:hover {
  background: #219a52;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .category-actions {
    flex-wrap: wrap;
  }

  .sites-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
