#!/usr/bin/env python3
"""
图片压缩脚本
用于压缩 PWA 图标和封面图片到合适的大小
"""

import os
from PIL import Image
import sys

def compress_image(input_path, output_path, max_size_kb, quality=85):
    """
    压缩图片到指定大小以下
    
    Args:
        input_path: 输入图片路径
        output_path: 输出图片路径
        max_size_kb: 最大文件大小（KB）
        quality: 初始质量（1-100）
    """
    try:
        # 打开图片
        img = Image.open(input_path)
        
        # 保存原始模式
        original_mode = img.mode
        
        # 转换为 RGB 模式（如果是 RGBA）
        if img.mode == 'RGBA':
            # 创建白色背景
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # 使用 alpha 通道作为 mask
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # 获取原始文件大小
        original_size = os.path.getsize(input_path) / 1024
        print(f"原始文件: {input_path}")
        print(f"原始大小: {original_size:.2f} KB")
        
        # 先尝试调整尺寸（对于超大图片）
        if original_size > max_size_kb * 10:
            print(f"图片过大，先缩小尺寸...")
            # 根据目标大小估算合适的缩放比例
            scale = (max_size_kb / original_size) ** 0.5
            new_size = (int(img.width * scale), int(img.height * scale))
            img = img.resize(new_size, Image.LANCZOS)
            print(f"已缩小到: {new_size[0]}x{new_size[1]}")
        
        # 尝试不同的质量级别（使用 JPEG 格式压缩）
        current_quality = quality
        while current_quality > 10:
            # 保存为 JPEG 格式（更好的压缩）
            temp_path = output_path + '.temp.jpg'
            img.save(temp_path, 'JPEG', quality=current_quality, optimize=True)
            
            # 检查文件大小
            current_size = os.path.getsize(temp_path) / 1024
            
            if current_size <= max_size_kb:
                # 转换回 PNG 格式
                temp_img = Image.open(temp_path)
                temp_img.save(output_path, 'PNG', optimize=True)
                os.remove(temp_path)
                
                final_size = os.path.getsize(output_path) / 1024
                print(f"压缩成功: {output_path}")
                print(f"压缩后大小: {final_size:.2f} KB")
                print(f"压缩率: {(1 - final_size/original_size)*100:.1f}%")
                return True
            
            os.remove(temp_path)
            # 降低质量继续尝试
            current_quality -= 10
        
        # 如果还是太大，继续缩小尺寸
        print(f"警告: 无法通过降低质量达到目标大小，继续缩小尺寸...")
        scale = 0.8
        while scale > 0.3:
            new_size = (int(img.width * scale), int(img.height * scale))
            resized_img = img.resize(new_size, Image.LANCZOS)
            
            # 保存为 JPEG 测试大小
            temp_path = output_path + '.temp.jpg'
            resized_img.save(temp_path, 'JPEG', quality=75, optimize=True)
            current_size = os.path.getsize(temp_path) / 1024
            
            if current_size <= max_size_kb:
                # 转换回 PNG
                temp_img = Image.open(temp_path)
                temp_img.save(output_path, 'PNG', optimize=True)
                os.remove(temp_path)
                
                final_size = os.path.getsize(output_path) / 1024
                print(f"压缩成功（已调整尺寸）: {output_path}")
                print(f"新尺寸: {new_size[0]}x{new_size[1]}")
                print(f"压缩后大小: {final_size:.2f} KB")
                return True
            
            os.remove(temp_path)
            scale -= 0.1
        
        print(f"错误: 无法将图片压缩到 {max_size_kb} KB 以下")
        return False
        
    except Exception as e:
        print(f"错误: 处理图片时出错 - {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """主函数"""
    public_dir = os.path.join(os.path.dirname(__file__), 'public')
    
    # 要压缩的图片列表 (输入文件, 输出文件, 最大大小KB)
    images_to_compress = [
        ('icon-192.png', 'icon-192.png', 50),
        ('icon-512.png', 'icon-512.png', 200),
        ('金融工具箱app封面.png', '金融工具箱app封面.png', 300),
    ]
    
    print("=" * 60)
    print("PWA 图片压缩工具")
    print("=" * 60)
    print()
    
    success_count = 0
    for input_name, output_name, max_size in images_to_compress:
        input_path = os.path.join(public_dir, input_name)
        output_path = os.path.join(public_dir, output_name)
        
        if not os.path.exists(input_path):
            print(f"跳过: {input_name} (文件不存在)")
            print()
            continue
        
        # 备份原始文件
        backup_path = input_path + '.backup'
        if not os.path.exists(backup_path):
            import shutil
            shutil.copy2(input_path, backup_path)
            print(f"已备份原始文件到: {backup_path}")
        
        if compress_image(input_path, output_path, max_size):
            success_count += 1
        
        print()
    
    print("=" * 60)
    print(f"压缩完成: {success_count}/{len(images_to_compress)} 个文件成功")
    print("=" * 60)

if __name__ == '__main__':
    try:
        from PIL import Image
    except ImportError:
        print("错误: 需要安装 Pillow 库")
        print("请运行: pip install Pillow")
        sys.exit(1)
    
    main()
