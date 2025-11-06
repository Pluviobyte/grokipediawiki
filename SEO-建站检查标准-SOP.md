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

## AI代码完成后质量检查SOP

> **重要性**: ⭐⭐⭐⭐⭐ 强制执行
> **检查时机**: 每次AI完成网页代码编写后，构建前必须执行
> **目的**: 避免结构化数据错误、404错误和索引问题

---

### 检查流程概览

```
AI完成代码
    ↓
1. 结构化数据检查
    ↓
2. Sitemap一致性检查
    ↓
3. 构建系统验证
    ↓
4. 实际文件验证
    ↓
执行构建
    ↓
部署上线
```

---

### 1. 结构化数据检查（Schema.org）

#### 1.1 面包屑导航（BreadcrumbList）检查

**检查位置**: 所有包含面包屑的HTML/模板文件

**必查项目**:

```html
□ 检查1: 每个面包屑项必须包含 itemprop="item"

  错误示例 ❌:
  <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
    <span itemprop="name">页面名称</span>  <!-- ❌ 缺少 item 属性 -->
    <meta itemprop="position" content="2" />
  </span>

  正确示例 ✅:
  <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
    <span itemprop="item">  <!-- ✅ 添加了 item -->
      <span itemprop="name">页面名称</span>
    </span>
    <meta itemprop="position" content="2" />
  </span>

  或者（如果有链接）:
  <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
    <a itemprop="item" href="/page/">  <!-- ✅ 链接本身就是 item -->
      <span itemprop="name">页面名称</span>
    </a>
    <meta itemprop="position" content="2" />
  </span>

□ 检查2: position值必须从1开始连续递增

  错误示例 ❌:
  position: 1 → 0 → 1  <!-- ❌ 从0开始或重复 -->

  正确示例 ✅:
  position: 1 → 2 → 3  <!-- ✅ 连续递增 -->

□ 检查3: 面包屑结构必须完整

  必需属性:
  ├─ @type: "BreadcrumbList"
  ├─ itemListElement 数组
  │   └─ 每个元素包含:
  │       ├─ @type: "ListItem"
  │       ├─ position: 数字
  │       ├─ item: URL或对象
  │       └─ name: 显示文本
  └─ 所有层级都有正确的 itemscope/itemtype
```

**检查命令**:

```bash
# 1. 查找所有面包屑实现
grep -r "BreadcrumbList" . --include="*.html" --include="*.hbs" --include="*.jsx" --include="*.tsx"

# 2. 检查是否所有itemListElement都有item属性
grep -A 5 "itemListElement" src/**/*.{html,hbs} | grep -v "itemprop=\"item\""

# 3. 检查position值
grep -o 'itemprop="position" content="[0-9]*"' dist/**/*.html | sort | uniq
```

**使用在线工具验证**:

```
工具: Google 富媒体结果测试
URL: https://search.google.com/test/rich-results

步骤:
1. 输入页面URL或粘贴HTML代码
2. 查看"BreadcrumbList"检测结果
3. 确保没有错误或警告
4. 验证所有必需属性都存在
```

---

#### 1.2 其他结构化数据检查

**文章页面 (Article/BlogPosting)**:

```html
□ 必需属性检查
  ├─ headline: 文章标题
  ├─ datePublished: 发布日期
  ├─ dateModified: 修改日期
  ├─ author: 作者信息
  │   ├─ @type: "Person" 或 "Organization"
  │   └─ name: 作者名称
  ├─ publisher: 发布者
  │   ├─ @type: "Organization"
  │   ├─ name: 组织名称
  │   └─ logo: 标志图片
  └─ image: 文章图片（最少1张）

□ 日期格式必须使用 ISO 8601
  正确: "2025-11-06T08:00:00+00:00"
  错误: "2025/11/06" 或 "Nov 6, 2025"
```

**组织信息 (Organization)**:

```html
□ 必需属性检查
  ├─ @type: "Organization"
  ├─ name: 组织名称
  ├─ url: 官方网站
  └─ logo: 标志（必须是ImageObject）
      ├─ @type: "ImageObject"
      ├─ url: 图片URL
      ├─ width: 宽度
      └─ height: 高度
```

**网站搜索框 (WebSite + SearchAction)**:

```html
□ 必需属性检查
  ├─ @type: "WebSite"
  ├─ url: 网站URL
  └─ potentialAction
      ├─ @type: "SearchAction"
      ├─ target
      │   └─ urlTemplate: 搜索URL模板
      └─ query-input: 查询参数定义
```

**检查所有JSON-LD的通用规则**:

```bash
□ JSON格式验证
  - 使用JSONLint验证语法
  - 检查是否有多余的逗号
  - 检查引号配对

□ URL格式统一
  - 所有URL使用绝对路径
  - 使用HTTPS
  - 使用主域名格式（与canonical一致）
  - 末尾斜杠保持一致

□ 必需属性完整性
  - 每个@type都有对应的必需属性
  - 使用Schema.org文档查询必需属性
```

---

### 2. Sitemap.xml一致性检查

#### 2.1 URL存在性验证

**问题**: Sitemap包含不存在的页面导致404错误

**检查流程**:

```bash
# 步骤1: 提取sitemap中的所有URL
grep -o '<loc>[^<]*</loc>' public/sitemap.xml | sed 's/<loc>//;s/<\/loc>//' > /tmp/sitemap-urls.txt

# 步骤2: 验证每个URL对应的文件是否存在
while read url; do
  # 提取路径部分
  path=$(echo $url | sed 's|https://[^/]*/||')

  # 检查对应的文件
  if [ -f "dist/${path}index.html" ] || [ -f "dist/${path}" ]; then
    echo "✓ $url"
  else
    echo "✗ $url - 文件不存在!"
  fi
done < /tmp/sitemap-urls.txt
```

**Python自动化检查脚本**:

```python
# check_sitemap.py
import xml.etree.ElementTree as ET
import os
from urllib.parse import urlparse

def check_sitemap(sitemap_path, dist_dir):
    """检查sitemap中的URL是否都有对应的文件"""

    tree = ET.parse(sitemap_path)
    root = tree.getroot()

    # XML命名空间
    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

    errors = []
    success = []

    for url in root.findall('sm:url/sm:loc', ns):
        url_text = url.text
        parsed = urlparse(url_text)
        path = parsed.path.strip('/')

        # 可能的文件位置
        possible_files = [
            os.path.join(dist_dir, path, 'index.html'),
            os.path.join(dist_dir, path + '.html'),
            os.path.join(dist_dir, path + '/index.html'),
        ]

        file_exists = any(os.path.isfile(f) for f in possible_files)

        if file_exists:
            success.append(url_text)
        else:
            errors.append({
                'url': url_text,
                'checked_paths': possible_files
            })

    return success, errors

# 使用方法
if __name__ == '__main__':
    success, errors = check_sitemap('public/sitemap.xml', 'dist')

    print(f"✓ 验证通过: {len(success)} 个URL")

    if errors:
        print(f"\n✗ 发现问题: {len(errors)} 个URL")
        for error in errors:
            print(f"\nURL: {error['url']}")
            print(f"检查的路径:")
            for path in error['checked_paths']:
                print(f"  - {path}")
```

**手动检查清单**:

```
□ 检查新添加的页面
  每次添加新页面后，确保:
  1. 页面文件已创建
  2. Sitemap已更新
  3. URL格式正确（目录/或.html一致性）

□ 检查已删除的页面
  删除页面后，确保:
  1. 从sitemap中移除对应URL
  2. 或设置301重定向到相关页面

□ 检查URL格式
  ✓ 正确: https://example.com/page/
  ✓ 正确: https://example.com/page.html
  ✗ 错误: https://example.com/page（缺少结尾）
  ✗ 错误: 混合使用斜杠和.html格式
```

---

#### 2.2 Sitemap URL格式验证

**检查项**:

```bash
□ 所有URL必须使用主域名格式

  检查命令:
  # 检查是否有www URL（如果主域名是非www）
  grep -c '<loc>https://www\.example\.com' public/sitemap.xml

  # 结果应该是 0

□ 所有URL必须使用HTTPS

  检查命令:
  grep -c '<loc>http://' public/sitemap.xml

  # 结果应该是 0

□ URL末尾斜杠保持一致

  检查命令:
  # 列出所有URL查看格式
  grep -o '<loc>[^<]*</loc>' public/sitemap.xml

  # 检查是否混用格式
  grep '<loc>.*[^/]</loc>' public/sitemap.xml  # 不以斜杠结尾的
  grep '<loc>.*/</loc>' public/sitemap.xml     # 以斜杠结尾的

□ 日期格式正确（YYYY-MM-DD）

  检查命令:
  grep '<lastmod>' public/sitemap.xml | grep -v '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}'

  # 应该没有输出（所有日期格式正确）
```

---

### 3. 构建系统验证

#### 3.1 文件类型处理检查

**问题**: 构建系统只处理某些文件类型，导致其他文件被忽略

**检查项**:

```javascript
□ 检查构建脚本处理的文件类型

  常见构建系统配置位置:
  ├─ build.js / build.ts
  ├─ webpack.config.js
  ├─ vite.config.js
  ├─ next.config.js
  └─ package.json (scripts部分)

□ 验证所有页面文件都会被处理

  检查模式:
  // 示例：只处理.hbs文件
  const pagesPattern = '**/*.hbs'  // ❌ 会忽略.html文件

  // 改进：处理多种文件类型
  const pagesPattern = '**/*.{hbs,html,md}'  // ✅ 处理多种类型

□ 确保文件输出路径正确

  示例检查:
  // 原文件: src/pages/article.html
  // 应输出: dist/article/index.html
  // 不应该: dist/article.html（不利于SEO）
```

**构建输出验证脚本**:

```bash
# 验证构建前后的文件对应关系

echo "=== 源文件统计 ==="
echo "HBS文件: $(find src/pages -name "*.hbs" | wc -l)"
echo "HTML文件: $(find src/pages -name "*.html" | wc -l)"
echo "总计: $(find src/pages -name "*.hbs" -o -name "*.html" | wc -l)"

echo -e "\n=== 构建输出统计 ==="
echo "输出的index.html: $(find dist -name "index.html" | wc -l)"

echo -e "\n=== 文件对比 ==="
# 检查是否有源文件没有对应的输出
for file in src/pages/**/*.{html,hbs}; do
  basename=$(basename "$file" | sed 's/\..*//')
  if [ ! -f "dist/$basename/index.html" ] && [ ! -f "dist/${basename}.html" ]; then
    echo "⚠️  缺少输出: $file"
  fi
done
```

---

#### 3.2 构建系统配置示例

**Node.js构建脚本模板**:

```javascript
// build.js - 完整的构建系统示例

const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');

const SRC_DIR = path.join(__dirname, 'src/pages');
const DIST_DIR = path.join(__dirname, 'dist');

// 处理模板文件（.hbs, .ejs等）
async function buildTemplates() {
  const files = await glob('**/*.hbs', { cwd: SRC_DIR });

  for (const file of files) {
    const inputPath = path.join(SRC_DIR, file);
    const outputPath = getOutputPath(file, '.hbs');

    // 处理模板...
    await processTemplate(inputPath, outputPath);
  }

  console.log(`✓ 处理了 ${files.length} 个模板文件`);
}

// 复制静态HTML文件
async function copyStaticHtml() {
  const files = await glob('**/*.html', { cwd: SRC_DIR });

  for (const file of files) {
    const inputPath = path.join(SRC_DIR, file);
    const outputPath = getOutputPath(file, '.html');

    // 确保输出目录存在
    await fs.ensureDir(path.dirname(outputPath));

    // 复制文件
    await fs.copyFile(inputPath, outputPath);

    console.log(`✓ 复制: ${file} → ${path.relative(DIST_DIR, outputPath)}`);
  }

  console.log(`✓ 复制了 ${files.length} 个HTML文件`);
}

// 获取输出路径（转换为目录/index.html结构）
function getOutputPath(relativePath, extension) {
  const fileName = path.basename(relativePath, extension);
  const dirName = path.dirname(relativePath);

  // 如果已经是index文件，保持原样
  if (fileName === 'index') {
    return path.join(DIST_DIR, dirName, 'index.html');
  }

  // 否则创建目录结构: file.html → file/index.html
  return path.join(DIST_DIR, dirName, fileName, 'index.html');
}

// 主构建函数
async function build() {
  console.log('🚀 开始构建...\n');

  // 清理输出目录
  await fs.remove(DIST_DIR);
  await fs.ensureDir(DIST_DIR);

  // 执行构建步骤
  await buildTemplates();
  await copyStaticHtml();

  console.log('\n✅ 构建完成!');
}

build().catch(console.error);
```

---

### 4. 实际文件验证

#### 4.1 构建后检查

**在构建完成后立即执行**:

```bash
□ 统计检查

  echo "=== 构建产物统计 ==="
  echo "总HTML文件数: $(find dist -name "*.html" | wc -l)"
  echo "总目录数: $(find dist -type d | wc -l)"
  echo ""
  echo "按目录分类:"
  find dist -name "index.html" -type f | sed 's|/index.html||' | sed 's|dist/||' | sort

□ 路径结构检查

  # 列出所有页面的URL路径
  find dist -name "index.html" | sed 's|dist||;s|/index.html||;s|^|https://example.com|'

  # 与sitemap对比
  echo "Sitemap中的URL数量:"
  grep -c '<loc>' public/sitemap.xml

  echo "实际构建的页面数量:"
  find dist -name "index.html" | wc -l

□ 关键文件存在性检查

  重要文件清单:
  ├─ dist/index.html (首页)
  ├─ dist/sitemap.xml
  ├─ dist/robots.txt
  ├─ dist/favicon.ico
  └─ dist/assets/ (静态资源)

  检查命令:
  for file in index.html sitemap.xml robots.txt favicon.ico; do
    [ -f "dist/$file" ] && echo "✓ $file" || echo "✗ $file 缺失!"
  done
```

---

#### 4.2 内容验证

**检查生成的HTML内容质量**:

```bash
□ Meta标签完整性检查

  # 检查所有页面是否有canonical标签
  for file in $(find dist -name "index.html"); do
    if ! grep -q 'rel="canonical"' "$file"; then
      echo "⚠️  缺少canonical: $file"
    fi
  done

  # 检查是否有title标签
  for file in $(find dist -name "index.html"); do
    if ! grep -q '<title>' "$file"; then
      echo "⚠️  缺少title: $file"
    fi
  done

□ 结构化数据完整性检查

  # 检查面包屑页面
  for file in $(grep -l "BreadcrumbList" dist/**/*.html); do
    # 检查position值
    positions=$(grep -o 'itemprop="position" content="[0-9]*"' "$file" | grep -o '[0-9]*' | sort -n)
    echo "$file: positions = $positions"
  done

□ 链接有效性检查

  # 检查内部链接
  # 提取所有href属性
  grep -oh 'href="[^"]*"' dist/**/*.html | sort | uniq > /tmp/all-links.txt

  # 检查相对链接对应的文件是否存在
  grep 'href="/' /tmp/all-links.txt | while read link; do
    path=$(echo $link | sed 's/href="//;s/"//')
    [ -f "dist${path}" ] || [ -f "dist${path}index.html" ] || echo "⚠️  断链: $path"
  done
```

---

### 5. 自动化检查脚本模板

**综合检查脚本（check-build.sh）**:

```bash
#!/bin/bash
# check-build.sh - AI代码完成后的自动化检查脚本

set -e

DOMAIN="grokipediawiki.com"
DIST_DIR="dist"
SITEMAP="public/sitemap.xml"

echo "╔════════════════════════════════════════════════╗"
echo "║   AI代码质量检查 - SEO & 结构化数据验证        ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERROR_COUNT=0
WARNING_COUNT=0
SUCCESS_COUNT=0

# 辅助函数
error() {
    echo -e "${RED}✗${NC} $1"
    ((ERROR_COUNT++))
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNING_COUNT++))
}

success() {
    echo -e "${GREEN}✓${NC} $1"
    ((SUCCESS_COUNT++))
}

# 1. 结构化数据检查
echo "═══ 1. 结构化数据检查 ═══"
echo ""

# 1.1 检查面包屑导航
echo "1.1 检查面包屑导航..."

BREADCRUMB_FILES=$(grep -rl "BreadcrumbList" src/ --include="*.hbs" --include="*.html" 2>/dev/null || echo "")

if [ -z "$BREADCRUMB_FILES" ]; then
    warning "未找到面包屑导航实现"
else
    for file in $BREADCRUMB_FILES; do
        # 检查是否所有itemListElement都有item属性
        itemListElements=$(grep -c "itemListElement" "$file" || echo 0)
        itemProps=$(grep -c 'itemprop="item"' "$file" || echo 0)

        # itemProps应该至少等于itemListElements（包括在循环中的）
        if [ "$itemListElements" -gt 0 ]; then
            if [ "$itemProps" -gt 0 ]; then
                success "面包屑结构正确: $file"
            else
                error "面包屑缺少 itemprop='item': $file"
            fi
        fi
    done
fi

# 1.2 检查构建后的position值
if [ -d "$DIST_DIR" ]; then
    echo -e "\n1.2 检查面包屑position值..."

    for file in $(find $DIST_DIR -name "*.html" -type f); do
        if grep -q "BreadcrumbList" "$file"; then
            positions=$(grep -o 'itemprop="position" content="[0-9]*"' "$file" | grep -o '[0-9]*' | tr '\n' ' ')

            # 检查是否从1开始
            if echo "$positions" | grep -q "^1 "; then
                success "Position值正确: $(basename $(dirname $file))"
            else
                error "Position值不从1开始: $(basename $(dirname $file)) - 值: $positions"
            fi
        fi
    done
fi

echo ""

# 2. Sitemap检查
echo "═══ 2. Sitemap一致性检查 ═══"
echo ""

if [ ! -f "$SITEMAP" ]; then
    error "Sitemap文件不存在: $SITEMAP"
else
    success "Sitemap文件存在"

    # 2.1 检查URL格式
    echo -e "\n2.1 检查URL格式..."

    www_count=$(grep -c "www\.$DOMAIN" "$SITEMAP" 2>/dev/null || echo 0)
    if [ "$www_count" -gt 0 ]; then
        error "Sitemap包含www URL: $www_count 个"
    else
        success "Sitemap URL格式正确（无www）"
    fi

    http_count=$(grep -c '<loc>http://' "$SITEMAP" 2>/dev/null || echo 0)
    if [ "$http_count" -gt 0 ]; then
        error "Sitemap包含HTTP URL: $http_count 个"
    else
        success "Sitemap全部使用HTTPS"
    fi

    # 2.2 检查URL存在性
    echo -e "\n2.2 检查URL对应文件存在性..."

    if [ -d "$DIST_DIR" ]; then
        missing_count=0
        total_count=0

        while IFS= read -r url; do
            ((total_count++))

            # 提取路径
            path=$(echo "$url" | sed "s|https://$DOMAIN||" | sed 's|/$||')

            # 检查文件是否存在
            if [ -z "$path" ]; then
                # 首页
                [ -f "$DIST_DIR/index.html" ] || ((missing_count++))
            else
                if [ ! -f "$DIST_DIR${path}/index.html" ] && [ ! -f "$DIST_DIR${path}.html" ]; then
                    error "文件不存在: $url"
                    ((missing_count++))
                fi
            fi
        done < <(grep -o '<loc>[^<]*</loc>' "$SITEMAP" | sed 's|</*loc>||g')

        if [ "$missing_count" -eq 0 ]; then
            success "所有Sitemap URL都有对应文件 (共 $total_count 个)"
        else
            error "发现 $missing_count 个URL缺少对应文件"
        fi
    fi
fi

echo ""

# 3. 构建产物检查
echo "═══ 3. 构建产物验证 ═══"
echo ""

if [ ! -d "$DIST_DIR" ]; then
    warning "构建目录不存在，跳过检查"
else
    # 3.1 统计检查
    echo "3.1 文件统计..."

    html_count=$(find "$DIST_DIR" -name "*.html" -type f | wc -l)
    success "HTML文件总数: $html_count"

    # 3.2 必需文件检查
    echo -e "\n3.2 必需文件检查..."

    for file in sitemap.xml robots.txt; do
        if [ -f "$DIST_DIR/$file" ]; then
            success "$file 存在"
        else
            error "$file 缺失"
        fi
    done

    # 3.3 Meta标签检查
    echo -e "\n3.3 Meta标签完整性检查..."

    missing_canonical=0
    missing_title=0

    for file in $(find "$DIST_DIR" -name "index.html" -type f); do
        grep -q 'rel="canonical"' "$file" || ((missing_canonical++))
        grep -q '<title>' "$file" || ((missing_title++))
    done

    if [ "$missing_canonical" -eq 0 ]; then
        success "所有页面都有canonical标签"
    else
        error "$missing_canonical 个页面缺少canonical标签"
    fi

    if [ "$missing_title" -eq 0 ]; then
        success "所有页面都有title标签"
    else
        error "$missing_title 个页面缺少title标签"
    fi
fi

echo ""

# 4. 最终报告
echo "╔════════════════════════════════════════════════╗"
echo "║              检查报告总结                      ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}成功: $SUCCESS_COUNT${NC}"
echo -e "${YELLOW}警告: $WARNING_COUNT${NC}"
echo -e "${RED}错误: $ERROR_COUNT${NC}"
echo ""

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ 发现严重问题，请修复后再构建部署！${NC}"
    exit 1
elif [ "$WARNING_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  存在警告项，建议检查${NC}"
    exit 0
else
    echo -e "${GREEN}✅ 所有检查通过，可以安全部署！${NC}"
    exit 0
fi
```

**使用方法**:

```bash
# 1. 保存脚本
chmod +x check-build.sh

# 2. 在package.json中添加检查命令
{
  "scripts": {
    "check": "./check-build.sh",
    "prebuild": "npm run check",  // 构建前自动检查
    "build": "node build.js"
  }
}

# 3. 手动运行检查
npm run check

# 4. 构建（会自动先运行检查）
npm run build
```

---

### 6. Google Search Console错误对照表

**当GSC报告问题时，使用此表快速定位**:

| GSC错误信息 | 可能原因 | 检查位置 | 本SOP章节 |
|------------|---------|---------|-----------|
| 未找到写段"item"(在"itemListElement"中) | 面包屑缺少item属性 | HTML模板中的面包屑代码 | 1.1 |
| 网页会自动重定向 + 未找到(404) | Sitemap中URL不存在 | sitemap.xml vs dist/ | 2.1 |
| 重复内容但无用户选择的规范网址 | Canonical标签缺失或错误 | HTML head部分 | 4.2 |
| 服务器错误(5xx) | 构建产物缺失 | 构建脚本、dist目录 | 3.1 |
| Sitemap无法读取 | Sitemap格式错误或未复制 | sitemap.xml语法 | 2.2 |

---

### 7. 快速检查清单（每次代码完成后）

```
□ 第一步：源代码检查（5分钟）
  □ 搜索所有BreadcrumbList实现
  □ 验证item属性存在
  □ 验证position值逻辑
  □ 检查sitemap.xml内所有URL

□ 第二步：运行自动化检查（1分钟）
  □ 执行 ./check-build.sh
  □ 查看报告
  □ 修复所有ERROR
  □ 评估WARNING

□ 第三步：构建验证（2分钟）
  □ npm run build
  □ 检查构建日志
  □ 验证文件数量正确
  □ 抽查几个重点页面

□ 第四步：手动抽查（3分钟）
  □ 在浏览器打开dist/index.html
  □ 查看页面源代码
  □ 检查canonical标签
  □ 使用富媒体测试工具验证一个页面

总计：约15分钟
```

---

### 8. AI自查提示词模板

**给AI的检查指令**:

```
我刚完成了网页代码的编写，请按照以下步骤进行SEO和结构化数据检查：

1. 结构化数据检查：
   - 搜索所有包含 "BreadcrumbList" 的文件
   - 验证每个 itemListElement 是否有 itemprop="item"
   - 检查 position 值是否从1开始连续递增
   - 检查其他Schema.org标记（Article、Organization等）

2. Sitemap检查：
   - 打开 public/sitemap.xml
   - 提取所有 <loc> 中的URL
   - 验证每个URL对应的文件在src/pages或dist中存在
   - 检查URL格式（HTTPS、主域名、斜杠一致性）

3. 构建系统检查：
   - 检查 build.js 或构建脚本
   - 确认所有文件类型（.html, .hbs等）都被处理
   - 验证输出路径转换逻辑（page.html → page/index.html）

4. 生成报告：
   列出所有发现的问题，按以下格式：

   ❌ 严重错误（必须修复）:
   - [具体问题描述]
   - 位置: [文件路径:行号]
   - 修复方法: [具体步骤]

   ⚠️  警告（建议修复）:
   - [问题描述]

   ✅ 检查通过的项目:
   - [列出通过的检查项]

请开始检查，并给出详细报告。
```

---

### 9. 常见问题快速修复

#### 问题1: 面包屑缺少item属性

```html
<!-- 修复前 ❌ -->
<span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
  <span itemprop="name">Page Name</span>
  <meta itemprop="position" content="2" />
</span>

<!-- 修复后 ✅ -->
<span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
  <span itemprop="item">
    <span itemprop="name">Page Name</span>
  </span>
  <meta itemprop="position" content="2" />
</span>
```

#### 问题2: Position值从0开始

```javascript
// 修复前 ❌
{{#each breadcrumbs}}
  <meta itemprop="position" content="{{@index}}" />
{{/each}}

// 修复后 ✅
// 在 build.js 添加 helper
Handlebars.registerHelper('add', function(a, b) {
  return a + b;
});

// 在模板中使用
{{#each breadcrumbs}}
  <meta itemprop="position" content="{{add @index 2}}" />
  <!-- +2 因为首页是1，循环从0开始 -->
{{/each}}
```

#### 问题3: Sitemap包含不存在的URL

```xml
<!-- 修复步骤 -->
1. 运行检查脚本找出不存在的URL
2. 选择：
   a) 创建缺失的页面
   b) 从sitemap中删除该URL
   c) 设置301重定向到相关页面

<!-- 删除示例 -->
<!-- 删除这个URL ❌ -->
<url>
  <loc>https://example.com/deleted-page/</loc>
  ...
</url>
```

#### 问题4: .html文件未被构建

```javascript
// 修复：在 build.js 添加复制逻辑

// 添加此函数
function copyHtmlFiles() {
  const htmlFiles = glob.sync('**/*.html', { cwd: PAGES_DIR });

  htmlFiles.forEach(file => {
    const fileName = path.basename(file, '.html');
    const dirName = path.dirname(file);
    const outputPath = path.join(DIST_DIR, dirName, fileName, 'index.html');

    fs.ensureDirSync(path.dirname(outputPath));
    fs.copyFileSync(path.join(PAGES_DIR, file), outputPath);

    console.log(`✓ Copied: ${file}`);
  });
}

// 在 build() 函数中调用
async function build() {
  // ... 其他构建步骤
  copyHtmlFiles();  // 添加这行
  // ...
}
```

---

### 10. 工具推荐

**在线验证工具**:

```
结构化数据:
• Google 富媒体结果测试
  https://search.google.com/test/rich-results

• Schema Markup Validator
  https://validator.schema.org/

Sitemap验证:
• XML Sitemap Validator
  https://www.xml-sitemaps.com/validate-xml-sitemap.html

JSON-LD验证:
• JSON-LD Playground
  https://json-ld.org/playground/
```

**浏览器扩展**:

```
• Structured Data Testing Tool (Chrome)
• SEO Meta in 1 Click (Chrome/Firefox)
• Web Developer (查看生成的代码)
```

**命令行工具**:

```bash
# 安装有用的工具
npm install -g html-validator-cli
npm install -g ajv-cli  # JSON Schema 验证

# 使用
html-validator --file=dist/index.html
```

---

## 版本历史

```
v1.1 - 2025-11-06
- 新增"AI代码完成后质量检查SOP"章节
- 添加结构化数据检查详细指南
- 添加Sitemap一致性验证流程
- 添加构建系统验证方法
- 提供完整的自动化检查脚本
- 基于实际修复经验（grokipediawiki.com案例）

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
