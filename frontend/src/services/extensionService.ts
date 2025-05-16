import { request } from './api';
import { Job } from '../types/job';
import { useState, useEffect } from 'react';

export interface JobFromExtension {
  title: string;
  company: string;
  location: string;
  description: string;
  jobType: string;
  salary?: string;
  applicationUrl: string;
  platform: string;
  postedDate?: Date;
  notes?: string;
}

export interface ExtensionJobResponse {
  job: Job;
  userJob: {
    _id: string;
    userId: string;
    jobId: string;
    status: string;
    notes: string;
  };
}

const extensionService = {
  /**
   * Create a new job from extension data
   * @param jobData Job data collected from the browser extension
   * @returns Created job and user-job association
   */
  createJobFromExtension: async (jobData: JobFromExtension): Promise<ExtensionJobResponse> => {
    const response = await request<{ data: ExtensionJobResponse }>({
      url: '/jobs/extension',
      method: 'POST',
      data: jobData,
    });
    return response.data;
  },
};

/**
 * GitHub Release API 响应类型定义
 */
interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  assets: ReleaseAsset[];
}

// 默认下载链接，当API请求失败时使用
export const DEFAULT_EXTENSION_DOWNLOAD_URL = 'https://github.com/DravenTJU/Job-Trip/releases/latest/download/jobtrip-extension.zip';

/**
 * 处理Chrome扩展下载相关的Hook
 * @param translateFn 可选的翻译函数，用于错误信息
 * @returns 下载链接、版本和状态信息
 */
export const useExtensionDownload = (translateFn?: (key: string, defaultValue: string) => string) => {
  const [latestVersion, setLatestVersion] = useState('1.0.0');
  const [releaseUrl, setReleaseUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取最新release信息
    fetch('https://api.github.com/repos/DravenTJU/Job-Trip/releases/latest')
      .then(response => response.json())
      .then((data: GitHubRelease) => {
        setIsLoading(false);
        if (data.tag_name) {
          setLatestVersion(data.tag_name.replace('v', ''));
          setReleaseUrl(data.html_url);
          // 获取zip资源的下载URL
          const zipAsset = data.assets.find(asset => asset.name.endsWith('.zip'));
          if (zipAsset) {
            setDownloadUrl(zipAsset.browser_download_url);
          } else {
            // 如果没有找到zip资产，使用默认链接
            setDownloadUrl(DEFAULT_EXTENSION_DOWNLOAD_URL);
          }
        }
      })
      .catch(error => {
        const errorMsg = translateFn ? 
          translateFn('extension:errors.fetchReleaseFailed', '获取发布信息失败:') : 
          '获取发布信息失败:';
        
        console.error(errorMsg, error);
        setIsLoading(false);
        // 设置默认下载链接，以防API请求失败
        setDownloadUrl(DEFAULT_EXTENSION_DOWNLOAD_URL);
      });
  }, [translateFn]);

  return {
    latestVersion,
    releaseUrl,
    downloadUrl: downloadUrl || DEFAULT_EXTENSION_DOWNLOAD_URL,
    isLoading
  };
};

export default extensionService; 