---
title: Diffusion Posterior Sampling (DPS)
description: 本文档主要介绍DPS的方法流程
created: 2025-09-16
---

## 主要思路

利用训练好的无条件生成模型，通过某种数学上的技巧，将无条件分数函数转化为条件分数函数，从而实现条件生成，在求解反问题中（通俗的来说，解方程）有应用潜力。

## 前置知识

### 反问题

在很多科学问题中，我们通过观测到的结果数据，反向求解方程中的系数等问题，称为反问题。反问题的常见形式是：

$$
y^\delta=Ax+n,
$$

其中n为观测噪声（通常假设为高斯噪声），A为正向算子，$y^\delta$为观测数据，x为待求解系数。比如在图像领域，去噪问题中，A为恒等算子；增加分辨率或补全图像问题中，A为某个投影算子。

### 基于分数的生成方法

见[基于分数的生成方法（score-based）](./score-based.md)

## 详细推导

在无条件生成中，我们要学习的数据初始分布为$x(0)\sim p_{0}(x(0))=p_{\text{data}}(x(0))$，通过如下方程：

$$
\mathrm{d}x = -\frac{\beta(t)}{2}\,\mathrm{d}t + \sqrt{\beta(t)}\,\mathrm{d}w,
$$

实现从数据分布到标准正态分布的演化，其中$T=1,\beta(0)=0.2, \beta(1)=10$。并训练好分数函数$\nabla_x\log p_t(x)$后，通过逆时演化以下方程：

$$
\mathrm{d}x = [-\frac{\beta(t)}{2}-\nabla_{x(t)}\log p_t(x(t))]\,\mathrm{d}t + \sqrt{\beta(t)}\,\mathrm{d}\bar{w}
$$

实现从数据分布中采样。

在反问题中，我们通常会有观测数据$y^\delta$，以及相应的正向算子A。因此我们通常想要学习条件数据分布，即$x(0)\sim p_{data}(x(0)|y^\delta)$。其对应正向SDE仍为方程（1），也就是说，我们仍然可以从该条件数据分布，顺时演化到标准正态分布。然而，其对应反向SDE为：

$$
\mathrm{d}x = [-\frac{\beta(t)}{2}-\nabla_{x(t)}\log p_t(x(t)|y^\delta)]\,\mathrm{d}t + \sqrt{\beta(t)}\,\mathrm{d}\bar{w}
$$

通过前一步训练，我们有分数函数$\nabla_x\log p_t(x)$，但并没有上式中的条件分布函数。

于是我们将上述（3）式，通过贝叶斯公式转化为：

$$
\mathrm{d}x = [-\frac{\beta(t)}{2}-(\nabla_{x(t)}\log p_t(x(t))+\nabla_{x(t)}\log p_t(y^\delta|x(t)))]\,\mathrm{d}t + \sqrt{\beta(t)}\,\mathrm{d}\bar{w}
$$

其中，分数函数已有训练近似，我们只需计算得出$\nabla_{x(t)}\log p_t(y^\delta|x(t))$即可进行逆时演化。

注意到：

$$
\begin{aligned}
p(y^\delta|x(t))&=\int p(y^\delta|x(0),x(t))p(x(0)|x(t))\,\mathrm{d}x(0)\\
&=\int p(y^\delta|x(0))p(x(0)|x(t))\,\mathrm{d}x(0)\\
&=E_{x(0)\sim p(x(0)|x(t))}[p(y^\delta|x(0))]
\end{aligned}
$$

由于（详见 [DPS](https://s0lu5lblzl4.feishu.cn/record/XrvPrlwdseM4aacVmRqcofVdnbf) 附录A）：

$$
\begin{aligned}
\hat{x}(0):=E[x(0)|x(t)]&=\frac{1}{\sqrt{\bar{\alpha}(t)}}(x(t)+(1-\bar{\alpha}(t))\nabla_{x(t)}\log p_t(x(t))\\
&\simeq \frac{1}{\sqrt{\bar{\alpha}(t)}}(x(t)+(1-\bar{\alpha}(t))s_\theta(x(t), t))
\end{aligned}
$$

于是有：

$$
\begin{aligned}
p(y^\delta|x(t)) &=E_{x(0)\sim p(x(0)|x(t))}[p(y^\delta|x(0))]\\
&\simeq p(y^\delta|E_{x(0)\sim p(x(0)|x(t))}[x(0)])\\
&=p(y^\delta|\hat{x}(0))
\end{aligned}
$$

（上式利用$E[f(x)]\simeq f(Ex)$，这里有一个Jessen Gap，详见 [DPS](https://s0lu5lblzl4.feishu.cn/record/XrvPrlwdseM4aacVmRqcofVdnbf) 附录A）

由于假设n为高斯噪声，于是（12）式可由正态分布概率函数计算，得到：

$$
\begin{aligned}
\nabla_{{x(t)}} \log p({y}| {x(t)}) \simeq-\frac{1}{\sigma^{2}} \nabla_{{x(t)}}\|{y}-\mathcal{A}(\hat{x}(0))\|_{2}^{2}
\end{aligned}
$$

其中，$\sigma$为n服从的正态分布的方差。由此，我们可以近似计算反向SDE（3），并从任一标准正态分布的采样出发，逆时演化得到条件数据分布的采样。

## 评价

### 优势

- 只需要训练一次无条件分数函数，理论上即可对任一算子进行上述操作进行反演，是一个无监督的训练模型

### 问题

- 由于基于SDE，采样过程不稳定，结果时好时坏
- 需要进行大量的迭代过程，相比于有监督的端到端模型，速度较慢
- 由于没有数据的监督，相比于有监督的端到端模型，效果较差

### 改进方向

- 可以考虑基于ODE的采样过程，增强采样稳定性
- 借助一些加速生成的模型（例如Consistency Model），提高采样速度
