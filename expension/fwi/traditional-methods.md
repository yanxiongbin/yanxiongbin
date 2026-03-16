---
title: FWI传统方法
description: FWI传统方法
created: 2025-09-23
---

## LBFGS

1. 目标：解决无约束优化问题：$\min_{x\in\mathbb{R}^n} f(x)$

2. 牛顿法：

$$
f(x_k+p)\approx f(x_k)+\nabla f(x_k)^Tp+\frac{1}{2}p^T\nabla^2f(x_k)p
$$

最小化该二次模型，可以得到搜索方向$p_k=-[\nabla^2f(x_k)]^{-1}\nabla f(x_k)$，然后逐步更新$x_{k+1}=x_k+p_k$。该方法需要计算和存储Hessian矩阵和逆，计算复杂度$O(n^3)$ 3. \*拟牛顿法：构造Hessian矩阵逆的近似$H_k\approx[\nabla^2f(x_k)]^{-1}$，理想情况下希望它满足拟牛顿条件：

$$
H_{k+1}(x_{k+1}-x_k)\approx\nabla f(x_{k+1})-\nabla f(x_k)
$$

4. BFGS:

$$
H_{k+1}=(I-\rho_ks_ky_k^T)H_k(I-\rho_ks_ky_k^T)+\rho_ks_ks_k^T
$$

其中$s_k=x_{k+1}-x_{k},y_k=\nabla f(x_{k+1})-\nabla f(x_k),\rho_k=\frac{1}{y_k^Ts_k}$，避免计算Hessian，但仍然需要存储稠密的$n\times n$的矩阵$H_k$

5. LBFGS: 目标是计算$p_k=-H_k\nabla f(x_k)$，而不显式的存储$H_k$。迭代流程如下:
   - 保存最近m次的迭代对$\{s_i,y_i\}$，初始逆矩阵近似$H_k^0$：通常为简单的标量矩阵，例如$H_K^0=\gamma_kI,\gamma_k=\frac{s_{k-1}^Ty*{k-1}}{y^T*{k-1}y\_{k-1}}$
   - 初始化$q=\nabla f(x_k)$
   - 对于$i=k-1, k-2, \cdots, k-m$，令$\alpha_i=\rho_is_i^Tq,q=q-\alpha_iy_i,r=H_k^0q$
   - 对于$i=k-m, k-m+1, \cdots, k-1$，令$\beta_i=\rho_iy_i^Tr,r=r+s_i(\alpha_i-\beta_i)$，最终得到的r就是我们想要的$H_k\nabla f(x_k)$，即$p_k=-r$该方法的收敛速度为超线性收敛，空间复杂度为O(mn)

## Wasserstein-p距离

1. 定义：假设地面上$\mathcal{X} = \mathbb{R}^2$堆了一些石子，石子的分布我们用$\mu : \mathcal{X} \to \mathbb{R}$来表示，采取这样的表示方法对于地面上的任意一块面积$A \subseteq \mathcal{X}$，$\mu(A)$表示这块面积上放置了质量为多少的石子。同样的我们可以定义目标石子堆的分布$\nu$。定义一个输运方案$T: \mathcal{X} \to \mathcal{X}$把现有的石子堆变成目标石子堆。$T(A) = B$表示把原来放在A处的石子都运到B处放好，类似地可以定义反函数$T^{-1}(B) = A$。该输运方案成立需要满足

$$
\nu(B) = \mu(T^{-1}(B)), \quad \forall B \subseteq \mathcal{X}
$$

即任意位置的石子通过输运过后都刚好满足分布$\mu$的要求。这也可以写为$T\#\mu = \nu$。由此，两堆石子之间的距离可以被定义成把一堆石子挪动或另外一堆所需要的最小输运成本

$$
W_p(\mu, \nu) = \left(\inf_{T: T\#\mu = \nu} \int_{\mathcal{X}} \|x - T(x)\|^p \mu(x)dx\right)^{1/p}
$$

对于石子不可分的情况，我们有如下公式

$$
W_2(\mu, \nu) = \left(\inf_{\gamma \in \Gamma(\mu, \nu)} \int_{X \times Y} d(x,y)^2 d\gamma(x,y) \right)^{1/2}
$$

1.  $\Gamma(\mu, \nu)$是所有联合分布的集合，其边缘分布分别为$\mu$和$\nu$, $d(x,y)$是x和y之间的距离度量, $\gamma$表示如何将分布$\mu$"传输"到分布$\nu$. 一维情况下有如下公式：

$$
W_2^2(P,Q)=\int_0^1|F^{-1}(u)-G^{-1}(u)|^2du
$$

其中$F$和$G$为相应的概率分布函数

2. 一维情形下我们有如下的闭式解：

$$
W_p^p(P,Q)=\int_0^1|F^{-1}(u)-G^{-1}(u)|^pdu
$$

F和G分别为与P，Q对应的分布函数。离散情况下，假设我们有从P中取出的N个样本$\{x_1,\cdots,x_n\},$从Q中取出的N个样本$\{y_1,\cdots,y_n\}$,我们有经验分布函数：

$$
FN(x)=\frac{1}{N}\sum_{i=1}^N \mathbb{1}_{\{x_i<x\}}
$$

相应的有经验分位数函数

$$
FN^{-1}(u)=x_{(k)},\frac{k-1}{N}<u\le\frac{k}{N}
$$

同理可得$G^{-1}(u)$。由此我们有

$$
W_p^p(P_N,Q_N)=\int_0^1|F_N^{-1}(u)-G_N^{-1}(u)|^pdx=\sum_{k=1}^N\int_{(k-1)/N}^{k/N}|x_{(k)}-y_{(k)}|^p du=\frac{1}{N}\sum_{k=1}^N|x_{(k)}-y_{(k)}|^p
$$

3. 二维情形可以采用如下两种方法: 1. Sliced Wasserstein Distance：<b>将二维分布做投影到一维分布</b>，然后对一维分布投影计算相应的W2距离，然后做积分。具体的数学公式为

$$
SW_p(P,Q)=(\int_{\mathbb{S}^{d-1}}W_p^p(P_\theta,Q_\theta)d\theta)^{1/p}
$$

其中$P_\theta$为$P$在方向$\theta$上的一维投影分布：

$$
P_\theta=\text{Distribution of } \theta^TX,\; X\sim P
$$

实践中我们采用随机采样方向来近似这个积分

$$
SW_p(P,Q)=(\frac{1}{L}\sum_{l=1}^LW_p^p(P_\theta,Q_\theta)d\theta)^{1/p}
$$

也即我们先随机生成L个随机方向$\theta_1,\cdots,\theta_L\in \mathcal{S}^{d-1}$, 然后将P中样本$\{x_1,\cdots,x_N\}\subset\mathbb{R}^d $，Q中样本$\{y_1,\cdots,y_N\}\subset \mathbb{R}^d$分别在这L个方向上做投影（也即做点乘），得到的投影值即为新的一维分布，这样就可以按照上面的一维情形求解了2. sinkhorn：引入<b>熵正则化</b>。原始的离散Wasserstein 距离需要解线性规划：

$$
W_p^p(P,Q)=\min_{\gamma\in\Gamma(P,Q)}\sum_{i=1}^m\sum_{j=1}^n\gamma_{ij}C_{ij}
$$

其中$C_{ij}=|x_i-y_j|^p,\sum_j\gamma_{ij}=p_i,\sum_i\gamma_{ij}=q_j,\gamma_{ij}\ge0$。sinkhorn引入熵正则化：

$$
W_{p,\epsilon}^p(P,Q)=\min_{\gamma\in\Gamma(P,Q)}[(\sum_{i=1}^m\sum_{j=1}^n\gamma_{ij}C_{ij})-\epsilon H(\gamma)]
$$

其中熵$H(\gamma)=-\sum_{i,j}\gamma_{ij}(\log\gamma_{ij}-1)$，该问题有显式解

$$
\gamma=\text{diag}(u)K\text{diag}(v)
$$

其中$K_{ij}=\exp(-C_{ij}/\epsilon)$，将该解代入约束可得

$$
\sum_j u_i K_{ij}v_j =p_i\Rightarrow u_i=\frac{p_i}{\sum_j K_{ij}v_j}
$$

$$
\sum_i u_i K_{ij}v_j =q_j\Rightarrow v_j=\frac{q_j}{\sum_i K_{ij}u_i}
$$

由此可以得到迭代公式$u\leftarrow \frac{p}{Kv},v\leftarrow \frac{q}{K^Tu}$

## 关于误差函数

波场是难以拟合好的，根本原因在于波场容易错开，具体来讲我们可以看下面的例子：

![](../assets/E4zkbVnqpoCwQBxzZMocwmOWnHg.png)

在这张图片中，我们可以看到橙色的波场是蓝色波场的一个偏移，在拟合的时候，梯度下降会优先将波做压缩而非平移，他并不知道平移的结果会使得误差函数降得更低。并且当偏移量足够大的时候，会发现MSE几乎不动，比如下面的图：

![](../assets/CQ4kbd20OoRydaxQThbcGMF9nYd.png)

我们可以看到的是我们更想要橙色的波场，因为离蓝色的波场更近，但是计算橙色和绿色的波场的MSE都是差不多的，我们可以画出偏移量和MSE的关系图：

![](../assets/F7eyb183hoOGpcxEACOcCzmBnYd.png)

可以看到稍微大点的偏移量MSE几乎没啥改变。所以我们要想办法修改一下MSE。

如果波场都是正的，是不是我直接沿着x轴做cumsum就可以了？所以我尝试了一下取绝对值再然后再累积求和，具体的数学公式如下：假设我们有观测波场$u_o(t)$，合成波场$u_p(t)$（波场均为一维的），我们定义如下的距离：

$$
d(u_o,u_p)=\int_0^T(\int_0^t|u_o(s)|-|u_p(s)|ds)^2dt
$$

果然解决了这个问题：

![](../assets/YBlpbYH0Aok5awxmhp1ctLWhned.png)

画出来的误差图像如下：

![](../assets/B9jKbZ9lHosZBvxe1iyc8OCQnxb.png)

这个操作能解决波场偏移的问题，波峰的高低可能可以再用什么trick处理一下？实际实验似乎有那么一点效果，但应该还能改进（用这个误差dps好像试出来是有戏的）。有什么见解可以评论一下。这里会发现t比较小的时候的波场占比会比较大，应该可以再做某些调整。

W2的做法似乎也是差不多这个想法，把波场当成分布函数，但是波场这里不一定都是正的，是不是得有某些操作处理一下，而且我也没法从波场做采样。另外，个人感觉这里不应该当成二维图像做sinkhorn，而应该直接对那个1000维的向量求误差，再把总共的 $5\times 70=350$个都加起来。

## 几种经典传统方法的结果对比（curvevelA版本）

### 省流

1. 如果有好的初值估计的话，<b>无脑对逐通道使用W2</b>，效果奇佳。
2. 这里的W2使用的是加上波场的最小值再做归一化，<b>直接取绝对值效果不佳</b>
3. 在没有好的初值的情况下，不管用什么损失函数，不管是否加tv正则化，<b>都是寄（层数少的话用W2可能可以勉强做一做）</b>。
4. 在异侧的情况不见得比在同侧的情况好求解。
5. 不推荐使用sinkhorn（不排除我参数没找好的情况）。
6. 我现在也不知道哪个算子简单了，难以描述，建议看下面的结果。个人感觉如果本来初值的表面就很接近真实解的话（也即面波本来的误差就非常小），打点在表面甚至更好做。尤其是逐通道的W2.
7. 不知道为什么积分loss失效了，完全跑不通（每次都是一开始相对误差就不下降，最后得到的图像也是完全不对的）（现在的结果我感觉是取绝对值的问题，换成$W^2$那种减去最小值就能降了，还是能得到形状的，效果倒是没有W2那么好，当然不排除是调参的原因）

### 震源和接收器都在左

#### 无正则化，不添加噪声

1. 使用$L^2$ norm: 1. Adam优化器：1. 初始化为<b>真解的模糊化</b>，具体公式为

   $$
   \text{output}(x,y) = \frac{1}{\iint \frac{1}{v_{\text{true}}(u,v)} \cdot G(x-u,y-v) \, du \, dv}
   $$

其中$G$为高斯核函数：

$$
G(x,y) = \frac{1}{2\pi\sigma^2} e^{-\frac{x^2 + y^2}{2\sigma^2}}
$$

对应的离散格式为

$$
\text{output}[i,j] = \frac{1}{\sum_{m=-k}^{k} \sum_{n=-k}^{k} \frac{1}{v_{\text{true}}[i-m,j-n]} \cdot G[m,n]},\quad G[m,n] = \frac{1}{2\pi\sigma^2} e^{-\frac{m^2 + n^2}{2\sigma^2}}
$$

此处$\sigma$越大，初始解就越模糊，离真实解就越远。取$\sigma=10$，初始相对误差为12.1%，迭代的结果如下（分别为结果，解的误差，波场的误差），相对误差为7.7%（注意，此时并不会出现所谓半收敛性的线性的现象），相对误差虽然一直在降，但是很明显整个图已经脱离数据集了。理论上应该还能降）

<div class="flex gap-3 columns-3" column-size="3">
    <div class="w-[35%]" width-ratio="35">
    ![](../assets/UNvXbAzdLoqNukxiB25cru2DnWh.png)
    </div>
    <div class="w-[32%]" width-ratio="32">
    ![](../assets/HQgvbgPnEoPlwoxY9XEcioP9nJc.png)
    </div>
    <div class="w-[32%]" width-ratio="32">
    ![](../assets/EMPZbSYObo3SrfxzJ8qcjixEnbW.png)
    </div>
</div>

1. 取$\sigma=100$，初始相对误差为26.6%，迭代的结果如下，相对误差为<b>26.7%</b>

<div class="flex gap-3 columns-3" column-size="3">
    <div class="w-[35%]" width-ratio="35">
        ![](../assets/OVUzbBb58oJsEsxT5FFcmAfjnsg.png)
    </div>
    <div class="w-[32%]" width-ratio="32">
        ![](../assets/GkrtbmSRYoCCoSxekD4cJzBRnrd.png)
    </div>
    <div class="w-[32%]" width-ratio="32">
        ![](../assets/JJ0NbIgg5omSbAxw31QcI64Cn0f.png)
    </div>
</div>

2. 初始化为常数值（这里我取的中间值3000），也会在迭代后期出现上面速度太小导致的警告，虽然强行运行也是能得到一个结果的

<div class="flex gap-3 columns-3" column-size="3">
   <div class="w-[35%]" width-ratio="35">
   ![](../assets/Et3ob7TYdoHMP9xC1DGcI1kVn6d.png)
   </div>
   <div class="w-[32%]" width-ratio="32">
   ![](../assets/Fvqhbg17loNkwXxuCyHcPJRwnud.png)
   </div>
   <div class="w-[32%]" width-ratio="32">
   ![](../assets/Jfn8bu0lMoo9SyxdbB8cHPkynGh.png)
   </div>
</div>
   
这时我们就能明显地看到半收敛性现象了（当上面的$\sigma$较大时，也会出现相对误差不降的现象）> deepwave的建议是一个完整波形的长度至少需要6个网格点，否则可能无法准确模拟波形。根据波长=速度/频率，速度太小时，波长也会相应的小，所包含的网格点也就少，所以会出现上面的问题。此时在物理上无法进行有效的模拟2. SGD：结果有点amazing，相对误差几乎不带降，也就是基本没做移动（这里我学习率设置为50），把学习率调到5000，loss开始降了，但相对误差几乎不变（应该是在局部极小点附近了）

![](../assets/Ewb8bL1CgoaDNkx7P4Wcxugunve.png)

1. lbfgs优化（原来torch也是有lbfgs优化器的）：我们继续重复上面的操作，结果也是很amazing，如果使用默认的使用 `strong_wolfe`进行线搜索，也会出现上面和上面SGD同样的情况。自己实现的lbfgs，使用原步长结果也是不太能动。

2. 使用W2 metric（以下用的Adam优化器）
   1. 使用sinkhorn：初始解依然设置为真解的模糊化，使用adam优化器，$\sigma=10$时出现了速度过小的情况，而且是在前几步就出现了这个问题，后面的结果也不收敛。
      <div class="flex gap-3 columns-3" column-size="3">
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/KKG3bdtGVoFfqxxV5QJcCDwgnhb.png)
      </div>
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/HpzMbNfzOoN4mtxtQiDchRjJnce.png)
      </div>
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/JMHtb71Ulo6WhJxqzIic45jInMf.png)
      </div>
      </div>
      若初始解为常数值，解也是跑不出来的
      <div class="flex gap-3 columns-3" column-size="3">
      <div class="w-[35%]" width-ratio="35">
    ![](../assets/Dv28bpj1poFDtNx039rc1vVqnFb.png)
    </div>
     <div class="w-[32%]" width-ratio="32">
   ![](../assets/WgkZbh3qnozY5uxstkVcEG1NnIc.png)
   </div>
     <div class="w-[32%]" width-ratio="32">
   ![](../assets/ZNpebjYd7owjq9xEIjkcHuy2nDd.png)
   </div>
     </div>

3. 把每个接收器和震源的pair对应的一维信号当作分布函数，直接求相应的分布函数，然后求逆，然后再直接计算误差
   1. 取$\sigma=10$，结果如下，相对误差为<b>5.1%</b>
      <div class="flex gap-3 columns-3" column-size="3">
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/F9hIblJykoMsBuxXrDgcw4dCnLc.png)
      </div>
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/X4aHbuUAeonxxoxOCbbczFQOnsv.png)
      </div>
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/VUOTbrMDroE5j5xYS1sceTcanrP.png)
      </div>
      </div>
   2. 取$\sigma=100$，结果如下，相对误差为<b>22.1%</b>
      <div class="flex gap-3 columns-3" column-size="3">
      <div class="w-[35%]" width-ratio="35">
      ![](../assets/BNA1bkyJIo6zBKxytR5cnLEvnEc.png)
      </div>
      <div class="w-[32%]" width-ratio="32">
      ![](../assets/N5vxbXgZsokAqbxMsR0cVzGDnPh.png)
      </div>
      <div class="w-[32%]" width-ratio="32">
      ![](../assets/T8p1bYVEZopptAxNghVcHLgMn9c.png)
      </div>
      </div>

   3. 取初始值为常数值3000，结果如下
      <div class="flex gap-3 columns-3" column-size="3">
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/BkIObNwfwojpHLxW3UKc0qNQndb.png)
      </div>
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/RDwMbE7Juo5Cr2xHWYFcUnLdnWf.png)
      </div>
      <div class="w-[33%]" width-ratio="33">
      ![](../assets/VqRYbr7CiojVuLxmyivcj37Vnpb.png)
      </div>
      </div>

#### 添加TV正则化

1. 定义：增加一个惩罚项：图像梯度的L2范数

$$
TV(u)=\sum\_{i,j} \sqrt{(u[i+1, j] - u[i, j])^2 + (u[i, j+1] - u[i, j])^2}
$$

该惩罚项能促进梯度域的稀疏性。鼓励大部分像素梯度为0（平滑区），允许少数像素梯度很大（边缘），即保边去噪。此时的loss_func我们定义为：

$$
J(c)=MSE(d,u(c))+\lambda TV(c)
$$

这里的d为观测到的波场，迭代过程中的速度场，u(c)为相应的模拟波长，$\lambda$为正则化项的系数（这里由于速度场的值本身比较大(1500~4500)，所以必须取一个比较小的值（比如0.001就太大了，相对误差会一直上升）。2. 使用L2 norm

1. Adam优化器：

1. 我们首先取$\lambda=1e-6$，$\sigma=10$，相对误差为<b>7.3%</b>，得到的图像如下。误差略微下降，并且图像看起来是会更接近数据集一点。
<div class="flex gap-3 columns-3" column-size="3">
<div class="w-[33%]" width-ratio="33">
![](../assets/YZw5b4R4eoFBggx8N49cON6gnxf.png)
</div>
<div class="w-[33%]" width-ratio="33">
![](../assets/XCPibgzajoss15xakZ1cx8DWnPe.png)
</div>
<div class="w-[33%]" width-ratio="33">
![](../assets/RyDibrWsZoPUkPx7lrBcIDIqnyf.png)
</div>
</div>
对于0初始值，依然会出现上面所说的情况，即速度太小，当然也是可以强行跑的，半收敛性会稍微小一点，但还是存在。从结果上看会稍微好一些，虽然好像也没啥意义
<div class="flex gap-3 columns-3" column-size="3">
<div class="w-[33%]" width-ratio="33">
![](../assets/ChiDbEJKuoWukxxciIEcF3eln8c.png)
</div>
<div class="w-[33%]" width-ratio="33">
![](../assets/FDOhbNLg9oCDFXxkIpJc6alFnAe.png)
</div>
<div class="w-[33%]" width-ratio="33">
![](../assets/WUihbATMooJ5G1xPScccdL5OnXe.png)
</div>
</div>
$\sigma=100$，相对误差为<b>26.1%</b>
<div class="flex gap-3 columns-3" column-size="3">
<div class="w-[35%]" width-ratio="35">
![](../assets/ZMCzbljRhoyTZ3xeaSIckINEnig.png)
</div>
<div class="w-[32%]" width-ratio="32">
![](../assets/MQ9xb2jjuoUPPux2hsHcOerynlc.png)
</div>
<div class="w-[32%]" width-ratio="32">
![](../assets/XMbLbDjKUop1PoxrqCMcGYofnHb.png)
</div>
</div>

1. 接下来取$\lambda=1e-5$，$\sigma=10$，相对误差为<b>8.4%</b>，得到的图像如下。误差反而增加了，d但图像看起来是会更接近数据集一点。
   <div class="flex gap-3 columns-3" column-size="3">
   <div class="w-[35%]" width-ratio="35">

![](../assets/ZjPob4Kv2oxhH6xKeb2co7PNnGJ.png)

</div>
            <div class="w-[32%]" width-ratio="32">
![](../assets/Dc2Kbjp4eooFmvxflzpc5O8hn9c.png)
</div>
            <div class="w-[32%]" width-ratio="32">
![](../assets/Fuolbe60noLuI7xRFvXc3923n6z.png)
</div>
            </div>
对于0初始值，依然会出现上面所说的速度太小的情况，当然也是可以强行跑的，半收敛性会稍微小一点，但还是存在。从结果上看会稍微好一些，虽然好像也没啥意义
  取$\sigma=100$，相对误差为<b>24.6%</b>
  <div class="flex gap-3 columns-3" column-size="3">
  <div class="w-[35%]" width-ratio="35">
![](../assets/YZScbch4ooBp0xxRa93c77GRnhd.png)
</div>
            <div class="w-[32%]" width-ratio="32">
![](../assets/F30kb2NyIo7kM8xyYslciwgHnuc.png)
</div>
            <div class="w-[32%]" width-ratio="32">
![](../assets/OAx3bhUvboSytOxcgPbc6Rf7nne.png)
</div>
            </div>
2. lbfgs：还是一动不动

3. 使用W2 norm
   1. 取$\lambda=1e-6$，使用sinkhorn: ，取$\sigma=10$，<b>结果并没有得到改善</b>：
      ![](../assets/ZADcb4wGNohftnxroE3c2i79nqh.png)
   2. 取$\lambda=1e-5$
   3. 使用sinkhorn: ，取$\sigma=10$，<b>结果并没有得到改善</b>：
      ![](../assets/X4GXbT6UAorMhixJ91QcXO7Jn1b.png)

4. 逐通道使用W2norm
   1. 取$\sigma=10$，结果如下，相对误差为<b>3.7%</b>
      <div class="flex gap-3 columns-3" column-size="3">
      <div class="w-[35%]" width-ratio="35">
   ![](../assets/I8zCbdl31otcsNxCimtcc9TXnVb.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/TgC2bI2LTofvAQxmFhucEGMDnKh.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/DB6RbssHooaJvGxF841czzMdnce.png)
   </div>
         </div>
           2. 取$\sigma=100$，结果如下，相对误差为<b>15.9%</b>
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[35%]" width-ratio="35">
   ![](../assets/J7obbHSvDoD0AJx3gjVcT71bnyb.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/LoFVbqADhoaBj2xSF0Xc9cmjnUf.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/AnoqbaPsOojbvPxif9bc8WNNnwg.png)
   </div>
         </div>
           3. 取初始值为常数值3000，结果如下（可以看到误差主要集中在右侧）
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[33%]" width-ratio="33">
   ![](../assets/QlxwbAoo6oAAxIxDGyCcgArRnBd.png)
   </div>
         <div class="w-[33%]" width-ratio="33">
   ![](../assets/X8hpbw05tornwLxsO87cEJ44n7e.png)
   </div>
         <div class="w-[33%]" width-ratio="33">
   ![](../assets/ERwFbQj6noLosex1Yowc5hw6nzc.png)
   </div>
         </div>

### 不同正则化参数误差对比

mse：

![](../assets/MWiobWyP0orj6txBBD6c1SrCnwg.png)

Sinkhorn:

![](../assets/V5LIbAM91oNCQ2xQHDLcONWvnec.png)

## 震源在左，接收器在右

### 无正则化，不添加噪声

1. 使用L2 norm
   1. Adam优化器：
1. 初始化为<b>真解的模糊化</b>，取$\sigma=10$，初始相对误差为12.1%，迭代的结果如下，相对误差为<b>8.8%</b>，比震源和接收器都在左侧高。<b>本来以为应该是比都放在左侧简单的，但实验结果好像不是这样的</b>，并且出现了半收敛性？
<div class="flex gap-3 columns-3" column-size="3">
<div class="w-[33%]" width-ratio="33">
![](../assets/CtC9bOixWolOYexhHTCccHl6nGc.png)
</div>
<div class="w-[33%]" width-ratio="33">
![](../assets/HVm2bPTC5oi40txZ9o7cVP2Anfg.png)
</div>
<div class="w-[33%]" width-ratio="33">
![](../assets/XNHvb37wYojW1uxLALgcYJXjnKh.png)
</div>
</div>

1. 取$\sigma=100$，还是寄
   ![](../assets/D7MObTNICoaaj7xQuDMcejswnGb.png)
1. SGD：相对误差几乎不带降，也就是基本没做移动（这里我学习率设置为50），把学习率调到5000，loss开始降了，但相对误差几乎不变（应该是在局部极小点附近了）
   ![](../assets/YkZkbUjBsoCZjsxjhNqcNP59nTe.png)
1. lbfgs优化（原来torch也是有lbfgs优化器的）：我们继续重复上面的操作，如果使用默认的使用 `strong_wolfe`进行线搜索，也会出现上面和上面SGD同样的情况。自己实现的lbfgs，使用原步长结果也是不太能动。

1. 使用W2 metric（以下用的Adam优化器）
   1. 使用sinkhorn：初始解依然设置为真解的模糊化，使用adam优化器，$\sigma=10$时出现了速度过小的情况，而且是在前几步就出现了这个问题，后面的结果也不收敛。
   <div class="flex gap-3 columns-3" column-size="3">
   <div class="w-[35%]" width-ratio="35">
   ![](../assets/NyKobRSsro4udux90ITcpYdinSc.png)
      </div>
            <div class="w-[32%]" width-ratio="32">
      ![](../assets/FcXEbeXJQoXZPYxdQfvcNEtInOh.png)
      </div>
            <div class="w-[32%]" width-ratio="32">
      ![](../assets/FVq5beWseo05gixKRDMctIJbnpc.png)
      </div>
            <div class="w-[32%]" width-ratio="32">
      ![](../assets/FVq5beWseo05gixKRDMctIJbnpc.png)
      </div>
   <div class="w-[35%]" width-ratio="35">

![](../assets/FKcpbgqezoRxGAx7Tcacb87fnfd.png)

</div>
  <div class="w-[32%]" width-ratio="32">
![](../assets/FrprbWPJfolkplx6FSYcBuFtnrf.png)
</div>
  <div class="w-[32%]" width-ratio="32">
![](../assets/PYTwbwAn7oNfw0xaUnfc3XLan6g.png)
</div>
  </div>

取$\sigma=100$，结果寄：
![](../assets/LbbBbaLYToEMROxbfFBc5a6Kn1d.png)

1. 使用W2：（不如用MSE）
   1. 使用sinkhorn：（不管模糊化程度多少，这个都是寄）$\lambda=1e-5$得到的结果如下，相对误差大小为<b>33.7%（寄）</b>：
      <div class="flex gap-3 columns-3" column-size="3">
      <div class="w-[35%]" width-ratio="35">
   ![](../assets/Sf2kbJCDDoIr9hxxPm6cHNHinlf.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/DJcBb6OqlolD1Kxz4VEcjFbSnke.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/Dt0sbcBkFooVzUxUZshc3pConEh.png)
   </div>
        </div>
   2. 使用swd：$\lambda=1e-5$得到的结果如下，相对误差大小为<b>9.0%</b>
   <div class="flex gap-3 columns-3" column-size="3">
   <div class="w-[35%]" width-ratio="35">
   ![](../assets/EBwQbRx1VoPlaKxaLPHcp30Lnwh.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/VB3Wbxf9eop2MjxYYY7c0VnHnyg.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/XBonbRpWWolcFxxzHTecKPDbned.png)
   </div>
         </div>

## 震源在地表，接收器在地底（source_depth=2, receiver_depth=68)

### 无正则化，不添加噪声

1. 使用MSE loss
   1. 初始化为<b>真解的模糊化</b>，取$\sigma=10$，初始相对误差为12.1%，迭代的结果如下，相对误差为<b>8.7%</b>，似乎也没有很简单
      <div class="flex gap-3 columns-3" column-size="3"> <div class="w-[35%]" width-ratio="35">
   ![](../assets/Ck5sbDtIeorpKUxgYpicNDbtnbf.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/Df8ebGFhTotPs9xLRvucIiTunlc.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/F3sPb4BDUoi3gjxW9ukcuRGQnnh.png)
   </div>
         </div>
   2. 初始化为常数值（这里我取的中间值3000），得到的结果也是不太好的
   <div class="flex gap-3 columns-3" column-size="3">
   <div class="w-[35%]" width-ratio="35">
   ![](../assets/Z6IxbrQvQo4nC5xsQeVcCC5wnUb.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/OAmkbSXqIoFFeyxwQnocFRsfnZb.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/DhYLbB8y6oMud8x4WmhcZGjenub.png)
   </div>
         </div>
           3. 但是，如果上面的$\sigma=100$，误差就会开始下降了，从初始的26.6%能下降到20.6%
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[35%]" width-ratio="35">
   ![](../assets/DwHVbx6hyozYcfxeRj4cgqSBnfc.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/QHRlbl1bdo5kGXxQ2v5c6r3Wnlh.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/M451bjgWqoiJzWxbUoScQUNsnxg.png)
   </div>
         </div>

2. 使用W2 metric（以下用的Adam优化器）
   1. 使用sinkhorn：初始解依然设置为真解的模糊化，使用adam优化器，$\sigma=10$时出现了速度过小的情况，而且是在前几步就出现了这个问题，后面的结果也不收敛。
      ![](../assets/Tvi2bHRoWoGHJSxwRqycUxX7nOR.png)
   2. 使用swd：1.$\sigma=10$，效果也还可以，相对误差大小为<b>7.2%</b>
     <div class="flex gap-3 columns-3" column-size="3">
     <div class="w-[33%]" width-ratio="33">
   ![](../assets/I4U5bjnVIoLWFBxXS9ccNZmWniN.png)
   </div>
               <div class="w-[33%]" width-ratio="33">
   ![](../assets/LOoabXBatoEwxdxQy05cg9Tinje.png)
   </div>
               <div class="w-[33%]" width-ratio="33">
   ![](../assets/ARGHbnwSyomzyexXUzNcpkyinHg.png)
   </div>
               </div>
   3. 和L2 norm类似，初始化为常数值，得到的结果也是不太好的：
      ![](../assets/FPf4bNvVboUnl9x7HXacPf5OnHc.png)
   4. 但是，如果上面的$\sigma=100$，误差也会开始下降了，从初始的26.6%能下降到21.4%（还不如MSE）
   <div class="flex gap-3 columns-3" column-size="3">
   <div class="w-[35%]" width-ratio="35">
   ![](../assets/FfuobQKhJojogQxXwj3cyUQGnJd.png)
   </div>
               <div class="w-[32%]" width-ratio="32">
   ![](../assets/N0HAbCd7compe6xSH5LctCnsnQh.png)
   </div>
               <div class="w-[32%]" width-ratio="32">
   ![](../assets/DRggbj7INoe9C9xK81dc9CALnvl.png)
   </div>
               </div>

### 添加TV正则化

1. 使用MSE loss
   1. 初始化为<b>真解的模糊化</b>，取$\sigma=10$，$\lambda=1e-6$，初始相对误差为12.1%，迭代的结果如下，相对误差为<b>7.5%</b>
      <div class="flex gap-3 columns-3" column-size="3"> \*<div class="w-[35%]" width-ratio="35">
   ![](../assets/LdoNb95tZoJVVwxQMPlcne1Inac.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/SD3KbxMFLoB14RxS4sXcgybvnIM.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/RTskbyEvZo0RprxvjGxckGOqnOe.png)
   </div>
         </div>
        2. 初始化为常数值（这里我取的中间值3000），得到的结果也是不太好的
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[35%]" width-ratio="35">
   ![](../assets/NzgMb1vNHosJGBxfq4gcH22Xndh.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/QS4XbT67do2gfsx18WgcuHt0nQc.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/DB7wb6tm2osDrsxC30Pc3FXZnVc.png)
   </div>
         </div>
           3. 取$\sigma=100$，相对误差从初始的26.6%能下降到<b>19.6%</b>
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[35%]" width-ratio="35">
   ![](../assets/FP75bSOItoXRcyxmFkmcuOCQnde.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/AeWSbQd4TojGzvxKGAkc8ijHnkg.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/TGPibMA6pozZVwxzQVNcHiwfnof.png)
   </div>
         </div>

2. 使用W2 metric（以下用的Adam优化器）
   1. 使用sinkhorn：初始解依然设置为真解的模糊化，使用adam优化器，$\sigma=10$时出现了速度过小的情况，而且是在前几步就出现了这个问题，后面的结果也不收敛。
      ![](../assets/XZIgbYMeQoRxEZxBzupcayeBnBh.png)
   2. 使用swd：1.$\sigma=10$，效果也还可以，相对误差大小为<b>7.2%</b>
     <div class="flex gap-3 columns-3" column-size="3">
     <div class="w-[33%]" width-ratio="33">
   ![](../assets/UmSaboVNdovriHxc1EycLN2cn5e.png)
   </div>
               <div class="w-[33%]" width-ratio="33">
   ![](../assets/VwRqbBqbko22JjxUphqcoJ50n0g.png)
   </div>
               <div class="w-[33%]" width-ratio="33">
   ![](../assets/CUjhbV6igoTyFHx9BL3cA5HYnPe.png)
   </div>
               </div>
   3. 和L2 norm类似，初始化为常数值，得到的结果也是不太好的：
   ![](../assets/J6Zeb7DJHoHzi0xDQdRce3fLnZg.png) 3.$\sigma=100$，误差从初始的26.6%能下降到<b>19.9%</b>
     <div class="flex gap-3 columns-3" column-size="3">
     <div class="w-[35%]" width-ratio="35">
   ![](../assets/OGvmbSBMroexHCxoKRkcH8mznVF.png)
   </div>
               <div class="w-[32%]" width-ratio="32">
   ![](../assets/PATmboAZ7o8wAMx7QzWcg5nWn3d.png)
   </div>
               <div class="w-[32%]" width-ratio="32">
   ![](../assets/Rci9biI6uoYiGExhBIJcOU2Nnoe.png)
   </div>
               </div>

## 震源和接收器均在地表（source_depth=2, receiver_depth=2)

### 无正则化，不添加噪声

1. 使用MSE loss
   1. 初始化为<b>真解的模糊化</b>，取$\sigma=10$，初始相对误差为12.1%，迭代的结果如下，相对误差为<b>7.0%</b>
      <div class="flex gap-3 columns-3" column-size="3"> \*<div class="w-[35%]" width-ratio="35">
   ![](../assets/F3YubmqJVoXuCTxCcMKccWu1nke.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/HvrqbYZkioKP8tx2umHcHjnJncg.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/RWgtbwZNEo6RvVxao3lci8mNn0f.png)
   </div>
         </div>
           2. 初始化为常数值（这里我取的中间值3000），得到的结果也是不太好的
         ![](../assets/XN0wbnPGkoon1bx9MNdc9XXcnfb.png)
           3. 取$\sigma=100$，相对误差能降到<b>24.1%</b>
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[35%]" width-ratio="35">
   ![](../assets/OdcJb2NoYo4ylJxyZvdcEl6tnzh.png)
   </div>
     <div class="w-[32%]" width-ratio="32">
   ![](../assets/PvbhbFfodoBGiKxw81sc4B40n9g.png)
   </div>
     <div class="w-[32%]" width-ratio="32">
   ![](../assets/S3O8bIuWyowQoIx1T6ZceK6wnPb.png)
   </div>
   </div>

2. 使用W2 metric（以下用的Adam优化器）
   1. 使用sinkhorn：初始解依然设置为真解的模糊化，使用adam优化器，$\sigma=10$时出现了速度过小的情况，而且是在前几步就出现了这个问题，后面的结果也不收敛。
      ![](../assets/PS1EbTECdoWNfHx0OFNcg6qfnKg.png)

3. 逐通道使用W2norm
   1. 初始化为<b>真解的模糊化</b>，取$\sigma=10$，初始相对误差为12.1%，迭代的结果如下，相对误差为<b>4.2%</b>
      <div class="flex gap-3 columns-3" column-size="3"><div class="w-[35%]" width-ratio="35">
   ![](../assets/Izvebgcj4oZL1TxrQRkcY3C4nxe.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/K1REbibSNo2jo6x2iWxcaelqnHf.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/A927bwiG7o24gEx29PZck7K9npe.png)
   </div>
         </div>
           2. 初始化为常数值（这里我取的中间值3000），得到的结果也是不太好的
           3. 取$\sigma=100$，相对误差能降到<b>24.1%</b>

### 添加TV正则化

1. 使用MSE loss
   1. 初始化为<b>真解的模糊化</b>，取$\sigma=10$，$\lambda=1e-6$，初始相对误差为12.1%，迭代的结果如下，相对误差为<b>6.5%</b>
      <div class="flex gap-3 columns-3" column-size="3"> \*<div class="w-[35%]" width-ratio="35">
   ![](../assets/NKl9bDbzhojX3SxyJglc8ggrn7b.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/LuRcbtsFZonLrWxGVbkc24BYn4b.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/N3DObMCMtoShDkxepMPcxurkneA.png)
   </div>
         </div>
           2. 初始化为常数值（这里我取的中间值3000），得到的结果也是不太好的
         ![](../assets/NpkRbg8Axo3NXAxsMaPcD9EfnIj.png)
           3. 取$\sigma=100$，$\lambda=1e-6$，相对误差从初始的26.6%能下降到<b>22.7%</b>
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[35%]" width-ratio="35">
   ![](../assets/WiLQbjeHQoXYctxl1hRc9jN7n1f.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/SkjQbEMEfolh6lxQ9hScvSfpnJe.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/IFuUb4U2IoK18pxlqhvch7Ibnpg.png)
   </div>
         </div>
         <b>（如果</b>$\lambda=1e-5$<b>，甚至能降到16.7%）</b>
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[35%]" width-ratio="35">
   ![](../assets/PZZebZLGkofr18xRSvFczTeLnCf.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/MBDKbUqH5osWHwxrHI7cjkIZn7b.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/Xt4lbVllJoooqAxUFEucoN25neg.png)
   </div>
         </div>

2. 使用W2 metric（以下用的Adam优化器）
   1. 使用sinkhorn：初始解依然设置为真解的模糊化，使用adam优化器，$\sigma=10$时出现了速度过小的情况，而且是在前几步就出现了这个问题，后面的结果也不收敛。
      ![](../assets/GhWLbPhPjoBJzvx4Rskc0ZqqnKh.png)

3. 逐通道使用W2norm
   1. 初始化为<b>真解的模糊化</b>，取$\sigma=10$，$\lambda=1e-6$，初始相对误差为12.1%，迭代的结果如下，相对误差为<b>3.2%</b>
      <div class="flex gap-3 columns-3" column-size="3"> \*<div class="w-[35%]" width-ratio="35">
   ![](../assets/GyYLbBkm0oDdq9xTohCcwsKvnKl.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/DUoKb8KdYosKqHxWBkccvG6Znad.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/H3NrbYsDHoBj9SxtqdZcKhzKn7b.png)
   </div>
         </div>
           2. 初始化为常数值（这里我取的中间值3000），结果挺amazing的，相对误差为<b>9.1%</b>
         ![](../assets/Qf6Nb19DtoMwuCxOBcgcX8Rsnbh.png)
           3. 取$\sigma=100$，$\lambda=1e-5$，相对误差从初始的26.6%能下降到<b>3.5%</b>
         <div class="flex gap-3 columns-3" column-size="3">
         <div class="w-[35%]" width-ratio="35">
   ![](../assets/Q8rKbRQO2oIX2RxMV3AcQpfbnIc.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/Et73bFWkzoEHnwxg4aMc9rG8nW8.png)
   </div>
         <div class="w-[32%]" width-ratio="32">
   ![](../assets/GiPIbWos4oNWy0xLVhEcfToUnyg.png)
   </div>
         </div>

## 包络反演

### 地震数据的包络

1. 希尔伯特变换：

   $$
   H\left\{ f\left( t \right) \right\}=\frac{1}{\pi}\mathrm{P.V.} \int_{-\infty}^{+\infty}\frac{f\left( \tau \right)}{t-\tau}\text{d}\tau = f (\frac{1}{\pi t})
   $$

其中$\mathrm{P.V.}$代表柯西主值，定义如下（假设c处是奇点）：

$$
\mathrm{P.V.} \int_a^b f(x)\, dx = \lim_{\varepsilon \to 0^+} \left[ \int_a^{c-\varepsilon} f(x) \, dx + \int_{c+\varepsilon}^b f(x) \, dx \right]
$$

> 希尔伯特变换相当于把信号所有频率分量相位推迟90度，对于$f(t)=e^{i(wt+\phi)},H\{f(t)\}=e^{i(wt+\phi-\frac{\pi}{2})}$

2. 对于实信号$f(t)$解析信号
   $$\hat{f}\left( t \right)=f\left( t \right)+\text{i}H\left\{ f\left( t \right) \right\}$$
   我们有如下定义：
1. 瞬时振幅（也称为信号的包络）：$E\text{}\left( t \right)=\sqrt{{{\left[ f\left( t \right) \right]}^{2}}+{{\left[ H\{f\left( t \right)\} \right]}^{2}}}$
1. 瞬时相位：$\Phi \left( t \right)=\arctan\frac{H\left\{ f\left( t \right) \right\}}{f\left( t \right)}$
1. $\hat{f}\left( t \right)=E\left( t \right){{\text{e}}^{^{\text{i}\mathit{\Phi}(t)}}}$
