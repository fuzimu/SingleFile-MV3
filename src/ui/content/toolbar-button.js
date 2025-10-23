/*
 * SingleFile Toolbar Button
 * 在页面底部添加保存按钮
 */

// 工具栏按钮功能
class SingleFileToolbar {
	constructor() {
		this.button = null;
		this.container = null;
		this.isVisible = false;
		this.init();
	}

	init() {
		// 检查是否已经存在工具栏
		if (document.getElementById("singlefile-toolbar-container")) {
			return;
		}

		// 创建工具栏容器
		this.createToolbar();
		
		// 监听页面滚动，控制工具栏显示/隐藏
		this.setupScrollListener();
		
		// 监听页面变化
		this.setupPageChangeListener();

		// 监听后台下载完成事件
		this.setupDownloadListener();
	}

	createToolbar() {
		// 创建容器
		this.container = document.createElement('div');
		this.container.id = "singlefile-toolbar-container";
		this.container.className = 'singlefile-toolbar-container';
		
		// 创建输入框
		this.input = document.createElement('input');
		this.input.id = "singlefile-toolbar-input";
		this.input.className = 'singlefile-toolbar-input';
		this.input.type = 'text';
		this.input.placeholder = '文件保存路径将显示在这里...';
		this.input.readOnly = true;
		
		// 创建按钮
		this.button = document.createElement('button');
		this.button.id = "singlefile-toolbar-button";
		this.button.className = 'singlefile-toolbar-button';
		this.button.innerHTML = `
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
				<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
			</svg>
			<span>保存页面</span>
		`;
		
		// 添加点击事件
		this.button.addEventListener('click', () => this.handleSaveClick());
		
		// 添加输入框和按钮到容器
		this.container.appendChild(this.input);
		this.container.appendChild(this.button);
		
		// 添加样式
		this.addStyles();
		
		// 添加到页面
		document.body.appendChild(this.container);
		
		// 初始显示
		this.show();
	}

	addStyles() {
		const style = document.createElement('style');
		style.textContent = `
			.singlefile-toolbar-container {
				position: fixed;
				bottom: 20px;
				right: 20px;
				z-index: 2147483647;
				opacity: 0;
				transform: translateY(20px);
				transition: all 0.3s ease;
				display: flex;
				align-items: center;
				gap: 8px;
			}
			
			.singlefile-toolbar-container.visible {
				opacity: 1;
				transform: translateY(0);
			}
			
			.singlefile-toolbar-input {
				padding: 8px 12px;
				border: 1px solid #ddd;
				border-radius: 6px;
				font-size: 13px;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
				background: white;
				color: #333;
				min-width: 200px;
				max-width: 300px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				transition: all 0.2s ease;
			}
			
			.singlefile-toolbar-input:focus {
				outline: none;
				border-color: #007bff;
				box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
			}
			
			.singlefile-toolbar-input::placeholder {
				color: #999;
				font-style: italic;
			}
			
			.singlefile-toolbar-button {
				display: flex;
				align-items: center;
				gap: 8px;
				background: #007bff;
				color: white;
				border: none;
				border-radius: 8px;
				padding: 12px 16px;
				font-size: 14px;
				font-weight: 500;
				cursor: pointer;
				box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
				transition: all 0.2s ease;
				user-select: none;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			}
			
			.singlefile-toolbar-button:hover {
				background: #0056b3;
				transform: translateY(-1px);
				box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
			}
			
			.singlefile-toolbar-button:active {
				transform: translateY(0);
				box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
			}
			
			.singlefile-toolbar-button svg {
				width: 16px;
				height: 16px;
				flex-shrink: 0;
			}
			
			.singlefile-toolbar-button svg.spinning {
				animation: spin 1s linear infinite;
			}
			
			@keyframes spin {
				from { transform: rotate(0deg); }
				to { transform: rotate(360deg); }
			}
			
			.singlefile-toolbar-button span {
				white-space: nowrap;
			}
			
			/* 响应式设计 */
			@media (max-width: 768px) {
				.singlefile-toolbar-container {
					bottom: 10px;
					right: 10px;
				}
				
				.singlefile-toolbar-input {
					display: none;
				}
				
				.singlefile-toolbar-button {
					padding: 10px 12px;
					font-size: 13px;
				}
				
				.singlefile-toolbar-button span {
					display: none;
				}
			}
		`;
		
		document.head.appendChild(style);
	}

	setupScrollListener() {
		let scrollTimeout;
		addEventListener('scroll', () => {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				const windowHeight = window.innerHeight;
				const documentHeight = document.documentElement.scrollHeight;
				
				// 当滚动到页面底部附近时隐藏按钮
				if (scrollTop + windowHeight >= documentHeight - 100) {
					this.hide();
				} else {
					this.show();
				}
			}, 100);
		});
	}

	setupPageChangeListener() {
		// 监听页面变化，重新初始化工具栏
		const observer = new MutationObserver(() => {
			if (!document.getElementById("singlefile-toolbar-container")) {
				this.init();
			}
		});
		
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	setupDownloadListener() {
		browser.runtime.onMessage.addListener((message) => {
			if (message && message.method === "toolbar.downloaded" && message.fileUrl) {
				this.onDownloaded(message.fileUrl);
			}
		});
	}

	onDownloaded(fileUrl) {
		try {
			if (!this.input) return;
			// 将 file:/// URL 转换为本地绝对路径（去掉前缀并解码）
			let path = fileUrl;
			if (path.startsWith("file:///")) {
				path = path.substring("file:///".length);
			}
			// Windows 路径可能前面有一个额外的斜杠，移除它
			if (path.startsWith("/")) {
				path = path.substring(1);
			}
			this.input.value = decodeURIComponent(path);
			this.input.placeholder = '文件保存路径';
			this.setSuccessState();
		} catch (e) {
			// 忽略
		}
	}

	show() {
		if (this.container && !this.isVisible) {
			this.container.classList.add('visible');
			this.isVisible = true;
		}
	}

	hide() {
		if (this.container && this.isVisible) {
			this.container.classList.remove('visible');
			this.isVisible = false;
		}
	}

	async handleSaveClick() {
		try {
			// 显示加载状态
			this.setLoadingState(true);
			
			// 清空输入框
			this.input.value = '';
			this.input.placeholder = '正在保存页面...';
			
			// 发送消息到background script触发保存
			// 使用与save-selected-tabs相同的逻辑
			const response = await browser.runtime.sendMessage({
				method: "business.saveTabs",
				tabs: [], // 空数组表示保存当前标签页
				options: {
					optionallySelected: true
				}
			});
			
			// 检查响应
			if (response && response.success === false) {
				throw new Error(response.error || 'Save failed');
			}
			
			// 显示成功状态
			this.setSuccessState();
			
		} catch (error) {
			console.error('SingleFile save error:', error);
			this.setErrorState();
		}
	}

	setLoadingState(loading) {
		if (!this.button) return;
		
		if (loading) {
			this.button.innerHTML = `
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spinning">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>
				<span>保存中...</span>
			`;
			this.button.disabled = true;
		} else {
			this.button.innerHTML = `
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
				</svg>
				<span>保存页面</span>
			`;
			this.button.disabled = false;
		}
	}

	setSuccessState() {
		if (!this.button) return;
		
		this.button.innerHTML = `
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
				<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
			</svg>
			<span>保存成功</span>
		`;
		this.button.style.background = '#28a745';
		
		// 3秒后恢复原状
		setTimeout(() => {
			this.setLoadingState(false);
			this.button.style.background = '#007bff';
		}, 3000);
	}

	setErrorState() {
		if (!this.button) return;
		
		this.button.innerHTML = `
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
			</svg>
			<span>保存失败</span>
		`;
		this.button.style.background = '#dc3545';
		
		// 3秒后恢复原状
		setTimeout(() => {
			this.setLoadingState(false);
			this.button.style.background = '#007bff';
		}, 3000);
	}

	destroy() {
		if (this.container) {
			this.container.remove();
		}
	}
}

// 初始化工具栏
let toolbar = null;

function initToolbar() {
	if (!toolbar) {
		toolbar = new SingleFileToolbar();
	}
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initToolbar);
} else {
	initToolbar();
}
