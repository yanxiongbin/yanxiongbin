---
title: 扩散模型求解全波反演
description: 介绍在全波反演上应用扩散模型的前沿方法
created: 2025-09-22
---

## Deepwave团队

这是一个来自[King Abdullah University of Science and Technology](https://www.kaust.edu.sa/study/faculty/tariq-alkhalifah)的石油佬团队，学生大多是中国人，主要研究方向是地震反演和深度学习，最近几年做过一些扩散模型结合FWI的工作。

### DiffusionInv

总结：尝试从无条件生成模型中蒸馏先验分布，通过进一步训练将神经网络参数finetune到条件生成的轨迹上。方式是冻结其他参数，对U-Net的解码器进行训练，没有对条件/无条件分数形式联系的进一步讨论和设计，我认为能够保持先验分布的形式是因为finetune部分已经解好了反问题，另一方面Latent Diffusion模式在Auto-encoder的解码器部分保持了先验分布的信息。

扩散模型：DDIM, Latent Diffusion

计算速度：函数级方法，每次求解需要重新对U-Net进行finetune

实验场景：Hess model，Otway model，应该是传统方法的经典数据，需要手动构造数据集进行先验知识的建模。文章的一部分实验是以速度模型的切片作为学习目标的简单场景

Notes

### [Diffusion regularized FWI](https://s0lu5lblzl4.feishu.cn/record/Ck3ZrrtBBejDYFcgq8acfEpCnGb)

总结：所谓扩散模型正则化的梯度下降方法，在扩散模型的迭代过程中，每一步时间步前进行若干次直接梯度下降，在大部分实验中是10步梯度下降-1步时间步，特别的改动是初始输入并非噪声而是速度场的初始猜测。相对DPS的方法缺乏解释，并没有 $\hat{x}_0=E[x_0|x_t]$这一类的估计而是直接进行梯度下降，声称优化解具有预训练的扩散模型学习的先验分布约束，但没有对这一点进一步的解释。

扩散模型：DDPM，保方差形式否则不能在初始输入速度场的粗糙猜测

计算速度：函数级，需要进行大量的正演计算

实验场景：使用OpenFWI的速度场学习先验分布，但应该是因为没法处理OpenFWI或者没有正演算子代码的原因，实际实验场景是自定义的正演算子但使用OpenFWI的速度场，只做了极少数的实验，这个正演算子的场景具有大量的震源数，可能是相对数据集更简单的场景。

Notes

## OpenFWI团队

### [Wave Diffusion](https://s0lu5lblzl4.feishu.cn/record/B81XrvpL9ecruOcA58hcbWdCnMb)
