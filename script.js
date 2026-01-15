// 获取DOM元素
const minRangeInput = document.getElementById('min-range');
const maxRangeInput = document.getElementById('max-range');
const drawCountInput = document.getElementById('draw-count');
const startBtn = document.getElementById('start-btn');
const resultNumbersDiv = document.getElementById('result-numbers');

// 添加事件监听器
startBtn.addEventListener('click', drawNumbers);

// 抽签函数
function drawNumbers() {
    // 获取输入值
    const min = parseInt(minRangeInput.value);
    const max = parseInt(maxRangeInput.value);
    const count = parseInt(drawCountInput.value);
    
    // 验证输入
    if (!validateInput(min, max, count)) {
        return;
    }
    
    // 生成随机数
    const numbers = generateRandomNumbers(min, max, count);
    
    // 显示结果
    displayResults(numbers);
}

// 验证输入
function validateInput(min, max, count) {
    // 检查是否为有效数字
    if (isNaN(min) || isNaN(max) || isNaN(count)) {
        alert('请输入有效的数字！');
        return false;
    }
    
    // 检查范围是否在1-50之间
    if (min < 1 || min > 50 || max < 1 || max > 50) {
        alert('范围必须在1-50之间！');
        return false;
    }
    
    // 检查起点是否小于等于终点
    if (min > max) {
        alert('范围起点不能大于终点！');
        return false;
    }
    
    // 检查抽签数量是否在1-10之间
    if (count < 1 || count > 10) {
        alert('抽签数量必须在1-10之间！');
        return false;
    }
    
    // 检查数量是否不超过范围大小
    const rangeSize = max - min + 1;
    if (count > rangeSize) {
        alert(`抽签数量不能超过范围大小(${rangeSize})！`);
        return false;
    }
    
    return true;
}

// 生成不重复的随机数
function generateRandomNumbers(min, max, count) {
    const numbers = [];
    const availableNumbers = [];
    
    // 创建可用数字数组
    for (let i = min; i <= max; i++) {
        availableNumbers.push(i);
    }
    
    // 随机抽取指定数量的数字
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const selectedNumber = availableNumbers.splice(randomIndex, 1)[0];
        numbers.push(selectedNumber);
    }
    
    // 排序结果
    numbers.sort((a, b) => a - b);
    
    return numbers;
}

// 显示结果
function displayResults(numbers) {
    // 清空之前的结果
    resultNumbersDiv.innerHTML = '';
    
    // 创建并添加结果数字元素
    numbers.forEach(number => {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'result-number';
        numberDiv.textContent = number;
        resultNumbersDiv.appendChild(numberDiv);
    });
}