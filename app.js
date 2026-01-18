/**
 * ========================================
 * 电子实验记录本 (ELN) - 原型应用
 * ========================================
 *
 * 这是一个用于科研实验记录的Web原型应用
 * 核心功能：实验记录的创建、查看、编辑、筛选
 *
 * 注意：这是一个原型（Prototype），并非生产环境就绪的产品
 * - 数据存储在浏览器localStorage中
 * - 没有用户认证和权限管理
 * - 没有后端服务支持
 */

// ========================================
// 数据模型与类型定义
// ========================================

/**
 * 实验类型枚举
 */
const ExperimentTypes = {
    SYNTHESIS: 'synthesis',        // 合成
    CHARACTERIZATION: 'characterization',  // 表征
    TESTING: 'testing',            // 测试
    SIMULATION: 'simulation',      // 计算模拟
    OTHER: 'other'                 // 其他
};

/**
 * 实验类型显示名称映射
 */
const ExperimentTypeLabels = {
    synthesis: '合成',
    characterization: '表征',
    testing: '测试',
    simulation: '计算模拟',
    other: '其他'
};

/**
 * 实验记录数据结构
 * @typedef {Object} Experiment
 * @property {string} id - 唯一标识符
 * @property {string} title - 实验标题
 * @property {string} date - 实验日期 (YYYY-MM-DD)
 * @property {string} experimenter - 实验者姓名
 * @property {string} type - 实验类型
 * @property {string} purpose - 实验目的
 * @property {Object} conditions - 实验条件
 * @property {string[]} steps - 实验步骤数组
 * @property {string} results - 实验结果
 * @property {string} conclusion - 实验结论
 * @property {string} notes - 备注
 * @property {string[]} attachments - 附件文件名列表
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

// ========================================
// 示例数据（用于初始化）
// ========================================

const sampleExperiments = [
    {
        id: 'EXP-2024-001',
        title: 'MoS2纳米片的液相剥离合成',
        date: '2024-01-15',
        experimenter: '张三',
        type: 'synthesis',
        purpose: '通过液相剥离法制备单层或少层MoS2纳米片，用于后续电化学性能测试。',
        conditions: {
            temperature: '室温 (25°C)',
            time: '6小时',
            solvent: 'NMP (N-甲基吡咯烷酮)',
            instrument: '超声波清洗机',
            other: '功率: 200W, 频率: 40kHz'
        },
        steps: [
            '称取0.5g MoS2粉末放入100ml烧杯中',
            '加入50ml NMP溶剂，搅拌分散',
            '将烧杯置于超声波清洗机中，超声处理6小时',
            '超声结束后，以3000rpm转速离心30分钟',
            '取上清液，得到剥离的MoS2纳米片分散液',
            '通过UV-Vis和AFM表征剥离效果'
        ],
        results: '成功获得稳定的MoS2纳米片分散液，浓度约为0.5mg/mL。UV-Vis光谱显示在670nm和610nm处有特征吸收峰，表明成功剥离。AFM表征显示片层厚度主要分布在1-3层。',
        conclusion: '采用NMP作为溶剂，6小时超声可以有效实现MoS2的液相剥离，所得产物适合用于后续器件制备。',
        notes: '建议后续尝试不同溶剂体系（如异丙醇/水混合溶剂）以降低成本。',
        attachments: ['UV-Vis光谱图.png', 'AFM表征图.jpg', '实验过程记录.xlsx'],
        createdAt: '2024-01-15T10:30:00',
        updatedAt: '2024-01-15T16:45:00'
    },
    {
        id: 'EXP-2024-002',
        title: '钙钛矿太阳能电池J-V曲线测试',
        date: '2024-01-18',
        experimenter: '李四',
        type: 'testing',
        purpose: '测试制备的钙钛矿太阳能电池器件的光电转换效率，评估器件性能。',
        conditions: {
            temperature: '25°C',
            time: '持续测试30分钟',
            solvent: 'N/A',
            instrument: '太阳光模拟器 + 数字源表',
            other: 'AM 1.5G滤波片, 光强100mW/cm²'
        },
        steps: [
            '将待测器件放入测试夹具，确保良好接触',
            '开启太阳光模拟器，预热15分钟至光强稳定',
            '使用标准硅电池校准光强至100mW/cm²',
            '设置电压扫描范围：-0.2V ~ 1.2V，扫描速度10mV/s',
            '进行正向和反向扫描，记录J-V曲线',
            '计算开路电压(Voc)、短路电流密度(Jsc)、填充因子(FF)和效率(PCE)'
        ],
        results: '正向扫描: Voc=1.12V, Jsc=23.5mA/cm², FF=0.75, PCE=19.8%\n反向扫描: Voc=1.13V, Jsc=23.6mA/cm², FF=0.76, PCE=20.3%\n存在轻微的磁滞现象。',
        conclusion: '器件性能达到预期目标，磁滞现象较小，表明界面质量良好。',
        notes: '建议在氮气手套箱中进行封装测试，评估器件稳定性。',
        attachments: ['J-V曲线图.pdf', '器件照片_01.jpg'],
        createdAt: '2024-01-18T14:20:00',
        updatedAt: '2024-01-18T15:30:00'
    },
    {
        id: 'EXP-2024-003',
        title: 'DFT计算：石墨烯吸附能研究',
        date: '2024-01-20',
        experimenter: '王五',
        type: 'simulation',
        purpose: '通过密度泛函理论(DFT)计算不同分子在石墨烯表面的吸附能，为实验设计提供理论指导。',
        conditions: {
            temperature: '0K (理论计算)',
            time: '约48小时计算时间',
            solvent: '真空',
            instrument: 'VASP 6.4',
            other: 'PBE泛函, 截断能500eV, K点3x3x1'
        },
        steps: [
            '使用Materials Studio构建石墨烯超胞模型 (4x4)',
            '优化石墨烯几何结构，收敛标准1e-5 eV',
            '在石墨烯表面添加吸附分子，测试不同吸附位点',
            '进行结构优化，获得最稳定吸附构型',
            '计算吸附能: E_ads = E_total - E_graphene - E_molecule',
            '分析差分电荷密度和态密度(DOS)'
        ],
        results: '苯分子在石墨烯表面的吸附能为-0.45 eV，属于物理吸附范围。最稳定吸附位点是苯环平行于石墨烯表面，位于六元环中心上方3.4 Å处。电荷转移量小于0.05 e，表明弱的π-π相互作用。',
        conclusion: '石墨烯与苯分子间存在较弱的范德华相互作用，这与实验观察到的现象一致。',
        notes: '建议后续尝试考虑范德华校正的泛函（如DFT-D3）以提高计算精度。',
        attachments: ['吸附构型.png', 'DOS图.dat'],
        createdAt: '2024-01-20T09:00:00',
        updatedAt: '2024-01-22T17:00:00'
    },
    {
        id: 'EXP-2024-004',
        title: 'X射线衍射(XRD)物相分析',
        date: '2024-01-22',
        experimenter: '张三',
        type: 'characterization',
        purpose: '对合成的金属有机框架(MOF)材料进行XRD表征，确认晶体结构和纯度。',
        conditions: {
            temperature: '室温',
            time: '每样品约30分钟',
            solvent: 'N/A',
            instrument: 'Bruker D8 Advance',
            other: 'Cu Kα辐射 (λ=1.5406Å), 2θ范围: 5-50°'
        },
        steps: [
            '将样品研磨成细粉',
            '将粉末样品平铺在样品槽中，压平表面',
            '将样品槽放入XRD样品台',
            '设置扫描参数：步长0.02°，每步停留时间0.5s',
            '开始扫描，收集XRD图谱',
            '使用Jade软件进行物相分析和精修'
        ],
        results: 'XRD图谱显示主要衍射峰位于2θ = 6.8°, 9.7°, 11.2°等位置，与标准卡片(PDF #00-xxx)匹配良好，表明成功合成了目标MOF相。峰形尖锐，结晶度良好，无明显杂质峰。',
        conclusion: '合成的MOF材料纯度高，结晶度良好，结构与文献报道一致。',
        notes: '样品对湿度敏感，建议测试后在真空干燥箱中保存。',
        attachments: ['XRD图谱.pdf', '精修报告.docx'],
        createdAt: '2024-01-22T10:00:00',
        updatedAt: '2024-01-22T14:30:00'
    }
];

// ========================================
// 应用状态管理
// ========================================

/**
 * 应用状态
 */
const AppState = {
    currentPage: 'list',      // 当前页面: 'list', 'detail', 'form'
    currentExperiment: null,  // 当前查看/编辑的实验ID
    filterType: 'all',        // 当前筛选类型
    filterDate: '',           // 当前筛选日期
    experiments: []           // 实验记录列表
};

// ========================================
// 数据持久化层
// ========================================

const Storage = {
    /** 存储键名 */
    KEY: 'eln_experiments',

    /**
     * 从localStorage加载实验数据
     * @returns {Experiment[]} 实验记录数组
     */
    load() {
        try {
            const data = localStorage.getItem(this.KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('加载数据失败:', error);
        }
        // 首次使用，初始化示例数据
        return this.initSampleData();
    },

    /**
     * 保存实验数据到localStorage
     * @param {Experiment[]} experiments - 实验记录数组
     */
    save(experiments) {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(experiments));
        } catch (error) {
            console.error('保存数据失败:', error);
            alert('数据保存失败，可能是存储空间不足。');
        }
    },

    /**
     * 初始化示例数据
     * @returns {Experiment[]} 示例实验记录数组
     */
    initSampleData() {
        this.save(sampleExperiments);
        return [...sampleExperiments];
    }
};

// ========================================
// 工具函数
// ========================================

const Utils = {
    /**
     * 生成唯一ID
     * @returns {string} 唯一标识符
     */
    generateId() {
        const now = new Date();
        const year = now.getFullYear();
        const num = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        return `EXP-${year}-${num}`;
    },

    /**
     * 格式化日期时间
     * @param {string} dateTimeStr - ISO日期时间字符串
     * @returns {string} 格式化后的日期时间
     */
    formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return '';
        const date = new Date(dateTimeStr);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * 格式化日期
     * @param {string} dateStr - YYYY-MM-DD格式日期字符串
     * @returns {string} 格式化后的日期
     */
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN');
    },

    /**
     * 获取实验类型的CSS类名
     * @param {string} type - 实验类型
     * @returns {string} CSS类名
     */
    getTypeClass(type) {
        const classMap = {
            synthesis: 'type-synthesis',
            characterization: 'type-characterization',
            testing: 'type-testing',
            simulation: 'type-simulation',
            other: 'type-other'
        };
        return classMap[type] || 'type-other';
    },

    /**
     * 截断文本
     * @param {string} text - 原始文本
     * @param {number} maxLength - 最大长度
     * @returns {string} 截断后的文本
     */
    truncate(text, maxLength = 100) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
};

// ========================================
// 页面渲染器
// ========================================

const Renderer = {
    /**
     * 渲染实验列表页
     */
    renderListPage() {
        // 筛选实验
        let filteredExperiments = [...AppState.experiments];

        if (AppState.filterType !== 'all') {
            filteredExperiments = filteredExperiments.filter(
                exp => exp.type === AppState.filterType
            );
        }

        if (AppState.filterDate) {
            filteredExperiments = filteredExperiments.filter(
                exp => exp.date === AppState.filterDate
            );
        }

        // 按日期倒序排序
        filteredExperiments.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 构建类型筛选选项HTML
        const typeOptions = Object.entries(ExperimentTypeLabels)
            .map(([value, label]) => `<option value="${value}">${label}</option>`)
            .join('');

        // 构建实验卡片HTML
        const cardsHtml = filteredExperiments.length > 0
            ? filteredExperiments.map(exp => this.buildExperimentCard(exp)).join('')
            : this.buildEmptyState();

        return `
            <div class="header">
                <h1>🔬 电子实验记录本 (ELN)</h1>
                <button class="btn btn-primary" onclick="App.goToForm()">
                    + 新建实验记录
                </button>
            </div>

            <div class="filter-section">
                <div class="filter-group">
                    <label>实验类型:</label>
                    <select id="filterType" onchange="App.handleFilterChange()">
                        <option value="all">全部</option>
                        ${typeOptions}
                    </select>
                </div>
                <div class="filter-group">
                    <label>日期:</label>
                    <input type="date" id="filterDate" value="${AppState.filterDate}"
                           onchange="App.handleFilterChange()">
                </div>
                <div class="filter-group">
                    <span style="color: #666; font-size: 14px;">
                        共 ${filteredExperiments.length} 条记录
                    </span>
                </div>
            </div>

            <div class="experiment-list">
                ${cardsHtml}
            </div>
        `;
    },

    /**
     * 构建单个实验卡片HTML
     * @param {Experiment} exp - 实验记录
     * @returns {string} 卡片HTML
     */
    buildExperimentCard(exp) {
        const typeClass = Utils.getTypeClass(exp.type);
        const typeLabel = ExperimentTypeLabels[exp.type] || '其他';
        const attachmentText = exp.attachments?.length > 0
            ? `📎 ${exp.attachments.length} 个附件`
            : '';

        return `
            <div class="experiment-card" onclick="App.goToDetail('${exp.id}')">
                <div class="card-header">
                    <h3 class="card-title">${this.escapeHtml(exp.title)}</h3>
                    <span class="card-type ${typeClass}">${typeLabel}</span>
                </div>
                <div class="card-meta">
                    <span>📅 ${Utils.formatDate(exp.date)}</span>
                    <span>👤 ${this.escapeHtml(exp.experimenter)}</span>
                </div>
                <div class="card-purpose">
                    <strong>目的：</strong>${this.escapeHtml(Utils.truncate(exp.purpose, 80))}
                </div>
                <div class="card-footer">
                    <span style="font-size: 12px; color: #999;">
                        ID: ${exp.id}
                    </span>
                    <span class="card-attachments">${attachmentText}</span>
                </div>
            </div>
        `;
    },

    /**
     * 构建空状态HTML
     * @returns {string} 空状态HTML
     */
    buildEmptyState() {
        return `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">暂无实验记录</div>
                <div class="empty-state-hint">点击上方"新建实验记录"按钮创建第一条记录</div>
            </div>
        `;
    },

    /**
     * 渲染实验详情页
     * @param {Experiment} exp - 实验记录
     */
    renderDetailPage(exp) {
        if (!exp) {
            return '<div class="empty-state"><div>实验记录不存在</div></div>';
        }

        const typeClass = Utils.getTypeClass(exp.type);
        const typeLabel = ExperimentTypeLabels[exp.type] || '其他';

        // 构建实验条件HTML
        const conditionsHtml = Object.entries(exp.conditions || {})
            .filter(([key, value]) => value && value !== 'N/A')
            .map(([key, value]) => {
                const labels = {
                    temperature: '温度',
                    time: '时间',
                    solvent: '溶剂',
                    instrument: '仪器',
                    other: '其他'
                };
                return `
                    <div class="condition-item">
                        <span class="condition-label">${labels[key]}:</span>
                        <span class="condition-value">${this.escapeHtml(value)}</span>
                    </div>
                `;
            }).join('');

        // 构建实验步骤HTML
        const stepsHtml = (exp.steps || [])
            .map(step => `<li>${this.escapeHtml(step)}</li>`)
            .join('');

        // 构建附件HTML - 支持本地文件链接
        const attachmentsHtml = (exp.attachments || []).length > 0
            ? (exp.attachments || []).map(file => {
                // 判断是否为完整路径（包含盘符或以/开头的路径）
                const isFullPath = /^[a-zA-Z]:|^[~\\/]/.test(file);
                // 转换为file:// URL格式
                let fileUrl = '';
                let displayName = file;

                if (isFullPath) {
                    // Windows路径: D:\path\file.ext -> file:///D:/path/file.ext
                    // Unix路径: /path/file.ext -> file:///path/file.ext
                    fileUrl = 'file:///' + file.replace(/\\/g, '/').replace(/^([a-zA-Z]):/, '$1:');
                }

                if (fileUrl) {
                    return `
                        <div class="attachment-item">
                            <span class="attachment-icon">📎</span>
                            <a href="${fileUrl}" class="attachment-link" target="_blank" title="点击打开文件">
                                ${this.escapeHtml(displayName)}
                            </a>
                            <span class="attachment-hint" style="font-size:11px;color:#999;margin-left:8px;">
                                (链接)
                            </span>
                        </div>
                    `;
                } else {
                    return `
                        <div class="attachment-item">
                            <span class="attachment-icon">📎</span>
                            <span>${this.escapeHtml(file)}</span>
                        </div>
                    `;
                }
            }).join('')
            : '<div style="color: #999;">无附件</div>';

        return `
            <div class="header">
                <h1>🔬 实验记录详情</h1>
                <button class="btn btn-secondary" onclick="App.goToList()">
                    ← 返回列表
                </button>
            </div>

            <div class="detail-page">
                <div class="detail-header">
                    <div>
                        <h2 class="detail-title">${this.escapeHtml(exp.title)}</h2>
                        <div class="detail-meta">
                            <span class="detail-meta-item">
                                <span class="badge ${typeClass}">${typeLabel}</span>
                            </span>
                            <span class="detail-meta-item">📅 ${Utils.formatDate(exp.date)}</span>
                            <span class="detail-meta-item">👤 ${this.escapeHtml(exp.experimenter)}</span>
                            <span class="detail-meta-item">🆔 ${exp.id}</span>
                        </div>
                    </div>
                    <div class="detail-actions">
                        <button class="btn btn-primary" onclick="App.goToForm('${exp.id}')">
                            ✏️ 编辑
                        </button>
                        <button class="btn btn-danger" onclick="App.deleteExperiment('${exp.id}')">
                            🗑️ 删除
                        </button>
                    </div>
                </div>

                ${exp.purpose ? `
                <div class="detail-section">
                    <h3>实验目的</h3>
                    <div class="detail-section-content">${this.escapeHtml(exp.purpose)}</div>
                </div>
                ` : ''}

                ${conditionsHtml ? `
                <div class="detail-section">
                    <h3>实验条件</h3>
                    <div class="conditions-grid">
                        ${conditionsHtml}
                    </div>
                </div>
                ` : ''}

                ${stepsHtml ? `
                <div class="detail-section">
                    <h3>实验步骤</h3>
                    <ul class="steps-list">
                        ${stepsHtml}
                    </ul>
                </div>
                ` : ''}

                ${exp.results ? `
                <div class="detail-section">
                    <h3>实验结果</h3>
                    <div class="detail-section-content">${this.escapeHtml(exp.results)}</div>
                </div>
                ` : ''}

                ${exp.conclusion ? `
                <div class="detail-section">
                    <h3>实验结论</h3>
                    <div class="detail-section-content">${this.escapeHtml(exp.conclusion)}</div>
                </div>
                ` : ''}

                ${exp.notes ? `
                <div class="detail-section">
                    <h3>备注</h3>
                    <div class="detail-section-content">${this.escapeHtml(exp.notes)}</div>
                </div>
                ` : ''}

                <div class="detail-section">
                    <h3>附件</h3>
                    <div class="attachments-list">
                        ${attachmentsHtml}
                    </div>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;
                            font-size: 12px; color: #999;">
                    创建时间: ${Utils.formatDateTime(exp.createdAt)} |
                    更新时间: ${Utils.formatDateTime(exp.updatedAt)}
                </div>
            </div>
        `;
    },

    /**
     * 渲染新建/编辑表单页
     * @param {Experiment} [exp] - 要编辑的实验记录（新建时为null）
     */
    renderFormPage(exp = null) {
        const isEdit = exp !== null;
        const now = new Date().toISOString().split('T')[0];

        // 获取表单值或默认值
        const values = exp || {
            id: Utils.generateId(),
            title: '',
            date: now,
            experimenter: '',
            type: 'synthesis',
            purpose: '',
            conditions: {
                temperature: '',
                time: '',
                solvent: '',
                instrument: '',
                other: ''
            },
            steps: [''],
            results: '',
            conclusion: '',
            notes: '',
            attachments: ['']
        };

        // 构建类型选项
        const typeOptions = Object.entries(ExperimentTypeLabels)
            .map(([value, label]) =>
                `<option value="${value}" ${values.type === value ? 'selected' : ''}>${label}</option>`
            ).join('');

        // 构建步骤输入框
        const stepsInputs = (values.steps || ['']).map((step, index) => `
            <div class="step-input-item" data-index="${index}">
                <input type="text" class="step-input" placeholder="步骤 ${index + 1}"
                       value="${this.escapeHtml(step)}">
                ${index > 0 ? '<button type="button" class="btn btn-danger btn-small" ' +
                               'onclick="App.removeStep(this)">删除</button>' : ''}
            </div>
        `).join('');

        // 构建附件输入框
        const attachmentInputs = (values.attachments || ['']).map((file, index) => `
            <div class="attachment-input-item" data-index="${index}">
                <input type="text" class="attachment-input" placeholder="附件路径（如：D:\\data\\spectrum.png）"
                       value="${this.escapeHtml(file)}">
                ${index > 0 ? '<button type="button" class="btn btn-danger btn-small" ' +
                               'onclick="App.removeAttachment(this)">删除</button>' : ''}
            </div>
        `).join('');

        return `
            <div class="header">
                <h1>${isEdit ? '✏️ 编辑实验记录' : '📝 新建实验记录'}</h1>
                <button class="btn btn-secondary" onclick="App.cancelForm()">
                    ← 取消
                </button>
            </div>

            <form class="form-page" id="experimentForm" onsubmit="App.handleFormSubmit(event)">
                <input type="hidden" id="experimentId" value="${values.id}">

                <!-- 基本信息 -->
                <div class="form-section">
                    <h4 class="form-section-title">基本信息</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="title">实验标题 *</label>
                            <input type="text" id="title" required
                                   value="${this.escapeHtml(values.title)}"
                                   placeholder="请输入实验标题">
                        </div>
                        <div class="form-group">
                            <label for="date">实验日期 *</label>
                            <input type="date" id="date" required value="${values.date}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="experimenter">实验者 *</label>
                            <input type="text" id="experimenter" required
                                   value="${this.escapeHtml(values.experimenter)}"
                                   placeholder="请输入实验者姓名">
                        </div>
                        <div class="form-group">
                            <label for="type">实验类型 *</label>
                            <select id="type" required>
                                ${typeOptions}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 实验目的 -->
                <div class="form-section">
                    <h4 class="form-section-title">实验目的</h4>
                    <div class="form-group">
                        <label for="purpose">实验目的描述</label>
                        <textarea id="purpose" rows="3"
                                  placeholder="简要描述本实验的目的和预期结果">${this.escapeHtml(values.purpose || '')}</textarea>
                    </div>
                </div>

                <!-- 实验条件 -->
                <div class="form-section">
                    <h4 class="form-section-title">实验条件</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="temp">温度</label>
                            <input type="text" id="temp" value="${this.escapeHtml(values.conditions?.temperature || '')}"
                                   placeholder="如：室温, 100°C">
                        </div>
                        <div class="form-group">
                            <label for="condTime">时间</label>
                            <input type="text" id="condTime" value="${this.escapeHtml(values.conditions?.time || '')}"
                                   placeholder="如：2小时, 30分钟">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="solvent">溶剂/介质</label>
                            <input type="text" id="solvent" value="${this.escapeHtml(values.conditions?.solvent || '')}"
                                   placeholder="如：NMP, 水, 真空">
                        </div>
                        <div class="form-group">
                            <label for="instrument">仪器设备</label>
                            <input type="text" id="instrument" value="${this.escapeHtml(values.conditions?.instrument || '')}"
                                   placeholder="如：超声波清洗机, XRD">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="condOther">其他条件</label>
                        <input type="text" id="condOther" value="${this.escapeHtml(values.conditions?.other || '')}"
                               placeholder="其他需要记录的条件参数">
                    </div>
                </div>

                <!-- 实验步骤 -->
                <div class="form-section">
                    <h4 class="form-section-title">实验步骤</h4>
                    <div class="steps-input-list" id="stepsList">
                        ${stepsInputs}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" style="margin-top: 10px;"
                            onclick="App.addStep()">
                        + 添加步骤
                    </button>
                </div>

                <!-- 实验结果 -->
                <div class="form-section">
                    <h4 class="form-section-title">实验结果</h4>
                    <div class="form-group">
                        <label for="results">结果描述</label>
                        <textarea id="results" rows="4"
                                  placeholder="记录实验观察到的现象、获得的数据、图表信息等">${this.escapeHtml(values.results || '')}</textarea>
                    </div>
                </div>

                <!-- 实验结论 -->
                <div class="form-section">
                    <h4 class="form-section-title">实验结论</h4>
                    <div class="form-group">
                        <label for="conclusion">结论与分析</label>
                        <textarea id="conclusion" rows="3"
                                  placeholder="总结实验结果是否达到预期，分析可能的原因">${this.escapeHtml(values.conclusion || '')}</textarea>
                    </div>
                </div>

                <!-- 备注 -->
                <div class="form-section">
                    <h4 class="form-section-title">备注</h4>
                    <div class="form-group">
                        <label for="notes">补充说明</label>
                        <textarea id="notes" rows="2"
                                  placeholder="其他需要记录的信息，如后续计划、注意事项等">${this.escapeHtml(values.notes || '')}</textarea>
                    </div>
                </div>

                <!-- 附件 -->
                <div class="form-section">
                    <h4 class="form-section-title">附件</h4>
                    <div class="attachments-input-list" id="attachmentsList">
                        ${attachmentInputs}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" style="margin-top: 10px;"
                            onclick="App.addAttachment()">
                        + 添加附件
                    </button>
                    <p style="font-size: 12px; color: #999; margin-top: 8px;">
                        输入完整本地路径可生成可点击链接（如：D:\data\spectrum.png）<br>
                        <strong>注意：</strong>需要双击打开HTML文件才能使用文件链接功能
                    </p>
                </div>

                <!-- 表单操作 -->
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="App.cancelForm()">
                        取消
                    </button>
                    <button type="submit" class="btn btn-primary">
                        ${isEdit ? '保存修改' : '创建记录'}
                    </button>
                </div>
            </form>
        `;
    },

    /**
     * HTML转义，防止XSS
     * @param {string} str - 原始字符串
     * @returns {string} 转义后的字符串
     */
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// ========================================
// 应用控制器
// ========================================

const App = {
    /**
     * 初始化应用
     */
    init() {
        // 加载实验数据
        AppState.experiments = Storage.load();

        // 渲染初始页面
        this.render();
    },

    /**
     * 渲染当前页面
     */
    render() {
        const app = document.getElementById('app');

        switch (AppState.currentPage) {
            case 'list':
                app.innerHTML = Renderer.renderListPage();
                // 恢复筛选状态
                if (AppState.filterType !== 'all') {
                    document.getElementById('filterType').value = AppState.filterType;
                }
                break;

            case 'detail':
                const exp = AppState.experiments.find(e => e.id === AppState.currentExperiment);
                app.innerHTML = Renderer.renderDetailPage(exp);
                break;

            case 'form':
                const editingExp = AppState.currentExperiment
                    ? AppState.experiments.find(e => e.id === AppState.currentExperiment)
                    : null;
                app.innerHTML = Renderer.renderFormPage(editingExp);
                break;
        }
    },

    // ==================== 页面导航 ====================

    /**
     * 跳转到列表页
     */
    goToList() {
        AppState.currentPage = 'list';
        AppState.currentExperiment = null;
        this.render();
    },

    /**
     * 跳转到详情页
     * @param {string} id - 实验记录ID
     */
    goToDetail(id) {
        AppState.currentPage = 'detail';
        AppState.currentExperiment = id;
        this.render();
    },

    /**
     * 跳转到表单页
     * @param {string} [id] - 要编辑的实验记录ID（新建时省略）
     */
    goToForm(id = null) {
        AppState.currentPage = 'form';
        AppState.currentExperiment = id;
        this.render();
        // 滚动到顶部
        window.scrollTo(0, 0);
    },

    /**
     * 取消表单编辑
     */
    cancelForm() {
        if (AppState.currentExperiment) {
            this.goToDetail(AppState.currentExperiment);
        } else {
            this.goToList();
        }
    },

    // ==================== 筛选操作 ====================

    /**
     * 处理筛选条件变化
     */
    handleFilterChange() {
        const typeSelect = document.getElementById('filterType');
        const dateInput = document.getElementById('filterDate');

        AppState.filterType = typeSelect ? typeSelect.value : 'all';
        AppState.filterDate = dateInput ? dateInput.value : '';

        this.render();
    },

    // ==================== 表单操作 ====================

    /**
     * 添加步骤输入框
     */
    addStep() {
        const container = document.getElementById('stepsList');
        const count = container.children.length;
        const div = document.createElement('div');
        div.className = 'step-input-item';
        div.innerHTML = `
            <input type="text" class="step-input" placeholder="步骤 ${count + 1}">
            <button type="button" class="btn btn-danger btn-small" onclick="App.removeStep(this)">删除</button>
        `;
        container.appendChild(div);
    },

    /**
     * 删除步骤输入框
     * @param {HTMLButtonElement} btn - 删除按钮
     */
    removeStep(btn) {
        btn.parentElement.remove();
        // 更新占位符
        this.updateStepPlaceholders();
    },

    /**
     * 更新步骤输入框占位符
     */
    updateStepPlaceholders() {
        const inputs = document.querySelectorAll('.step-input');
        inputs.forEach((input, index) => {
            input.placeholder = `步骤 ${index + 1}`;
        });
    },

    /**
     * 添加附件输入框
     */
    addAttachment() {
        const container = document.getElementById('attachmentsList');
        const div = document.createElement('div');
        div.className = 'attachment-input-item';
        div.innerHTML = `
            <input type="text" class="attachment-input" placeholder="附件文件名（如：spectrum.png）">
            <button type="button" class="btn btn-danger btn-small" onclick="App.removeAttachment(this)">删除</button>
        `;
        container.appendChild(div);
    },

    /**
     * 删除附件输入框
     * @param {HTMLButtonElement} btn - 删除按钮
     */
    removeAttachment(btn) {
        btn.parentElement.remove();
    },

    /**
     * 处理表单提交
     * @param {Event} event - 表单提交事件
     */
    handleFormSubmit(event) {
        event.preventDefault();

        // 收集表单数据
        const id = document.getElementById('experimentId').value;
        const isEdit = AppState.experiments.some(e => e.id === id);

        // 收集步骤
        const stepInputs = document.querySelectorAll('.step-input');
        const steps = Array.from(stepInputs)
            .map(input => input.value.trim())
            .filter(step => step !== '');

        // 收集附件
        const attachmentInputs = document.querySelectorAll('.attachment-input');
        const attachments = Array.from(attachmentInputs)
            .map(input => input.value.trim())
            .filter(file => file !== '');

        // 构建实验记录对象
        const experiment = {
            id: id,
            title: document.getElementById('title').value.trim(),
            date: document.getElementById('date').value,
            experimenter: document.getElementById('experimenter').value.trim(),
            type: document.getElementById('type').value,
            purpose: document.getElementById('purpose').value.trim(),
            conditions: {
                temperature: document.getElementById('temp').value.trim(),
                time: document.getElementById('condTime').value.trim(),
                solvent: document.getElementById('solvent').value.trim(),
                instrument: document.getElementById('instrument').value.trim(),
                other: document.getElementById('condOther').value.trim()
            },
            steps: steps.length > 0 ? steps : [''],
            results: document.getElementById('results').value.trim(),
            conclusion: document.getElementById('conclusion').value.trim(),
            notes: document.getElementById('notes').value.trim(),
            attachments: attachments.length > 0 ? attachments : [],
            updatedAt: new Date().toISOString()
        };

        if (isEdit) {
            // 更新现有记录
            const index = AppState.experiments.findIndex(e => e.id === id);
            if (index !== -1) {
                experiment.createdAt = AppState.experiments[index].createdAt;
                AppState.experiments[index] = experiment;
            }
        } else {
            // 创建新记录
            experiment.createdAt = new Date().toISOString();
            AppState.experiments.push(experiment);
        }

        // 保存到localStorage
        Storage.save(AppState.experiments);

        // 显示成功提示并跳转
        alert(isEdit ? '实验记录已更新！' : '实验记录已创建！');
        this.goToDetail(id);
    },

    // ==================== 实验记录操作 ====================

    /**
     * 删除实验记录
     * @param {string} id - 实验记录ID
     */
    deleteExperiment(id) {
        if (!confirm('确定要删除这条实验记录吗？此操作不可恢复。')) {
            return;
        }

        AppState.experiments = AppState.experiments.filter(e => e.id !== id);
        Storage.save(AppState.experiments);

        alert('实验记录已删除。');
        this.goToList();
    }
};

// ========================================
// 应用启动
// ========================================

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// 将App暴露到全局，以便HTML中的onclick可以访问
window.App = App;
