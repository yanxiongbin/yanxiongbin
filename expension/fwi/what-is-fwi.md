---
title: 什么是全波反演
description: 介绍全波反演的基本数学模型和常用方法
created: 2025-09-16
---

## 核心数学公式

1. 波动方程：

$$
\nabla^2p-\frac{1}{c^2}\frac{\partial^2p}{\partial t^2}=s
$$

其中

- $p=p(x,y,z,t)$:<b>压力场 (pressure field)</b>。代表地震波在某点某时刻的压力值。接收器记录到的就是地表上特定位置的压力场随时间的变化 （也即我们所说的波长）
- $c = c(x, y, z)$：<b>速度模型 (velocity map)</b>。它只与空间位置有关，表示地震波在地下不同位置的传播速度。<b>这是FWI最终要求解的目标</b>。
- $s=s(x,y,z,t)$: <b>震源项 (source term)</b>。描述了人工震源的性质，包括其位置、激发时间和波形。在主动源地震勘探中，这是一个已知量。

实际的FWI即我们在给定的位置设置了一系列震源和接收器（通常都在表面，若能在地表之下，问题的求解会简单很多），然后通过接收器的波场数据$p$来反演速度场$c$，也即我们的反问题目标为

$$
u|_{\partial \Omega}\rightarrow c.
$$

2. 实际正演过程即给定速度场$c$和源项$s$，通过数学离散格式将上述方程（1）离散化求解得到波长$p$
3. 边界条件：在实际计算中，为了地震波在<b>地下传播的无限性和计算区域的有限性</b>这一对矛盾，必须人为截断边界，这会引入人为边界反射问题，目标都是消除或削弱反射。例如，对[openfwi数据集](https://s0lu5lblzl4.feishu.cn/record/EtJYr3ScLeh4vXcIvhqcxq2fnWc)，速度场大小为(70,70)，但上下左右均会加上边界层，最后大小为 (310, 310)。在以下讨论中，我们均考虑二维波动方程

$$
\begin{aligned}
\nabla^2u-\frac{1}{c^2}\frac{\partial^2u}{\partial t^2}&=0\\
u(x,0)&=0
\end{aligned}
$$

- abc边界吸收层（[openfwi数据集](https://s0lu5lblzl4.feishu.cn/record/EtJYr3ScLeh4vXcIvhqcxq2fnWc)使用该边界条件）: 对于上下左右边界层，我们分别使用如下的方程

$$
\begin{aligned}
\frac{\partial^{2} u}{\partial x \partial t} - \frac{1}{c} \frac{\partial^{2} u}{\partial t^{2}} + \frac{c}{2} \frac{\partial^{2} u}{\partial y^{2}} = 0 \\
\frac{\partial^{2} u}{\partial x \partial t} - \frac{1}{c} \frac{\partial^{2} u}{\partial t^{2}} - \frac{c}{2} \frac{\partial^{2} u}{\partial y^{2}} = 0 \\
\frac{\partial^{2} u}{\partial y \partial t} - \frac{1}{c} \frac{\partial^{2} u}{\partial t^{2}} + \frac{c}{2} \frac{\partial^{2} u}{\partial y^{2}} = 0 \\
\frac{\partial^{2} u}{\partial y \partial t} - \frac{1}{c} \frac{\partial^{2} u}{\partial t^{2}} - \frac{c}{2} \frac{\partial^{2} u}{\partial y^{2}} = 0 \\
\end{aligned}
$$

- pml边界（deepwave中的scaler函数所用的边界层）：我们首先引入中间变量$q_x,q_y,\psi_x,\psi_y$，我们将波动方程（2）改写为如下方程组

$$
\begin{aligned}
\frac{\partial u}{\partial t}=\frac{1}{c^2}(\psi_x+\psi_y) \\
\frac{\partial q_x}{\partial t}+d_x(x)q_x=\frac{\partial}{\partial x}\frac{\partial u}{\partial t} \\
\frac{\partial \psi_x}{\partial t}+d_x(x)\psi_x=\frac{\partial}{\partial x}\frac{\partial q_x}{\partial t}
\end{aligned}
$$

此处$q_y,\psi_y$与$q_x,\psi_x$同理。$d_x(x)$为衰减系数，在内部计算区域（对openfwi来说就是上面的(70,70）)为0，在pml边界层，$d_x(x)$平滑增加，例如使用多项式函数等

4. 源项：通常采用点源的形式

$$
s(x,t)=f(t)\cdot\delta(x-x_s).
$$

$f(t)$为源时间函数，在fwi中我们常使用<b>ricker子波（Ricker Wavelet）：</b>

$$
f(t)=(1-2\pi^2f_p(t-t_0)^2)\cdot\exp(-\pi^2f_p(t-t_0)^2)
$$

其中$f_p$为峰值频率。

## 离散格式正演过程

### 直接调包

可直接使用deepwave库，具体文档见 [deepwave](https://ausargeo.com/deepwave/)，设定好相应的参数，会自动使用<b>pml边界条件</b>，求解速度极快（注意，使用scalar的时候官方文档给的深度位置坐标是错误的，源项和接收器项的[:,:,0]对应的才是深度。

### 具体的数值求解过程（abc边界条件）

在openfwi中，采用如下的方式进行离散求解：考虑波动方程

$$
\frac{\partial^2 p}{\partial t^2}=v^2\nabla^2 p+s
$$

加入衰减项有

$$
\frac{\partial^2 p}{\partial t^2}+\kappa\frac{\partial p}{\partial t}=v^2\nabla^2 p+s
$$

原始的速度场大小为(nx, nz)，速度场的上下左右均加入nbc层，值均为用边界值填充，最后得到的shape为（nx+2nbc，nz+2nbc)

1. 时间离散：

$$
\frac{\partial^2 p}{\partial t^2}=\frac{p^{n+1}-2p^n+p^{n-1}}{\Delta t^2}
$$

2. 空间离散：

$$
\nabla^2p \approx \frac{4}{3}\frac{p_{i+1,j}+p_{i-1,j}+p_{i,j+1}+p_{i,j-1}-4p_{i,j}}{\Delta x^2}-\frac{1}{12}\frac{p_{i+2,j}+p_{i-2,j}+p_{i,j+2}+p_{i,j-2}-4p_{i,j}}{\Delta x^2}
$$

3. 衰减项：使用一阶近似

$$
\frac{\partial p}{\partial t}=\frac{p^n-p^{n-1}}{\Delta t}
$$

边界层基础衰减系数为$\kappa_c=\frac{3v_{min}\log(10^7)}{2a},a=(nbc-1)*\text{dx}$。一维衰减系数为$\kappa_c(\frac{i\Delta x}{a})^2,i=0,1,\cdots,nbc-1$，即边界内部为0，边界外部衰减最大。相应的可以计算上下左右边界的衰减项，例如，左边的衰减项为$\kappa_{i,j}=\kappa_c(\frac{(nbc-1-j)\Delta x}{a})^2$ 4. 在波源的位置会注入波场$f_{ij}$ 5. 最后得到如下格式：

$$
p^{n+1}=(2-\kappa)p^n-(1-\kappa)p^{n-1}+\alpha\nabla^2p^n+\beta \Delta t^2f^n
$$

其中$\alpha=(v\Delta t/\Delta x)^2,\beta=v^2$

## 伴随状态法求梯度

### 具体算法流程

1. 正演模拟：给定当前速度场$c$和源$s$，通过上面的正演过程得到波场$u(x,t)$
2. 计算残差：在接收点位置$\mathbf{x}_r$计算残差：

$$
\delta d(\mathbf{x}_r, t) = u(\mathbf{x}_r, t) - d_{obs}(\mathbf{x}_r, t)
$$

3. 把上面的残差在时间反转后作为源项注入接收器的位置

$$
s_{adj}(\mathbf{x}, t) = \sum_r \delta d(\mathbf{x}_r, T-t) \delta(\mathbf{x} - \mathbf{x}_r)
$$

初始时伴随波场在终端时间$t=T$设置为$\lambda(\mathbf{x},T)=0$，然后从$t=T$开始，<b>反向积分</b>到$t=0$，此处可以设置$\tau=T-t$。进行上面的正演过程，得到伴随波场$\lambda(\mathbf{x},t)$ 4. 计算梯度：$ \frac{\partial J}{\partial c(\mathbf{x})} = -\frac{2}{c^3(\mathbf{x})} \int_0^T \frac{\partial^2 u(\mathbf{x}, t)}{\partial t^2} \lambda(\mathbf{x}, t) dt$

### 算法推导过程

1. 物理约束方程为

$$
\mathcal{F}(\mathbf{m}, p) = \frac{1}{c^2(\mathbf{x})} \frac{\partial^2 p}{\partial t^2} - \nabla^2 p - s(\mathbf{x}, t) = 0
$$

这里$\mathbf{m}=\frac{1}{c^2(\mathbf{x})}$表示要优化的参数，目标为最小化如下loss funcition

$$
 J(\mathbf{m}) = \frac{1}{2} \int_0^T \int_{\Omega} [u(\mathbf{x}, t) - d_{obs}(\mathbf{x}, t)]^2 \delta(\mathbf{x} - \mathbf{x}_r) d\mathbf{x} dt
$$

其中$x_r$为接收器的位置。我们想要求解$J(\mathbf{m})$关于$\mathbf{m}$的梯度 2. 引入拉格朗日乘子$\lambda(\mathbf{x},t)$(即未来的伴随场)，构造如下的拉格朗日函数

$$
\mathcal{L}(\mathbf{m},p,\lambda) = \frac{1}{2} \int_0^T \int_{\Omega} (p - d_{obs})^2 \delta(\mathbf{x} - \mathbf{x}_r) d\mathbf{x} dt - \int_0^T \int_{\Omega} \lambda(\mathbf{x}, t) \left[ \frac{1}{c^2} \frac{\partial^2 p}{\partial t^2} - \nabla^2 p - s \right] d\mathbf{x} dt
$$

对$\mathcal{L}$分别对$\lambda,p,\mathbf{m}$求解一阶变分，并令其为0。我们可以得到如下的方程

$$
\frac{\delta \mathcal{L}}{\delta \lambda} = 0 \implies \mathcal{F}(\mathbf{m}, u) = 0
$$

也即上面的物理约束方程。

$$
\begin{aligned}
\frac{\delta \mathcal{L}}{\delta p} = \frac{\delta J}{\delta p} - \langle \lambda, \frac{\delta \mathcal{F}}{\delta p} \rangle = 0 \\
\frac{\delta J}{\delta p} = (p - d_{obs}) \delta(\mathbf{x} - \mathbf{x}_r) \\
\langle \lambda, \frac{\delta \mathcal{F}}{\delta p} \rangle = \int_0^T \int_{\Omega} \lambda(\mathbf{x}, t) \left[ \frac{1}{c^2} \frac{\partial^2}{\partial t^2} - \nabla^2 \right] \delta pd\mathbf{x} dt \\
\end{aligned}
$$

为了将算子从 $\delta p$ 转移到 $\lambda$ 上，我们进行两次分部积分（这里假设波场初始时刻是静止的，伴随场终止时刻是静止的）

$$
\int_0^T \lambda \frac{1}{c^2} \frac{\partial^2 (\delta p)}{\partial t^2} dt = ... = \int_0^T \frac{1}{c^2} \frac{\partial^2 \lambda}{\partial t^2} \delta p dt + [\text{边界项}]_0^T
$$

$$
\int_{\Omega} \lambda \nabla^2 (\delta p) d\mathbf{x} = ... = \int_{\Omega} (\nabla^2 \lambda) \delta p d\mathbf{x} + [\text{表面积分}]
$$

由此我们可以得到

$$
\frac{\delta \mathcal{L}}{\delta p} = \int_0^T \int_{\Omega} \left[ (p - d_{obs}) \delta(\mathbf{x} - \mathbf{x}_r) - \left( \frac{1}{c^2} \frac{\partial^2 \lambda}{\partial t^2} - \nabla^2 \lambda \right) \right] \delta p d\mathbf{x} dt = 0
$$

由于$\delta p$的任意性，方括号中的项必须恒为0，由此我们可以得到伴随方程

$$
\frac{1}{c^2(\mathbf{x})} \frac{\partial^2 \lambda}{\partial t^2} - \nabla^2 \lambda = (u - d_{obs}) \delta(\mathbf{x} - \mathbf{x}_r)
$$

最后我们可以得到梯度表达式：

$$
\frac{\delta J}{\delta \mathbf{m}} = \frac{\delta \mathcal{L}}{\delta \mathbf{m}} = \langle \lambda, \frac{\delta \mathcal{F}}{\delta \mathbf{m}} \rangle
$$

代入$\frac{\delta F}{\delta \mathbf{m}}$，可以得到

$$
\frac{\delta J}{\delta m(\mathbf{x})} = \int_0^T \lambda(\mathbf{x}, t) \frac{\partial^2 u(\mathbf{x}, t)}{\partial t^2} dt
$$

求解关于c的梯度，只需使用链式法则：

$$
\frac{\delta J}{\delta c(\mathbf{x})} = \frac{\delta J}{\delta m} \frac{\delta m}{\delta c} = \left( \int_0^T \lambda \frac{\partial^2 u}{\partial t^2} dt \right) \cdot \left( -\frac{2}{c^3} \right)
$$

## 主要难点与某些取巧操作

可参考 [FWI传统方法](/docs/inverse/fwi/fwi-methods/fwi-traditional-methods)
