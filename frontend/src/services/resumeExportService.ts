const resumeExportService = {
  // 下载简历PDF
  downloadResumePDF: async (resumeId: string): Promise<void> => {
    try {
      // 获取认证令牌
      const token = localStorage.getItem('token');
      const url = `/api/v1/resumes/${resumeId}/pdf`;
      
      // 使用fetch API发送带有Authorization头的请求
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status} ${response.statusText}`);
      }
      
      // 获取blob数据，确保指定正确的MIME类型
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      
      // 获取文件名
      let fileName = `resume_${resumeId}.pdf`;
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }
      
      // 创建下载链接
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // 延迟清理，确保下载开始
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      }, 1000);
    } catch (error) {
      console.error('下载简历PDF失败:', error);
      throw error;
    }
  }
};

export default resumeExportService; 