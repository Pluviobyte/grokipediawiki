# SEO工具使用指南

本目录包含用于修复和验证Google Search Console索引问题的工具和文档。

## 📚 文档

| 文件 | 用途 | 何时阅读 |
|------|------|---------|
| **修复总结.md** | 问题分析和修复总结 | 首先阅读,了解整体情况 |
| **SEO-FIX-GUIDE.md** | 详细的修复指南 | 需要深入了解每个问题 |
| **DEPLOYMENT-CHECKLIST.md** | 部署清单和步骤 | 准备部署时使用 |

## 🔧 工具脚本

### 1. verify-seo.js - SEO验证工具

**作用:** 检查网站的SEO配置是否正确

**使用:**
```bash
node verify-seo.js
```

**检查项目:**
- ✅ 所有页面的canonical标签
- ✅ Canonical URL格式是否正确
- ✅ Meta描述是否存在
- ✅ Sitemap URL有效性
- ✅ robots.txt配置

**输出示例:**
```
🔍 SEO Verification Report
============================================================

1. Checking Canonical Tags...
✅ All pages have canonical tags
✅ All canonical URLs use correct format (no .html)

2. Checking Sitemap URLs...
📄 Total URLs in sitemap: 37
✅ All sitemap URLs use correct format
✅ All sitemap URLs have corresponding files

🎉 No critical SEO issues found!
```

**何时使用:**
- 每次构建后
- 部署前
- 修改页面配置后
- 定期审计(每月)

---

### 2. fix-paths.js - Path配置修复工具

**作用:** 批量修复frontmatter中的path配置

**使用:**
```bash
node fix-paths.js
```

**功能:**
- 自动扫描所有 `.hbs` 和 `.html` 文件
- 将 `"path": "xxx.html"` 替换为 `"path": "xxx/"`
- 报告修复的文件数量

**输出示例:**
```
✓ Fixed: news/wikipedia-content-dependency.hbs
✓ Fixed: news/wikipedia-ai-strategy.hbs
✓ Fixed: analysis/launch-controversy.hbs
...
✅ Fixed 19 files with incorrect path configurations
```

**何时使用:**
- ⚠️ 已经运行过一次,通常不需要再次运行
- 添加新页面后如果path配置错误
- 批量更新URL结构时

---

## 🚀 快速开始

### 第一次使用

1. **构建网站**
   ```bash
   npm run build
   ```

2. **验证SEO配置**
   ```bash
   node verify-seo.js
   ```

3. **如果有错误,查看详细信息**
   - 阅读 `修复总结.md` 了解常见问题
   - 查看 `SEO-FIX-GUIDE.md` 获取修复方案

4. **准备部署**
   - 按照 `DEPLOYMENT-CHECKLIST.md` 执行

---

## 📋 常见问题

### Q1: verify-seo.js报告缺少canonical标签

**原因:**
- 页面的frontmatter没有被正确解析
- 页面没有使用 `layout: "main"`
- 文件是 `.html` 而不是 `.hbs`

**解决:**
1. 检查frontmatter的JSON语法
2. 确保有 `"layout": "main"`
3. 将 `.html` 文件重命名为 `.hbs`

### Q2: canonical URL包含 .html

**原因:**
- Frontmatter中的 `path` 配置包含 `.html`

**解决:**
```bash
# 自动修复
node fix-paths.js

# 或手动修改
# 将 "path": "/news/article.html"
# 改为 "path": "/news/article/"
```

### Q3: Sitemap中的URL文件不存在

**原因:**
- Sitemap中的URL与实际文件不匹配
- URL格式错误

**解决:**
1. 检查 `dist/sitemap.xml`
2. 确保每个URL对应的文件存在
3. 更新sitemap或创建缺失的页面

### Q4: 构建后某些页面missing meta description

**原因:**
- Frontmatter缺少 `description` 字段
- JSON语法错误导致frontmatter未解析

**解决:**
1. 在frontmatter中添加 `"description": "..."`
2. 验证JSON语法(尤其注意逗号和括号)

---

## 🔄 工作流程

### 日常开发

```bash
# 1. 修改页面或添加新页面
vim src/pages/news/new-article.hbs

# 2. 构建
npm run build

# 3. 验证
node verify-seo.js

# 4. 如果通过,提交
git add .
git commit -m "Add new article"
git push
```

### 部署前检查

```bash
# 1. 完整构建
npm run build

# 2. SEO验证
node verify-seo.js

# 3. 如果通过,继续部署流程
# 参考 DEPLOYMENT-CHECKLIST.md
```

### 发现问题后

```bash
# 1. 查看详细报告
node verify-seo.js > seo-report.txt
cat seo-report.txt

# 2. 根据错误类型查阅文档
# - Canonical问题 → SEO-FIX-GUIDE.md 第1节
# - 404问题 → SEO-FIX-GUIDE.md 第2节
# - 等等

# 3. 修复后重新验证
node verify-seo.js
```

---

## 📊 验证通过标准

运行 `node verify-seo.js` 应该看到:

```
✅ All pages have canonical tags
✅ All canonical URLs use correct format (no .html)
✅ All pages have meta descriptions
✅ All meta descriptions are adequate length (≥50 chars)
✅ All sitemap URLs use correct format
✅ All sitemap URLs have corresponding files
✅ robots.txt exists
✅ robots.txt includes sitemap reference

🎉 No critical SEO issues found!
```

如果看到任何 ❌ 或 ⚠️,请根据提示修复。

---

## 🛠️ 自定义和扩展

### 添加新的SEO检查

编辑 `verify-seo.js`,添加新的检查函数:

```javascript
// 例如:检查标题长度
console.log('\n5. Checking Title Length...\n');

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);

  if (titleMatch) {
    const title = titleMatch[1];
    if (title.length > 60) {
      console.log(`⚠️  Title too long: ${file}`);
      console.log(`   Length: ${title.length} chars`);
    }
  }
});
```

### 集成到CI/CD

在 `.github/workflows/deploy.yml` 中:

```yaml
- name: Install dependencies
  run: npm ci

- name: Build site
  run: npm run build

- name: Verify SEO
  run: |
    node verify-seo.js
    if [ $? -ne 0 ]; then
      echo "SEO validation failed"
      exit 1
    fi

- name: Deploy
  run: npm run deploy
```

---

## 📝 最佳实践

### 创建新页面时

1. **使用 `.hbs` 扩展名**
   ```
   src/pages/news/my-article.hbs  ✅
   src/pages/news/my-article.html ❌
   ```

2. **使用正确的path格式**
   ```json
   {
     "path": "/news/my-article/",  ✅
     "path": "/news/my-article.html" ❌
   }
   ```

3. **包含所有必需字段**
   ```json
   {
     "layout": "main",
     "title": "...",
     "description": "...",
     "keywords": "...",
     "path": "/news/my-article/"
   }
   ```

4. **验证JSON语法**
   - 使用JSON linter
   - 注意逗号和括号
   - 检查引号配对

### 定期维护

- ⏰ **每月:** 运行 `node verify-seo.js`
- ⏰ **每季度:** 审查Google Search Console数据
- ⏰ **添加页面后:** 验证SEO配置
- ⏰ **部署前:** 必须通过验证

---

## 🆘 获取帮助

如果遇到问题:

1. **查看错误信息**
   - `verify-seo.js` 会给出具体的错误位置

2. **查阅文档**
   - 修复总结.md - 常见问题
   - SEO-FIX-GUIDE.md - 详细解决方案

3. **检查示例**
   - 查看已经正确配置的页面
   - 复制其frontmatter结构

4. **验证语法**
   - 使用在线JSON validator
   - 检查Handlebars模板语法

---

**工具版本:** 1.0
**最后更新:** 2025-11-14
**状态:** ✅ 稳定可用
