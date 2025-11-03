# SEO 建站检查标准 SOP

> **版本**: 1.0
> **最后更新**: 2025-11-03
> **适用范围**: 所有新建网站项目
> **目的**: 确保网站从一开始就具备正确的 SEO 配置，避免索引问题

---

## 📋 目录

1. [核心原则](#核心原则)
2. [建站前规划](#建站前规划)
3. [域名配置检查清单](#域名配置检查清单)
4. [HTML 代码检查清单](#html-代码检查清单)
5. [服务器配置检查清单](#服务器配置检查清单)
6. [SEO 文件检查清单](#seo-文件检查清单)
7. [一致性验证](#一致性验证)
8. [Search Console 配置](#search-console-配置)
9. [上线后验证](#上线后验证)
10. [常见错误和解决方案](#常见错误和解决方案)
11. [AI 自查提示词](#ai-自查提示词)

---

## 核心原则

### 黄金法则：三者必须一致

```
┌─────────────────────────────────────────────┐
│ 1. 服务器重定向配置                         │
│ 2. HTML Canonical 标签                      │
│ 3. Sitemap 中的 URL                         │
│                                             │
│ ⚠️  三者必须指向相同的域名格式！            │
└─────────────────────────────────────────────┘
```

### SEO 索引三大支柱

```
支柱 1: 服务器行为（重定向）
└─ 告诉浏览器和爬虫如何访问网站

支柱 2: HTML 标签（Canonical）
└─ 声明页面的官方 URL

支柱 3: 网站地图（Sitemap）
└─ 列出所有需要索引的页面
```

### 一致性是关键

```
✓ 正确示例：
  服务器: grokipediawiki.com → 200 OK
  重定向: www.grokipediawiki.com → grokipediawiki.com
  Canonical: https://grokipediawiki.com/
  Sitemap: https://grokipediawiki.com/

✗ 错误示例：
  服务器: grokipediawiki.com → www.grokipediawiki.com
  Canonical: https://grokipediawiki.com/
  Sitemap: https://www.grokipediawiki.com/

  ⚠️ 矛盾！Google 会困惑！
```

---

## 建站前规划

### 第一步：确定主域名格式

**在开始编码之前，必须决定：**

```
选项 A: example.com (不带 www)
选项 B: www.example.com (带 www)

考虑因素：
├─ 品牌形象（www 更传统，非 www 更现代）
├─ 输入便利性（非 www 更短）
├─ 团队偏好
└─ 技术考虑（CDN、DNS 配置）

⚠️ 一旦决定，整个项目必须统一使用！
```

### 第二步：文档化决策

**在项目根目录创建 `SEO-CONFIG.md`：**

```markdown
# SEO 配置决策

## 主域名
- 主域名格式: https://example.com (不带 www)
- 备用域名: https://www.example.com (重定向到主域名)

## 配置要求
- 所有 canonical 标签使用: https://example.com
- Sitemap 中所有 URL 使用: https://example.com
- 服务器配置: www.example.com → example.com (308)

## 更新日期
- 创建: 2025-XX-XX
- 最后检查: 2025-XX-XX
```

### 第三步：创建配置模板

**HTML 模板 `_template.html`：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO Meta Tags -->
  <title>页面标题 - 网站名称</title>
  <meta name="description" content="页面描述，150-160 字符">
  <meta name="robots" content="index, follow">

  <!-- Canonical URL - 必须设置 -->
  <link rel="canonical" href="https://example.com/page-path/">

  <!-- Open Graph -->
  <meta property="og:title" content="页面标题">
  <meta property="og:description" content="页面描述">
  <meta property="og:url" content="https://example.com/page-path/">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="页面标题">
  <meta name="twitter:description" content="页面描述">
</head>
<body>
  <!-- 页面内容 -->
</body>
</html>
```

---

## 域名配置检查清单

### DNS 配置

```
□ A 记录配置
  主域名: @ 或留空 → 服务器 IP
  www: www → 服务器 IP 或 CNAME 到主域名

□ HTTPS 证书
  包含主域名和 www 域名

□ DNS 传播验证
  使用工具检查全球 DNS 解析状态
```

### 托管平台配置 (Vercel/Netlify/等)

```
□ 添加主域名 (example.com)
  └─ 设置为 Production Domain

□ 添加 www 域名 (www.example.com)
  └─ 设置为重定向到主域名
  └─ 类型: 308 Permanent Redirect

□ 验证配置
  使用 curl 或在线工具测试重定向
```

### 重定向配置验证

**使用命令行测试：**

```bash
# 测试主域名（应该返回 200）
curl -I https://example.com/

# 预期结果：
# HTTP/2 200 OK

# 测试 www 域名（应该重定向）
curl -I https://www.example.com/

# 预期结果：
# HTTP/2 308 Permanent Redirect
# location: https://example.com/

# 测试 HTTP（应该重定向到 HTTPS）
curl -I http://example.com/

# 预期结果：
# HTTP/1.1 308 Permanent Redirect
# location: https://example.com/
```

**使用在线工具测试：**

```
工具: https://www.redirect-checker.org/
测试 URL: https://www.example.com
期望: 308 → https://example.com
```

---

## HTML 代码检查清单

### 每个页面必须包含的标签

```html
□ Canonical 标签（必需）
  <link rel="canonical" href="https://example.com/page/">

  规则:
  ├─ 必须使用绝对 URL
  ├─ 必须使用 HTTPS
  ├─ 必须使用主域名格式
  ├─ 末尾斜杠保持一致
  └─ 指向页面自己（不是其他页面）

□ Title 标签（必需）
  <title>页面标题 - 网站名称</title>

  规则:
  ├─ 每个页面唯一
  ├─ 50-60 字符最佳
  ├─ 包含关键词
  └─ 吸引点击

□ Meta Description（必需）
  <meta name="description" content="页面描述">

  规则:
  ├─ 每个页面唯一
  ├─ 150-160 字符
  ├─ 准确描述页面内容
  └─ 包含关键词

□ Robots Meta（推荐）
  <meta name="robots" content="index, follow">

  选项:
  ├─ index / noindex
  └─ follow / nofollow

□ Viewport（必需 - 移动端）
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

□ Language（推荐）
  <html lang="zh-CN"> 或 <html lang="en">
```

### Open Graph 标签（社交分享）

```html
□ 基础 OG 标签
  <meta property="og:title" content="页面标题">
  <meta property="og:description" content="页面描述">
  <meta property="og:url" content="https://example.com/page/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://example.com/image.jpg">

  规则:
  └─ og:url 必须与 canonical 一致
```

### Twitter Card 标签（推荐）

```html
□ Twitter Card 标签
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="页面标题">
  <meta name="twitter:description" content="页面描述">
  <meta name="twitter:image" content="https://example.com/image.jpg">
```

### 批量检查脚本

**检查所有 HTML 文件的 canonical 标签：**

```bash
# 查找所有 canonical 标签
grep -r 'rel="canonical"' . --include="*.html"

# 检查是否有 www 版本（不应该有）
grep -r 'canonical.*www\.example\.com' . --include="*.html"

# 计数检查
grep -r 'rel="canonical"' . --include="*.html" | wc -l
```

---

## 服务器配置检查清单

### Vercel 配置

```
□ 域名设置
  Settings → Domains

  配置:
  ├─ example.com → Production
  └─ www.example.com → Redirect to example.com (308)

□ HTTPS 强制
  自动启用，无需额外配置

□ 不要使用 vercel.json 配置重定向
  原因: 可能与项目设置冲突，导致循环

  ⚠️ 如果已有 vercel.json，检查是否与域名设置冲突
```

### Nginx 配置（如果自托管）

```nginx
□ HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 308 https://example.com$request_uri;
}

□ www 重定向到非 www
server {
    listen 443 ssl http2;
    server_name www.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    return 308 https://example.com$request_uri;
}

□ 主站点配置
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/html;
    index index.html;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;
}
```

### Apache 配置（如果使用 .htaccess）

```apache
□ .htaccess 重定向配置
# 强制 HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://example.com/$1 [R=308,L]

# www 重定向到非 www
RewriteCond %{HTTP_HOST} ^www\.example\.com [NC]
RewriteRule ^(.*)$ https://example.com/$1 [R=308,L]
```

---

## SEO 文件检查清单

### robots.txt

```
□ 创建 robots.txt 文件
  位置: /public/robots.txt 或网站根目录

□ 基础配置
# robots.txt for [网站名称]

User-agent: *
Allow: /

# Sitemap
Sitemap: https://example.com/sitemap.xml

# Crawl-delay (可选)
Crawl-delay: 1

# 禁止抓取的目录（如果有）
Disallow: /admin/
Disallow: /api/
Disallow: /.git/

□ 验证规则
  ├─ Sitemap URL 使用主域名格式
  ├─ 不要阻止重要内容
  └─ 不要阻止 CSS/JS（影响渲染）

□ 测试访问
  https://example.com/robots.txt
```

### sitemap.xml

```xml
□ 创建 sitemap.xml 文件
  位置: /public/sitemap.xml 或网站根目录

□ 基础结构
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://example.com/about/</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>

□ URL 规则
  ├─ 使用绝对 URL
  ├─ 使用 HTTPS
  ├─ 使用主域名格式（不带 www）
  ├─ 只包含可索引的页面
  ├─ 不包含重定向的 URL
  └─ 不包含被 robots.txt 阻止的 URL

□ 优先级设置建议
  ├─ 首页: 1.0
  ├─ 主要栏目: 0.8-0.9
  ├─ 重要文章: 0.7-0.8
  └─ 次要页面: 0.5-0.6

□ 更新频率设置
  ├─ 首页: daily 或 weekly
  ├─ 新闻/博客: daily 或 weekly
  ├─ 普通页面: weekly 或 monthly
  └─ 静态页面: monthly 或 yearly

□ 验证
  ├─ XML 格式正确（使用验证器）
  ├─ 可以访问: https://example.com/sitemap.xml
  └─ 文件大小 < 50MB，URL < 50,000 个
```

### Sitemap 验证脚本

```bash
# 检查 sitemap 中的域名格式
grep -o '<loc>https://[^<]*</loc>' sitemap.xml | head -10

# 统计非 www URL 数量（应该等于总数）
grep -c '<loc>https://example.com/' sitemap.xml

# 统计 www URL 数量（应该为 0）
grep -c '<loc>https://www.example.com/' sitemap.xml

# 验证 XML 格式
xmllint --noout sitemap.xml && echo "XML 格式正确"
```

---

## 一致性验证

### 自动化检查脚本

```bash
#!/bin/bash
# seo-consistency-check.sh
# 检查 SEO 配置一致性

DOMAIN="example.com"
WWW_DOMAIN="www.example.com"
EXPECTED_CANONICAL="https://${DOMAIN}/"

echo "=== SEO 配置一致性检查 ==="
echo ""

# 1. 检查主域名重定向
echo "1. 检查主域名..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN}/)
if [ "$MAIN_STATUS" = "200" ]; then
    echo "   ✓ 主域名返回 200 OK"
else
    echo "   ✗ 主域名返回 $MAIN_STATUS (期望 200)"
fi

# 2. 检查 www 重定向
echo "2. 检查 www 重定向..."
WWW_REDIRECT=$(curl -s -I https://${WWW_DOMAIN}/ | grep -i "^location:" | awk '{print $2}' | tr -d '\r')
if [[ "$WWW_REDIRECT" == "https://${DOMAIN}/"* ]]; then
    echo "   ✓ www 正确重定向到非 www"
else
    echo "   ✗ www 重定向错误: $WWW_REDIRECT"
fi

# 3. 检查 canonical 标签
echo "3. 检查 canonical 标签..."
CANONICAL=$(curl -s https://${DOMAIN}/ | grep -o '<link rel="canonical"[^>]*>' | grep -o 'href="[^"]*"' | cut -d'"' -f2)
if [ "$CANONICAL" = "$EXPECTED_CANONICAL" ]; then
    echo "   ✓ Canonical 标签正确"
else
    echo "   ✗ Canonical 标签错误: $CANONICAL (期望 $EXPECTED_CANONICAL)"
fi

# 4. 检查 sitemap URL
echo "4. 检查 sitemap..."
SITEMAP_URLS=$(curl -s https://${DOMAIN}/sitemap.xml | grep -c "<loc>https://${DOMAIN}/")
WWW_URLS=$(curl -s https://${DOMAIN}/sitemap.xml | grep -c "<loc>https://${WWW_DOMAIN}/")
echo "   非 www URL: $SITEMAP_URLS"
echo "   www URL: $WWW_URLS"
if [ "$WWW_URLS" = "0" ]; then
    echo "   ✓ Sitemap URL 格式正确"
else
    echo "   ✗ Sitemap 包含 www URL"
fi

# 5. 检查 robots.txt
echo "5. 检查 robots.txt..."
ROBOTS_SITEMAP=$(curl -s https://${DOMAIN}/robots.txt | grep "Sitemap:" | awk '{print $2}')
if [[ "$ROBOTS_SITEMAP" == "https://${DOMAIN}/"* ]]; then
    echo "   ✓ robots.txt Sitemap 路径正确"
else
    echo "   ✗ robots.txt Sitemap 路径错误: $ROBOTS_SITEMAP"
fi

echo ""
echo "=== 检查完成 ==="
```

**使用方法：**

```bash
# 修改脚本中的 DOMAIN 变量
# 然后运行
chmod +x seo-consistency-check.sh
./seo-consistency-check.sh
```

### 手动验证清单

```
□ 重定向验证
  访问 https://www.example.com
  └─ 地址栏应自动变为 https://example.com

□ Canonical 验证
  查看页面源代码
  └─ 搜索 "canonical"
  └─ 确认指向 https://example.com/page/

□ Sitemap 验证
  访问 https://example.com/sitemap.xml
  └─ 查看所有 <loc> 标签
  └─ 确认都是 https://example.com/ 开头

□ robots.txt 验证
  访问 https://example.com/robots.txt
  └─ 确认 Sitemap 行指向正确的域名

□ 浏览器开发者工具验证
  F12 → Network 标签
  └─ 访问 www.example.com
  └─ 查看是否有 308 重定向
```

---

## Search Console 配置

### 添加资源

```
□ 登录 Google Search Console
  https://search.google.com/search-console

□ 添加主域名资源
  ├─ 选择 "网址前缀" 类型
  ├─ 输入: https://example.com
  └─ 完成所有权验证

□ 添加 www 域名资源（可选但推荐）
  ├─ 输入: https://www.example.com
  └─ 完成验证
  └─ 用于监控重定向是否正常

□ 添加 HTTP 版本（可选）
  ├─ http://example.com
  └─ http://www.example.com
  └─ 监控 HTTPS 迁移状态
```

### 提交 Sitemap

```
□ 在主域名资源中
  左侧菜单 → 索引 → 站点地图

□ 提交 sitemap
  ├─ 输入: sitemap.xml（只输入文件名）
  ├─ 点击 "提交"
  └─ 等待 5-10 分钟查看状态

□ 验证状态
  ├─ 状态: 成功
  ├─ 已发现的网址: [数量]
  └─ 上次读取时间: [最近]
```

### 请求索引（上线后）

```
□ 使用 URL 检查工具
  ├─ 在顶部搜索框输入完整 URL
  ├─ 等待检查完成
  └─ 点击 "请求编入索引"

□ 优先级顺序
  1. 首页
  2. 主要栏目页
  3. 重要内容页
  4. 其他页面（让 Google 自然发现）

□ 注意事项
  ├─ 每个 URL 间隔 1-2 分钟
  ├─ 每天限制约 10-20 个请求
  └─ 遇到配额限制就停止
```

---

## 上线后验证

### 立即验证（上线后 10 分钟）

```
□ 重定向功能测试
  ├─ 访问 http://example.com → 应该重定向到 https://example.com
  ├─ 访问 http://www.example.com → 应该重定向到 https://example.com
  ├─ 访问 https://www.example.com → 应该重定向到 https://example.com
  └─ 访问 https://example.com → 应该正常显示，不重定向

□ 文件可访问性
  ├─ https://example.com/robots.txt → 可以打开
  ├─ https://example.com/sitemap.xml → 可以打开
  └─ https://example.com/favicon.ico → 可以打开

□ 页面渲染检查
  ├─ 首页正常显示
  ├─ CSS 加载正常
  ├─ JavaScript 运行正常
  └─ 图片加载正常

□ 移动端测试
  ├─ 响应式设计正常
  └─ 移动端可以正常访问
```

### 24 小时后验证

```
□ Search Console 检查
  ├─ 覆盖率报告: 是否有错误
  ├─ Sitemap 状态: 是否成功
  └─ URL 检查: 测试几个重要页面

□ 索引状态检查
  使用 Google 搜索:
  site:example.com

  └─ 查看是否有页面被索引
  └─ 查看索引的是否是正确的 URL 格式
```

### 一周后验证

```
□ 索引进度
  ├─ Search Console → 覆盖率报告
  ├─ "有效页面" 数量
  └─ "已排除" 原因

□ 重定向验证
  ├─ www.example.com 资源
  └─ 应该显示 "网页会自动重定向"

□ 效果数据
  ├─ 是否开始有展示次数
  └─ 是否开始有点击次数
```

---

## 常见错误和解决方案

### 错误 1: 网页会自动重定向

**症状：**
```
Search Console 显示:
"网页会自动重定向"
页面无法编入索引
```

**原因分析：**
```
1. 重定向配置与 canonical 标签不一致
   重定向: A → B
   Canonical: 指向 A

2. 重定向循环
   A → B → A

3. 不必要的重定向链
   A → B → C → D
```

**解决方案：**
```
1. 检查一致性
   ├─ 确保 canonical 指向最终 URL
   ├─ 确保 sitemap 包含最终 URL
   └─ 确保重定向指向正确方向

2. 消除重定向循环
   ├─ 检查服务器配置
   ├─ 检查代码中的重定向
   └─ 确保单向重定向

3. 简化重定向链
   └─ 直接重定向到最终 URL
```

### 错误 2: 重复内容

**症状：**
```
Search Console 显示:
"Google 选择的规范网址与用户不同"
```

**原因分析：**
```
1. 多个 URL 返回相同内容
   ├─ example.com/page
   ├─ www.example.com/page
   └─ 没有 canonical 标签或重定向

2. 参数变化但内容相同
   ├─ example.com/page
   ├─ example.com/page?ref=123
   └─ example.com/page?utm_source=twitter
```

**解决方案：**
```
1. 设置正确的重定向
   └─ 所有变体重定向到主 URL

2. 添加 canonical 标签
   └─ 指向首选 URL

3. 使用 URL 参数工具
   └─ Search Console → 旧版工具
   └─ 告诉 Google 忽略特定参数
```

### 错误 3: Sitemap 无法访问

**症状：**
```
Search Console 显示:
"无法获取"
"HTTP 错误"
```

**原因分析：**
```
1. 文件不存在或路径错误
2. 服务器返回错误（404, 500）
3. robots.txt 阻止访问
4. 文件权限问题
```

**解决方案：**
```
1. 验证文件存在
   └─ 在浏览器中访问 sitemap.xml

2. 检查服务器配置
   └─ 确保 XML 文件可以访问

3. 检查 robots.txt
   └─ 确保没有 Disallow: /sitemap.xml

4. 检查 MIME 类型
   └─ 应该返回 application/xml 或 text/xml
```

### 错误 4: 索引速度慢

**症状：**
```
提交 sitemap 很久，但页面未索引
```

**原因分析：**
```
1. 网站新建，Google 信任度低
2. 内容质量问题
3. 技术问题（加载慢、JS 渲染）
4. 抓取配额不足
```

**解决方案：**
```
1. 主动请求索引
   └─ 使用 URL 检查工具

2. 提高内容质量
   ├─ 原创内容
   ├─ 有价值的信息
   └─ 良好的用户体验

3. 优化技术性能
   ├─ 提高加载速度
   ├─ 确保移动端友好
   └─ 修复技术错误

4. 获取外部链接
   └─ 增加网站权威性
```

---

## AI 自查提示词

### 建站完成后的自查提示

**复制以下提示词让 AI 进行检查：**

```
请根据 SEO-建站检查标准-SOP.md 对当前网站进行完整的 SEO 配置检查。

网站信息：
- 域名: [填写域名]
- 主域名格式: [www/非www]
- 托管平台: [Vercel/Netlify/其他]

请按以下顺序检查：

1. 域名配置
   - 检查重定向是否正确配置
   - 验证 HTTP → HTTPS
   - 验证 www → 非www（或相反）

2. HTML 代码
   - 扫描所有 HTML 文件
   - 检查 canonical 标签一致性
   - 验证 meta 标签完整性

3. SEO 文件
   - 检查 robots.txt 配置
   - 检查 sitemap.xml 格式和 URL
   - 验证文件可访问性

4. 一致性验证
   - 对比服务器重定向、canonical、sitemap
   - 识别任何不一致之处

5. 生成报告
   - 列出所有发现的问题
   - 按严重程度排序（严重/警告/建议）
   - 提供具体的修复步骤

请使用检查清单格式，每项标记 ✓ 或 ✗。
```

### 快速验证提示词

```
快速检查以下 SEO 配置项：

1. 运行命令：
curl -I https://[域名]/
curl -I https://www.[域名]/

2. 检查以下文件中的域名格式：
- 所有 HTML 文件的 canonical 标签
- sitemap.xml 中的所有 URL
- robots.txt 中的 Sitemap 行

3. 报告任何不一致的地方

域名：[填写域名]
期望格式：[www/非www]
```

### 问题诊断提示词

```
我的网站在 Google Search Console 中显示错误：
"[填写错误信息]"

网站配置：
- 域名: [填写]
- 错误页面: [填写 URL]
- 托管平台: [填写]

请参考 SEO-建站检查标准-SOP.md 中的"常见错误和解决方案"章节：

1. 识别这是哪一类错误
2. 分析可能的原因
3. 提供诊断步骤
4. 给出具体的修复方案
5. 说明预期的恢复时间

请一步步指导我解决这个问题。
```

---

## 检查清单总览

### 建站前检查（规划阶段）

```
□ 确定主域名格式（www/非www）
□ 创建 SEO-CONFIG.md 文档
□ 准备 HTML 模板
□ 准备 robots.txt 模板
□ 准备 sitemap.xml 模板
```

### 开发阶段检查

```
□ 所有页面包含 canonical 标签
□ Canonical 使用一致的域名格式
□ 所有页面包含 title 和 description
□ 所有页面包含 viewport meta
□ Open Graph 标签配置正确
□ robots.txt 配置正确
□ sitemap.xml 配置正确
□ Sitemap URL 使用一致的域名格式
```

### 部署前检查

```
□ 域名 DNS 配置正确
□ SSL 证书已安装
□ 服务器重定向配置正确
□ 运行一致性检查脚本
□ 本地测试所有重定向
□ 验证所有 SEO 文件可访问
```

### 上线后检查

```
□ 验证所有重定向功能
□ 验证文件可访问性
□ 添加到 Search Console
□ 提交 Sitemap
□ 请求索引重要页面
□ 设置监控提醒
```

### 定期维护检查

```
每周:
□ 检查 Search Console 错误
□ 查看索引状态
□ 监控流量变化

每月:
□ 更新 sitemap lastmod
□ 检查断链
□ 审查新增页面的 SEO 配置
□ 运行一致性检查脚本

每季度:
□ 全面 SEO 审计
□ 竞争对手分析
□ 性能优化检查
□ 移动端体验检查
```

---

## 工具和资源

### 在线检查工具

```
重定向检查:
• https://www.redirect-checker.org/
• https://httpstatus.io/

Canonical 检查:
• https://www.duplichecker.com/canonical-tag-checker.php

Sitemap 验证:
• https://www.xml-sitemaps.com/validate-xml-sitemap.html
• Google Search Console (站点地图报告)

robots.txt 测试:
• Google Search Console → robots.txt 测试工具

移动端友好性:
• https://search.google.com/test/mobile-friendly

页面速度:
• https://pagespeed.web.dev/
• https://gtmetrix.com/

结构化数据:
• https://search.google.com/test/rich-results
```

### 命令行工具

```bash
# 检查重定向
curl -I https://example.com/

# 检查 HTTPS
curl -I https://example.com/ | grep "HTTP"

# 提取 canonical
curl -s https://example.com/ | grep canonical

# 验证 sitemap
xmllint --noout sitemap.xml

# 批量检查 canonical
grep -r 'rel="canonical"' . --include="*.html"
```

### 浏览器扩展

```
SEO 检查:
• SEO Meta in 1 Click (Chrome/Firefox)
• SEOquake (Chrome/Firefox)

重定向跟踪:
• Redirect Path (Chrome)
• HTTP Header Live (Firefox)
```

---

## 版本历史

```
v1.0 - 2025-11-03
- 初始版本
- 基于 grokipediawiki.com 项目实践经验
- 包含完整的检查清单和解决方案
```

---

## 附录：术语表

```
Canonical 标签: 声明页面官方 URL 的 HTML 标签
Googlebot: Google 的网页抓取机器人
索引 (Index): Google 数据库中存储的网页
抓取 (Crawl): Googlebot 访问和下载网页的过程
Sitemap: 列出网站所有页面的 XML 文件
robots.txt: 告诉搜索引擎哪些内容可以抓取的文件
301/308 重定向: 永久重定向
302/307 重定向: 临时重定向
HSTS: HTTP 严格传输安全，强制使用 HTTPS
CDN: 内容分发网络
DNS: 域名系统
TTL: 生存时间，DNS 缓存时间
```

---

## 联系和反馈

如果在使用此 SOP 过程中发现问题或有改进建议，请：

1. 在项目中创建 issue
2. 提交 pull request
3. 更新版本历史

---

**记住：一致性是 SEO 成功的关键！**

在开始编码之前确定主域名格式，然后在整个项目中保持一致。
