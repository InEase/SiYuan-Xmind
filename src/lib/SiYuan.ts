import { TOKEN } from "@/config"
import { resolve } from "path"

interface ResponseBody {
  code: number
  data: any
  msg: string
}

async function Request(url: string, data?: any): Promise<ResponseBody> {
  let resData = null
  await fetch(url, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      Authorization: `Token `,
    }
  }).then(function (response) { resData = response.json() })
  // @ts-ignore
  return resData
}


async function Apply(response: Promise<ResponseBody>) {
  let r: ResponseBody = await response
  if (!r) {
    return null
  }
  return r.code === 0 ? r.data : null
}

export interface FilesUnderPath {
  box: string
  files: File[]
  path: string
}

export interface File {
  alias: string
  bookmark: string
  count: number
  ctime: number // 创建时间
  hCtime: string // 格式化的创建时间
  hMtime: string // 相对修改时间
  hSize: string // 文件大小
  icon: string
  id: string
  memo: string
  mtime: number // 修改时间
  name: string
  name1: string
  path: string // 路径
  size: number
  sort: number // 排序
  subFileCount: number // 子文件数目
}

export function listDocsByPath(path: string, notebook: string): Promise<FilesUnderPath> {
  let data = {
    path,
    notebook,
  }
  let url = '/api/filetree/listDocsByPath'
  let result = Apply(Request(url, data))
  return result
}

export interface StandardResponse<T> {
  code: number
  data: T
  msg: string
}

export interface NoteBookData {
  closed: boolean
  icon: string
  id: string
  name: string
  sort: number
}

export function lsNotebooks(): Promise<Map<"notebooks", NoteBookData[]>> {
  let url = '/api/notebook/lsNotebooks'
  return Apply(Request(url))
}

export interface DocOutline {
  children: DocOutline[] | null
  count: number // 这一级有多少标题
  alias: string
  depth: number
  content: string // 内容
  id: string
}

export function getDocOutline(id: string): Promise<Record<"blocks", DocOutline[]>[]> {
  // 因为思源的API有点混乱，所以这里只关注了目前来说有用到的信息
  let data = {
    id,
  }
  let url = '/api/outline/getDocOutline'
  return Apply(Request(url, data))
}


export interface sqlResult {
  alias: string // 别名
  box: string // 所在笔记本id
  content: string // 不带markdown的纯文本
  created: string // 创建时间 "20201224120447"
  hash: string
  hpath: string // 人类可读路径 "/请从这里开始/内容块/嵌入内容块"
  ial: string
  id: string // 块id
  length: number // 长度
  markdown: string // markdown
  memo: string
  name: string
  parent_id: string
  path: string // 真实路径
  root_id: string // 文件id
  sort: number
  subtype: string
  type: string // 块类型
  updated: string // 修改时间 "20210512154659"
}

export function sqlRequest(sql: string): Promise<sqlResult[]> {
  let data = {
    stmt: sql,
  }
  let url = '/api/query/sql'
  return Apply(Request(url, data))
}
