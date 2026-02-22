# 项目上下文

## 项目定位
- 摄影作品集网站，瀑布流多列自动滚动展示
- 悬浮暂停当前列并显示标题提示
- 顶部搜索框根据关键词替换瀑布流照片
- 悬浮显示下载按钮，可下载高清图

## 技术栈
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React 图标

## 运行与构建
- 开发：`npm run dev`
- 构建：`npm run build`
- 预览：`npm run preview`

## 页面与组件关系
- 入口：`src/main.tsx` 渲染 `App`
- `src/App.tsx` 仅包裹 `ErrorBoundary` 与 `Home`
- `src/pages/Home.tsx`
  - 头部搜索框与状态提示
  - 计算列数并渲染多列瀑布流
  - 悬浮状态与标题提示控制
- `src/components/WaterfallColumn.tsx`
  - 单列滚动逻辑
  - 悬浮暂停当前列
- `src/components/PhotoItem.tsx`
  - 单张照片展示
  - 悬浮显示下载按钮
- `src/components/PhotoTitleModal.tsx`
  - 鼠标跟随标题提示
- `src/components/ErrorBoundary.tsx`
  - 运行时错误兜底 UI

## 数据与搜索逻辑
- `src/data/photos.ts` 提供初始瀑布流数据与列速率
- `src/services/unsplash.ts`
  - 通过 Picsum 生成与关键词相关的可复现实例图片
  - 不依赖 API Key
- `Home.tsx` 的搜索逻辑
  - 500ms 防抖
  - 搜索中显示加载状态
  - 结果按列数均匀分配

## 交互逻辑
- 悬浮照片：暂停对应列滚动
- 悬浮照片：显示标题提示，跟随鼠标
- 悬浮照片：左下角显示半透明下载按钮
- 鼠标移出：恢复列滚动并隐藏提示

## 部署与配置
- `vercel.json` 指定 Vite 构建与 `dist` 输出目录
- 静态产物位于 `dist`
- 访问异常时已确认根因可能是本地网络对 vercel.app 的访问限制

## 已完成的关键调整
- 去除调试埋点与临时日志文件
- 保留 `ErrorBoundary` 提升运行时稳定性
