export interface Project {
    type: 'git' | 'file',
    name: string,
    options: FileProjectOptions | GitProjectOptions,
}

export interface FileProjectOptions {
    path: string,
}

export interface GitProjectOptions {
    path: string,
    url: string,
    trackingMethod: 'branch' | 'commit' | 'tag',
    trackingValue: string,
}