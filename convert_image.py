import requests
import base64

# 图片URL
image_url = "https://pbs.twimg.com/media/GHhY86fXoAA79e-.jpg"

# 下载图片
response = requests.get(image_url)
response.raise_for_status()

# 转换为Base64
base64_data = base64.b64encode(response.content).decode('utf-8')

# 生成Data URI
data_uri = f"data:image/jpeg;base64,{base64_data}"

# 输出到文件
with open('base64_image.txt', 'w') as f:
    f.write(data_uri)

print("图片已转换为Base64编码，保存到base64_image.txt文件中")