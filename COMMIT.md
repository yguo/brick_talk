# 提交更改到 Git

要将当前的更改提交到 Git 仓库，可以按照以下步骤操作：

```bash
# 将所有更改添加到暂存区
git add .

# 提交更改，使用有意义的提交信息
git commit -m "完善项目结构，添加数据库支持和管理界面"

# 将更改推送到远程仓库（如果有）
git push origin main
```

## 常用的 Git 命令

- `git status`：查看当前工作区状态
- `git diff`：查看未暂存的更改
- `git log`：查看提交历史
- `git branch`：查看分支
- `git checkout -b <branch-name>`：创建并切换到新分支
- `git merge <branch-name>`：合并分支

## 提交消息规范

建议按照以下格式编写提交消息：

- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- chore: 构建过程或辅助工具的变动

例如：
```
feat: 添加播客管理界面
fix: 修复播客创建时的验证问题
docs: 更新README和安装说明
``` 