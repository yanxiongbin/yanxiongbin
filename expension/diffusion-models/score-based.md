---
title: 基于分数的生成方法
description: 本文主要介绍score-based generative model的方法流程
created: 2025-09-16
---

## 主要思路

相比于DDPM等离散格式方法[基于概率分布的方法（DDPM)](./ddpm.md)，该方法提出了连续意义下的生成过程，为后续DPS等方法的发展奠定了基础。该方法考虑连续情形的SDE，正向演变（顺着时间）会将初始数据分布演化为高斯分布；依照相应反向SDE，反向演变会将高斯分布演化为数据分布，从而实现在数据分布中采样。

## 详细推导

我们的目标是建立一个连续扩散序列$\{x(t)\}_{t=0}^T$，使得$x(0)$服从数据分布，且$x(T)$服从某个容易采样的分布，比如标准高斯分布。于是我们考虑建立以下伊藤随机微分方程：

$$
\mathrm{d}x=f(x,t)\,\mathrm{d}t+g(t)\,\mathrm{d}w,
$$

这里$dw$是标准布朗运动。有许多$f,g$的选择可以满足我们的上述要求，比如将DDPM连续化后得到如下随机微分方程（连续化过程见[s0lu5lblzl4.feishu.cn](https://s0lu5lblzl4.feishu.cn/record/ICzMrKgK1evr7CcYx9gc9Qwmnyc)）：

$$
\mathrm{d}x = -\frac{\beta(t)}{2}\,\mathrm{d}t + \sqrt{\beta(t)}\,\mathrm{d}w,
$$

就可以实现从数据分布到标准正态分布的演化，其中$T=1,\beta(0)=0.2, \beta(1)=10$.

以下我们记$p_t(x)$为$x(t)$所服从的概率分布函数，$p_{st}(x(t)|x(s))$为$x(s)$到$x(t)$的转移概率核。

对每个SDE（1），都存在相应反SDE方程：

$$
\mathrm{d}x = [f(x,t)-g(t)^2\nabla_x\log p_t(x)]\,\mathrm{d}t +g(t)\,\mathrm{d}\bar{w},
$$

其中，$d\bar{w}$为反向过程的标准布朗运动。如果我们能得到<b>分数函数</b>$\nabla_x\log p_t(x)$，就可以沿着反SDE（3），从标准正态分布的采样出发，演化到数据分布中的采样。遗憾的是，解析意义下我们难以得到上述分数函数，不过，我们可以建立一个神经网络$s_\theta(x(t), t)$去拟合该分数函数。

在训练过程中，我们有一个自然的损失函数：

$$
J_1 = E_t\{E_{x(t)}[\|s_\theta(x(t),t)-\nabla_{x(t)}\log p(x(t))\|_2^2]\}
$$

但是，上述损失函数中的分数函数我们没法提前计算得知。幸运的是，上述损失函数可以进行转化，从而得到以下等价的损失函数（转化过程见<b>附录A</b>)：

$$
J_2 = E_t\{E_{x(0)}E_{x(t)|x(0)}[\|s_\theta(x(t),t)-\nabla_{x(t)}\log p_{0t}(x(t)|x(0))\|_2^2]\}
$$

至于训练样本生成，我们可以数据集中任意$x(0)$出发，正向演化到$x(t)$，然后代入计算上述损失函数。这里的$\nabla_{x(t)}\log p_{0t}(x(t)|x(0))$可以是易于计算的。

至此，我们可以完成训练，并通过反向SDE方程进行采样。

## ODE采样

注意到，上述采样方式依照一个SDE方程，相同的采样起点（标准正态分布采样）并不能得到相同的采样终点（数据分布采样）。这在生成中没有什么影响，但在条件生成（即生成满足某种条件的图片）时，会引入一些问题。于是，本文作者提出了一个ODE采样的方法。我们可以将上述反向SDE改写为如下ODE：

$$
\mathrm{d}x = [f(x,t)-\frac{g(t)^2}{2}\nabla_x\log p_t(x)]\,\mathrm{d}t ,
$$

可以证明，在相同初始分布下（$x(0)$服从同一分布），任意时刻t，由（3）和（6）得到的$x(t)$服从同一分布（详细证明见<b>附录B</b>）。因此，（3）和（6）拥有相同的分数函数。我们可以通过SDE进行训练，然后将训练得到的分数函数代入（6）式中，通过上述ODE方程进行数据分布的采样，从而保证采样的稳定性。

## 附录

### A

$$
\begin{aligned}
J_1&=\mathbb{E}_{t\sim U(0,1),~\mathbf{x}(t)\sim p(\mathbf{x}(t))}[\| s_\theta(\mathbf{x}(t), t) - \nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t))\|_2^2] \\
J_2 &= \mathbb{E}_{t\sim U(0,1),~\mathbf{x}(t)\sim p(\mathbf{x}(t)|\mathbf{x}(0)), ~\mathbf{x}(0)\sim p(\mathbf{x}(0))}[\|s_\theta(\mathbf{x}(t), t)-\nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t)|\mathbf{x}(0))\|_2^2].
\end{aligned}
$$

由于t服从相同分布，因此我们考虑：

$$
\begin{aligned}
\hat{J}_1 &= \mathbb{E}_{\mathbf{x}(t)\sim p(\mathbf{x}(t))}[\| s_\theta(\mathbf{x}(t), t) - \nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t))\|_2^2] \\
\hat{J}_2 &= \mathbb{E}_{\mathbf{x}(t)\sim p(\mathbf{x}(t)|\mathbf{x}(0)), ~\mathbf{x}(0)\sim p(\mathbf{x}(0))}[\|s_\theta(\mathbf{x}(t), t)-\nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t)|\mathbf{x}(0))\|_2^2].
\end{aligned}
$$

$$
\begin{aligned}
\hat{J}_1 &= \mathbb{E}_{\mathbf{x}(t)\sim p(\mathbf{x}(t))}[\| s_\theta(\mathbf{x}(t))\|_2^2]-S_1(\theta)+C_1\\
\hat{J}_2 &= \mathbb{E}_{\mathbf{x}(t)\sim p(\mathbf{x}(t)|\mathbf{x}(0)), ~\mathbf{x}(0)\sim p(\mathbf{x}(0))}[\|s_\theta(\mathbf{x}(t))\|_2^2]-S_2(\theta)+C_2,
\end{aligned}
$$

$$
\begin{aligned}
S_1(\theta)&=2\mathbb{E}_{\mathbf{x}(t)\sim p(\mathbf{x}(t))}[\left\langle s_\theta(\mathbf{x}(t), t),\nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t))\right\rangle]\\
S_2(\theta)&=2\mathbb{E}_{\mathbf{x}(t)\sim p(\mathbf{x}(t)|\mathbf{x}(0)), ~\mathbf{x}(0)\sim p(\mathbf{x}(0))}[\left\langle s_\theta(\mathbf{x}(t), t),\nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t)|\mathbf{x}(0))\right\rangle].
\end{aligned}
$$

$$
\begin{aligned}
&\frac{1}{2}S_1(\theta)\\
&=\int_{\mathbf{x}(t)}p(\mathbf{x}(t))\left\langle s_\theta(\mathbf{x}(t),t), \nabla_{\mathbf{x}(t)} \log p(\mathbf{x}(t)) \right\rangle \,\mathrm{d}\mathbf{x}(t)\\
&=\int_{\mathbf{x}(t)}\left\langle s_\theta(\mathbf{x}(t),t), \nabla_{\mathbf{x}(t)} p(\mathbf{x}(t))\right\rangle \,\mathrm{d}\mathbf{x}(t)\\
&=\int_{\mathbf{x}(t)}\left\langle s_\theta(\mathbf{x}(t),t),  \int_{\mathbf{x}(0)}p(\mathbf{x}(0))\nabla_{\mathbf{x}(t)}p(\mathbf{x}(t)|\mathbf{x}(0))d\mathbf{x}(0) \right\rangle \,\mathrm{d}\mathbf{x}(t)\\
&=\int_{\mathbf{x}(t)}\left\langle s_\theta(\mathbf{x}(t),t),  \int_{\mathbf{x}(0)}p(\mathbf{x}(0))p(\mathbf{x}(t)|\mathbf{x}(0))\nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t)|\mathbf{x}(0))\,\mathrm{d}\mathbf{x}(0) \right\rangle \,\mathrm{d}\mathbf{x}(t)\\
&=\int_{\mathbf{x}(t)}\int_{\mathbf{x}(0)}p(\mathbf{x}(0))p(\mathbf{x}(t)|\mathbf{x}(0))\left\langle s_\theta(\mathbf{x}(t),t),  \nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t)|\mathbf{x}(0)) \right\rangle \,\mathrm{d}\mathbf{x}(0)\,\mathrm{d}\mathbf{x}(t)\\
&=\mathbb{E}_{\mathbf{x}(t)\sim p(\mathbf{x}(t)|\mathbf{x}(0)),~ \mathbf{x}(0)\sim p(\mathbf{x}(0))}[\left\langle s_\theta(\mathbf{x}(t), t),\nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t)|\mathbf{x}(0))\right\rangle]\\
&=\frac{1}{2}S_2(\theta).
\end{aligned}
$$

因此有$J_2 = J_1-C_1+C_2$，两者具有相同的最优点，证毕。

### B

我们考虑SDE（3），对应的Fokker-Planch方程为：

$$
\frac{\partial p(\mathbf{x}(t))}{\partial t}=-\nabla_{\mathbf{x}(t)}\cdot[\mathbf{f}(\mathbf{x}(t),t)p(\mathbf{x}(t))]+\frac{1}{2}g^2(t)\nabla_{\mathbf{x}(t)}\cdot\nabla_{\mathbf{x}(t)}p(\mathbf{x}(t)).
$$

由于事实$\nabla_{\mathbf{x}(t)}(\log p(\mathbf{x}(t)))p(\mathbf{x}(t))=\nabla_{\mathbf{x}(t)}p(\mathbf{x}(t))$，我们有以下结果：

$$
\begin{aligned}
\frac{\partial p(\mathbf{x}(t))}{\partial t}&=-\nabla_{\mathbf{x}(t)}\cdot[\mathbf{f}(\mathbf{x}(t),t)p(\mathbf{x}(t))-\frac{1}{2}g^2(t)\nabla_{\mathbf{x}(t)}p(\mathbf{x}(t))]\\
&=-\nabla_{\mathbf{x}(t)}\cdot\{[(\mathbf{f}(\mathbf{x}(t),t)-\frac{1}{2}g^2(t)\nabla_{\mathbf{x}(t)}\log p(\mathbf{x}(t)))]p(\mathbf{x}(t))\}
\end{aligned}
$$

对比两式，我们得到（8）对应方程：

$$
\mathrm{d}{x}=[{f}({x}(t),t)-\frac{1}{2}g^2(t)\nabla_{{x}(t)}\log p({x}(t))]\,\mathrm{d}t.
$$

由于（8）是ODE，其对应反向方程仍为：

$$
\mathrm{d}{x}=[{f}({x}(t),t)-\frac{1}{2}g^2(t)\nabla_{{x}(t)}\log p({x}(t))]\,\mathrm{d}t.
$$

证毕。
