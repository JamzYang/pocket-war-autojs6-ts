// https://github.com/SuperMonster003/AutoJs6-VSCode-Extension/issues/6#issuecomment-1620894339

import nodeHttp from 'http';
import nodePath from 'path';
import fs from 'fs';
// Autojs6 部署动作
export declare type Autojs6DeployAction = 'none' | 'both' | 'save' | 'rerun' | 'run';

// Autojs6 部署执行器
export class Autojs6DeployExecutor {

    // 输出目录值
    private static DIST_PATH: string = './dist';

    // 输出主文件值
    private static MAIN_PATH: string = './main.js';

    public constructor() {
    }

    // 发送部署命令
    private sendDeployCmd(execCmd: string, sendPath: string, deployName: string): void {
      process.stdout.write(`开始发送部署命令: ${execCmd}, 路径: ${sendPath}, 部署名称: ${deployName}`);
      const files = fs.readdirSync(sendPath);
      const mainFile = files.find(file => file.startsWith('main'));

      if (mainFile) {
        const filePath = sendPath +'\\' + mainFile;
        const fileContent = fs.readFileSync(filePath);
        const boundary = `--------------------------${Math.random().toString(36).slice(2)}`;
        const options = {
          hostname: 'localhost', //base_url
          // hostname: '192.168.68.15',
          port: 8080,
          path: '/files/upload',
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Accept': '*/*',
            'Connection': 'keep-alive'
          }
        };

        const req = nodeHttp.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            process.stdout.write(`响应数据: ${data}`);
          });
        });

        req.on('error', (error) => {
          process.stderr.write(`上传文件时出错: ${error}`);
        });

        const postData = [
          `--${boundary}`,
          `Content-Disposition: form-data; name="file"; filename="${mainFile}"`,
          'Content-Type: application/javascript',
          '',
          fileContent,
          `--${boundary}--`
        ].join('\r\n');

        req.write(postData);
        req.end();
        process.stdout.write('部署成功');
      } else {
        process.stderr.write('未找到main开头的文件');
      }
    }

    // 获取输出目录值
    private getDistPath(deployName: string): string {
        return `${nodePath.resolve(Autojs6DeployExecutor.DIST_PATH, deployName)}`;
    }

    // 获取输出主文件值
    private getMainPath(deployName: string): string {
        return `/${nodePath.resolve(Autojs6DeployExecutor.DIST_PATH, deployName, Autojs6DeployExecutor.MAIN_PATH)}`;
    }

    // 执行运行项目命令
    private execRunProject(deployName: string): void {
        this.sendDeployCmd('runProject', this.getMainPath(deployName), deployName);
    }

    // 执行重新运行项目命令
    private execRerunProject(deployName: string): void {
        this.sendDeployCmd('rerunProject', this.getMainPath(deployName), deployName);
    }

    // 执行保存项目命令
    private execSaveProject(deployName: string): void {
        this.sendDeployCmd('saveProject', this.getDistPath(deployName), deployName);
    }

    // 解析部署名称
    public resolveDeployName(projectName?: string): string {
        if (projectName) {
            return projectName;
        }
        // 这里可以修改一些自定义解析处理
        throw new Error('部署执行器: -> 解析错误，未知部署名称！');
    }

    // 执行部署项目
    public execDeployProject(deployAction: Autojs6DeployAction, projectName?: string): void {
        const deployName: string = this.resolveDeployName(projectName);
        switch (deployAction) {
            case 'save':
                this.execSaveProject(deployName);
                console.info('部署执行器: %s -> 完成保存项目！', deployName);
                break;
            case 'rerun':
                this.execRerunProject(deployName);
                console.info('部署执行器: %s -> 完成重新运行项目！', deployName);
                break;
            case 'run':
                this.execRunProject(deployName);
                console.info('部署执行器: %s -> 完成运行项目！', deployName);
                break;
            case 'both':
                this.execSaveProject(deployName);
                this.execRerunProject(deployName);
                console.info('部署执行器: %s -> 完成保存并重新运行项目！', deployName);
                break;
            case 'none':
            default:
                console.info('部署执行器: %s -> 没有需要执行的动作！', deployName);
                break;
        }
    }

}
