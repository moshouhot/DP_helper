// 骚神库 DP_helper

// 永久储存对象

    chrome.storage.local.get('sao_config', function (result) {
        var obj = result.sao_config;
    
        if (obj) {
            console.log('成功获取');
            console.log(obj);
            window.sao_config=obj;
        } else {
            chrome.storage.local.set({ 'sao_config': {'DP官网':'https://www.drissionpage.cn/'} }, function () {
                console.log('永久存储对象已经初始化');
                console.log(obj);
            });
        }
    });
    

function  persistent_storage(obj){
    chrome.storage.local.set({ 'sao_config': obj}, function () {
        console.log('数据成功持久化');
        console.log(obj);
    });
}

//----------封装主函数
class MainApp{
    constructor() {
        var self=this;

        this.createNavbar();//调用函数创建导航栏  默认隐藏
        this.toggleDiv();
        
        
        // ----------------监听导航栏 进行位置变换
        $('#daohanglan').on('click', function() {
            togglePosition();
        });
        
   
        this.listen_mousemove_to_update_div(); //监听鼠标移动
   
   
        // 监听按键   F2 F8  F9  ctrl+alt+1/2/3
        $(document).keydown(function(event) {
            switch (event.keyCode) {
                case 119: // F8键
                    self.extractInfoAndAlert();
                    break;
                case 113: // F2键
                    self.extractInfoAndAlert_simple();
                    break;
                case 120: // F9键
                    alert('-✔️骚神库元素定位插件- \n 网页已经刷新定位\n 插件已经深度解析，重新定位动态元素!!');
                    break;
                case 49: // 数字键1
                    if (event.altKey) {
                        self.copyElementXPath();
                    }
                    break;
                case 50: // 数字键2
                    if (event.altKey) {
                        self.copyShortElementXPath();
                    }
                    break;
                case 51: // 数字键3
                    if (event.altKey) {
                        self.copyCombinedElementXPath();
                    }
                    break;
            }
        });

    }

        // -------------------------------------------创建导航信息栏
    
         createNavbar() {
            // 获取当前网页的标题
            const pageTitle = document.title;
        
            // 创建导航栏元素
            const navbar = document.createElement('div');
            // navbar.classList.add('navbar2');
            navbar.id='daohanglan';
    
            
            // 创建导航栏文本元素
            const navText = document.createElement('span');
            navText.textContent = '骚神库元素语法自动显示插件';
            navText.id = 'show';
    
            // 将文本添加到导航栏中
            navbar.appendChild(navText);
        
            // 将导航栏添加到页面的 body 元素中
            document.body.insertBefore(navbar, document.body.firstChild);
        
            //初始化导航栏的位置
            this.togglePosition();
   
        }
        // -------------切换div隐藏
        async  toggleDiv(){
            chrome.storage.local.get('show_div', function (result) {
                var newState = result.show_div ;
                
                if (newState == '隐藏') {
                    document.getElementById('daohanglan').style.display = "none";
                } else {
                    document.getElementById('daohanglan').style.display = "block";
                }
            });
            
        }

        
    // -------------------------------工具函数
    
    // 是否是空字符
    isBlankString(str) {
        if (str && typeof str === 'string') {
            return str.trim().length === 0;
        } else {
            return true;  // 将空值、null 和 undefined 视为"空字符串"
        }
    }
    
    // 检查是否包含特殊字符 
    containsString(str) {
        return str.includes('href') || str.includes('src');
    }
    
    //打印某个元素的所有属性值
    printElementAttributesAsString(element) {
        // 初始化一个空字符串用于存储属性
        var attributesString = '';

        // 检查输入是否是一个元素
        if (!(element instanceof Element)) {
            // console.error('输入必须是一个HTML元素');
            return '当前位置无法解析元素';
        }
    
        // 获取元素的所有属性
        var attrs = element.attributes;
    
    
        // 遍历所有属性并将它们的名称和值拼接到字符串中
        for (var i = 0; i < attrs.length; i++) {
            var attrName = attrs[i].name;
            var attrValue = attrs[i].value;
            //特殊情况处理
            if (this.containsString(attrName)) continue;
            if (this.isBlankString(attrValue)) continue;
            // 如果使用了 element_hover_color 颜色，则跳过该属性
            if (attrName.includes('style') && attrValue.includes( this.element_hover_color )) continue;
            if (attrValue.length > 25 && attrName != "class") {
                attributesString += "@@" + attrName + "^" + attrValue.slice(0, 20);
            } else {
                // 拼接属性名和属性值，属性之间用空格分隔
                attributesString += "@@" + attrName + "=" + attrValue;
            }
    
    
    
        }
    
        // 打印最终的属性字符串
        //console.log(attributesString.trim()); // 使用trim()移除尾部的空格
        return attributesString.trim();
    }
    
    //打印某个元素的 精简属性值
    printElementAttributesAsString_simple(element) {
        // 检查输入是否是一个元素
        if (!(element instanceof Element)) {
            console.log('输入必须是一个HTML元素');
            return '必须是一个HTML元素';
        }
    
        // 获取元素的所有属性
        var attrs = element.attributes;
    
        // 初始化一个空字符串用于存储属性
        var attributesString = '';
        if (element.hasAttribute('id')){
            attributesString = "@@id=" + element.id;
            return attributesString.trim();
    
        }
        if (element.classList.length > 0) {
            // 元素具有 class 属性
            let classValue = element.classList.value; // 获取所有 class 值，以字符串形式返回
            attributesString = "@@class=" + classValue;
            return attributesString.trim();
            
        }
    
        // 检查元素是否有innerText，并返回其值
        if (element.innerText !== null && element.innerText !== undefined) {
            let innerTextValue = element.innerText;
            attributesString = "@@text()=" + innerTextValue;
            return attributesString.trim();       
        }
    
      
    
        // 打印最终的属性字符串
        //console.log(attributesString.trim()); // 使用trim()移除尾部的空格
        return attributesString.trim();
    }

     
   
    // 提取某个元素的属性信息
     async extract_attri_info_to_div(inputElement) {
        // 暂存元素定位信息
        let info = "";
        var theEle = { style: {}, elementRect: { left: 0, top: 0 } };

        // inputElement.addEventListener('mouseover', function() { this.style.backgroundColor ='';this.style.fontWeight = 'bold';});
        // inputElement.addEventListener('mouseout', function() { this.style.backgroundColor ='';this.style.fontWeight = 'normal';});
        if (!(inputElement instanceof Element)) {
            console.log('输入必须是一个HTML元素');
            window.info='当前位置是非元素'
            return ;
        }



       
        // 暂存当前元素
        theEle = this;
        let self=this;

        // 以下是获取元素定位语法功能
        var attrib_info = self.printElementAttributesAsString(inputElement);
        var attrib_info_simple = self.printElementAttributesAsString_simple(inputElement);

        var Name = "tag:" + inputElement.tagName.toLowerCase();

        var text = inputElement.innerText;


        if (self.isBlankString(text)) {
            text = "";
        } else {

            if (text.length <= 15) text = "@@text()=" + text;
            else text = "@@text()^" + text.slice(0, 10);

        }

        // 保存最后悬停的元素,供生成简短xpath使用
        window.lastHoveredElement = inputElement;
        
        window.XPath_info = "xpath:" + self.getElementXPath(inputElement);
        const shortXPaths = self.getShortElementXPath(inputElement);
        window.ShortXPath_info = "xpath:" + shortXPaths.simple;
        window.CombinedXPath_info = "xpath:" + shortXPaths.combined;

        window.anotherGlobalVar = Name + attrib_info + text;
        window.anotherGlobalVar_simple = Name + attrib_info_simple;

        window.info = "<b>🔹元素层级结构（从上到下）：</b><br>@@" + this.getElementHierarchy(inputElement) +
                     "<hr><b>🔹按alt+1 复制XPath--></b>@@" + window.XPath_info + 
                     "<br><b>🔹可用的XPath方案：</b>@@" + this.getAllXPathStrategies(inputElement) +
                     "<br><b>🔹按alt+2 复制简短XPath--></b>@@" + window.ShortXPath_info +
                     "<br><b>🔹按alt+3 复制组合XPath--></b>@@" + window.CombinedXPath_info + "<hr>" + 
                     "<b>🔹按F2复制精简语法 <br>🔹按F8复制完整语法--> </b>@@" + Name + attrib_info + text;


    }

 
  
    sleep(ms) {
        // 创建一个新的Promise对象，并将resolve作为回调函数传入
        return new Promise(resolve => setTimeout(resolve, ms));
      // 调用setTimeout函数，设置延迟时间为ms毫秒，延迟时间结束后调用resolve回调函数
      }

    //------------监听鼠标移动
     listen_mousemove_to_update_div(){
        let self=this;
        let lastElement = null;
        let lastUpdateTime = 0;
        const THROTTLE_TIME = 100; // 100ms节流

        document.addEventListener('mousemove', async function(event) {
            //提取信息
            var hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
            

            // await self.sleep(1000);

            await self.extract_attri_info_to_div(hoveredElement);
            

       
            // 边缘碰撞检测
        
            let daohanglan = document.getElementById("daohanglan");          
            
            
            setTimeout(function () {
          
                // 定义常量以避免重复的数字字面量
                const OFFSET = 300;
                const pianyi = 20;
                // 获取元素的宽度（包括边框、内边距和滚动条）
                let width = daohanglan.offsetWidth;
        
                // 获取元素的高度（包括边框、内边距和滚动条）
                let height = daohanglan.offsetHeight;
        
                
                if (event.clientX < window.outerWidth -width-40) {
                    // 根据 event.clientX 设置 daohanglan 元素的 left 属性                    
                    daohanglan.style.left = (event.clientX + pianyi) + "px";
                } else {                    
                    daohanglan.style.left =(event.clientX - pianyi-width) + "px";
                    
                }
                
                // daohanglan.style.top = (event.pageY + pianyi) + "px";
                if (event.pageY < window.outerHeight - height - 40) {                  
                    
                    daohanglan.style.top = (event.pageY + pianyi) + "px";
                } else {                  
                    
                    daohanglan.style.top = (event.pageY-pianyi -height) + "px";
                }               
        
        
                
        
        
            }, 0); // 延迟1000毫秒（即1秒）
        
            // 获取鼠标位置
            var mouseX = event.clientX + window.screenX;
            var mouseY = event.clientY + window.screenY;
            // 为了计算元素内坐标，获取当前元素的位置
         
            
            var xyInfoDoc1 = "浏览器坐标 x:" + event.clientX + ",y:" + event.clientY + "<br>";
            var xyInfoDoc2 = "屏幕坐标 x:" + mouseX + ",y:" + mouseY + "<hr>";
            
            // xyInfoEle = "元素内坐标 x:"+eleX+",y:"+eleY+"<hr>";
        
            // 将坐标信息、定位语法 显示到页面上 
            var F9_info='🔹按F9 刷新定位'+"<hr>";              
            
        
            document.getElementById('show').textContent = xyInfoDoc1+xyInfoDoc2 + F9_info + window.info;




            // 获取包含文本的 span 元素
            let spanElement = document.getElementById('show');
        
            // 获取 span 元素内的文本内容
            let textContent = spanElement.textContent;
        
            // 使用 @@ 进行分割
            let lines = textContent.split('@@');
        
            // 创建一个新的文本内容
            let newContent = '';
            lines.forEach(function(line, index) {
                if (line.includes('tag')) {
                    line = 'tag:<span style="color:black"><b>' + line.split(':')[1] + '</b></span>';
                }
                // 添加换行符
                if (index > 0) {
                    newContent += '<br>';
                }
                // 添加当前行文本
                newContent += line;
            });
        
            // 更新 span 元素的内容为新的文本内容
            spanElement.innerHTML = newContent;

            
            

        });
        
    
    }  
    // -------------------格式化字符串    


    format_the_text(id){
          // 获取包含文本的 span 元素
          let spanElement = document.getElementById(id);
    
          // 获取 span 元素内的文本内容
          let textContent = spanElement.textContent;
    
          // 使用 @@ 进行分割
          let lines = textContent.split('@@');
    
          // 创建一个新的文本内容
          let newContent = '';
          lines.forEach(function(line, index) {
              // 添加换行符
              if (index > 0) {
                  newContent += '<br>';
              }
              // 添加当前行文本
              newContent += line;
          });
    
          // 更新 span 元素的内容为新的文本内容
          spanElement.innerHTML = newContent;
    }
        // ----------------获取到元素相对于电脑显示器的坐标
        getElementAbsolutePosition(ele) {
            // 获取元素
            // let element = ele;
        
            if (!ele) {
                console.error("未找到指定ID的元素");
                return null;
            }
        
            // 获取元素相对于视口的位置
            var rect = ele.getBoundingClientRect();
        
            // 计算元素相对于电脑显示器的坐标
            var x = rect.left + window.scrollX;
            var y = rect.top + window.scrollY;
        
            return { x: x, y: y };
        }

      
    

        
    // 获取元素的XPath
    getElementXPath(element) {
        // 如果元素有id属性,直接返回id形式的XPath
        if (element && element.id) {
            return 'id("' + element.id + '")';
        } else {
            // 创建数组存储XPath路径片段
            let paths = [];
            
            // 从当前元素开始向上遍历DOM树,直到根元素
            // 只处理元素节点(nodeType == 1)
            for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
                // 获取元素的小写标签名
                let tagName = element.nodeName.toLowerCase();
                
                // 计算当前元素在同类型兄弟元素中的位置索引
                let index = 1;
                let sibling = element;
                // 遍历前面的兄弟元素
                while (sibling = sibling.previousElementSibling) {
                    // 如果找到相同标签名的兄弟元素,索引加1
                    if (sibling.nodeName.toLowerCase() === tagName) {
                        index++;
                    }
                }
                
                // 只有当索引>1时才添加位置索引
                // 例如: div[2]表示第2个div元素
                let pathIndex = index > 1 ? `[${index}]` : '';
                
                // 将当前元素的XPath片段插入到数组开头
                // 形如: tagName[index]
                paths.splice(0, 0, tagName + pathIndex);
            }
            
            // 如果paths数组不为空,返回以"/"连接的完整XPath
            // 否则返回null
            return paths.length ? "/" + paths.join("/") : null;
        }
    }
    
    // 测试XPath的函数
    testXPath(xpath) {
        // 移除可能存在的'xpath:'前缀
        const cleanXPath = xpath.replace(/^xpath:/, '');
        
        // 测试xpath是否能找到元素
        const result = document.evaluate(
            cleanXPath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        
        return result.snapshotLength; // 返回找到的元素数量
    }

    // 复制标准XPath的函数
    copyElementXPath() {
        const xpath = window.XPath_info;
        this.copyToClipboard(xpath);
        
        // 测试XPath并获取匹配数量
        const count = this.testXPath(xpath);
        
        // 根据匹配数量生成不同的提示信息
        let message = `✔️已经复制下面XPath语法到剪贴板\n${xpath}\n`;
        if (count === 0) {
            message += "⚠️警告：当前XPath未能定位到任何元素";
        } else {
            message += `经检测定位到${count}个位置。`;
        }
        
        alert(message);
    }

    // 复制简短XPath的函数
    copyShortElementXPath() {
        const shortXPaths = this.getShortElementXPath(window.lastHoveredElement);
        const shortXPath = "xpath:" + shortXPaths.simple;
        this.copyToClipboard(shortXPath);
        
        // 测试XPath并获取匹配数量
        const count = this.testXPath(shortXPath);
        
        // 根据匹配数量生成不同的提示信息
        let message = `✔️已经复制下面简短XPath语法到剪贴板\n${shortXPath}\n`;
        if (count === 0) {
            message += "⚠️警告：当前XPath未能定位到任何元素";
        } else {
            message += `经检测定位到${count}个位置。`;
        }
        
        alert(message);
    }

    // 复制组合XPath的函数
    copyCombinedElementXPath() {
        const shortXPaths = this.getShortElementXPath(window.lastHoveredElement);
        const combinedXPath = "xpath:" + shortXPaths.combined;
        this.copyToClipboard(combinedXPath);
        
        // 测试XPath并获取匹配数量
        const count = this.testXPath(combinedXPath);
        
        // 根据匹配数量生成不同的提示信息
        let message = `✔️已经复制下面组合XPath语法到剪贴板\n${combinedXPath}\n`;
        if (count === 0) {
            message += "⚠️警告：当前XPath未能定位到任何元素";
        } else {
            message += `经检测定位到${count}个位置。`;
        }
        
        alert(message);
    }

    // 获取简短XPath的函数
    getShortElementXPath(element) {
        let result = {
            simple: '',
            combined: ''
        };
        
        // 检查元素自身及其祖先元素的ID (最多3代)
        let current = element;
        let generation = 0;
        let ancestorWithId = null;
        
        while (current && generation < 3) {
            if (current.id) {
                // 记录第一个找到的带ID的祖先
                if (!ancestorWithId) {
                    ancestorWithId = {
                        element: current,
                        generation: generation
                    };
                }
            }
            current = current.parentElement;
            generation++;
        }
        
        // 如果找到了带ID的元素(自身或祖先)
        if (ancestorWithId) {
            const idOwner = ancestorWithId.element;
            const generations = ancestorWithId.generation;
            
            if (generations === 0) {
                // 元素自身有ID
                result.simple = `//*[@id="${element.id}"]`;
                result.combined = `//${element.tagName.toLowerCase()}[@id="${element.id}"]`;
            } else {
                // 祖先元素有ID，需要构建相对路径
                let relativePath = '';
                let relativePathWithTags = '';
                current = element;
                
                // 构建从当前元素到带ID祖先的路径
                for (let i = 0; i < generations; i++) {
                    if (i === 0) {
                        // 当前元素
                        relativePath = `*`;
                        relativePathWithTags = current.tagName.toLowerCase();
                    } else {
                        // 添加路径分隔符
                        relativePath = `*/${relativePath}`;
                        relativePathWithTags = `${current.tagName.toLowerCase()}/${relativePathWithTags}`;
                    }
                    current = current.parentElement;
                }
                
                // 构建最终的XPath
                result.simple = `//*[@id="${idOwner.id}"]/${relativePath}`;
                result.combined = `//${idOwner.tagName.toLowerCase()}[@id="${idOwner.id}"]/${relativePathWithTags}`;
            }
            return result;
        }
        
        // 2. 尝试使用独特的class
        if (element.className && !element.className.includes(' ')) {
            // 先验证class是否唯一
            if (this.isClassUnique(element.className)) {
                const classPath = `//*[@class="${element.className}"]`;
                result.simple = classPath;
                result.combined = `//${element.tagName.toLowerCase()}[@class="${element.className}"]`;
                return result;
            }
            // 如果class不唯一，继续尝试下一个策略
        }
        
        // 3. 尝试使用name属性
        if (element.name) {
            const namePath = `//*[@name="${element.name}"]`;
            result.simple = namePath;
            // 组合name和标签名
            result.combined = `//${element.tagName.toLowerCase()}[@name="${element.name}"]`;
            return result;
        }
    
        // 4. 对于链接元素(a标签)的特殊处理
        if (element.tagName.toLowerCase() === 'a') {
            const text = element.textContent?.trim();
            
            // 4.1 优先使用文本内容(如果较短)
            if (text && text.length < 20) {
                result.simple = `//a[text()="${text}"]`;
                // 如果有href，只使用URL的最后一个有意义部分
                if (element.href) {
                    try {
                        const url = new URL(element.href);
                        const pathParts = url.pathname.split('/').filter(p => p);
                        const lastPart = pathParts[pathParts.length - 1];
                        if (lastPart) {
                            result.combined = `//a[text()="${text}" and contains(@href,"${lastPart}")]`;
                        } else {
                            result.combined = result.simple;
                        }
                    } catch (e) {
                        // 如果URL解析失败，退回到使用simple版本
                        result.combined = result.simple;
                    }
                    return result;
                }
                result.combined = result.simple;
                return result;
            }
            
            // 4.2 如果有href属性,提取最后一段有意义的部分
            if (element.href) {
                try {
                    const url = new URL(element.href);
                    const pathParts = url.pathname.split('/').filter(p => p);
                    const lastPart = pathParts[pathParts.length - 1];
                    if (lastPart) {
                        result.simple = `//a[contains(@href,"${lastPart}")]`;
                        // 如果有class，组合href和class
                        if (element.className) {
                            const firstClass = element.className.split(' ')[0];
                            result.combined = `//a[contains(@href,"${lastPart}") and contains(@class,"${firstClass}")]`;
                        } else {
                            result.combined = result.simple;
                        }
                        return result;
                    }
                } catch (e) {
                    // URL解析失败时继续后续策略
                }
            }
        }
    
        // 5. 其他元素的文本内容处理
        const text = element.textContent?.trim();
        if (text && text.length < 20) {
            // 5.1 如果是纯文本内容
            if (!/[<>]/.test(text)) {
                result.simple = `//*[contains(text(),"${text}")]`;
                // 组合标签名、class和文本
                if (element.className) {
                    const firstClass = element.className.split(' ')[0];
                    result.combined = `//${element.tagName.toLowerCase()}[contains(@class,"${firstClass}") and contains(text(),"${text}")]`;
                } else {
                    result.combined = `//${element.tagName.toLowerCase()}[contains(text(),"${text}")]`;
                }
                return result;
            }
        }
        
        // 6. 后备方案：使用相对路径(只往上找2层)
        current = element;
        let tagName = current.tagName.toLowerCase();
        let simplePath = `//${tagName}`;
        let combinedPath = `//${tagName}`;
        
        // 6.1 添加当前元素的class作为条件(如果存在)
        if (element.className) {
            const firstClass = element.className.split(' ')[0];
            simplePath += `[contains(@class,"${firstClass}")]`;
            combinedPath += `[contains(@class,"${firstClass}")]`;
            
            // 为combined路径添加额外的属性
            if (element.title) {
                combinedPath += ` and @title="${element.title}"`;
            }
            if (text && text.length < 20) {
                combinedPath += ` and contains(text(),"${text}")`;
            }
        }
        
        // 6.2 如果有父元素,再加一层
        if (current.parentElement) {
            const parent = current.parentElement;
            const parentTag = parent.tagName.toLowerCase();
            if (parent.id) {
                // 如果父元素有id,优先使用id
                simplePath = `//*[@id="${parent.id}"]//${tagName}`;
                combinedPath = `//${parentTag}[@id="${parent.id}"]//${combinedPath}`;
            } else if (parent.className) {
                // 否则使用父元素的第一个class
                const parentFirstClass = parent.className.split(' ')[0];
                simplePath = `//${parentTag}[contains(@class,"${parentFirstClass}")]//${tagName}`;
                combinedPath = `//${parentTag}[contains(@class,"${parentFirstClass}")]//${combinedPath}`;
            } else {
                simplePath = `//${parentTag}//${tagName}`;
                combinedPath = `//${parentTag}//${combinedPath}`;
            }
        }
        
        result.simple = simplePath;
        result.combined = combinedPath;
        return result;
    }

    // 提取元素语法内容 并弹窗提示
    extractInfoAndAlert(){

        let tishi2=window.anotherGlobalVar;
        this.copyToClipboard(tishi2);
        
        alert('✔️已经复制该语法到剪贴板  \n'+tishi2);
    
    }
    extractInfoAndAlert_simple(){ 
    
        let tishi2=window.anotherGlobalVar_simple;
        this.copyToClipboard(tishi2);
        
        alert('✔️已经复制该精简语法到剪贴板  \n'+tishi2);
    
    }
    
    extractInfoAndAlert_simple_input(){ 
        let result = prompt("输入框里要输入的内容:", "1234");
        if (result !== null) {
            // 用户点击了确认按钮，result 是用户输入的值
            var tishi2=`page.ele('${window.anotherGlobalVar_simple}').input('${result}')`  ;
            this.copyToClipboard(tishi2);
        } else {
            // 用户点击了取消按钮或关闭了对话框
        }
        
        alert('✔️已复制该精简语法到剪贴板  \n'+tishi2);
    
    }

    execute_js() {
        let result = prompt("输入你要执行的js语句:", "alert('123');");
        if (result !== null && result.trim() !== "") {
            try {
                // 使用 try...catch 捕获可能出现的错误
                eval(result);
            } catch (error) {
                // 如果执行出错，显示错误信息
                alert('执行出错：' + error);
            }
        } else {
            // 用户点击了取消按钮或输入为空
            alert('执行不成功！');
        }
    }
    
    extractInfoAndAlert_simple_click(){
    
        let tishi2=`page.ele('${window.anotherGlobalVar_simple}').click()`  ;
        this.copyToClipboard(tishi2);
    
        alert('✔️已经复制该精简语法到剪贴板  \n'+tishi2);
    
    }

       
    
    //  复制到剪贴板操作
    copyToClipboard(text) {
        navigator.clipboard.writeText(text);
    }
    
    
    //  切换导航栏位置
    togglePosition() {
        var daohanglan = document.getElementById("daohanglan");
    
        if (daohanglan.style.left !== '') {
            daohanglan.style.removeProperty('left');
            daohanglan.style.right = "0px";
            
            
        } else {
            daohanglan.style.removeProperty('right');
            daohanglan.style.left = "0px";
            
    
        }
    }
    
    
    // 向页面注入JS
    injectCustomJs(jsPath) {
        jsPath = jsPath || 'js/inject.js';
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
        temp.src = chrome.runtime.getURL(jsPath);
        temp.onload = function() {
          // 放在页面不好看，执行完后移除掉
          this.parentNode.removeChild(this);
        };
        document.body.appendChild(temp);
      }
  



      // 获取当前网页中所有的图片元素
       getAllImageLinksTo(id) { 
        const images = this.getElementsByName(['img','source','audio']);
        // const images = document.getElementsByTagName('img');
        
        // 创建一个空数组来存储图片链接地址
        const imageLinks = [];
        
        // 遍历所有图片元素，获取图片链接地址并添加到数组中
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const src = image.src; // 获取图片链接地址
            imageLinks.push(src); // 将链接地址添加到数组中
        }
        
        // 获取 id 为 'img_url' 的 div 元素
        let div = document.getElementById('img_url');
        
        // 如果该 div 元素不存在，则创建一个新的 div 元素
        if (!div) {
            div = document.createElement('div');
            div.id = 'img_url'; // 设置 div 元素的 id 属性为 img_url
            document.getElementById(id).appendChild(div); // 将新创建的 div 元素插入到指定 id 的父元素中
        }
        
        // 获取该 div 中已存在的所有链接
        const existingLinks = div.querySelectorAll('a');
        const existingLinkUrls = Array.from(existingLinks).map(link => link.href);
        
        // 将图片链接转换成带链接的 <a> 标签并添加到 div 元素中（如果链接不存在）
        imageLinks.forEach(link => {
            if (!existingLinkUrls.includes(link)) {
                const a = document.createElement('a');
                a.href = link; // 设置 <a> 标签的 href 属性为图片链接地址
                //  设置 <a> 标签的文本内容为图片链接地址 ☑️
                if(link.includes('.mp4')) {a.textContent = '🔷 ' + link;} 
                else if(link.includes('.m4a')){a.textContent = '🔶 ' + link;}
                else{a.textContent = '✅* ' + link;}
               
                
                a.target = '_blank';
                div.appendChild(a); // 将 <a> 标签添加到 div 元素中
                div.appendChild(document.createElement('br')); // 添加一个换行
            }
        });       


        // 返回图片链接数组（可选）
        return imageLinks;
    }

    getElementsByName(tagNames) {
        let elements = [];
    
        // 遍历标签名称数组
        tagNames.forEach(tagName => {
            // 获取指定标签名称的所有元素
            const elems = Array.from(document.getElementsByTagName(tagName));
            // 将获取到的元素数组合并到结果数组中
            elements = elements.concat(elems);
        });
    
        return elements;
    }

    
 download_video() {
    // 获取包含 shadow root 的元素
    const toolbarShadow = document.getElementById('video_download_toolbar_shadow');
  
    // 如果找到了元素
    if (toolbarShadow) {
      // 获取 shadow root
      const shadowRoot = toolbarShadow.shadowRoot;
  
      // 如果存在 shadow root
      if (shadowRoot) {
        // 在 shadow root 中查询所有 img 元素
        const imgElements = shadowRoot.querySelectorAll('img');
  
        // 遍历所有的 img 元素
        imgElements.forEach(imgElement => {
          // 获取每个 img 元素的 src 属性
          const src = imgElement.getAttribute('src');
          // 检查 src 属性中是否包含 'download' 字符串
          if (src.includes('download')) {
            // 如果包含，执行点击操作
            imgElement.click();
          }
          console.log(src);
        }
        );
      }
    } else {
      console.log('没有找到下载按钮！')
      alert('该功能仅适用于 星愿浏览器！！')
    }
  
  }

  // 添加新方法
  getAllXPathStrategies(element) {
    if (!element || !(element instanceof Element)) {
        return "当前位置无法解析元素";
    }

    let strategies = [];
    
    // 1. ID策略检查
    if (element.id) {
        strategies.push(`ID策略: //*[@id="${element.id}"]`);
    }
    
    // 检查祖先ID
    let parent = element.parentElement;
    let generation = 1;
    while (parent && generation <= 3) {
        if (parent.id) {
            strategies.push(`祖先ID策略(${generation}代): //*[@id="${parent.id}"]//*`);
            break;
        }
        parent = parent.parentElement;
        generation++;
    }
    
    // 2. Class策略检查
    if (element.className && !element.className.includes(' ')) {
        strategies.push(`Class策略: //*[@class="${element.className}"]`);
    }
    
    // 3. Name属性策略检查
    if (element.name) {
        strategies.push(`Name策略: //*[@name="${element.name}"]`);
    }
    
    // 4. 链接策略检查
    if (element.tagName.toLowerCase() === 'a') {
        const text = element.textContent?.trim();
        if (text && text.length < 20) {
            strategies.push(`链接文本策略: //a[text()="${text}"]`);
        }
        if (element.href) {
            try {
                const url = new URL(element.href);
                const pathParts = url.pathname.split('/').filter(p => p);
                const lastPart = pathParts[pathParts.length - 1];
                if (lastPart) {
                    strategies.push(`链接href策略: //a[contains(@href,"${lastPart}")]`);
                }
            } catch (e) {}
        }
    }
    
    // 5. 文本内容策略检查
    const text = element.textContent?.trim();
    if (text && text.length < 20 && !/[<>]/.test(text)) {
        strategies.push(`文本策略: //*[contains(text(),"${text}")]`);
    }
    
    // 6. 如果没有其他策略，添加相对路径策略
    if (strategies.length === 0) {
        strategies.push(`相对路径策略: //${element.tagName.toLowerCase()}`);
    }
    
    return strategies.join(" | ");
  }

  // 添加新方法：获取元素的层级结构（优化版本）
  getElementHierarchy(element) {
    if (!element || !(element instanceof Element)) {
        return "当前位置无法解析元素";
    }

    let hierarchy = [];
    let current = element;
    let index = 0;
    
    // 缓存 computedStyle 计算结果
    const styleCache = new Map();
    const getStyle = (el) => {
        if (!styleCache.has(el)) {
            styleCache.set(el, window.getComputedStyle(el));
        }
        return styleCache.get(el);
    };

    while (current && current.tagName && index < 4) { // 最多显示4层
        const style = getStyle(current);
        let elementInfo = {
            tag: current.tagName.toLowerCase(),
            classes: current.className,
            text: current.textContent?.trim().slice(0, 20),
            position: style.position !== 'static' ? style.position : '',
            isClickable: this.isClickable(current, style)
        };
        
        hierarchy.unshift(elementInfo);
        current = current.parentElement;
        index++;
    }

    // 格式化显示（简化版本）
    return hierarchy.map((info, index) => {
        let prefix = "—".repeat(index);
        let parts = [prefix + info.tag];
        
        if (info.isClickable) parts.push("🖱️可点击");
        if (info.position) parts.push(`定位:${info.position}`);
        if (info.classes) parts.push(`class="${info.classes}"`);
        if (info.text) parts.push(`text="${info.text}"`);
        
        return parts.filter(Boolean).join(" ");
    }).join("\n");
  }

  // 优化版本的可点击检测
  isClickable(element, computedStyle = null) {
    // 使用传入的 computedStyle 或获取新的
    const style = computedStyle || window.getComputedStyle(element);
    
    // 快速检查：如果元素不可见，直接返回false
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
    }

    // 快速检查：最常见的可点击特征
    if (element.tagName.toLowerCase() === 'button' || 
        element.tagName.toLowerCase() === 'a' ||
        element.role === 'button' ||
        style.cursor === 'pointer') {
        return true;
    }

    // 检查class名称（Taro和其他框架的按钮特征）
    const className = element.className || '';
    if (className.includes('button') || 
        className.includes('submit') || 
        className.includes('clickable')) {
        return true;
    }

    // 检查标签名（Taro组件）
    if (element.tagName.toLowerCase().includes('taro-') && 
        (className.includes('button') || element.textContent.trim() !== '')) {
        return true;
    }

    return false;
  }

}

 //创建主程序对象 
 var main_app=new MainApp(); 
    
    
    // ------------------遮罩层类
    class OverlayElement {
        constructor(id,iframe_src) {
            // 创建遮罩层元素
            this.element = document.createElement('div');
            
            this.element.id = id;
            this.id=id;
            // 将遮罩层添加到 body 中
            document.body.appendChild(this.element);
            // 设置默认样式
            this.setStyle();
            // 设置点击事件监听器
            this.element.addEventListener('click', () => this.switch_show_hide());
            // 获取插件id
            this.pluginId=chrome.runtime.id;
            this.iframeSrc=chrome.runtime.getURL('code_helper.html');
            // 设置遮罩层内嵌的网页
            this.iframeID=id+'_iframe';
            this.iframeInnerText = `
            <div id="sao_f" style="height: 100%; width: 50%; position: fixed; border-radius: 10px;">
                <iframe src="${iframe_src}" id="${this.iframeID}" width="100%" height="100%" frameborder="0"></iframe>
            </div>
                `;
            console.log(this.iframeInnerText);    
        
            this.isFisrtInit=true;          
   
        }
    
        // 设置默认样式
        setStyle() {
            Object.assign(this.element.style, {
                position: 'fixed',
                right: '0',
                top: '0',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'none',
                width: '100%',
                height: '100%',
                zIndex: 1999,
                // justifyContent: 'center',
                // alignItems: 'center'
            });
        }
    
    
        // 切换显示/隐藏状态
        switch_show_hide() {
            // this.element.style.display = this.element.style.display === 'none' ? 'flex' : 'none';        

            // $(this.element).slideToggle("slow");
            if(this.isFisrtInit){
                this.element.innerHTML =this.iframeInnerText;
                this.isFisrtInit=false;
                 //iframe 可以自由缩放拖动   
                $(function() { $('#sao_f').resizable();});
            }
            // console.log('first init ?'+this.isFisrtInit);

            $(this.element).toggle('slide', {direction: 'left'}, 600); //需要加载jQuery-ui库

        }

     
    }
    
    
    
    
    // 创建遮罩层对象
    var overlay = new OverlayElement('overlay',chrome.runtime.getURL('code_helper.html'));
    // overlay.setIframeSrc(chrome.runtime.getURL('code_helper.html'));
    
    
    
    // 创建遮罩层对象
    var overlay2 = new OverlayElement('overlay2','https://drissionpage.cn/search');

    
    var overlay4 = new OverlayElement('overlay4',chrome.runtime.getURL('AI.html'));
    var overlay6 = new OverlayElement('overlay6',chrome.runtime.getURL('json_viewer.html'));

    var overlay3 = new OverlayElement('overlay3','https://wxhzhwxhzh.github.io/saossion_code_helper_online/vip/index.html');

    var overlay5 = new OverlayElement('overlay5','https://wxhzhwxhzh.github.io/saossion_code_helper_online/jiaoxue/index.html');
  
    // 输出插件的 ID
    console.log(overlay.pluginId);   
   
    
    
    
    // 切换显示信息展示栏
      function info_show_switch() {
        chrome.storage.local.get('show_div', function (result) {
            var newState = (result.show_div === '隐藏') ? '显示' : '隐藏';
            
            if (newState == '隐藏') {
                document.getElementById('daohanglan').style.display = "none";
            } else {
                document.getElementById('daohanglan').style.display = "block";
            }
    
            chrome.storage.local.set({ show_div: newState }, function () {
                console.log('信息栏- ' + newState );
                // alert('信息展示栏已经' + newState);
                AutoDismissAlert('元素信息浮窗 已经' + newState,1000);
            });
    
    
            });
        }
    
    
      
      
// 万能侧边栏圆形按钮  <span id='sao_txt'>骚</span>

var side_button_code = `

  
    <div id='yuananniu' class="yuananniu" title="开关">
    骚       


        <div class="sao-dropdown-menu">
            <div id="sao1" class="sao-dropdown-item">元素浮窗开关</div>
            <div id="sao3" class="sao-dropdown-item">信息浮窗开关</div>
            <div id="sao7" class="sao-dropdown-item">指纹检测</div>
            
            <div id="sao2" class="sao-dropdown-item">启动代码生成</div>            
            <div id="sao9" class="sao-dropdown-item">官方文档</div>
            <div id="sao10" class="sao-dropdown-item">实战代码</div>
            
            <div id="sao11" class="sao-dropdown-item">AI对话</div>
             

            
                <li class="sao-menu-item sao-dropdown-item">复制>
                    <ul class="sao-submenu ">
                        <li id="sao4" class="sao-dropdown-item">Cookie</li>
                        <li id="sao5" class="sao-dropdown-item">UA</li>                       
                        <li id="sao_copy_url" class="sao-dropdown-item">URL</li>                       
                    </ul>
                </li>
                
                <li id="sao-wangzhi-li" class="sao-menu-item  sao-dropdown-item">收藏>
                    <ul id="sao-wangzhi" class="sao-submenu ">            
   
                        
                        <li id="sao-clear" class="sao-dropdown-item">*清空所有网址*</li>
                        <li id="sao-shoucang" class="sao-dropdown-item">*收藏当前网址*</li>
                        <li class="sao-dropdown-item"><a class="sao-url" href="http://x.aichatos8.com/" target="_blank">AIchatOS</a></li>
                        <li class="sao-dropdown-item"><a class="sao-url" href="https://wxhzhwxhzh.github.io/saossion_code_helper_online/" target="_blank">骚神网</a></li>
                        

                    </ul>
                </li>


                <li class="sao-menu-item  sao-dropdown-item">骚操作>
                    <ul class="sao-submenu ">
                        <li id="sao_coffee" class="sao-dropdown-item">打赏作者</li>
                        <li id="sao_video" class="sao-dropdown-item">视频解析</li>
                        <li id="sao_kuozhan" class="sao-dropdown-item">定时刷新</li>                       
                        <li id="sao_daili" class="sao-dropdown-item">动态代理</li>                       
                        <li id="sao_json_viewer" class="sao-dropdown-item">代码录制器</li>                       
                    </ul>
                </li>
  
            
        
        </div>
            
        </div>
    </div>


    `
    var side_button=document.createElement('div');
    side_button.id='cebianlan';
    side_button.innerHTML=side_button_code;

    document.body.appendChild(side_button);

    $('#sao1').click(function() {
        info_show_switch();
    });

    $('#sao2').click(function() {       

        overlay.switch_show_hide();
    });

    $('#sao3').click(function() {
        let xuanfu_chuang = $('#floatingWindow');
        xuanfu_chuang.toggle();
    });

    $('#sao4').click(function() {
        main_app.copyToClipboard(document.cookie);
        alert('网页的cookie已经复制到剪贴板 \n' + document.cookie);
    });

    $('#sao5').click(function() {
        main_app.copyToClipboard(navigator.userAgent);
        alert('网页的UA已经复制到剪贴板 \n' + navigator.userAgent);
    });
    $('#sao_copy_url').click(function() {
        let url=window.location.href;
        main_app.copyToClipboard(url);
        alert('网页的url已经复制到剪贴板 \n' + url);
    });



    $('#sao7').click(function() {
        window.open("https://ip77.net/", "_blank");
    });

    $('#sao_video').click(function() {
        // overlay3.switch_show_hide();
        minOpen('https://wxhzhwxhzh.github.io/saossion_code_helper_online/vip/index.html');
      
    });
    $('#sao_kuozhan').click(function() {
       
        minOpen('chrome://extensions/');
      
    });
    
    $('#sao9').click(function() {        
        // overlay2.switch_show_hide();
        minOpen('https://drissionpage.cn/search?')
    });

    $('#sao10').click(function() {
       overlay5.switch_show_hide();
      
    });

    $('#sao_json_viewer').click(function () {

        overlay6.switch_show_hide();
        const iframe_obj = document.getElementById('overlay6').querySelector('iframe');
        console.log(iframe_obj);
        // body_html = $('body').html();

        setTimeout(() => {
            iframe_obj.contentWindow.postMessage(document.cookie, '*');

        }, 1000);

    });

    $('#sao11').click(function() {        
        // overlay4.switch_show_hide();
        // minOpen('https://free1.gptchinese.app/chat/new')
        minOpen('https://kimi.moonshot.cn/');
    });
    $('#sao_coffee').click(function() {        
       buyMeACoffee();
    });
    




    
    // 变成可拖拽的按钮  对话框的浮窗
    $(function() {
        $("#yuananniu").draggable();
        $( "#floatingWindow" ).draggable();
        $(".sao_iframe").resizable();

      });
      
// 调用函数设置悬浮窗
setupFloatingWindow();      
// 创建和配置悬浮窗
function setupFloatingWindow() {
    // 创建悬浮窗
    var $floatingWindow = $('<div>', {
        class: 'floating-window',
        id: 'floatingWindow'
    });

    // 创建标题栏
    var $titleBar = $('<div>', {
        class: 'title-bar',
        id: 'titleBar',
        text: '信息浮窗(可拖动)'
    });

    // 创建关闭按钮
    var $closeBtn = $('<span>', {
        class: 'close-btn',
        id: 'closeBtn',
        html: '&nbsp;&nbsp;X'
    });

    // 添加关闭按钮到标题栏
    $titleBar.append($closeBtn);

    // 点击关闭按钮隐藏浮窗
    $closeBtn.on('click', function() {
        $floatingWindow.hide();
    });

   // 创建内容区域
    var $content = $('<div>', {
        id: 'float_content',
        class: 'content',
        html: $('#daohanglan').html() // 使用html()方法获取元素的内容
    }).css("user-select", "text");
    // 将标题栏和内容区域添加到浮窗
    $floatingWindow.append($titleBar).append($content);

    // 将浮窗添加到body中
    $floatingWindow.hide().appendTo('body');
    // 更新内容
    setInterval(() => {
        $('#float_content').html($('#daohanglan').html());
        

    }, 300);
    
}






async function buyMeACoffee() {
    // 显示头像

    let img = document.createElement('img');
    img.src = 'https://wxhzhwxhzh.github.io/saossion_code_helper_online/img/%E6%89%93%E8%B5%8F%E7%A0%81.png';
    img.style.position = 'fixed'; // or 'absolute', 'fixed', 'sticky'
    img.style.left = '40%';
    img.style.zIndex = 2000;
    img.style.bottom = '50%';
    document.body.append(img);

    let div_img = document.createElement('div');
    // div_img.innerText=count;
    div_img.style.position = 'fixed'; // or 'absolute', 'fixed', 'sticky'
    div_img.style.left = '40%';
    div_img.style.zIndex = 2001;
    div_img.style.bottom = '50%';
    div_img.style.fontSize='40px';
    div_img.style.color ='green';
    document.body.append(div_img);
    // 倒计时移除图片
    let count=9;
    const intervalId = setInterval(() => {
        count--;
        console.log(`执行第 ${count} 次`);
        div_img.innerText=count;
    
        if (count == 0) {
            clearInterval(intervalId);
            console.log('执行结束');
            img.remove();
            div_img.remove();
        }
    }, 1000);
    
 
}


async function minOpen(url) {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;

    window.open(url, 'test', params);
}

// 骚网址 功能区
function append_url_to_button(name, url) {
    // 获取ul元素
    var ulElement = document.getElementById('sao-wangzhi');
    //判断是否存在
    for (var i = 0; i < ulElement.children.length; i++) {
        if (ulElement.children[i].textContent === name) {
            return;
        }
    }

    // 创建新的li元素
    var newLi = document.createElement('li');
    newLi.className = 'sao-dropdown-item';

    // 创建a元素并设置其属性
    var newA = document.createElement('a');
    newA.className = 'sao-url'; // 与现有的a元素保持一致的类名
    newA.href = url; // 链接
    newA.target = '_blank'; // 链接在新标签页打开
    newA.textContent = name; // 链接显示的文本

    // 将a元素添加到li元素中
    newLi.appendChild(newA);

    // 将新的li元素添加到ul元素中
    ulElement.appendChild(newLi);
}




//  收藏网址的功能
function append_website_to_button(){
    var title = document.title;
    var currentUrl = window.location.href;
    window.sao_config[title]=currentUrl;
    persistent_storage(window.sao_config);
    update_sao_url();
}



// 更新网址的功能  主动执行和被动触发的函数.
function update_sao_url(){   
    Object.keys(window.sao_config).forEach((key)=>{
        append_url_to_button(key,window.sao_config[key]);
    })

}

document.getElementById('sao-clear').addEventListener('click',()=>{
     // 获取ul元素
     var ulElement = document.getElementById('sao-wangzhi');

     // 获取ul元素的所有子元素
     var children = ulElement.children;
 
     // 计算需要删除的元素数量 保留前4个li
     var numToRemove = children.length - 4;
     
     // 检查是否有多余的元素需要删除
     if (numToRemove > 0) {
         // 从后往前删除多余的元素
         for (var i = children.length - 1; i >= 4; i--) {
             ulElement.removeChild(children[i]);
         }
     }
    window.sao_config={'DP官网':'https://www.drissionpage.cn/'};
    persistent_storage(window.sao_config);
    update_sao_url();
});

document.getElementById('sao-shoucang').addEventListener('click',append_website_to_button);
document.getElementById('sao-wangzhi-li').addEventListener('mouseenter',update_sao_url);


//监听文本选择，更新右键菜单文本
document.addEventListener('selectionchange', function() {
    var selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
        console.log('Selected text:', selection.toString());
        
          // 更新右键菜单菜单名
        //   chrome.contextMenus.update("youdao", { title: `有道翻译 ${selection.toString()} ` });
          chrome.runtime.sendMessage({ youdao_text: selection.toString() });
    }
});
































